# 更新日志 / CHANGELOG — 澄迈执法考试备考工作台

> **用途**：记录本项目**每一次改动（无论大小）**，便于问题溯源、回滚，以及在其他机器上完整复刻。
>
> **维护约定（务必遵守）**：
> 1. 任何改动**先写本文件、再提交/发布**；按时间**倒序**（最新在最上方）。
> 2. 类型标签：`feat`(新功能) · `fix`(修复) · `data`(题库/资讯数据) · `infra`(环境/网络) · `ops`(打包/发布) · `doc`(文档)
> 3. 每条至少含：**日期 · 类型 · 改动内容 · 原因/背景 · 复刻要点 · 关联文件/commit**。
> 4. 日常题库同步（`data.js` 机械更新 + GitHub Pages 自动部署）合并为阶段条目，不逐条记；但**功能性 / 基础设施 / 打包类改动必须逐条记**。
> 5. 待推送 / 未提交 / 有歧义的改动，在标题后标注 `[待推送]` / `[未决]`。

---

## 一、复刻与环境重建（新机器必读）

目标：在任何一台 Windows 机器上重建「网页工作台 + 手机 APK + GitHub 题库源」三位一体。

### 1. 代码与题库（真相源）
```bash
git clone https://github.com/kong940/chengmai-exam.git
```
- 网页版直接用 `chengmai-exam/index.html`，或本地起服务：`python -m http.server 8090` → 浏览器开 `http://127.0.0.1:8090`。
- 题库 `data.js` / `data.json` 即唯一真相源；GitHub Pages 自动部署，链接固定：
  `https://kong940.github.io/chengmai-exam/`

### 2. 重新出 APK（可选，需特殊环境）
> 以下文件**不在仓库、不公开**，必须从原机拷贝到新机同路径，否则无法覆盖安装旧包：
> - `apk_inspect/app.apk` —— 重出包母版（原"本地离线版"解包）
> - `apk_build/chengmai_key.pem` / `chengmai_cert.pem` —— 自签密钥（**丢了就只能让用户先卸载旧包再装**）
> - `apk_build/build_apk.py` —— 重打包+签名脚本
- Python venv 依赖：`pip install cryptography pycryptodome`
- 运行：`python apk_build/build_apk.py` → 产物 `apk_build/备考题库-联网更新版.apk`
- 详细步骤见 `apk_build/更新说明.md`。

### 3. 推送题库更新（让"在线更新"生效）
- 安装 **Git for Windows**。
- 直连 GitHub 困难时的稳妥方案 —— **SSH over 443**：
  ```bash
  ssh-keygen -t ed25519 -C "kong940"        # 公钥加到 GitHub → Settings → SSH and GPG keys
  git remote set-url origin ssh://git@ssh.github.com:443/kong940/chengmai-exam.git
  git push origin main
  ```
- 国内兜底 —— **Gitee 镜像**（APK 已内置该地址）：
  ```bash
  git remote add gitee https://gitee.com/kong940/chengmai-exam.git
  git push gitee main
  ```

### 4. 网络兜底（中国大陆）
- GitHub raw / Pages 可能慢或被墙；APK 在线更新拉不到时自动退回离线内置。
- 必要时在 `C:\Windows\System32\drivers\etc\hosts` 添加 `github.com` 当前 IP。
  ⚠️ **hosts 必须是文件，不是目录**（本机曾误为目录，已修复为标准文件）。

### 5. 关键文件清单（哪些带走 / 哪些入库）
| 文件 | 位置 | 是否入库 | 说明 |
|------|------|----------|------|
| `chengmai-exam/*` | 仓库 | ✅ 公开 | index.html / data.js / data.json / icons / sw.js / manifest.json / README.md / 本 CHANGELOG |
| `apk_inspect/app.apk` | 工作区 | ❌ 本地 | 重出包母版 |
| `apk_build/chengmai_key.pem` | 工作区 | ❌ 本地 | **签名密钥，务必备份** |
| `apk_build/chengmai_cert.pem` | 工作区 | ❌ 本地 | 配套证书 |
| `apk_build/build_apk.py` | 工作区 | ❌ 本地 | 重打包脚本 |
| `apk_build/更新说明.md` | 工作区 | ❌ 本地 | 打包发布详细流程 |

---

## 二、更新记录

### [2026-09-03] feat：刷题页「返回顶部」按钮 + 自动定位上次做题位置
- **改动**：在 `index.html`（刷题/打卡页）新增
  - 右下角固定「↑ 顶部」悬浮按钮（滚动超一屏显示），点击平滑回顶。
  - 切到 `practice` 标签页时，自动展开分页直到覆盖 `localStorage.qb_last_id` 对应的题目，并 `scrollIntoView` 高亮约 2.6s + 顶部提示条约 3.6s（含「回到顶部↑」链接）。
  - 每答一题写入 `localStorage.qb_last_id = 该题 id`（`markQbPos()`）。
