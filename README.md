# 澄迈执法考试 · 备考工作台 — GitHub Pages 部署指南

本目录是要发布到 GitHub Pages 的**完整静态站点**，共 3 个文件：
- `index.html` — 工作台主页面（含 316 题题库，离线也能用）
- `data.js` — 题库数据文件（"在线更新"会读取它）
- `data.json` — 题库数据备份

部署后链接固定、永久有效、自动 HTTPS、手机/iPad 都能打开。

---

## 一、准备
1. 注册一个 GitHub 账号：https://github.com （免费）
2. 本目录里的 3 个文件已准备就绪。

## 二、发布步骤（网页操作，无需 git 命令）
1. 登录 GitHub，右上角 **+** → **New repository**。
2. Repository name 填 `chengmai-exam`（小写、无空格即可）；**Visibility 选 Public**；其余默认 → 点 **Create repository**。
3. 在空白仓库页，点 **"uploading an existing file"**（或直接把本目录的 3 个文件拖进虚线框）。
4. 上传完成后点绿色 **Commit changes**。
5. 仓库顶部进入 **Settings** → **Pages** → Branch 选 **main**，文件夹选 **/(root)** → **Save**。
6. 等待 1–2 分钟，访问：
   `https://<你的用户名>.github.io/chengmai-exam/`
   这就是长期稳定的分享链接，发给朋友即可。

> 提示：若你的仓库名不是 `chengmai-exam`，链接最后一段改成你实际的仓库名。

## 三、以后更新题库
- 我改好 `data.js` / `data.json` 后，你回到 GitHub 仓库，把新文件拖进去覆盖、Commit 即可。
- 朋友在页面点「在线更新」就能拿到新题，不用重新发链接。

## 四、链接特点
- 固定不变、永久有效（除非你主动删除仓库）。
- 自动 HTTPS、全球 CDN、电脑 / 安卓 / iPad 浏览器均完美支持。

## 备选更省事的方式
如果你的 WorkBuddy 连接了 GitHub（左侧连接器里启用 GitHub），可以直接让助手用命令行帮你建仓库、推送、开启 Pages，你几乎不用动手。
