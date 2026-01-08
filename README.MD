# Turbo Mail Sender

> 高效、可靠的批量邮件群发工具，基于 Node.js 构建，提供现代化的 Web 界面和强大的任务管理功能。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

[在线体验](https://erpanomer.nurverse.com/tools/turbo-mail-sender) | [GitHub](https://github.com/ErpanOmer/turbo-mail-sender)

## 目录

- [核心功能](#核心功能)
- [快速开始](#快速开始)
- [详细使用指南](#详细使用指南)
- [部署说明](#部署说明)
- [API 文档](#api-文档)
- [二次开发指南](#二次开发指南)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)

---

## 核心功能

### 主要特性

- **SMTP 配置管理**：支持 QQ 邮箱、Gmail、163 邮箱等主流服务商，灵活的端口配置（465 SSL、587 TLS）
- **富文本邮件编辑**：集成 Quill 编辑器，支持 HTML 格式和实时预览
- **批量发送系统**：支持 CSV/TXT 文件导入，智能邮箱验证和自动去重
- **任务队列管理**：基于 Map 的高效任务管理，支持多重重试机制（默认 3 次）
- **连接池缓存**：SMTP 传输器智能复用，提升发送性能
- **实时监控**：按日期分割的日志文件，实时进度显示和 CSV 结果导出

### 技术栈

- **后端**：Node.js + Express.js + Nodemailer
- **前端**：HTML5 + Tailwind CSS + Quill.js + Vanilla JavaScript
- **特性**：服务端渲染（SSR）、本地存储、响应式设计

---

## 快速开始

### 环境要求

- **操作系统**：Windows / macOS / Linux
- **Node.js**：>= 14.0.0
- **npm**：>= 6.0.0

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/ErpanOmer/turbo-mail-sender
cd turbo-mail-sender

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

服务将在 `http://localhost:3000` 启动。

### 快速配置

1. 访问 `http://localhost:3000`
2. 配置 SMTP 服务器信息（如 QQ 邮箱：smtp.qq.com:465）
3. 编辑邮件内容
4. 导入收件人列表（CSV/TXT 文件）
5. 点击发送并监控进度

---

## 详细使用指南

### SMTP 配置

#### QQ 邮箱
- **服务器**：smtp.qq.com
- **端口**：465（SSL）或 587（TLS）
- **授权码**：在邮箱设置中生成

#### Gmail
- **服务器**：smtp.gmail.com
- **端口**：465（SSL）或 587（TLS）
- **授权码**：需开启两步验证并生成应用专用密码

#### 163 邮箱
- **服务器**：smtp.163.com
- **端口**：465（SSL）
- **授权码**：在邮箱设置中开启 SMTP 服务

### 使用流程

1. **配置发件人**：填写 SMTP 服务器、端口、邮箱和授权码
2. **编辑邮件**：输入主题，使用富文本编辑器编写内容
3. **添加收件人**：手动输入或导入 CSV/TXT 文件
4. **设置策略**：配置发送延迟和重试次数
5. **发送监控**：实时查看进度和日志，导出结果

### CSV 文件格式

```csv
email
user1@example.com
user2@example.com
user3@example.com
```

或简单的一列邮箱地址：

```csv
user1@example.com
user2@example.com
user3@example.com
```

### 高级功能

#### URL 参数预填充

```
http://localhost:3000?host=smtp.qq.com&port=465&user=test@qq.com&subject=测试邮件&content=邮件内容
```

#### 本地存储

SMTP 配置会自动保存到浏览器本地存储，下次访问时自动填充。

---

## 部署说明

### 开发环境

```bash
# 启动开发服务器
npm start

# 访问
http://localhost:3000
```

### 生产环境

#### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name "turbo-mail-sender"

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs turbo-mail-sender
```

#### 使用 Docker

创建 `Dockerfile`：

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

构建和运行：

```bash
docker build -t turbo-mail-sender .
docker run -d -p 3000:3000 --name mail-sender turbo-mail-sender
```

#### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 配置说明

系统配置位于 [server.js](server.js#L11-L20)：

```javascript
const CONFIG = {
    PORT: 3000,                    // 服务端口
    CONCURRENCY: 5,                // 并发发送数
    PER_SEND_DELAY: 1000,          // 默认单封延迟（毫秒）
    MAX_RETRIES: 3,                // 默认最大重试次数
    RETRY_BASE_MS: 2000,           // 重试基础延迟（毫秒）
    RESULTS_LIMIT: 10000,          // 结果记录上限
    TASK_RETENTION_MS: 3600 * 1000, // 任务保留时间（1小时）
    LOGS_DIR: path.join(__dirname, 'logs') // 日志目录
};
```

---

## API 文档

### 基础信息

- **Base URL**：`http://localhost:3000`
- **Content-Type**：`application/json`
- **字符编码**：UTF-8

### API 端点

#### 1. 获取首页（SSR）

**接口地址**：`GET /`

**功能描述**：返回首页 HTML，支持 URL 参数预填充配置

**请求参数**（Query）：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| host | string | 否 | SMTP 服务器地址 |
| port | string | 否 | SMTP 端口 |
| user | string | 否 | 发件邮箱 |
| subject | string | 否 | 邮件主题 |
| content | string | 否 | 邮件内容（需 URL 编码） |

**请求示例**：

```bash
curl "http://localhost:3000?host=smtp.qq.com&port=465&user=test@qq.com&subject=测试&content=%E6%B5%8B%E8%AF%95%E9%82%AE%E4%BB%B6"
```

**响应**：HTML 页面

---

#### 2. 批量发送邮件

**接口地址**：`POST /send-mail-batch`

**功能描述**：批量提交邮件发送任务

**请求头**：

```
Content-Type: application/json
```

**请求体**：

```json
{
  "host": "smtp.qq.com",
  "port": "465",
  "user": "test@qq.com",
  "pass": "授权码",
  "recipients": [
    "user1@example.com",
    "user2@example.com"
  ],
  "subject": "邮件主题",
  "html": "<p>邮件内容</p>",
  "clientConfig": {
    "perSendDelay": 1000,
    "maxRetries": 3
  }
}
```

**请求参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| host | string | 否 | SMTP 服务器（默认 smtp.qq.com） |
| port | string | 否 | SMTP 端口（默认 465） |
| user | string | 是 | 发件邮箱 |
| pass | string | 是 | 邮箱授权码 |
| recipients | array | 是 | 收件人邮箱列表 |
| subject | string | 是 | 邮件主题 |
| html | string | 是 | 邮件 HTML 内容 |
| clientConfig | object | 否 | 客户端配置 |
| clientConfig.perSendDelay | number | 否 | 单封延迟（毫秒，默认 1000） |
| clientConfig.maxRetries | number | 否 | 最大重试次数（默认 3） |

**请求示例**：

```bash
curl -X POST http://localhost:3000/send-mail-batch \
  -H "Content-Type: application/json" \
  -d '{
    "host": "smtp.qq.com",
    "port": "465",
    "user": "test@qq.com",
    "pass": "授权码",
    "recipients": ["user1@example.com", "user2@example.com"],
    "subject": "测试邮件",
    "html": "<p>这是一封测试邮件</p>",
    "clientConfig": {
      "perSendDelay": 1000,
      "maxRetries": 3
    }
  }'
```

**成功响应**：

```json
{
  "success": true,
  "total": 2
}
```

**失败响应**：

```json
{
  "success": false,
  "message": "Invalid params"
}
```

---

#### 3. 查询队列状态

**接口地址**：`GET /queue-status`

**功能描述**：获取当前队列状态和发送统计

**请求示例**：

```bash
curl http://localhost:3000/queue-status
```

**成功响应**：

```json
{
  "success": true,
  "queueLength": 10,
  "running": 3,
  "totalProcessed": 50
}
```

**响应参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| success | boolean | 请求是否成功 |
| queueLength | number | 待发送任务数量 |
| running | number | 正在发送的任务数量 |
| totalProcessed | number | 已完成的任务总数 |

---

#### 4. 导出发送结果

**接口地址**：`GET /results`

**功能描述**：导出 CSV 格式的发送结果

**请求示例**：

```bash
curl -O http://localhost:3000/results
```

**响应**：CSV 文件（带 BOM 头，支持 Excel 打开）

**CSV 格式**：

```csv
Time,Email,Status,Attempts,Error
2025-12-03T12:00:00.000Z,user1@example.com,sent,1,
2025-12-03T12:00:01.000Z,user2@example.com,failed,3,"Connection timeout"
```

**响应头**：

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="results.csv"
```

### 错误码说明

| HTTP 状态码 | 说明 |
|------------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 二次开发指南

### 项目结构

```
turbo-mail-sender/
├── server.js          # 后端服务器主文件
├── index.html         # 前端界面
├── package.json       # 项目依赖配置
├── package-lock.json  # 依赖锁定文件
├── logs/              # 日志目录
│   └── *.log         # 日志文件
└── README.md         # 项目文档
```

### 核心组件

#### 1. TransporterCache（连接池缓存）

负责 SMTP 传输器的创建和缓存管理，实现连接复用。

**关键特性**：
- 基于 Map 的缓存机制
- 智能键值生成（user@host）
- 连接池配置（maxConnections: 3）
- 速率限制（rateLimit: 5）

#### 2. TaskManager（任务管理器）

管理邮件发送任务的整个生命周期，包括创建、执行、监控和清理。

**关键特性**：
- 任务队列管理
- 状态跟踪（pending/sending/sent/failed）
- 结果记录（最多 10000 条）
- 自动清理过期任务

#### 3. Worker（工作线程）

从队列中获取任务并执行发送操作，支持重试机制。

**关键特性**：
- 并发控制（默认 5）
- 多重重试（默认 3 次）
- 指数退避策略
- 异常捕获处理

#### 4. Logger（日志记录器）

提供结构化的日志记录功能，支持按日期分割文件。

**关键特性**：
- 按日期分割日志文件
- 多级别日志（INFO/SUCCESS/WARN/ERROR）
- 控制台和文件双输出
- 自动创建日志目录

### 开发环境搭建

```bash
# 1. 克隆仓库
git clone https://github.com/ErpanOmer/turbo-mail-sender
cd turbo-mail-sender

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm start

# 4. 访问
http://localhost:3000
```

## 常见问题

### 安装和启动

**Q: 启动时提示端口被占用怎么办？**

A: 修改 [server.js](server.js#L12) 中的 `PORT` 配置：

```javascript
const CONFIG = {
    PORT: 3001,  // 修改为其他端口
    // ...
};
```

**Q: npm install 安装失败怎么办？**

A: 尝试以下解决方案：

1. 清除 npm 缓存：
```bash
npm cache clean --force
```

2. 使用淘宝镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

3. 删除 node_modules 和 package-lock.json 后重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

### SMTP 配置

**Q: QQ 邮箱发送失败，提示认证错误？**

A: 请检查以下几点：

1. 确认使用的是授权码而非邮箱密码
2. 在 QQ 邮箱设置中开启 SMTP 服务
3. 生成新的授权码（设置 > 账户 > POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务）

**Q: Gmail 发送失败怎么办？**

A: Gmail 需要开启两步验证并生成应用专用密码：

1. 登录 Google 账户
2. 开启两步验证
3. 生成应用专用密码（安全性 > 应用专用密码）
4. 使用应用专用密码作为授权码

### 发送问题

**Q: 部分邮件发送失败怎么办？**

A: 检查以下几点：

1. 查看日志文件了解失败原因
2. 检查邮箱地址格式是否正确
3. 确认 SMTP 服务商的发送限制
4. 增加重试次数和延迟时间

**Q: 如何查看详细的发送日志？**

A: 日志文件存储在 `logs/` 目录下，按日期命名：

```bash
# 查看今天的日志
cat logs/$(date +%Y-%m-%d).log

# 实时监控日志
tail -f logs/$(date +%Y-%m-%d).log
```

**Q: 邮件被标记为垃圾邮件怎么办？**

A: 优化邮件内容：

1. 使用真实的发件人信息
2. 避免使用敏感词汇
3. 提供退订链接
4. 控制发送频率
5. 使用专业的 SMTP 服务

### 性能优化

**Q: 发送速度太慢怎么办？**

A: 可以调整以下参数：

1. 增加并发数（[server.js](server.js#L13)）：
```javascript
CONCURRENCY: 10,  // 增加到 10
```

2. 减少发送延迟：
```javascript
PER_SEND_DELAY: 500,  // 减少到 500ms
```

注意：过高的并发可能导致被 SMTP 服务商限制。

**Q: 内存占用过高怎么办？**

A: 系统已内置内存管理机制：

1. 自动清理过期任务（1小时后）
2. 限制结果记录数量（10000 条）
3. 定期清理（每 10 分钟）

如仍需优化，可以调整：

```javascript
RESULTS_LIMIT: 5000,           // 减少结果记录上限
TASK_RETENTION_MS: 1800 * 1000 // 减少任务保留时间
```

---

## 贡献指南

欢迎所有形式的贡献！

### 如何贡献

#### 1. 报告问题

如果您发现了 bug 或有功能建议，请：

1. 检查是否已有类似问题
2. 创建新的 Issue，详细描述问题
3. 提供复现步骤和环境信息
4. 附上相关日志和截图

#### 2. 提交代码

如果您想贡献代码：

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 创建 Pull Request

### 使用声明

本工具仅供合法用途使用，请遵守以下规定：

1. 不得用于发送垃圾邮件
2. 不得用于非法活动
3. 尊重收件人的隐私和选择权
4. 遵守相关法律法规
5. 遵守 SMTP 服务商的使用条款

---

## 联系方式

- **GitHub Issues**：[提交问题](https://github.com/ErpanOmer/turbo-mail-sender/issues)
- **Email**：erpanomer@gmail.com
- **在线体验**：[https://erpanomer.nurverse.com/tools/turbo-mail-sender](https://erpanomer.nurverse.com/tools/turbo-mail-sender)

## 相关资源

- [Nodemailer 官方文档](https://nodemailer.com/)
- [Express.js 官方文档](https://expressjs.com/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [Quill.js 官方文档](https://quilljs.com/)

---

**Turbo Mail Sender** - 让邮件发送更简单、更高效！

如有任何问题或建议，欢迎随时联系我: erpanomer@gmail.com
