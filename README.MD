# Turbo Mail Sender

> 一个高效、可靠的批量邮件群发工具，基于 Node.js 构建，提供现代化的 Web 界面和强大的任务管理功能。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

## 📖 项目概述

Turbo Mail Sender 是一款专业的批量邮件发送解决方案，旨在为用户提供简单易用、功能强大的邮件群发体验。该工具采用现代化的前后端分离架构，集成了 SMTP 连接池、任务队列管理、实时监控等企业级特性，能够高效处理大规模邮件发送任务。

### 核心价值

- **高效性能**：采用连接池复用和并发控制技术，大幅提升发送效率
- **可靠稳定**：内置重试机制和异常处理，确保邮件送达率
- **易于使用**：直观的 Web 界面，支持富文本编辑和批量导入
- **灵活配置**：支持多种 SMTP 服务商，可自定义发送策略
- **实时监控**：提供详细的进度跟踪和日志记录

### 应用场景

- 营销邮件群发
- 系统通知推送
- 客户服务邮件
- 内部公告分发
- 邮件营销活动
- 批量邀请函发送

## ✨ 功能特性

### 核心功能

#### 1. SMTP 配置管理
- 支持主流邮件服务商（QQ邮箱、Gmail、163邮箱等）
- 灵活的端口配置（支持 465 SSL、587 TLS 等）
- 安全的授权码认证机制
- 配置本地缓存，避免重复输入

#### 2. 邮件内容编辑
- 集成 Quill 富文本编辑器
- 支持 HTML 格式邮件
- 实时预览功能
- 邮件主题自定义
- 服务端渲染 (SSR) 支持

#### 3. 批量发送系统
- 支持 CSV/TXT 文件批量导入
- 智能邮箱格式验证
- 自动去重机制
- 并发发送控制（默认 5 个并发）
- 发送延迟配置

#### 4. 任务队列管理
- 基于 Map 的高效任务管理
- 支持多重重试机制（默认 3 次）
- 指数退避重试策略
- 自动清理过期任务
- 内存优化管理

#### 5. 连接池缓存
- SMTP 传输器智能复用
- 连接池配置（最大 3 个连接）
- 速率限制保护
- 性能优化核心

#### 6. 日志与监控
- 按日期分割的文件日志
- 实时进度条显示
- 队列状态监控（队列长度、运行中、已完成）
- CSV 结果导出
- 详细的错误日志记录

### 高级特性

- **服务端渲染 (SSR)**：支持 URL 参数预填充配置
- **本地存储**：自动保存 SMTP 配置信息
- **响应式设计**：完美适配桌面和移动设备
- **动画效果**：流畅的用户交互体验
- **健康检查**：实时检测服务连接状态
- **内存管理**：定期清理过期数据，防止内存泄漏

## 🏗️ 技术架构

### 技术栈

#### 后端技术
- **Node.js** - JavaScript 运行时环境
- **Express.js** - Web 应用框架
- **Nodemailer** - 邮件发送核心库
- **Body-parser** - HTTP 请求体解析
- **CORS** - 跨域资源共享

#### 前端技术
- **HTML5** - 页面结构
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Quill.js** - 富文本编辑器
- **Vanilla JavaScript** - 原生 JavaScript
- **LocalStorage** - 浏览器本地存储

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ SMTP 配置    │  │ 邮件编辑器   │  │ 监控面板     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        API 接口层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ POST /send   │  │ GET /status  │  │ GET /results │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        业务逻辑层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ TaskManager  │  │ Worker       │  │ Logger       │        │
│  │ 任务管理     │  │ 任务执行     │  │ 日志记录     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        数据访问层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Transporter  │  │ 内存队列     │  │ 文件日志     │        │
│  │ 连接池       │  │ 任务存储     │  │ 日志存储     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 核心组件说明

#### 1. TransporterCache（连接池缓存）
负责 SMTP 传输器的创建和缓存管理，实现连接复用，提升性能。

**关键特性：**
- 基于 Map 的缓存机制
- 智能键值生成（user@host）
- 连接池配置（maxConnections: 3）
- 速率限制（rateLimit: 5）

