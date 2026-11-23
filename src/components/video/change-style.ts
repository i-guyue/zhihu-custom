import { EVideoInAnswerArticle } from '../../components/select';
import { fnAppendStyle, myStorage } from '../../tools';
import { CLASS_VIDEO_ONE, CLASS_VIDEO_TWO } from './download';

/**
 * 修改回答和列表中的视频样式。
 * 视频样式属于「视觉修改」，与背景/尺寸/自定义 CSS 一样受样式总开关约束：
 * 总开关关闭时注入空串，还原知乎原生视频样式；配置值 videoInAnswerArticle 保留。
 */
export const changeVideoStyle = async () => {
  const config = await myStorage.getConfig();
  // 总闸 + 「视频样式」子开关同时开启才注入。
  const enabled = config.sizeStyleEnabled && config.styleVideoEnabled !== false;
  const style = enabled ? STYLE_VIDEO[config.videoInAnswerArticle || EVideoInAnswerArticle.默认] : '';
  fnAppendStyle('CTZ_STYLE_VIDEO', style);
};

const STYLE_VIDEO = {
  [EVideoInAnswerArticle.默认]: '',
  [EVideoInAnswerArticle.修改为链接]:
    `${CLASS_VIDEO_ONE}>div,${CLASS_VIDEO_ONE}>i{display: none;}` +
    `${CLASS_VIDEO_ONE}{padding: 0!important;height:24px!important;width: fit-content!important;}` +
    `${CLASS_VIDEO_ONE}::before{content: '视频链接，点击跳转';cursor:pointer;color: #1677ff;font-size:12px;font-weight:600;}` +
    `${CLASS_VIDEO_ONE}:hover::before{color: rgb(0, 64, 221)}` +
    `${CLASS_VIDEO_TWO}::before,${CLASS_VIDEO_TWO}>i{display: none;}` +
    `.VideoAnswerPlayer + div{display:none;}.VideoAnswerPlayer::before{content: '视频链接，点击跳转';cursor:pointer;color: #1677ff;font-size:12px;font-weight:600;}` +
    `.VideoAnswerPlayer:hover::before{color: rgb(0, 64, 221)}`,
  [EVideoInAnswerArticle.隐藏视频]:
    `${CLASS_VIDEO_ONE}>div,${CLASS_VIDEO_ONE}>i{display: none;}` +
    `${CLASS_VIDEO_ONE}{padding: 0!important;height:24px!important;width: fit-content!important;}` +
    `${CLASS_VIDEO_ONE}::before{content: '隐藏一条视频内容';cursor:pointer;color: rgb(142, 142, 147);font-size: 12px;}`,
};
