# 本次修改记录

> 对应 `CHANGELOG_THIS.md` 的待发布条目。按**功能模块的最终状态**组织，记录方案、职责边界与关键实现，便于对照源码阅读。
> 日期：2026-11-21　范围：`src/`、`index.html`、构建产物 `index.js`

---

## 一、项目机制速览

看懂下面的改动，需要先知道四件事：

| 机制 | 位置 | 作用 |
| --- | --- | --- |
| 配置存储 | `src/tools/storage.ts` 的 `myStorage` | 所有设置存在 `pfConfig` 一个对象里；`getConfig()` 读、`updateConfigItem()` 写。开关的 `name` 就是配置 key |
| 默认配置 | `src/config/index.ts` 的 `CONFIG_DEFAULT` | 启动时与已存配置合并，缺字段用默认值补齐（`src/index.ts` 的 `onDocumentStart`） |
| 类型声明 | `src/config/types.ts` 的 `IPfConfig` | 配置文件是 `any` 索引签名，新增 key 建议在接口里补声明 |
| 样式注入 | `src/tools/` 的 `fnAppendStyle(id, css)` | 按 id 创建/覆盖 `<style>` 标签，**传空串即清除旧样式**——这是总开关能一键还原页面的基础 |

面板链路：

```text
index.html（静态骨架）→ initHTML() 渲染动态开关 → initOperate() 事件委托
    ├─ fnChanger()  按开关 name 分发刷新
    └─ echoData()   打开面板时回填配置
    → 各业务模块 init() 注入 <style> 或页面按钮
```

隐藏模块的数据源是 `src/components/hidden/configs.ts` 的 `HIDDEN_ARRAY`：二级分组数组，每项含
`key / name / desc / content`，`content` 是二维数组，元素形如 `{ label, value, css, tooltip }`。
`HIDDEN_ARRAY_MORE` 用于「多个 key 全开才生效」的组合规则。

---

## 二、功能模块

### 1. 知乎新版页面结构适配

知乎改版不只是哈希类名变了，而是**导航结构整体改版**：顶部栏只剩「关注/推荐/热榜」，
其余入口搬到左侧竖排导航，链接由相对路径改成完整绝对 URL。据此全面调整选择器：

- `hidden/configs.ts`：顶部悬浮 `.AppHeader` → `header.LeanAppHeaderBar`；顶部三项改用新容器；原顶部菜单 7 项改到 `aside a[href="https://…"]`；AI Works 链接修正为 `/project-square`；组合规则改为按绝对 URL 判定。
- `background/background.ts`：背景着色列表补 `header.LeanAppHeaderBar` 与 `div:has(> header.LeanAppHeaderBar)`，修复深色/自定义主题下顶部栏残留白底。
- `listen-comment.ts`：评论用户信息容器类名链更新。

**选择器约定（后续维护须遵守）**：`css-xxxxx` 是知乎打包哈希类名，登录态、每次发版都可能变。
优先用 `href` / 语义类名 / `aria-label` / `data-za-*` / `:has()` 等稳定特征；按 `href` 匹配必须带容器限定
（如 `aside`、`header.LeanAppHeaderBar`），否则误伤正文同名链接；确实无稳定特征时才用哈希类名。

### 2. 设置面板主题与页面主题分离

- **面板主题**：由 `html[theme-dark]` / `html[theme-light]` 控制（`styles/common.less`），属脚本 UI 配色，**始终按用户主题设置写入，不受样式总开关影响**。
- **页面配色**：由 `CTZ_STYLE_BACKGROUND` 注入，属视觉修改，受总开关控制。

实现：`background.ts` 的 `myBackground.init()` 把 `theme-dark`/`theme-light` 的写入提到总开关判断之前。
两者落到不同属性、不同 CSS 作用域，互不干扰——关闭总开关时设置面板仍保持深色，知乎页面还原原生。