#### 2. TaskManager（任务管理器）
管理邮件发送任务的整个生命周期，包括创建、执行、监控和清理。

**关键特性：**
- 任务队列管理
- 状态跟踪（pending/sending/sent/failed）
- 结果记录（最多 10000 条）
- 自动清理过期任务

#### 3. Worker（工作线程）
从队列中获取任务并执行发送操作，支持重试机制。

**关键特性：**
- 并发控制（默认 5）
- 多重重试（默认 3 次）
- 指数退避策略
- 异常捕获处理

#### 4. Logger（日志记录器）
提供结构化的日志记录功能，支持按日期分割文件。

**关键特性：**
- 按日期分割日志文件
- 多级别日志（INFO/SUCCESS/WARN/ERROR）
- 控制台和文件双输出
- 自动创建日志目录

### 性能优化

1. **连接池复用**：避免重复创建 SMTP 连接
2. **并发控制**：合理控制并发数，平衡性能和资源
3. **内存管理**：定期清理过期数据，防止内存泄漏
4. **任务队列**：异步处理，提升响应速度
5. **缓存策略**：本地存储 SMTP 配置，减少重复输入

## 🔧 环境配置

### 系统要求

- **操作系统**：Windows / macOS / Linux
- **Node.js**：>= 14.0.0
- **npm**：>= 6.0.0
- **浏览器**：Chrome / Firefox / Safari / Edge（最新版本）
- **网络**：稳定的互联网连接

### 开发环境准备

#### 1. 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新 LTS 版本。

验证安装：
```bash
node --version
npm --version
```

#### 2. 克隆或下载项目

```bash
# 如果使用 Git
git clone <repository-url>
cd mailsender

# 或直接下载并解压项目文件
```

#### 3. 安装项目依赖

```bash
npm install
```

这将安装以下依赖：
- `express@^5.2.1` - Web 框架
- `nodemailer@^7.0.11` - 邮件发送
- `body-parser@^2.2.1` - 请求解析
- `cors@^2.8.5` - 跨域支持

### SMTP 服务配置

#### QQ 邮箱配置
- **SMTP 服务器**：smtp.qq.com
- **端口**：465（SSL）或 587（TLS）
- **授权码**：需要在 QQ 邮箱设置中生成

#### Gmail 配置
- **SMTP 服务器**：smtp.gmail.com
- **端口**：465（SSL）或 587（TLS）
- **授权码**：需要开启两步验证并生成应用专用密码

#### 163 邮箱配置
- **SMTP 服务器**：smtp.163.com
- **端口**：465（SSL）
- **授权码**：需要在 163 邮箱设置中开启 SMTP 服务

## 📦 安装部署

### 快速开始

#### 1. 安装依赖

```bash
npm install
```

#### 2. 启动服务

```bash
npm start
```

服务将在 `http://localhost:3000` 启动。

#### 3. 访问界面

在浏览器中打开 `http://localhost:3000`，即可看到 Turbo Mail Sender 的操作界面。

### 详细部署步骤

#### 步骤 1：环境检查

确保已安装 Node.js 和 npm：

```bash
node --version
npm --version
```

#### 步骤 2：安装依赖

在项目根目录执行：

```bash
npm install
```

#### 步骤 3：配置端口（可选）

