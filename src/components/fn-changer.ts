import { dom, domById, myStorage } from '../tools';
import { INPUT_NAME_THEME, INPUT_NAME_THEME_DARK, INPUT_NAME_ThEME_LIGHT, myBackground, onUseThemeDark } from './background';
import { changeReplaceBlockUserSwitchDisabled } from './black-list';
import { myCustomStyle } from './custom-style';
import { appendHiddenStyle } from './hidden';
import { previewGIF } from './image';
import { myListenList } from './listen-list';
import { changeICO, changeTitle } from './page-title';
import { mySize } from './size';
import { onChangeSuspensionSwitch, suspensionPickupAttribute } from './suspension';
import { addArticleTime, addQuestionTime } from './time';
import { changeVideoStyle } from './video';

/** 更改编辑器方法 */
export const fnChanger = async (ev: HTMLInputElement) => {
  // onchange 时只调用 mySize 的 name
  const doCssVersion = [
    'questionTitleTag',
    'listTitleTagQuestion',
    'listTitleTagArticle',
    'listTitleTagVideo',
    'listTitleTagPin',
    'fixedListItemMore',
    // 'linkShopping',
    'highlightListItem',
    'zoomImageSize',
    // 'zoomImageHeight',
    'zoomImageHeightSize',
    'versionHome',
    'versionAnswer',
    'versionArticle',
    'versionHomePercent',
    'versionAnswerPercent',
    'versionArticlePercent',
    'versionUserHome',
    'versionUserHomePercent',
    'versionCollection',
    'versionCollectionPercent',
    'fontSizeForListTitle',
    'fontSizeForAnswerTitle',
    'fontSizeForArticleTitle',
    'fontSizeForList',
    'fontSizeForAnswer',
    'fontSizeForArticle',
    'contentLineHeight',
    // 'zoomListVideoType',
    'zoomListVideoSize',
    'commitModalSizeSameVersion',
  ];
  const { name, value, checked, type } = ev;
  const changeBackground = () => {
    mySize.change();
    myBackground.init();
    myListenList.restart();
    onUseThemeDark();
  };
  /**
   * 样式总开关变更：统一刷新所有会注入视觉样式的模块。
   *
   * 各模块（mySize / myBackground / myCustomStyle / changeVideoStyle）都是
   * 「自己读一次配置再决定注入什么」，总开关本身不会触发它们重算，
   * 因此切换时必须逐一调用一次；模块内部已各自判断 sizeStyleEnabled，
   * 关闭时都会注入空串，从而一次性清掉之前注入的全部视觉样式。
   * 隐藏样式（appendHiddenStyle）与脚本按钮不受此开关影响，无需刷新。
   */
  const changeStyleEnabled = async () => {
    mySize.change();
    await myBackground.init();
    const config = await myStorage.getConfig();
    myCustomStyle.change(config.customizeCss || '');
    changeVideoStyle();
    onUseThemeDark();
  };

  const rangeChoosePercent = () => {
    const rangeName = name.replace('IsPercent', '');
    const rangeNamePercent = `${rangeName}Percent`;
    const domRange = dom(`.ctz-range-${rangeName}`);
    const domRangePercent = dom(`.ctz-range-${rangeNamePercent}`);
    if (domRange && domRangePercent) {
      domRange.style.display = checked ? 'none' : 'flex';
      domRangePercent.style.display = !checked ? 'none' : 'flex';
    }
    mySize.change();
  };

  const ob: Record<string, Function> = {
    sizeStyleEnabled: changeStyleEnabled,
    // 7 个视觉子开关：各模块内部已判断自己的子开关，这里统一走全量刷新即可。
    // 全量刷新是幂等的（每个模块都是「读配置→注入对应 CSS」），不会互相干扰。
    styleWidthEnabled: changeStyleEnabled,
    styleFontEnabled: changeStyleEnabled,
    styleImageEnabled: changeStyleEnabled,
    styleListVideoEnabled: changeStyleEnabled,
    styleBackgroundEnabled: changeStyleEnabled,
    styleCustomCssEnabled: changeStyleEnabled,
    styleVideoEnabled: changeStyleEnabled,
    [INPUT_NAME_THEME]: changeBackground,
    [INPUT_NAME_ThEME_LIGHT]: changeBackground,
    [INPUT_NAME_THEME_DARK]: changeBackground,
    colorText1: changeBackground,
    backgroundHighlightOriginal: changeBackground,
    // suspensionHomeTab: () => {
    //   mySize.change();
    //   changeSuspensionTab();
    // },
    // suspensionFind: () => suspensionHeader('suspensionFind'),
    // suspensionSearch: () => suspensionHeader('suspensionSearch'),
    // suspensionUser: () => suspensionHeader('suspensionUser'),
    titleIco: changeICO,
    showGIFinDialog: previewGIF,
    questionCreatedAndModifiedTime: addQuestionTime,
    highlightOriginal: () => myListenList.restart(),
    listOutPutNotInterested: () => myListenList.restart(),
    articleCreateTimeToTop: addArticleTime,
    versionHomeIsPercent: rangeChoosePercent,
    versionAnswerIsPercent: rangeChoosePercent,
    versionArticleIsPercent: rangeChoosePercent,
    versionUserHomeIsPercent: rangeChoosePercent,
    versionCollectionIsPercent: rangeChoosePercent,
    // zoomImageType: () => {
    //   mySize.change();
    //   initImagePreview();
    // },
    globalTitleRemoveMessage: changeTitle,
    suspensionPickUp: suspensionPickupAttribute,
    suspensionPickupRight: suspensionPickupAttribute,
    // videoInAnswerArticle: () => {
    //   changeVideoStyle();
    //   myListenList.restart();
    //   myListenAnswer.restart();
    // },
    // homeContentOpen: () => {
    //   myListenUserHomeList.restart();
    // },
    topVote: () => {
      appendHiddenStyle();
    },
    suspensionSwitch: onChangeSuspensionSwitch,
    suspensionSwitchFollow: onChangeSuspensionSwitch,
    suspensionSwitchDefault: onChangeSuspensionSwitch,
    suspensionSwitchHot: onChangeSuspensionSwitch,
    suspensionSwitchColumnSquare: onChangeSuspensionSwitch,
    suspensionSwitchRingFeeds: onChangeSuspensionSwitch,
  };

  if (name === 'fetchInterceptStatus') {
    if (
      confirm(
        !checked
          ? '关闭接口拦截，确认后将刷新页面。\n「黑名单设置；外置不感兴趣；快速屏蔽用户；回答、文章和收藏夹导出」功能将不可用。'
          : '开启接口拦截，确认后将刷新页面。\n如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。'
      )
    ) {
      await myStorage.updateConfigItem('fetchInterceptStatus', checked);
      window.location.reload();
    } else {
      ev.checked = !checked;
    }
    return;
  }

  await myStorage.updateConfigItem(name, type === 'checkbox' ? checked : value);

  if (name === 'replaceBlockUserContentWithStar') {
    changeReplaceBlockUserSwitchDisabled(checked);
  }

  if (type === 'range') {
    const nodeName = domById(name);
    nodeName && (nodeName.innerText = value);
  }

  if (/^hidden/.test(name)) {
    appendHiddenStyle();
    return;
  }
  if (doCssVersion.includes(name)) {
    mySize.change();
    return;
  }
  ob[name] && ob[name]();
};
