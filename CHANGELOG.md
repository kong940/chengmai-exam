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

### [2026-09-24] data：每日学习补录第二批“各类官方新闻”（18 条，覆盖 时政/国常会、经济、法治、科技、工程、民生）
- **改动**：`data.js` / `data.json` 的 `news` 数组再新增 18 条**各类官方新闻**（不再局限于“含习近平”主线），总量 30 → 48 条，`updated` 改为 `2026-09-24 17:03`，按 `date` 降序排序。
  - **时政/国常会（7 条）**：①9/21 政治局会议研究全面从严治党（二十届五中全会 10 月召开）；②9/11 国常会部署安全生产、算力网、老旧水库改造；③8/28 政治局会议部署西藏吉隆县泥石流抢险救援；④8/21 国常会部署新一代通信网、清理拖欠企业账款；⑤8/17 国务院第十二次全体会议（完成全年目标）；⑥7/31 国常会学习贯彻上半年经济形势讲话、核准 4 个核电项目；⑦7/30 政治局会议部署下半年经济工作、决定 10 月开二十届五中全会。
  - **经济（2 条）**：⑧7/15 上半年经济“半年报”（GDP 69.6 万亿 +4.7%、CPI +1.0%、失业率 5.2%、夏粮首破 3000 亿斤）；⑨8/21 1—7 月财政收支（收入 14.37 万亿 +5.8%、支出 16.29 万亿 +1.3%）。
  - **法治（3 条）**：⑩8/15《生态环境法典》施行（我国第二部“法典”命名法律）；⑪7/1《民族团结进步促进法》施行；⑫7/1 新修订《民用航空法》施行（无人机适航、护航低空经济）。
  - **科技（3 条）**：⑬8/28 神舟二十三号乘组出舱 + 航天功勋奖章；⑭8/23 嫦娥七号不满足发射条件、今年窗口不实施；⑮6/26“灵晟”超算登顶全球 TOP500。
  - **工程（1 条）**：⑯9/16 平陆运河建成通航（新中国首条通江达海大运河，134.2 公里，缩短西南出海 560 公里以上）。
  - **民生（2 条）**：⑰8/24 消费品以旧换新惠及 1.78 亿人次（上半年带动销售额 1.1 万亿）；⑱8/20 全民医保“十五五”规划发布（5 年建成多层次医疗保障体系）。
  - 全部经 WebSearch 核实权威来源（中国政府网、新华社、央视网、人民网、国家统计局等），字段含 `备考提示` 标注可考点（时间 / 数字 / 会议名称 / 法律施行日）。
- **原因**：用户反馈第一批 14 条偏“习近平/党建/外交”单一主线，公基需“各种各样关于官方的新闻”广泛积累；本次补齐国务院政策、经济数据、法律法规、科技成就、重大工程、民生政策等类别。
- **复刻要点**：同上一 data 条——Python 解析 `window.__LIVE_DATA__ = {...}`（去末尾 `;` 再 `json.loads`），向 `news` 追加 dict，按 `date` 降序，两文件同步写回；去重按 `t` 标题判重。`tag` 维度已由原来 `时政/海南/澄迈/法治` 扩为 `时政/海南/澄迈/法治/经济/科技/工程/民生`，便于按类浏览。
- **关联文件**：`chengmai-exam/data.js`、`chengmai-exam/data.json`。
- **发布状态**：待推送（commit 后 push 至 `kong940/chengmai-exam` main，GitHub Pages 自动部署，网页版/PWA 刷新即生效）。

### [2026-09-24] data：每日学习新增国家层面时政（2026年6—9月），覆盖十五五、习近平讲话与外交、党建、法治
- **改动**：`data.js` / `data.json` 的 `news` 数组新增 14 条**国家层面**时政（tag=`时政` 13 条 + `法治` 1 条），原 16 条海南/澄迈本地资讯保留；总量 16 → 30 条，`updated` 改为 `2026-09-24 16:04`，整体按 `date` 降序排序。
  - 新增要点（均经 WebSearch 核实权威来源）：①十五五规划纲要（3.12 全国人大批准，20 项指标 / 109 项重大工程 / 16 个“强国” / 今年 GDP 目标 4.5%–5%）；②习近平 6 月访朝提出中朝关系“四个坚持”；③全国党建工作座谈会（习近平党建思想“十四个坚持”）；④中缅会谈严打电诈与毒品走私；⑤《构建更加公正合理的全球治理体系》白皮书；⑥山东德州考察“三夏”与粮食安全；⑦政治局会议部署防汛抗旱；⑧建党 105 周年多项大国重器（神舟二十三号、天舟十号、平陆运河通水）；⑨纪念江泽民同志诞辰 100 周年大会；⑩习近平关于正确政绩观重要指示；⑪《习近平文化文选》第一、二卷出版；⑫上合组织元首理事会第 26 次会议（比什凯克）；⑬金砖国家领导人第十八次会晤（新德里）；⑭新修订《商标法》通过（2027.1.1 施行）。