如需修改默认端口，编辑 [server.js](file:///c:\Users\Lenovo\Desktop\mailsender\server.js#L12) 文件：

```javascript
const CONFIG = {
    PORT: 3000,  // 修改为所需端口
    // ... 其他配置
};
```

#### 步骤 4：启动服务

```bash
npm start
```

看到以下输出表示启动成功：

```
==================================================
🚀 服务已启动！请在浏览器访问: http://localhost:3000
==================================================
```

#### 步骤 5：验证服务

在浏览器中访问 `http://localhost:3000`，检查界面是否正常显示。

### 生产环境部署

#### 使用 PM2 进程管理

1. 安装 PM2：

```bash
npm install -g pm2
```

2. 启动服务：

```bash
pm2 start server.js --name "turbo-mail-sender"
```

3. 设置开机自启：

```bash
pm2 startup
pm2 save
```

4. 查看状态：

```bash
pm2 status
pm2 logs turbo-mail-sender
```

#### 使用 Docker 部署

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

配置 Nginx：

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

## 📚 使用说明

### 基本使用流程

#### 步骤 1：配置发件人信息

1. 在 "STEP 1: 发件人配置" 区域填写 SMTP 信息：
   - **SMTP 服务器**：如 smtp.qq.com
   - **端口**：如 465
   - **发件邮箱**：您的邮箱地址
   - **授权码**：邮箱的 SMTP 授权码

2. 点击 "🚀 START MISSION" 按钮时，配置会自动保存到本地。

#### 步骤 2：编辑邮件内容

1. 在 "STEP 2: 邮件内容" 区域：
   - **邮件主题**：输入邮件标题
   - **邮件正文**：使用富文本编辑器编辑内容

2. 编辑器支持：
   - 文本格式（加粗、斜体、下划线、删除线）
   - 列表（有序、无序）
   - 标题（H1、H2、H3）
   - 链接插入

#### 步骤 3：添加收件人

1. 在 "STEP 3: 收件人" 区域：
   - **手动输入**：直接输入邮箱地址，每行一个
   - **批量导入**：点击 "📂 导入 CSV" 按钮，选择 CSV 或 TXT 文件

2. 支持的文件格式：
   - CSV 文件：包含邮箱列
   - TXT 文件：每行一个邮箱地址

3. 系统会自动：
   - 验证邮箱格式
   - 去除重复邮箱
   - 显示收件人数量

#### 步骤 4：配置发送策略

在 "发送策略" 区域：
- **单封延迟 (ms)**：设置每封邮件之间的延迟时间（默认 1000ms）
- **最大重试次数**：设置发送失败时的重试次数（默认 3 次）

#### 步骤 5：发送邮件

1. 点击 "🚀 START MISSION" 按钮
2. 系统会验证所有配置项
3. 任务提交到队列
4. 实时监控发送进度

#### 步骤 6：监控进度

在 "运行监控" 区域：
- **进度条**：显示整体发送进度
- **统计数字**：
  - Queue：待发送数量
  - Sending：正在发送数量
  - Done：已完成数量
- **日志窗**：实时显示发送日志
- **导出结果**：点击 "📥 导出结果" 下载 CSV 格式的发送报告

### 高级功能

#### URL 参数预填充

支持通过 URL 参数预填充配置：

```
http://localhost:3000?host=smtp.qq.com&port=465&user=test@qq.com&subject=测试邮件&content=邮件内容
```

#### CSV 文件格式

支持的 CSV 文件格式：

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

#### 本地存储

系统会自动保存以下配置到浏览器本地存储：
- SMTP 服务器
- 端口
- 发件邮箱
- 授权码

下次访问时会自动填充，无需重复输入。

### 使用示例

#### 示例 1：发送营销邮件

1. 配置 QQ 邮箱 SMTP
2. 编辑营销邮件内容（包含图片、链接等）
3. 导入客户邮箱列表（CSV 文件）
4. 设置发送延迟为 2000ms
5. 点击发送并监控进度

#### 示例 2：发送系统通知

1. 配置企业邮箱 SMTP
2. 编写通知内容（简洁明了）
3. 手动输入或导入员工邮箱
4. 设置发送延迟为 500ms
5. 发送并导出结果报告

## 🔌 API 文档

### 接口概览

Turbo Mail Sender 提供 RESTful API 接口，支持批量发送、状态查询和结果导出。

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

## ⚙️ 配置说明

### 系统配置

系统配置位于 [server.js](file:///c:\Users\Lenovo\Desktop\mailsender\server.js#L11-L20) 文件的 `CONFIG` 对象中：

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

### 配置参数详解

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| PORT | number | 3000 | 服务监听端口 |
| CONCURRENCY | number | 5 | 并发发送任务数 |
| PER_SEND_DELAY | number | 1000 | 每封邮件之间的延迟（毫秒） |
| MAX_RETRIES | number | 3 | 发送失败时的最大重试次数 |
| RETRY_BASE_MS | number | 2000 | 重试延迟基数（毫秒） |
| RESULTS_LIMIT | number | 10000 | 内存中保存的结果记录上限 |
| TASK_RETENTION_MS | number | 3600000 | 已完成任务在内存中的保留时间（毫秒） |
| LOGS_DIR | string | ./logs | 日志文件存储目录 |

### 连接池配置

连接池配置在 [TransporterCache](file:///c:\Users\Lenovo\Desktop\mailsender\server.js#L31-L40) 类中：

```javascript
const transporter = nodemailer.createTransport({
    pool: true,                    // 启用连接池
    host: host || "smtp.qq.com",   // SMTP 服务器
    port: Number(port) || 465,     // 端口
    secure: Number(port) === 465,   // SSL/TLS
    auth: { user, pass },          // 认证信息
    maxConnections: 3,             // 最大连接数
    maxMessages: 100,              // 每个连接最大消息数
    rateLimit: 5                   // 速率限制（每秒消息数）
});
```

### 日志配置

日志系统支持以下日志级别：

- **INFO**：一般信息
- **SUCCESS**：成功操作
- **WARN**：警告信息
- **ERROR**：错误信息

日志文件按日期命名，格式为 `YYYY-MM-DD.log`，存储在 `logs/` 目录下。

### 客户端配置

客户端配置通过 `clientConfig` 参数传递：

```javascript
{
  "clientConfig": {
    "perSendDelay": 1000,    // 单封延迟（毫秒）
    "maxRetries": 3          // 最大重试次数
  }
}
```

## ❓ 常见问题

### 安装和启动问题

#### Q1: 启动时提示端口被占用怎么办？

**A:** 修改 [server.js](file:///c:\Users\Lenovo\Desktop\mailsender\server.js#L12) 中的 `PORT` 配置：

```javascript
const CONFIG = {
    PORT: 3001,  // 修改为其他端口
    // ...
};
```

#### Q2: npm install 安装失败怎么办？

**A:** 尝试以下解决方案：

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

### SMTP 配置问题

#### Q3: QQ 邮箱发送失败，提示认证错误？

**A:** 请检查以下几点：

1. 确认使用的是授权码而非邮箱密码
2. 在 QQ 邮箱设置中开启 SMTP 服务
3. 生成新的授权码（设置 > 账户 > POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务）

#### Q4: Gmail 发送失败怎么办？

**A:** Gmail 需要开启两步验证并生成应用专用密码：

1. 登录 Google 账户
2. 开启两步验证
3. 生成应用专用密码（安全性 > 应用专用密码）
4. 使用应用专用密码作为授权码

#### Q5: 发送速度太慢怎么办？

**A:** 可以调整以下参数：

1. 增加并发数（[server.js](file:///c:\Users\Lenovo\Desktop\mailsender\server.js#L13)）：
```javascript
CONCURRENCY: 10,  // 增加到 10
```

2. 减少发送延迟：
```javascript
PER_SEND_DELAY: 500,  // 减少到 500ms
```

注意：过高的并发可能导致被 SMTP 服务商限制。

### 发送问题

#### Q6: 部分邮件发送失败怎么办？

**A:** 检查以下几点：

1. 查看日志文件了解失败原因
2. 检查邮箱地址格式是否正确
3. 确认 SMTP 服务商的发送限制
4. 增加重试次数和延迟时间

#### Q7: 如何查看详细的发送日志？

**A:** 日志文件存储在 `logs/` 目录下，按日期命名：

```bash
# 查看今天的日志
cat logs/$(date +%Y-%m-%d).log

# 实时监控日志
tail -f logs/$(date +%Y-%m-%d).log
```

#### Q8: 邮件被标记为垃圾邮件怎么办？

**A:** 优化邮件内容：

1. 使用真实的发件人信息
2. 避免使用敏感词汇
3. 提供退订链接
4. 控制发送频率
5. 使用专业的 SMTP 服务

### 功能问题

#### Q9: 如何批量导入邮箱列表？

**A:** 支持两种方式：

1. **CSV 文件**：创建包含邮箱列的 CSV 文件
2. **TXT 文件**：每行一个邮箱地址

点击 "📂 导入 CSV" 按钮选择文件即可。

#### Q10: 如何导出发送结果？

**A:** 点击 "📥 导出结果" 按钮，系统会下载 CSV 格式的结果文件，包含以下信息：

- 发送时间
- 收件人邮箱
- 发送状态
- 重试次数
- 错误信息（如有）

#### Q11: 配置信息会保存吗？

**A:** 是的，SMTP 配置会自动保存到浏览器本地存储（LocalStorage），下次访问时会自动填充。

注意：邮件主题和内容不会保存，每次发送后会被清空。

### 性能问题

#### Q12: 内存占用过高怎么办？

**A:** 系统已内置内存管理机制：

1. 自动清理过期任务（1小时后）
2. 限制结果记录数量（10000 条）
3. 定期清理（每 10 分钟）

如仍需优化，可以调整：

```javascript
RESULTS_LIMIT: 5000,           // 减少结果记录上限
TASK_RETENTION_MS: 1800 * 1000 // 减少任务保留时间
```

#### Q13: 如何提高发送效率？

**A:** 优化建议：

1. 使用连接池（已默认启用）
2. 合理设置并发数（5-10）
3. 减少不必要的延迟
4. 使用高性能的 SMTP 服务
5. 批量导入而非逐个添加

## 🤝 贡献指南

我们欢迎所有形式的贡献！

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

#### 3. 代码规范

请遵循以下代码规范：

- 使用有意义的变量和函数名
- 添加必要的注释
- 保持代码简洁清晰
- 遵循现有代码风格
- 确保代码通过测试

#### 4. 提交信息规范

提交信息应清晰描述更改内容：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：

```
feat(api): add email validation

Add email format validation to the send-mail-batch endpoint
to prevent invalid email addresses from being queued.

Closes #123
```

### 开发指南

#### 本地开发

1. 克隆仓库：
```bash
git clone <repository-url>
cd mailsender
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

4. 在浏览器中访问 `http://localhost:3000`

#### 项目结构

```
mailsender/
├── server.js          # 后端服务器主文件
├── index.html         # 前端界面
├── package.json       # 项目依赖配置
├── package-lock.json  # 依赖锁定文件
├── logs/              # 日志目录
│   └── *.log         # 日志文件
└── README.md         # 项目文档
```

#### 技术栈

- **后端**：Node.js + Express
- **前端**：HTML + Tailwind CSS + Vanilla JavaScript
- **邮件**：Nodemailer

### 贡献者

感谢所有贡献者的支持！

## 📄 许可证信息

本项目采用 MIT 许可证。

### MIT License

Copyright (c) 2025 Turbo Mail Sender

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### 使用声明

本工具仅供合法用途使用，请遵守以下规定：

1. 不得用于发送垃圾邮件
2. 不得用于非法活动
3. 尊重收件人的隐私和选择权
4. 遵守相关法律法规
5. 遵守 SMTP 服务商的使用条款

## 📞 联系方式

### 技术支持

如果您在使用过程中遇到问题或有任何建议，欢迎通过以下方式联系我们：

- **GitHub Issues**：[提交问题](https://github.com/yourusername/mailsender/issues)
- **Email**：support@example.com
- **文档**：[在线文档](https://your-docs-site.com)

### 社区

加入我们的社区，与其他用户交流：

- **讨论区**：[GitHub Discussions](https://github.com/yourusername/mailsender/discussions)
- **微信群**：扫描二维码加入
- **QQ 群**：123456789

### 更新日志

查看项目的更新历史和版本变更：

- [CHANGELOG.md](./CHANGELOG.md)

### 相关资源

- [Nodemailer 官方文档](https://nodemailer.com/)
- [Express.js 官方文档](https://expressjs.com/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [Quill.js 官方文档](https://quilljs.com/)

---

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者和用户！

特别感谢以下开源项目：

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Nodemailer](https://nodemailer.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Quill.js](https://quilljs.com/)

---

**Turbo Mail Sender** - 让邮件发送更简单、更高效！

如有任何问题或建议，欢迎随时联系我们。
