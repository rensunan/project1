# ☁️ 个人云数据存储

一个精美的个人云存储网页应用，支持多分类管理、文件上传下载、加密便利贴，基于 Cloudflare Workers + KV 构建。

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 📂 **分类管理** | 图片 / 小说 / 文档 / 便利贴，可自由扩展 |
| ➕ **CRUD 操作** | 新建、查看详情、编辑、删除 |
| 📎 **文件上传** | 支持拖拽上传，最大 10MB，图片自动预览 |
| ⬇️ **一键下载** | 文件原格式下载，文本导出 .txt |
| 🔒 **便利贴** | 账号密码存储，密码自动遮蔽，点击 👁️ 查看 |
| 📊 **存储统计** | 彩色进度条展示各类别存储占用 |
| 🔍 **实时搜索** | 搜索标题、内容、文件名 |
| 📱 **响应式** | 手机端侧边栏折叠，深色主题 |

## 🛠 技术栈

- **后端**: Cloudflare Workers (ES Modules)
- **存储**: Cloudflare KV (本地开发模拟)
- **前端**: 原生 HTML/CSS/JS，零框架依赖
- **构建**: Node.js 构建脚本内联资源
- **部署**: Cloudflare Workers / Netlify

## 🚀 本地运行

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 进入项目
cd 个人云数据存储

# 3. 启动开发服务器
wrangler dev

# 4. 打开浏览器
# http://localhost:8787
```

## 🔧 添加新分类

极其简单，只需改 **两个文件** 各一行：

### `src/app.js` — 添加配置
```js
const CATEGORIES = {
  // ... 现有分类 ...
  videos: { id:"videos", label:"视频", icon:"🎬", color:"#f472b6", hasFile:true, pageIcon:"🎬", pageLabel:"视频" },
};
```

### `src/worker.js` — 注册分类
```js
const CATEGORIES = ["images", "novels", "documents", "stickies", "videos"];
```

### 重新构建
```bash
node src/build.js
```

侧边栏、卡片颜色、表单等全部自动生效。

## 📁 项目结构

```
个人云数据存储/
├── wrangler.toml      # Cloudflare 配置
├── README.md
└── src/
    ├── worker.js      # Worker 后端 (API + 静态服务)
    ├── index.html     # HTML 模板
    ├── styles.css     # 样式表
    ├── app.js         # 前端逻辑 (含分类配置)
    ├── build.js       # 构建脚本 → 生成 html.js
    └── html.js        # 构建产物 (自动生成)
```


> 线上地址: **https://rsnpro.netlify.app**
> 默认登录: 用户名 **rsn** / 密码 **131420**

## 🌐 部署

### Cloudflare Workers
```bash
wrangler kv namespace create PERSONAL_CLOUD_KV
# 将返回的 ID 填入 wrangler.toml 的 kv_namespaces
wrangler deploy
```

### Netlify
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 构建前端静态文件
node src/build-standalone.js

# 部署
netlify deploy --prod
```

## 📝 数据模型

```json
{
  "id": "mq93zuvh42zddbth",
  "title": "我的文件",
  "content": "文本内容",
  "category": "documents",
  "fileData": "data:image/png;base64,...",
  "fileName": "photo.png",
  "fileType": "image/png",
  "fileSize": 12345,
  "createdAt": "2026-06-11T00:00:00.000Z",
  "updatedAt": "2026-06-11T00:00:00.000Z"
}
```

## 📄 许可

MIT