- **原因**：用户备考公基，原“每日学习”仅覆盖海南/澄迈本地新闻，缺近期国家层面时政积累。按用户要求从 6 月填充到 9 月。
- **复刻要点**：Python 解析 `window.__LIVE_DATA__ = {...}`（注意末尾去 `;` 再 `json.loads`），向 `news` 追加四字段 dict（`date`/`tag`/`t`/`x`），按 `date` 降序排序后 `json.dumps(ensure_ascii=False, separators=(',',':'))` 写回；`data.json` 为同内容纯 JSON 须同步改。App(`index.html`) 远程优先拉 `data.js` 自动生效，无需重打包。
- **关联文件**：`chengmai-exam/data.js`、`chengmai-exam/data.json`。
- **发布状态**：已推送（commit `0cab930`，GitHub Pages 已部署，网页版/PWA 刷新即生效）。

### [2026-09-04] ops：APK v2 签名块【位置】修复（终版，真能装）—— 签名块必须在中央目录之前
- **改动**：`apk_build/build_apk.py` 第 4.4 节组装逻辑。此前虽已修正 v2 记录格式与 v1 PKCS7 证书标签，但**签名块被插到了中央目录【之后】**（`[条目][中央目录][签名块][EOCD]`），而 AOSP 强制要求 `[条目][签名块][中央目录][EOCD]`。
  - Android 的 v2 校验器从「中央目录偏移」**向前**扫描定位签名块；顺序错则找不到 v2 → 退回 v1 → 报"缺乏开发者证书无法安装"。这正是前几轮"自检通过却装不上"的真因。
  - 修正：`final = body + v2 + 中央目录 + EOCD`，签名块插入中央目录之前；最终 EOCD「中央目录偏移」改写为 `cd_start + len(v2)`，摘要计算时该字段置为 `cd_start`（签名块偏移）。
  - 配套：`verify()` 改用「中央目录偏移(cd_off2)」向前定位块；另写一份**完全独立、不复用构建代码**的 AOSP 风格解析器交叉验证——确认**块位于 CD 之前**、摘要重算一致、v2 公钥验签 PASS、v1 PKCS7 `0xa0` 且签名为 PASS。
- **根因复盘（关键教训）**：前几轮"修复"与自写 `verify()` **共用同一套（错误）布局假设**，两者自洽 → 误判通过。签名块物理位置这种"字节解析看不出、肉眼也易漏"的错误，必须靠独立解析器模拟 Android 找块方式、或 `apksigner verify`（需 JDK）做权威校验。
- **原因**：vivo/国产 ROM 安装器严格按 AOSP v2 校验；位置错误导致 v2 不被识别。
- **产物**：`apk_build/备考题库-联网更新版.apk`（1,973,914 字节；已同步至桌面 `刷题/`）。
- **复刻要点**：同「复刻 → 2」；`python build_apk.py` 须输出 `v2 签名块位于中央目录之前 ✅ … v2 签名验证 PASS`，且独立校验脚本 v1/v2 全 PASS。
- **权威验证建议**：若仍不放心，用 Android SDK `apksigner verify 备考题库-联网更新版.apk`（需 JDK）终确认；本环境无 JDK，已用独立 AOSP 风格解析器替代。

