import { dom, fnLog, myStorage } from '../../tools';
import { HIDDEN_ARRAY, HIDDEN_ARRAY_MORE } from './configs';
import { IHiddenContentItem } from './types';

/**
 * 隐藏规则失效检测。
 *
 * 背景：知乎改版会更换 DOM 结构 / class 名，导致 configs.ts 里的 CSS 选择器
 * 匹配不到任何元素，隐藏功能「看似开着、实则失效」。本模块在每次打开设置面板时
 * 对「当前页面已开启的隐藏规则」做一次命中体检，把未命中的规则提示给用户。
 *
 * 两个关键设计，用于避免误报：
 * 1. 页面类型过滤：隐藏规则分属通用 / 操作栏 / 列表 / 问答 / 文章 / 用户主页 /
 *    收藏夹 / 话题等分组，很多规则只在特定页面出现。若不加区分，在首页会把
 *    「问题话题」这类只在问答页生效的规则误报成失效。这里用页面容器特征探测当前
 *    页面类型，再结合规则选择器里的页面特征串，只检查「本页面应当生效」的规则。
 * 2. 隐藏意图声明：一条 css 里可能既有 display:none 又有 width:auto / padding 等
 *    布局修正（后者是配合隐藏用的，单独拿来判断命中没有意义）。只提取含隐藏语义
 *    （display:none / visibility:hidden / font-size:0 / height:0）声明块的选择器。
 */

/** 一条待检查的规则：展开配置时带上所属分组信息，检查阶段不再反查 */
interface ICheckRule {
  /** 所属分组中文名 */
  group: string;
  /** 所属分组 key，用于查表得到默认页面类型 */
  groupKey: string;
  /** 规则配置key、中文名与 css */
  item: IHiddenContentItem;
}

/** 检测结果中的一条未命中记录 */
export interface IInvalidRule {
  /** 所属分组名，如「问答页面」 */
  group: string;
  /** 规则中文名，如「问题话题」 */
  label: string;
  /** 配置 key */
  value: string;
  /** 未命中的选择器 */
  selector: string;
}

/** 完整的检测结果 */
export interface ICheckResult {
  /** 已开启且在检查范围内的规则总数 */
  checked: number;
  /** 疑似失效（页面适用但未命中）的规则 */
  invalid: IInvalidRule[];
  /** 当前页面不适用、被跳过的规则数（不计入失效） */
  skipped: number;
}

/** 声明块里的隐藏语义：只有这些才代表「这条规则要隐藏某元素」 */
const HIDE_DECLARATION = /display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0|height\s*:\s*0/i;

/**
 * 页面类型探测表。
 * probe 是「该页面必然存在的容器选择器」，命中即认为当前处于该页面类型；
 * features 是规则选择器里代表该页面的特征串，用于判断规则属于哪个页面。
 */
const PAGE_TYPES: { name: string; probe: string; features: string[] }[] = [
  { name: '问答页面', probe: '.QuestionPage', features: ['Question', 'AnswerItem', 'ContentItem-actions', 'Reward', 'Question-sideColumn'] },
  { name: '文章专栏', probe: '.zhuanlan, .Post-Main', features: ['zhuanlan', 'Post-', 'PostIndex'] },
  { name: '搜索页面', probe: '#SearchMain', features: ['SearchMain', 'Search-container', 'SearchSideBar'] },
  { name: '用户主页', probe: '.Profile-mainColumn', features: ['Profile-'] },
  { name: '收藏夹', probe: '.Collections-container', features: ['Collections-', 'CollectionsDetailPage'] },
  { name: '话题页面', probe: '[data-za-detail-view-path-module="TopicItem"]', features: ['TopicItem'] },
  // 首页信息流 / 关注 / 热榜共用 Topstory 容器
  { name: '列表页面', probe: '#TopstoryContent, .Topstory-container', features: ['Topstory', 'HotItem', 'TopstoryContent'] },
];

/**
 * 分组 key 到页面类型的映射。
 * 通用 / 导航菜单 / 操作栏组是跨页面生效的，不在此表中（规则选择器自带页面特征串时仍会被 getRulePage 识别）。
 */
