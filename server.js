// server.js - 终极优化版 (带 SSR + 连接池 + 队列)
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

// ============= 配置常量 =============
const CONFIG = {
    PORT: 3000,
    CONCURRENCY: 5,           // 并发数
    PER_SEND_DELAY: 1000,     // 默认延迟
    MAX_RETRIES: 3,
    RETRY_BASE_MS: 2000,
    RESULTS_LIMIT: 10000,
    TASK_RETENTION_MS: 3600 * 1000,
    LOGS_DIR: path.join(__dirname, 'logs')
};

// ============= 1. 连接池缓存 (性能核心) =============
class TransporterCache {
    constructor() {
        this.cache = new Map();
    }
    get(host, port, user, pass) {
        const key = `${user}@${host}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const transporter = nodemailer.createTransport({
            pool: true,
            host: host || "smtp.qq.com",
            port: Number(port) || 465,
            secure: Number(port) === 465,
            auth: { user, pass },
            maxConnections: 3,
            maxMessages: 100,
            rateLimit: 5
        });
        this.cache.set(key, transporter);
        return transporter;
    }
}
const transporterCache = new TransporterCache();

// ============= 2. 日志模块 =============
class Logger {
    constructor(logsDir) {
        this.logsDir = logsDir;
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    }
    log(line, type = 'INFO') {
        const msg = `[${new Date().toISOString()}] [${type}] ${line}`;
        console.log(msg);
        fs.appendFile(path.join(this.logsDir, new Date().toISOString().slice(0, 10) + '.log'), msg + '\n', () => {});
    }
}
const logger = new Logger(CONFIG.LOGS_DIR);

// ============= 3. 任务管理 =============
class TaskManager {
    constructor() {
        this.tasks = new Map();
        this.queue = [];
        this.running = 0;
        this.results = [];
        setInterval(() => this.cleanup(), 10 * 60 * 1000);
    }

    createTask({ host, port, user, pass, to, subject, html, clientConfig }) {
        const id = randomUUID();
        const task = {
            id, host, port, user, pass, to, subject, html,
            status: 'pending', attempts: 0, error: null,
            createdAt: Date.now(), updatedAt: Date.now(),
            clientConfig: clientConfig || {}
        };
        this.tasks.set(id, task);
        this.queue.push(id);
        return id;
    }

    getTask(id) { return this.tasks.get(id); }

    finalizeTask(task, status, error = null) {
        task.status = status;
        task.error = error;
        task.updatedAt = Date.now();
        this.results.push({
            taskId: task.id, email: task.to, status, attempts: task.attempts,
            time: new Date().toISOString(), error
        });
        if (this.results.length > CONFIG.RESULTS_LIMIT) this.results.shift();
        // 内存释放
        task.html = null; task.pass = null; task.subject = null;
    }

    getQueueStatus() {
        return { queueLength: this.queue.length, running: this.running, totalProcessed: this.results.length };
    }

    cleanup() {
        const now = Date.now();
        for (const [id, task] of this.tasks.entries()) {
            if (task.status !== 'pending' && task.status !== 'sending' && now - task.updatedAt > CONFIG.TASK_RETENTION_MS) {
                this.tasks.delete(id);
            }
        }
    }
}
const taskManager = new TaskManager();

// ============= 4. Worker (消费者) =============
class Worker {
    constructor() { setInterval(() => this.tick(), 500); }

    tick() {
        while (taskManager.running < CONFIG.CONCURRENCY && taskManager.queue.length > 0) {
            const id = taskManager.queue.shift();
            const task = taskManager.getTask(id);
            if (task) this.processTask(task);
        }
    }

    async processTask(task) {
        taskManager.running++;
        task.status = 'sending';
        const maxRetries = task.clientConfig.maxRetries || CONFIG.MAX_RETRIES;
        try {
            await this.sendWithRetry(task, maxRetries);
        } catch (error) {
            logger.log(`Failed ${task.to}: ${error.message}`, 'ERROR');
        } finally {
            taskManager.running--;
        }
    }

    async sendWithRetry(task, maxRetries) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            task.attempts = attempt;
            try {
                const transporter = transporterCache.get(task.host, task.port, task.user, task.pass);
                await transporter.sendMail({
                    from: `"${task.user}" <${task.user}>`,
                    to: task.to, subject: task.subject, html: task.html
                });
                taskManager.finalizeTask(task, 'sent');
                logger.log(`Sent to ${task.to}`, 'SUCCESS');
                return;
            } catch (err) {
                logger.log(`Retry ${task.to} (${attempt}): ${err.message}`, 'WARN');
                if (attempt === maxRetries) taskManager.finalizeTask(task, 'failed', err.message);
                else await new Promise(r => setTimeout(r, (task.clientConfig.retryBaseMs || CONFIG.RETRY_BASE_MS) * attempt));
            }
        }
    }
}
const worker = new Worker();

// ============= 5. Express App (含 SSR) =============
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// [关键修复]：服务端渲染 (SSR) 首页
app.get('/', (req, res) => {
    const templatePath = path.join(__dirname, 'index.html');
    
    if (!fs.existsSync(templatePath)) {
        return res.status(404).send(`
            <h1>Error: index.html not found</h1>
            <p>Please ensure index.html is in the same directory as server.js</p>
        `);
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // 获取 URL 参数
    const host = req.query.host || '';
    const port = req.query.port || '';
    const user = req.query.user || '';
    const subject = req.query.subject || '';
    const content = req.query.content ? decodeURIComponent(req.query.content) : '';

    // 改进的替换逻辑：使用正则替换 value 属性值
    // 这样可以避免重复替换的问题
    if (host) {
        html = html.replace(/id="smtpHost"\s+type="text"\s+value="[^"]*"/,
            `id="smtpHost" type="text" value="${host}"`);
    }
    if (port) {
        html = html.replace(/id="smtpPort"\s+type="number"\s+value="[^"]*"/,
            `id="smtpPort" type="number" value="${port}"`);
    }
    if (user) {
        html = html.replace(/id="senderEmail"\s+type="email"\s+value="[^"]*"/,
            `id="senderEmail" type="email" value="${user}"`);
    }
    if (subject) {
        html = html.replace(/id="mailSubject"\s+type="text"\s+value="[^"]*"/,
            `id="mailSubject" type="text" value="${subject}"`);
    }
    if (content) {
        html = html.replace('__MAIL_CONTENT__', content);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
});

// 批量发送接口
app.post('/send-mail-batch', (req, res) => {
    const { host, port, user, pass, recipients, subject, html, clientConfig } = req.body;
    if (!user || !pass || !Array.isArray(recipients)) return res.status(400).json({ success: false, message: 'Invalid params' });

    const cleanRecipients = recipients.map(e => e.trim()).filter(e => e.includes('@'));
    const taskIds = cleanRecipients.map(to => taskManager.createTask({ host, port, user, pass, to, subject, html, clientConfig }));

    logger.log(`Enqueued ${taskIds.length} tasks`, 'BATCH');
    res.json({ success: true, total: taskIds.length });
});

// 状态查询
app.get('/queue-status', (req, res) => res.json({ success: true, ...taskManager.getQueueStatus() }));

// 结果导出
app.get('/results', (req, res) => {
    const csv = "Time,Email,Status,Attempts,Error\n" + taskManager.results.map(r => 
        `${r.time},${r.email},${r.status},${r.attempts},"${(r.error||'').replace(/"/g,'""')}"`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="results.csv"');
    res.send('\uFEFF' + csv);
});

app.listen(CONFIG.PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 服务已启动！请在浏览器访问: http://localhost:${CONFIG.PORT}`);
    console.log(`==================================================\n`);
});