**深色主题控件白底修复**：面板按钮/下拉的深色样式原错误写在 `background.ts` 的 `dark()` 里、注入
`CTZ_STYLE_BACKGROUND` 且受总开关控制；总开关默认关闭时注入空串，控件退回 `button.less`/`select.less`
的白底，白底浅字几乎看不清。修复：把面板内控件深色配色集中到 `common.less` 的 `.BackgroundDark()`，
用 `#CTZ_DIALOG` 等 ID 选择器提高优先级（盖过浅色默认值，也不误伤页面上注入的按钮）。
页面上的脚本按钮（导出回答 / 屏蔽用户 / 获取回答链接）深色着色，原先写在 `background.ts` 的 `dark()` 里、
注入 `CTZ_STYLE_BACKGROUND` 且受总开关控制——总开关关闭时页面按钮退回白底浅字（知乎页面本身深色由
`html[data-theme=dark]` 控制，不受脚本总开关影响），形成白底浅字。修复：把这条移到 `button.less`
（脚本自身样式 `INNER_CSS`，始终注入），用知乎的 `html[data-theme=dark]` 驱动，与总开关解耦；
`background.ts` 里那条已删除。按钮可读性是脚本 UI 职责，与背景配色修改分开。

面板内其它写死白底的控件同样收拢到 `.BackgroundDark()`：屏蔽词标签（`.ctz-block-words-content > span`）、
黑名单用户条目（`.ctz-black-item`）及其右键菜单（`.ctz-black-item-menu`），深色下统一改为深灰底浅字。
这几处基础样式里写死 `background:#fff`，深色主题下形成白底浅字；按 `#CTZ_DIALOG` 作用域用 ID 选择器
覆盖，优先级确定（此前混在 mixin 顶层的部分规则未稳定生效）。

### 3. 样式修改总开关与分项开关

**总开关** `sizeStyleEnabled`（默认 `false`）：关闭后背景/主题、版心与字体尺寸、自定义 CSS、视频样式
全部不注入，知乎页面还原原生；仅保留脚本按钮和隐藏屏蔽。配置值不清空，重开立即恢复。
实现方式是各模块注入空串（`my-size` / `background` / `custom-style` / `change-style`），
`fn-changer.ts` 的 `changeStyleEnabled` 在切换时统一刷新——各模块自己读配置再决定注入什么，
总开关本身不触发它们重算，所以必须逐一调用一次。

**7 个分项开关**（`styleWidthEnabled` / `styleFontEnabled` / `styleImageEnabled` /
`styleListVideoEnabled` / `styleBackgroundEnabled` / `styleCustomCssEnabled` / `styleVideoEnabled`，默认全开）：
在总闸开启前提下逐类控制，关闭某一类只停该类 CSS、不影响其它。默认全开保证打开总开关时效果与旧版一致。
各模块注入前判断对应开关；`fn-changer.ts` 统一挂到 `changeStyleEnabled` 全量刷新（模块幂等）。
UI 上开关就近放在各自功能块的标题行右侧（`.ctz-title-with-switch`：文字 `.ctz-title-text` + 开关 `.ctz-title-switch`），
关哪个一目了然——早期"总开关 / 分项开关各占一个 tab"的空壳设计已废弃。

总开关标题原用固定 `.ctz-title`（`height/line-height:42px`），长说明换行后溢出被裁切；
新增 `.ctz-title-multiline`（`height:auto` + 正常行高 + 内边距）解决。

### 4. 隐藏模块

**规则数据与展示**：全部隐藏项在 `hidden/configs.ts`，按页面/功能划分为 8 个二级分组；
规则体检见下节。每个开关下方有一行 `tooltip` 说明「屏蔽的是什么」——
由隐藏模块专用 `createHiddenItemHTML` 直接渲染成说明小字（`.ctz-hidden-item-desc`，深色主题补浅灰色），
不用通用组件的悬停问号（用户反馈不直观）。

**分组一键开关**（`toggle-all.ts`）：每个二级分组顶部一个拨动开关，批量开/关该组全部隐藏项。
关键设计是**不新增配置字段、不落库、不引入第二套状态**——点击时批量写回该组每个 `hiddenXxx` key，
与逐项勾选完全等价；开关状态由「该组是否全部开启」推导回填。
`getGroupSwitches` 依赖固定 DOM 顺序（分组标题 → 一键开关 form-box → 组内隐藏项 → 遇下一个 `.ctz-title` 停止），
调整渲染结构须同步改。`init-operate.ts` 优先拦截 `.ctz-group-toggle`（它带 `ctz-i` 类，否则会被当成普通配置）。

**失效检测**（`hidden/check-invalid.ts`）：打开面板时自动体检「当前页面已开启的隐藏规则」，
在隐藏 tab 顶部提示疑似失效并可展开明细（规则名/选择器/分组），帮助发现知乎改版导致的选择器失效。