const GROUP_PAGE: Record<string, string> = {
  CTZ_HIDDEN_ANSWER: '问答页面',
  CTZ_HIDDEN_ARTICLE: '文章专栏',
  CTZ_HIDDEN_LIST: '列表页面',
  CTZ_HIDDEN_SEARCH: '搜索页面',
  CTZ_HIDDEN_USER_HOME: '用户主页',
  CTZ_HIDDEN_COLLECTIONS: '收藏夹',
  CTZ_HIDDEN_TOPIC: '话题页面',
};

/**
 * 「条件出现」的规则：这类规则依赖页面恰好展示某内容才命中，命中 0 并不代表失效，
 * 而是本次没有该内容（广告按投放策略展示、评论区需展开才存在）。它们不参与失效检测，
 * 直接计入「跳过」，避免整屏误报。
 *
 * 判定依据（Chrome 登录态实测）：同一批广告选择器，首页无投放时 11 项全部命中 0，
 * 问答页却有 .pc-article-answer-text-chain 命中 1（软广卡片仍在使用这个老类名）。
 * 可见命中数取决于「这次有没有投放广告」，而非规则本身失效，因此广告规则必须跳过。
 *
 * - 按配置 value 标识：hiddenAD（广告，通用组，跨页面条件投放）
 * - 按选择器特征串：Comments-container（问答页评论区，未展开时不存在）
 */
const CONDITIONAL_RULE_VALUES = ['hiddenAD'];
const CONDITIONAL_FEATURES = ['Comments-container'];

/** 一条规则是否为「条件出现」规则（命中 0 属正常，应跳过检测） */
const isConditionalRule = (item: IHiddenContentItem, selectors: string[]): boolean => {
  if (CONDITIONAL_RULE_VALUES.includes(item.value)) return true;
  const selectorText = selectors.join(' ');
  return CONDITIONAL_FEATURES.some((feature) => selectorText.includes(feature));
};

/**
 * 从一条 css 里提取所有「隐藏意图」选择器。
 * 一条 css 可能含多个声明块（如 `a{display:none}b{width:auto}`），
 * 只保留声明里带隐藏语义的选择器，并按逗号拆成单个选择器。
 */
const extractHideSelectors = (css: string): string[] => {
  const selectors: string[] = [];
  // 依次匹配 `选择器{声明}`，选择器部分允许换行与逗号
  const ruleReg = /([^{}]+)\{([^{}]*)\}/g;
  let matched: RegExpExecArray | null;
  while ((matched = ruleReg.exec(css))) {
    if (!HIDE_DECLARATION.test(matched[2])) continue;
    matched[1]
      .split(',')
      .map((selector) => selector.trim())
      .filter(Boolean)
      .forEach((selector) => selectors.push(selector));
  }
  return selectors;
};

/**
 * 判断一条规则适用于哪个页面类型。
 * 优先看选择器里的页面特征串（操作栏组把各页面规则混在一起，必须靠特征区分）；
 * 特征都不命中时才退回分组的默认页面类型；两者都没有则是跨页面的通用规则（返回空）。
 * 注：条件出现规则（广告/评论区）已在调用方由 isConditionalRule 提前跳过，不在这里判断。
 */
const getRulePage = (groupKey: string, selectors: string[]): string | undefined => {
  const selectorText = selectors.join(' ');
  for (const page of PAGE_TYPES) {
    if (page.features.some((feature) => selectorText.includes(feature))) return page.name;
  }
  return GROUP_PAGE[groupKey];
};

/**
 * 探测当前页面属于哪些页面类型。
 * 用 DOM 容器而非 pathname 判断，是因为知乎 SPA 路由与 URL 形式多样，容器更可靠。
 */
const detectCurrentPages = (): Set<string> => {
  const pages = new Set<string>();
  PAGE_TYPES.forEach((page) => {
    if (dom(page.probe)) pages.add(page.name);
  });
  return pages;
};

/** 把配置展开成待检查规则列表，只包含开启了开关的项 */
const collectEnabledRules = (config: Record<string, any>): ICheckRule[] => {
  const rules: ICheckRule[] = [];
  HIDDEN_ARRAY.forEach((group) => {
    group.content.forEach((row) => {
      row.forEach((item) => {
        if (config[item.value]) rules.push({ group: group.name, groupKey: group.key, item });
      });
    });
  });
  // 组合规则：一组开关全开才生效，页面归属由 css 里的特征串判断
  HIDDEN_ARRAY_MORE.forEach(({ keys, value }) => {
    if (!keys.every((key) => config[key])) return;
    rules.push({
      group: '组合隐藏',
      groupKey: '组合隐藏',
      item: { label: keys.join(' + '), value: keys[0], css: value },
    });
  });
  return rules;
};

