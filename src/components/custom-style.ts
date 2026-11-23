import { dom, fnAppendStyle, myStorage } from '../tools';

/** 自定义样式方法 */
export const myCustomStyle = {
  init: async function () {
    const { customizeCss = '' } = await myStorage.getConfig();
    (dom('[name="textStyleCustom"]') as HTMLTextAreaElement).value = customizeCss;
    this.change(customizeCss);
  },
  /**
   * 注入自定义 CSS。自定义样式属于「视觉修改」，受样式总开关约束：
   * 总开关关闭时注入空串（fnAppendStyle 会覆盖同名 style 标签），页面还原知乎原生；
   * 用户填写的 customizeCss 仍保存在配置里，重新打开总开关即恢复。
   */
  change: async (innerCus: string) => {
    const config = await myStorage.getConfig();
    // 总闸 + 「自定义 CSS」子开关同时开启才注入，关闭任一即清空。
    const enabled = config.sizeStyleEnabled && config.styleCustomCssEnabled !== false;
    fnAppendStyle('CTZ_STYLE_CUSTOM', enabled ? innerCus : '');
  },
};
