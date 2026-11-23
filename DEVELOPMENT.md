# 开发者指南

> 面向接手维护本项目的开发者，讲的是**项目本身怎么运转、怎么改**。
> 用户功能见 `README.md`，版本变更见 `CHANGELOG.md` / `CHANGELOG_THIS.md`，本轮 fork 的改动推导见 `MODIFICATIONS.md`。

本项目是**油猴用户脚本**（Tampermonkey / Violentmonkey），用于定制知乎网页：隐藏模块、过滤内容、调整尺寸主题、缓存列表、导出内容等。fork 自 `liuyubing233/zhihu-custom`，在原项目上做了知乎新版适配和若干新功能。

## 一、技术栈与构建

- TypeScript（`src/`）+ `index.html` 模板 + LESS（`src/styles/`）
- esbuild 打包成单文件油猴脚本，产物是根目录 `index.js`（油猴加载的就是它）
- 构建时插件把 LESS 编译压缩、HTML 压缩后填入 `web-resources.ts` 的 `INNER_CSS` / `INNER_HTML` 常量，并**剥离所有 TS 注释**（注释不进产物）
- 存储：`localStorage` + GM `GM.setValue` 双写，按时间戳取新

```bash
npm run dev:win     # 开发：watch + http://localhost:5555
npm run build:win   # 构建：生成根目录 index.js
# 非 Windows 去掉 :win
```

> **不要手动 `cp dist/index.js index.js`**——构建脚本自动生成，且根目录那份去掉了路径注释，属正常设计。

调试：改 `src/` → `dev:win` → 油猴脚本指向 `http://localhost:5555/index.js`（或每次 `build:win` 后更新脚本）→ 刷新知乎。

## 二、启动流程（`src/index.ts`）

`// @run-at document-start`，DOM 未成型，分两阶段等待：

```text
onDocumentStart（等 head）
  ├─ 注入 INNER_CSS（脚本自身样式）
  ├─ 读/补全配置并写回（含旧字段迁移）
  ├─ appendHiddenStyle() 注入隐藏规则
  ├─ myBackground / mySize / changeVideoStyle 初始化
  ├─ 改写 window.fetch 做接口拦截（受 fetchInterceptStatus 控制）
  └─ onBodyLoad（等 body）
       ├─ 解析 #js-initialData 预过滤
       ├─ initHTML() 渲染面板 → initOperate() 绑事件 → echoData() 回填
       ├─ mySize.initAfterLoad() / myCustomStyle.init() 等
       └─ historyToChangePathname() 按路由执行页面功能
```

要点：
- 主逻辑只在 `www.zhihu.com` / `zhuanlan.zhihu.com` 且非 iframe 运行（`misc/index.ts`）。
- **接口拦截**：改写 `window.fetch`（Safari 用 `unsafeWindow`），按 URL 匹配推荐流/回答/评论/黑名单等接口，交给 `store` 和过滤模块。黑名单、导出、不感兴趣都依赖它，关闭会确认并刷新。
- **路由变化**：监听 `popstate` / `pushState` 调 `changeHistory()`；仅 hash 变化不重新初始化（面板 tab 用 hash 切换）。
- **快捷键**：`Shift + .` 唤起/关闭面板，`Esc` 关闭弹窗，`o` 展开全文。

## 三、目录导览

```text
src/
├── index.ts / index.html / web-resources.ts   入口、面板模板、样式模板占位
├── misc/index.ts        全局常量（域名白名单、class、面板 id）
├── config/              types.ts（配置类型）+ index.ts（CONFIG_DEFAULT 默认值）
├── tools/               storage.ts（双写存储）、dom.ts、fetch.ts 等通用工具
├── store/index.ts       运行时内存状态
├── init/
│   ├── init-html/       initHTML：渲染各 tab；configs/ 放静态开关项数组
│   ├── init-operate.ts  面板事件委托（点击/change → 处理函数）
│   └── init-*.ts        历史、图片预览、resize、置顶、重定向
├── components/          功能模块，一目录/文件对应一类
│   ├── hidden/          configs.ts（选择器数据）、append-style.ts、create-html.ts、check-invalid.ts（规则体检）
│   ├── background/      主题配色，面板与页面主题分离
│   ├── size/            my-size.ts（尺寸 CSS）、create-html.ts
│   ├── black-list/      黑名单：接口拦截、批量操作
│   ├── listen-list/     推荐流监听与高性能模式
│   ├── ctz-dialog/      menu.ts（左侧 tab + 锚点导航）、open.ts
│   ├── video/           视频样式/下载/自动播放修复
│   ├── toggle-all.ts    隐藏模块分组一键开关
│   ├── fn-changer.ts    配置项变更的统一调度中心
│   └── echo-data.ts     打开面板时回填配置到控件
├── styles/              LESS（index.less 为汇总入口）
└── types/               知乎接口返回数据类型（zhihu/*.type.ts）
```

## 四、配置与面板机制（改动最多）

**配置读写**：类型集中在 `IPfConfig`（`config/types.ts`），默认值在 `CONFIG_DEFAULT`（`config/index.ts`）。`myStorage` 同时写 localStorage 和 GM，每条带时间戳，读取取较新的一份并同步回另一侧。常用 API：`getConfig()` / `updateConfigItem(key, value)` / `updateConfig(obj)`。启动时用 `{...CONFIG_DEFAULT, ...savedConfig}` 补全——**新增配置只要加默认值，老用户自动获得，无需迁移脚本**；只有字段含义变了才写迁移逻辑。

