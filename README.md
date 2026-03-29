# Estrella AI Framework

> 开箱即用的企业级 AI 知识管理与记忆系统

## 🌟 功能特性

- 🌐 **Web 界面** - 简洁易用的管理界面，支持深色/浅色主题
- 💾 **数据持久化** - SQLite 数据库存储，本地数据安全可控
- 🔍 **智能搜索** - 支持中文模糊搜索，快速定位知识
- 📝 **自动记忆** - 自动记录对话内容（需配置 OpenClaw）
- 📦 **批量导入** - 支持多种文件格式一键导入
- 🔒 **备份恢复** - 数据备份与恢复功能
- 📊 **统计面板** - 实时查看知识库统计信息

## 🚀 快速开始

### 版本A - 精简版（需安装依赖）

```bash
# 1. 双击运行 install.bat 等待安装完成（约3-5分钟）
# 2. 双击 start.bat 启动服务
# 3. 打开浏览器访问：http://localhost:3000/
```

### 版本B - 完整版（开箱即用）

```bash
# 1. 双击 start.bat 直接启动
# 2. 打开浏览器访问：http://localhost:3000/
```

## 📦 支持的文件格式

| 格式 | 扩展名 | 说明 |
|------|--------|------|
| 文本 | .txt | 纯文本文件 |
| Markdown | .md | Markdown 文档 |
| JSON | .json | JSON 数据文件 |
| CSV | .csv | 表格数据 |
| HTML | .html | 网页文件 |
| XML | .xml | XML 数据 |
| PDF | .pdf | PDF 文档 |
| Word | .docx | Word 文档 |
| Excel | .xlsx | Excel 表格 |

## 🔌 API 接口

### 基础接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /health | GET | 健康检查 |
| /api/v1/version | GET | 获取版本信息 |
| /api/v1/stats | GET | 获取统计信息 |

### 知识库接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/v1/knowledge | GET | 获取知识列表 |
| /api/v1/knowledge/count | GET | 获取知识数量 |
| /api/v1/knowledge/search | GET | 搜索知识 |
| /api/v1/knowledge/entries | POST | 添加知识 |
| /api/v1/knowledge/:id | PUT | 更新知识 |
| /api/v1/knowledge/:id | DELETE | 删除知识 |
| /api/v1/knowledge/import-folder | POST | 批量导入文件夹 |
| /api/v1/knowledge/backup | POST | 备份知识库 |
| /api/v1/knowledge/restore | POST | 恢复知识库 |

### 记忆接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/v1/memory | GET | 获取记忆列表 |
| /api/v1/memory | POST | 添加记忆 |
| /api/v1/memory/:id | DELETE | 删除记忆 |
| /api/v1/memory/auto-record | POST | 自动记录对话 |

### API 使用示例

```bash
# 获取知识列表
curl http://localhost:3000/api/v1/knowledge

# 搜索知识
curl "http://localhost:3000/api/v1/knowledge/search?query=关键词"

# 添加知识
curl -X POST http://localhost:3000/api/v1/knowledge/entries \
  -H "Content-Type: application/json" \
  -d '{"content":"知识内容","type":"DOCUMENT","source":"我的来源"}'

# 备份知识库
curl -X POST http://localhost:3000/api/v1/knowledge/backup \
  -H "Content-Type: application/json" \
  -d '{"path":"./backups/my-backup"}'
```

## ⚙️ 环境配置

可在 `.env` 文件中配置以下选项：

```bash
# 服务端口
API_PORT=3000
API_HOST=0.0.0.0

# 数据库
DATABASE_PATH=./data/skills.db

# 日志
LOG_LEVEL=info

# 任务配置
SKILLS_MAX_CONCURRENT_TASKS=10
SKILLS_TASK_TIMEOUT_MS=30000
SKILLS_RETRY_ATTEMPTS=3

# 生产环境建议设置
NODE_ENV=production
JWT_SECRET=your-production-secret-key-min-32-chars
```

## 📁 目录结构

```
├── src/              # TypeScript 源代码
├── dist/             # 编译后的 JavaScript 代码
├── frontend/         # 前端页面 (HTML/CSS/JS)
├── scripts/          # 工具脚本
│   ├── auto-record-conversations.js  # 自动记录脚本
│   └── bulk-import.js                # 批量导入脚本
├── data/             # 数据库文件
│   └── skills.db    # SQLite 数据库
├── backups/          # 备份目录
├── logs/             # 日志目录
├── package.json     # 项目配置
├── tsconfig.json   # TypeScript 配置
└── start.bat       # 启动脚本
```

## 🔧 故障排除

### 服务无法启动

```bash
# 检查端口是否被占用
netstat -ano | findstr :3000

# 重新安装依赖
npm install

# 重新编译
npm run build
```

### 中文显示乱码

- 确保数据库文件以 UTF-8 编码存储
- 浏览器使用 UTF-8 编码打开

### 批量导入失败

- 检查文件夹路径是否正确
- 确保文件格式在支持列表中
- 检查文件大小是否超过限制（默认 100MB）

## 📋 技术栈

- **运行时**: Node.js 18+
- **语言**: TypeScript
- **框架**: Express.js
- **数据库**: SQLite (better-sqlite3)
- **解析库**: mammoth (Word), pdf-parse (PDF), xlsx (Excel)

## 📄 License

MIT

## 👤 作者

Estrella AI Team