- 展开 `HIDDEN_ARRAY`（仅开启项）+ `HIDDEN_ARRAY_MORE`（keys 全开的组合项）；
- 从每条 CSS 里只提取「隐藏意图」声明块的选择器（`display:none` / `visibility:hidden` / `font-size:0` / `height:0`），
  忽略 `width:auto` / `padding` 等布局修正块；
- **页面过滤是抗误报核心**：`PAGE_TYPES` 定义各页面探针容器 + 规则特征串，`detectCurrentPages` 探测当前页面，
  `getRulePage` 先看特征串再退回分组默认页面；规则只在本页面适用时才检查。
  **条件出现的规则**（`hiddenAD` 按投放策略出现、评论区 `Comments-container`）由 `isConditionalRule`
  按 value + 选择器特征串识别，计入「跳过」而非「失效」——否则广告命中 0 会被误报成 11 项失效。
- 同一规则多个选择器只要一个命中即有效；`:has()` 兼容失败按有效处理。无失效显示绿色概要，有失效红色概要 + 明细。

**右侧栏空盒子**：首页右侧栏 5 项（创作中心/盐言作者平台/推荐关注/知乎指南/大家都在搜）全隐藏后，
公共容器 `[data-za-detail-view-path-module="RightSideBar"]`（宽 320px）仍占位。组合规则扩到这 5 项，
value 改为 `.Topstory-container [data-za-detail-view-path-module="RightSideBar"]{display:none;}.Topstory-mainColumn{margin:0 auto;}`——
整栏隐藏 + 主列居中。用 `.Topstory-container` 限定在首页，也让失效检测归为「列表页面」规则避免问答页误报。

**删除已废弃规则**：右侧栏付费咨询/知学堂推广位、618 大促商品卡、圈子/分类圆桌/更多分类/首页付费咨询/列表切换-视频
——登录态多页实测确认模块永久消失（宽松特征全部命中 0），连同 `config/types.ts` 字段、`config/index.ts` 默认值、
组合规则 keys、`check-invalid.ts` 条件特征一并清理。判断原则是**只删确已消失的，修存在但失效的**。

**失效选择器修复**（模块仍在场、只是选择器过时）：问题头部 8 项由旧 `.QuestionHeader` 改为 `.PageHeader` +
`[data-za=QuestionDescription]`，改用 `FollowButton` / `WriteAnswerButton` / `QuestionButtonGroup-invite` /
`.Tag:has(a.TopicLink)` / `:has()` 等稳定特征；创作中心补 `.Topstory .CreatorEntrance`；盐选作者平台补
`.New-KfeCollection-CreateSaltCard`；话题浏览/讨论量补 `.TopicMetaCard-voteCard`；列表切换 tab 改用
`header.LeanAppHeaderBar a[href$=...]`；推荐关注用 `.Card:has(> div > button):has(a[href*="/people/"])`
精准命中（避免误伤写想法卡）。修复后失效检测从 11 项降为 0。

**二级 tab 切换修复**：`menu.ts` 的 `getTitleOffsetTop` 原用 `getBoundingClientRect().top`，分组标题是
`position:sticky`，吸顶后 `rect.top`（及 `offsetTop`）都被 sticky 偏移污染，导致点前面的分组滚不回顶部。
改为测量前临时把所有 `.ctz-title` 设为 `static`，读完立即还原，拿到稳定文档流偏移。

### 5. 设置面板与菜单

**主菜单 7 项**（按用户目标归类，不再是代码模块视角）：

| 菜单 | 内容 |
| --- | --- |
| 外观样式 | 所有视觉样式：宽度/字体/图片/列表视频/视频显示方式/背景配色/自定义 CSS |
| 显示修改 | 纯显示类开关：标题类别/高亮/时间/按钮/购物链接/收起展开 |
| 界面清理 | 隐藏模块（8 组） |
| 内容过滤 | 屏蔽内容 + 黑名单 |
| 悬浮增强 | 悬浮模块 + 高性能 |
| 数据记录 | 推荐列表缓存 + 浏览历史 |
| 脚本设置 | 脚本自身功能：接口拦截/快捷键/配置导入导出/关于链接 |

**多容器菜单**（`ctz-dialog/menu.ts`）：一个菜单项可显示多个原容器——菜单用 `data-also` 列出附属容器，
`getMenuContentIds()` 汇总主容器 + 附属容器，`fnChangeMenu` 按 id 列表控制同组容器一起显隐；
`getCurrentTitleList()` 汇总同组所有容器的 `.ctz-title` 供锚点导航。所有容器 id 和 DOM 位置保留，
组件查询与 CSS 选择器不用改，旧 hash 仍有效。

