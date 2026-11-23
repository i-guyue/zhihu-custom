import { dom, domA, myStorage } from '../tools';
import { appendHiddenStyle, HIDDEN_ARRAY } from './hidden';

/**
 * 隐藏模块「二级分组一键开关」
 *
 * 功能：隐藏模块（#CTZ_HIDDEN）按页面区域分为 8 个二级分组（通用 / 操作栏 /
 * 列表页面 / 问答页面 / 文章专栏 / 用户主页 / 收藏夹 / 话题），每组含若干独立
 * 隐藏开关。本模块为每组提供一个拨动开关，一次性开启或关闭整组隐藏项。
 *
 * 设计要点（不新增配置字段、不引入第二套状态）：
 * - 分组开关本身不写入配置，它的勾选状态由「该组隐藏项是否全部开启」推导；
 * - 点击时批量写回的是该组每个隐藏项原有的配置 key（hiddenXxx），
 *   因此隐藏样式的生成与持久化仍走原有的 appendHiddenStyle / myStorage，
 *   与逐项勾选完全等价；
 * - 样式即时生效，不需要刷新页面。
 *
 * 完整链路（相关文件）：
 *   hidden/create-html.ts        渲染分组开关 DOM，data-group 绑定分组 key
 *   init/init-operate.ts         面板点击事件中优先拦截 .ctz-group-toggle
 *   components/echo-data.ts      每次打开面板回填分组开关状态
 *   components/hidden/index.ts   appendHiddenStyle 注入隐藏 CSS
 *   styles/form.less             .ctz-group-toggle-hint 提示文字
 */

/**
 * 取分组开关管辖的所有隐藏项 checkbox。
 *
 * 隐藏模块渲染后的 DOM 结构（见 hidden/create-html.ts）：
 *   <div class="ctz-title">分组标题</div>
 *   <div class="ctz-form-box">[本组一键开关]</div>   ← toggleNode 所在
 *   <div class="ctz-form-box">…隐藏项开关…</div>     ← 同组，可能连续多个
 *   <div class="ctz-form-box">…隐藏项开关…</div>
 *   <div class="ctz-title">下一分组标题</div>        ← 遍历到此前停止
 *
 * 从一键开关所在 form-box 的下一个兄弟节点开始向后收集 input.ctz-switch，
 * 遇到下一个 .ctz-title 即停。分组开关自身位于起始 form-box 内，不在收集范围，
 * 因此不会出现「开关控制自己」。
 */
const getGroupSwitches = (toggleNode: HTMLElement): HTMLInputElement[] => {
  const toggleBox = toggleNode.closest('.ctz-form-box');
  const result: HTMLInputElement[] = [];
  let node = toggleBox?.nextElementSibling;
  while (node && !node.classList.contains('ctz-title')) {
    node.querySelectorAll('input.ctz-switch').forEach((item) => result.push(item as HTMLInputElement));
    node = node.nextElementSibling;
  }
  return result;
};

/**
 * 批量切换某个隐藏分组的所有隐藏项。
 * @param key    HIDDEN_ARRAY 中的分组 key（与 data-group 一致）
 * @param enable 开关当前勾选状态：true 全开 / false 全关
 *
 * 配置来源直接取 HIDDEN_ARRAY 的 content（二维数组），不依赖 DOM 是否渲染，
 * 因此即使分组内容尚未显示也能正确写入全部 key。写回后顺序为：
 * 持久化 → 重新注入隐藏样式 → 同步面板上各开关与分组开关的勾选状态。
 */
export const toggleHiddenGroup = async (key: string, enable: boolean) => {
  const group = HIDDEN_ARRAY.find((item) => item.key === key);
  if (!group) return;
  const record: Record<string, boolean> = {};
  group.content.forEach((items) => items.forEach((item) => (record[item.value] = enable)));
  await myStorage.updateConfigItem(record);
  appendHiddenStyle();
  const toggleNode = dom(`[data-group="${key}"]`);
  if (toggleNode) {
    getGroupSwitches(toggleNode).forEach((item) => (item.checked = enable));
    (toggleNode as HTMLInputElement).checked = enable;
  }
};

/**
 * 回填分组一键开关状态：仅当组内隐藏项全部开启时才显示为开。
 * 依赖 echoData 已先回填完各单项开关，故在 echoData 末尾调用。
 * 分组开关没有 name，echoData 的通用 checkbox 回填会把 config[undefined]
 * 视作 false，这里再按实际组内状态覆盖为最终值。
 */
export const echoHiddenGroupToggle = () => {
  domA('input.ctz-group-toggle').forEach((node) => {
    const switches = getGroupSwitches(node as HTMLElement);
    (node as HTMLInputElement).checked = switches.length > 0 && switches.every((item) => item.checked);
  });
};
