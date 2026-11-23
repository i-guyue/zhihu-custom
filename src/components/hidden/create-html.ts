import { dom } from '../../tools';
import { HIDDEN_ARRAY } from './configs';
import { IHiddenContentItem } from './types';

/**
 * 生成分组一键开关的 DOM。
 * 与设置面板里其它开关完全一致（ctz-i / ctz-switch 拨动样式），不额外做按钮样式；
 * data-group 存 HIDDEN_ARRAY 的分组 key，供 toggleHiddenGroup 定位该组配置项。
 */
const createGroupToggleHTML = (key: string) =>
  `<div class="ctz-form-box">` +
  `<div class="ctz-form-box-item">` +
  `<div>一键开启/关闭本组<span class="ctz-group-toggle-hint">开启后隐藏本组全部内容</span></div>` +
  `<div><input class="ctz-i ctz-switch ctz-group-toggle" data-group="${key}" type="checkbox" value="on" /></div>` +
  `</div>` +
  `</div>`;

/**
 * 隐藏项专用渲染：在开关名称下方直接显示一行说明小字，让「屏蔽的是什么」一眼可见。
 * 不使用通用 createHTMLFormBoxSwitch 的问号 tooltip——用户反馈悬停提示不够直观。
 * name 属性保持为 value，init-operate.ts 的事件委托按 name 读写配置，不受影响。
 */
const createHiddenItemHTML = (items: IHiddenContentItem[][]): string =>
  items
    .map(
      (row) =>
        `<div class="ctz-form-box">` +
        row
          .map(({ label, value, tooltip }) => {
            const desc = tooltip ? `<div class="ctz-hidden-item-desc">${tooltip}</div>` : '';
            return (
              `<div class="ctz-form-box-item ctz-hidden-item">` +
              `<div><div class="ctz-hidden-item-label">${label}</div>${desc}</div>` +
              `<div><input class="ctz-i ctz-switch" name="${value}" type="checkbox" value="on" /></div>` +
              `</div>`
            );
          })
          .join('') +
        `</div>`
    )
    .join('');

/**
 * 初始化隐藏元素设置，添加修改器隐藏模块设置元素。
 * 每个二级分组的输出顺序固定为：分组标题 → 一键开关 form-box → 该组若干隐藏项 form-box，
 * toggle-all.ts 的 getGroupSwitches 依赖这个顺序遍历兄弟节点，调整渲染时需同步。
 */
export const createHTMLHiddenConfig = (domMain: HTMLElement) => {
  dom('#CTZ_HIDDEN', domMain)!.innerHTML =
    // 隐藏规则失效检测提示区：固定放在本 tab 顶部，打开面板时由 runHiddenCheck 填充结果
    `<div id="CTZ_HIDDEN_CHECK" class="ctz-check-box"></div>` +
    HIDDEN_ARRAY.map(
      (item) =>
        (item.name ? `<div class="ctz-title">${item.name}<span>${item.desc}</span></div>` : '') +
        createGroupToggleHTML(item.key) +
        createHiddenItemHTML(item.content)
    ).join('');
};
