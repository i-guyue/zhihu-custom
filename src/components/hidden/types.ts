import { IOptionItem } from "../../types/common.type";

export type IHiddenArray = IHiddenItem[];

export interface IHiddenContentItem extends IOptionItem {
  css: string;
  /** 开关下方的说明文字：一句话讲清「屏蔽的是什么」，让面板一眼可读 */
  tooltip?: string;
}
export interface IHiddenItem {
  key: string;
  name: string;
  desc: string;
  content: IHiddenContentItem[][];
}