**锚点导航**（`#CTZ_DIALOG_RIGHT_ANCHOR`）：`flex-wrap: wrap` + `overflow: visible`，项多时自动折行
（如「内容过滤」13 项分两行），不再横向滚动藏起来。`getTitleText` 优先取 `.ctz-title-text`，
避免带开关的标题把开关区算进锚点名。

**面板布局**：版本号移到左侧菜单底部（`#CTZ_DIALOG_LEFT` 末尾），关闭（✕）与缩放（⇵）按钮移到右侧
标题栏 `#CTZ_RIGHT_BUTTONS`。事件通过 `name` 委托、版本号全局查询，与 DOM 位置无关。

### 6. 文档与产物

- `CHANGELOG_THIS.md`：本次发布条目；`DEVELOPMENT.md`：开发者指南；本文件记录方案与推导。
- 根目录 `index.js` 是构建产物，**只需 `npm run build:win` 自动生成，不要手动复制**：
  `build-config/esbuild.plugins.js` 的 `envEnd` 插件读 `dist/index.js`、去掉 esbuild 的路径注释后写入根目录。
  `dist/` 被 gitignore，两份内容本就不完全相同，属正常。
  `envLoad` 插件打包时剥离 TS 注释、压缩 LESS/HTML，源码注释只服务阅读、不进产物。
- Windows 下须用 `npm run build:win`（`npm run build` 的 `APP_ENV=prod` 是 Unix 写法不生效）。

---

## 三、验收结果（浏览器实测，登录态知乎）

| 场景 | 结果 |
| --- | --- |
| 改版适配 | 12/12 新选择器全部命中：`header.LeanAppHeaderBar`、`aside a[href=…]`、`.KanshanCornerButton`、`.WriteArea` 等 |
| 分组一键开关 | 开启→该组全部 checkbox 变 true 且元素即时消失；关闭→恢复 unchecked 且元素恢复 |
| 样式总开关 | 关闭→类别标签消失、宽度/字体还原原生、配置值仍在；打开→原设置立即生效 |
| 分项开关 | 默认全开；单独关「版心宽度」后诊断确认注入 CSS 中已无宽度规则，独立生效 |
| 主题分离 | 总开关关闭时面板仍为深色、知乎页面原生；深色下按钮/下拉/单选对比度清晰 |
| 失效检测 | 从最初误报 11 项 → 条件规则跳过后「已检查 N 项，未发现失效」；改坏选择器可正确告警并可展开明细 |
| 右侧栏空盒子 | 5 项全隐藏后整栏消失、主列居中，空白占位不再出现 |
| 菜单与锚点 | 7 个菜单内容归属正确、回填正常；锚点无空壳 tab、多项折行、点击精准滚动 |
| 二级 tab | 从「话题」点「通用」滚回顶部、点中间分组精准定位且高亮正确 |
| 脚本按钮 | 齿轮、看山等注入按钮在总开关关闭时始终保留 |
| 构建 | `npm run build:win` 成功、产物含关键改动、所有临时诊断代码与残留已清除 |

验证方式：改完 `index.js` → 浏览器刷新页面（本地 file:// 加载油猴脚本，无需手动更新）→ 逐项实测。

---

## 四、已知边界 / 后续注意

1. **跨页面规则未在首页验证**：问答页/文章页/搜索页/用户主页的选择器在首页 MISS 属正常，不代表失效。
   判断原则是 **MISS ≠ 功能不需要**——绝大多数 MISS 规则的父容器仍在，只是子选择器过时或内容条件展示，
   应按「选择器需修复」处理，不能按命中 0 直接删。某页面仍有未屏蔽元素时，在该页面重跑诊断补齐。
2. **哈希类名仍会变**：`listen-comment.ts`、`configs.ts` 中少量 `css-xxxxx` 无稳定特征可替，知乎下次发版可能需再更新，
   优先按第 1 节的选择器约定替换成稳定特征。
3. **构建不做类型检查**：esbuild 不做 TypeScript 类型检查，曾出现 `NodeList.filter` 这类运行时才暴露的问题。
   改完用 `npx tsc --noEmit` 自查，并实际刷新页面点一遍开关，不要只依赖构建成功。