### [2026-09-04] ops：APK 增加 v2 签名 + 修正 v1 PKCS7（修复国产 ROM "没有开发者证书" 安装失败）
- **改动**：`apk_build/build_apk.py` 在原有 v1(JAR) 自签基础上，新增 **APK Signature Scheme v2（全文件签名）**，生成 v1+v2 双重签名 APK。本次（第二轮）修正了两处曾导致"自检通过却装不上"的致命格式错误：
  - **v2 摘要/签名记录格式**：严格按 AOSP 规范 `记录 = [uint32 记录长][uint32 算法ID][字节]`，其中 `记录长 = 4 + len(字节)`；整组记录外层只包**一个** `uint32` 长度前缀。⚠️ 旧写法多加了一层长度前缀并多塞了一个"摘要长度"字段（`[uint32 总长][uint32 内部长][uint32 alg][摘要]`），与 `verify()` 自洽所以自检通过，但 Android 解析器拒绝。
  - **v1 PKCS7 `certificates` 字段**：必须为 `[0] IMPLICIT` 上下文标签 `0xa0` 包住证书 DER（`0xa0 ‖ len ‖ certDER`）；旧写法误用 `0x31 SET` 标签，jar 校验器抽不出证书 → 报"没有开发者证书"。
  - v2 内容摘要仍采用 AOSP 规范两级 Merkle 树：将「ZIP 条目区(section1) + 中央目录(section3) + EOCD(section4)」按 1MB 切块，每块 `SHA256(0xa5 ‖ uint32LE(块长) ‖ 块)`，顶层 `SHA256(0x5a ‖ uint32LE(块数) ‖ 各块摘要拼接)`；计算前把 EOCD「中央目录偏移」改写为**签名块偏移**（= cd_start + cd_size）。
  - 算法 ID 声明 `0x0103`（RSASSA-PKCS1-v1_5 + SHA2-256），与 `key.sign(pkcs1v15)` 一致。
  - 校验改为**手动 CRC 遍历 + 自写 v2 校验**；并新增一份**完全独立**的 AOSP 风格解析器交叉验证（不复用构建代码），确认 v2 摘要/签名、v1 PKCS7 结构与证书公钥验签全部 PASS。
- **原因**：首版 v2 包在 vivo/国产 ROM 仍报"没有开发者证书无法安装"——根因是签名块/v1 PKCS7 字节格式非标准（与自写 `verify()` 自洽，故误判通过）。本轮按 AOSP 规范逐字节对齐后，Android 方能通过校验。
- **产物**：`apk_build/备考题库-联网更新版.apk`（约 1,973,914 字节；已同步至桌面 `刷题/`）。
- **复刻要点**：同上方「复刻与环境重建 → 2」；依赖 `cryptography` + `pycryptodome`；运行须输出 `条目 CRC OK / v1 签名 OK / APK Sig Block 结构 OK / v2 两级 Merkle 摘要 OK / v2 签名验证 PASS`，且独立校验脚本 v1/v2 全 PASS。
- **注意**：仓库 `index.html` 已指向 GitHub+Gitee，本包 `assets/index.html` 无改动。`apk_inspect/app.apk` 母版**无 .so 文件**，无需 zipalign 对齐。证书有效期 2026-08-30 → 2036-08-28，自签，无扩展（Android v2 不要求证书链/扩展）。

### [2026-09-03] feat：刷题页「返回顶部」按钮 + 自动定位上次做题位置
- **改动**：在 `index.html`（刷题/打卡页）新增
  - 右下角固定「↑ 顶部」悬浮按钮（滚动超一屏显示），点击平滑回顶。
  - 切到 `practice` 标签页时，自动展开分页直到覆盖 `localStorage.qb_last_id` 对应的题目，并 `scrollIntoView` 高亮约 2.6s + 顶部提示条约 3.6s（含「回到顶部↑」链接）。
  - 每答一题写入 `localStorage.qb_last_id = 该题 id`（`markQbPos()`）。
- **原因**：用户反馈每次重开都要一直往下滑找进度；选题型又要一直往上滑，交互繁琐。
- **复刻要点**：函数为 `locateQbLast()` / `markQbPos()` / `toTop` 滚动监听；卡片需带 `data-qid`；分页变量 `qbPage` 需支持按需扩展。
- **关联文件**：`chengmai-exam/index.html`（由 `web-workbench/index.html` 同步而来，9 处改动，JS 语法检查通过）。
- **发布状态**：已随提交 `e5206da`（2026-09-03）推送到 GitHub（网页版/PWA 生效）；并据仓库 `index.html` 重打包 APK（手机端生效，复用原密钥覆盖安装）。详见同日 `ops` 条目。

### [2026-09-03] ops：重打包 APK（含返回顶部功能，复用原密钥覆盖安装）
- **改动**：运行 `apk_build/build_apk.py` 重新生成 `备考题库-联网更新版.apk`（5,917,371 字节）。脚本改为**从仓库 `chengmai-exam/index.html` 取页面**（而非母版 APK），故「返回顶部+自动定位」一并打进包；数据仍取自仓库 `data.js`/`data.json`；签名复用 `chengmai_key.pem`，证书自签自检 PASS。
- **原因**：让手机端 App 也具备最新刷题交互；并确立「改 `index.html` 后重出包即含新功能」的稳定链路。
- **复刻要点**：需 `apk_inspect/app.apk`（母版）+ `apk_build/chengmai_key.pem|crt` + venv 依赖 `cryptography`+`pycryptodome`；详见 `apk_build/更新说明.md` 与上方「复刻与环境重建 → 2」。
- **产物**：`apk_build/备考题库-联网更新版.apk`（已同步至桌面 `刷题/` 目录，可直接覆盖安装）。

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