/**
 * 判断选择器在当前页面是否命中元素。
 * 选择器来自本地配置而非用户输入，但仍用 try 包裹：知乎选择器里用了 :has() 等，
 * 个别浏览器版本不支持时会抛错，此时按「有效」处理，避免误报。
 */
const isSelectorMatched = (selector: string): boolean => {
  try {
    return document.querySelectorAll(selector).length > 0;
  } catch {
    return true;
  }
};

/** 执行一次隐藏规则失效检测 */
export const checkHiddenInvalid = async (): Promise<ICheckResult> => {
  const config = await myStorage.getConfig(true);
  const currentPages = detectCurrentPages();
  const rules = collectEnabledRules(config);
  const result: ICheckResult = { checked: 0, invalid: [], skipped: 0 };

  rules.forEach(({ group, groupKey, item }) => {
    const selectors = extractHideSelectors(item.css);
    if (!selectors.length) return;

    // 条件出现规则（广告按投放展示、评论区需展开）命中 0 属正常，跳过不计失效
    if (isConditionalRule(item, selectors)) {
      result.skipped++;
      return;
    }

    const rulePage = getRulePage(groupKey, selectors);
    // 规则属于特定页面，但当前不在该页面 -> 跳过，不计入失效
    if (rulePage && !currentPages.has(rulePage)) {
      result.skipped++;
      return;
    }

    result.checked++;
    // 同一规则可能有多个选择器（逗号分隔），全部未命中才算失效
    const hit = selectors.some(isSelectorMatched);
    if (hit) return;

    selectors.forEach((selector) => result.invalid.push({ group, label: item.label, value: item.value, selector }));
  });

  return result;
};

/** 检测结果容器的 id，渲染与清空共用 */
const CHECK_BOX_ID = 'CTZ_HIDDEN_CHECK';

/**
 * 渲染检测结果到隐藏模块 tab 顶部。
 * 分为两层：一句话概要 + 可展开的明细列表，避免无失效时干扰视线。
 */
export const renderCheckResult = (result: ICheckResult) => {
  const box = dom(`#${CHECK_BOX_ID}`);
  if (!box) return;

  const { checked, invalid, skipped } = result;
  if (!invalid.length) {
    box.innerHTML = `<div class="ctz-check-summary ctz-check-ok">✓ 已检查 ${checked} 项已开启规则，未发现失效${skipped ? `（另跳过 ${skipped} 项非当前页面规则）` : ''}</div>`;
    return;
  }

  const rows = invalid
    .map(
      ({ group, label, selector }) =>
        `<div class="ctz-check-row"><span class="ctz-check-row-name">${label}</span><span class="ctz-check-row-sel">${selector}</span><span class="ctz-check-row-group">${group}</span></div>`
    )
    .join('');
  box.innerHTML =
    `<div class="ctz-check-summary ctz-check-warn">⚠ 检测到 ${invalid.length} 项疑似失效（已检查 ${checked} 项，跳过 ${skipped} 项非当前页面规则）</div>` +
    `<details class="ctz-check-detail"><summary>查看明细</summary>${rows}</details>` +
    `<div class="ctz-check-note">「疑似失效」表示规则已开启、页面也适用，但选择器未匹配到元素。知乎改版常导致此类问题；也可能是该模块本次未展示，请到对应页面复核。</div>`;
};

/**
 * 打开面板时执行检测并渲染。
 * 检测是纯读取 + DOM 查询，不改任何配置，也不干扰 echoData 的回填流程。
 */
export const runHiddenCheck = async () => {
  const box = dom(`#${CHECK_BOX_ID}`);
  if (!box) return;
  box.innerHTML = '<div class="ctz-check-hint">正在检测…</div>';
  const result = await checkHiddenInvalid();
  renderCheckResult(result);
  fnLog(`隐藏规则检测完成：已检查 ${result.checked} 项，疑似失效 ${result.invalid.length} 项`);
};