- **原因**：用户反馈每次重开都要一直往下滑找进度；选题型又要一直往上滑，交互繁琐。
- **复刻要点**：函数为 `locateQbLast()` / `markQbPos()` / `toTop` 滚动监听；卡片需带 `data-qid`；分页变量 `qbPage` 需支持按需扩展。
- **关联文件**：`chengmai-exam/index.html`（由 `web-workbench/index.html` 同步而来，9 处改动，JS 语法检查通过）。
- **发布状态**：已随本提交推送到 GitHub（网页版/PWA 生效）；并据仓库 `index.html` 重打包 APK（手机端生效，复用原密钥覆盖安装）。详见同日 `ops` 条目。

### [2026-09-03] fix：在线更新增加 Gitee 镜像，远程优先、本地兜底
- **改动**：`index.html` 的 `loadScriptData` 取数顺序改为
  `GitHub Pages → Gitee 镜像 → GitHub raw → 本地兜底(assets/data.js)`。
- **原因**：中国大陆访问 GitHub raw / Pages 可能慢或被墙，加 Gitee 作国内更快更稳的第二远程。
- **关联 commit**：`614c1a2`（2026-09-03）。
- **关联文件**：`chengmai-exam/index.html`、`apk_build/build_apk.py`（`GITEE_DATA` 常量）。

### [2026-08-31] fix：在线更新接 GitHub Pages（远程优先、本地兜底）
- **改动**：修正原 APK `index.html` 取数顺序（旧版把本地 `data.js` 排第一，导致「在线更新」永远命中本地、从不联网）。改为优先拉 `https://kong940.github.io/chengmai-exam/data.js`，断网退回内置。
- **原因**：让网页版/APK 的「在线更新」真正能从 GitHub 拉最新题。
- **关联 commit**：`055d90e`（2026-08-31）。

### [2026-08-29] ops：复原网页工作台 + 桌面一键启动
- **改动**：
  - 从 APK 体系复原出独立网页工作台 `web-workbench/`（index.html + data.js/json + icons + sw.js + manifest.json）。
  - 桌面新增 `启动备考工作台.bat`（一键 `python -m http.server 8090` + 开浏览器）。
  - 桌面新增 `推送备考题库.bat`（最终版用 SSH over 443 推送，推完还原 remote）。
- **原因**：网页版是 PWA 本体，可独立本地运行/分享，且不依赖手机。

### [2026-08-29] ops：APK 重打包（联网更新版）并自签
- **改动**：基于桌面「备考题库-本地离线版.apk」解包改造为「联网更新版」——WebView 壳 + 本地 `ServerSocket(127.0.0.1:8080)` 喂 `assets/`，内置失效的旧更新地址改为 GitHub（Pages→raw→本地兜底）。纯 Python 自签 v1(JAR) 生成 `备考题库-联网更新版.apk`。
- **原因**：旧 APK 在线更新地址（agentos-app.net）已失效，需接 GitHub 题库长期更新。
- **复刻要点**：脚本 `apk_build/build_apk.py`；依赖 `cryptography` + `pycryptodome`；密钥 `chengmai_key.pem` 必留（覆盖安装靠它）。
- **产物**：`apk_build/备考题库-联网更新版.apk`（桌面也有一份，5.9MB，含 Gitee 镜像）。

### [2026-08-29] infra：找回 GitHub 项目 + 环境搭建（Git / SSH over 443 / hosts）
- **改动**：
  - 原误登账号 `yehu9472`，纠正为正确账号 `kong940`，找到仓库 `chengmai-exam`（澄迈执法考试备考 PWA）。
  - 安装 **Git for Windows**；因 GCM「字符串绑定无效」改用 PAT；因 `git push` 被 reset 改用 **SSH over 443**（`ssh.github.com:443`）。
  - 修复 `C:\Windows\System32\drivers\etc\hosts` 被误建成**目录**的问题：备份为 `hosts.github-d`，重建为标准 hosts 文件（含 localhost + `github.com` IP 映射）。
  - 生成并登记 SSH 公钥（`id_ed25519.pub`）到 GitHub，认证通过。
- **原因/背景**：重装系统后丢失本地项目，需从 GitHub 恢复并打通推送链路。
- **复刻要点**：见上方「复刻与环境重建 → 3. 推送题库更新」与「4. 网络兜底」。

### [2026-08-20 ~ 2026-08-27] data：题库与资讯持续同步（外置 data.js）
- **改动**：将资讯外置到 `data.js`，并多次同步最新题库与资讯（精确到分钟）。约 40 次提交（`7fb97d3` ~ `f8bfb65`），均为 `data.js` / `data.json` 机械更新 + GitHub Pages 自动部署。
- **原因**：题库随备考进度持续增改。
- **复刻要点**：日常改题只需编辑 `data.js`（同步 `data.json`）后推送，APK/网页点「在线更新」即生效，**无需重打包**。详见 `apk_build/更新说明.md`。

---

## 三、待办 / 开放问题
- [x] 「返回顶部 + 自动定位」已写回仓库并推送（网页版生效）；已据仓库 `index.html` 重打包 APK（手机端生效，复用原密钥覆盖安装）。
- [ ] 考虑为 `chengmai-exam/` 加 GitHub Actions，实现「推题库自动重打包 APK」闭环（免去手动出包）。