**面板渲染**：`initHTML()` 以 `INNER_HTML` 为骨架填充各 tab。静态开关来自 `init-html/configs/*.ts` 数组（`{label, value}`），用 `createHTMLFormBoxSwitch()` 生成控件；隐藏模块由 `hidden/create-html.ts` 按 `HIDDEN_ARRAY` 的 8 个分组渲染（每组顶部带一键开关）；尺寸/主题/黑名单等各有自己的 `create-html.ts`。

左侧主 tab 由 `index.html` 的 `#CTZ_DIALOG_MENU` 提供，`ctz-dialog/menu.ts` 负责：
- hash（如 `#CTZ_VERSION`）切换对应 `#CTZ_xxx` 容器；分组用 `data-also` 列出附属容器，一个菜单项可显示多个容器。
- 右侧锚点导航（`#CTZ_DIALOG_RIGHT_ANCHOR`）从当前菜单对应容器的所有 `.ctz-title` 生成（多项自动换行），点击滚动到对应分组。

**开关变更调度（`fn-changer.ts`）**：所有控件变更汇聚到 `fnChanger(ev)`——先 `updateConfigItem` 持久化，再按 name 分派副作用：`/^hidden/` → `appendHiddenStyle()`；尺寸/字体类 → `mySize.change()`；特殊项走 `ob` 映射表；`fetchInterceptStatus` 确认后刷新。事件绑定在 `initOperate()`：`onclick` 先拦截 `.ctz-group-toggle`（无 name 的分组开关），再处理 `ctz-i`；`onchange` 处理 `ctz-i-change`。

> 新增开关：加配置类型 + 默认值 + 面板项 + （需即时生效时）在 `fnChanger` 加分派分支。

**回填（`echo-data.ts`）**：每次打开面板调 `echoData()`，把配置写回控件，最后调 `echoHiddenGroupToggle()` 回填分组开关状态。

## 五、样式注入约定

统一用 `fnAppendStyle(styleId, cssText)`，同名 id 覆盖旧内容：

| styleId | 来源 | 受 `sizeStyleEnabled` 总开关控制 |
| --- | --- | --- |
| `CTZ_STYLE` | `INNER_CSS`（脚本自身 UI） | 否，始终注入 |
| `CTZ_STYLE_HIDDEN` | 隐藏规则 | 否，屏蔽始终生效 |
| `CTZ_STYLE_BACKGROUND` | 主题配色 | **是** |
| `CTZ_STYLE_CUSTOM` | 自定义 CSS | **是** |
| `CTZ_STYLE_VIDEO` | 视频样式 | **是** |

总开关关闭时后三者注入空串、页面还原原生；配置值保留，重开即恢复。脚本按钮和隐藏屏蔽不受影响。

## 六、知乎改版适配（最频繁的维护）

隐藏规则依赖知乎动态生成的哈希类名（`css-xxxxx`），每次发版都可能变。约定：

1. **优先稳定标识**：`href` / `aria-label` / `data-za-*` / 语义类名，其次 `:has()`，最后哈希类名。
2. **按 href 匹配必带容器限定**（如 `aside a[href="..."]`），否则误伤正文同类链接。
3. **区分"当前页面无此元素"与"规则失效"**：其它页面的规则在本页 MISS 属正常，别据此删除。
4. **诊断方法**：登录态页面执行不了 JS（`javascript:` 和快捷键被拦），用生成诊断脚本 → 用户手动运行 → 回贴结果。生成器在 `.workbuddy/gen_diag.js`（已 gitignore）。
5. **href 形式**：左侧导航是绝对 URL，推广卡片可能用相对路径，匹配前先确认。

改完：`npm run build:win` → 油猴更新 → 刷新知乎验证。

## 七、常见改动速查

| 想做的事 | 改哪里 |
| --- | --- |
| 新增隐藏开关 | `hidden/configs.ts` 加 `{label, value, css}` + `config/types.ts` 加字段 |
| 新增普通开关 | `init-html/configs/*.ts` 或 `index.html` 加控件 + 类型/默认值 + `fn-changer.ts` 分派 |
| 调整尺寸样式 | `size/my-size.ts`，确认在 `fnChanger` 的 doCssVersion 列表里触发 |
| 适配知乎改版 | `hidden/configs.ts` 选择器 + `background/background.ts` 头部/侧栏着色选择器 |
| 加面板 tab | `index.html` 加 `#CTZ_xxx` 容器和菜单项 + `init-operate.ts` 事件 + `menu.ts` 路由 |
| 改主题配色 | `background/`（dark.ts / light.ts / types.ts）+ 主题 UI |
| 发布版本 | 改 `package.json` 的 version → `CHANGELOG_THIS.md` 写条目 → `npm run build:win` |

## 八、注意事项

- esbuild 不做类型检查，类型错误不阻断构建；改完用 `npx tsc --noEmit` 自查。
- 面板深色样式依赖 `html[theme-dark]`（`styles/common.less`），是**脚本自身 UI 配色**，与知乎页面主题（`data-theme`）是两套，勿耦合。
- 隐藏规则的 DOM 顺序被 `toggle-all.ts` 的 `getGroupSwitches()` 依赖，调整渲染结构要同步改。
- 用户功能说明在 `README.md`，无图精简版在 `README_LESS_IMAGE.md`。
