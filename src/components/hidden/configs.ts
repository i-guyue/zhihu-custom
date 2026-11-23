import { IHiddenArray, IHiddenItem } from './types';

/** 通用隐藏：跨所有页面生效的视觉元素与正文推广 */
const HIDDEN_ITEM_COMMON: IHiddenItem = {
  key: 'CTZ_HIDDEN_COMMON',
  name: '通用',
  desc: '所有页面都生效',
  content: [
    [
      {
        label: '隐藏修改器弹出图标 ⚙︎',
        value: 'hiddenOpenButton',
        tooltip: '隐藏右侧悬浮的齿轮按钮（隐藏后可在「默认功能」用快捷键唤出面板）',
        css: '#CTZ_OPEN_CLOSE{display:none!important;}',
      },
    ],
    [
      {
        label: '广告',
        value: 'hiddenAD',
        tooltip: '隐藏信息流与正文中的推广卡片、软广文案链（按投放情况出现）',
        css: '.pc-article-answer-big-img,.pc-article-answer,.TopstoryItem--advertCard,.Pc-card,.Pc-word,.RichText-ADLinkCardContainer,.Pc-Business-Card-PcTopFeedBanner,.ZhiGoodsCard,.Pc-word-new,.Business-Card-PcRightBanner-link,.pc-article-answer-text-chain{display: none!important;}',
      },
    ],
    [
      {
        label: '隐藏选中文字后的弹窗模块',
        value: 'hiddenSelectedTextPopup',
        tooltip: '选中正文文字后弹出的复制/搜索悬浮工具条',
        css: '.css-fg13ww,.css-fg13ww + svg{display: none!important;}',
      },
    ],
    [
      {
        label: 'LOGO',
        value: 'hiddenLogo',
        tooltip: '隐藏顶部知乎 LOGO 图标',
        css: '.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}',
      },
      {
        label: '顶部悬浮模块',
        value: 'hiddenHeader',
        tooltip: '隐藏整条吸顶的顶部导航栏（含搜索框、关注/推荐/热榜）',
        css: 'header.LeanAppHeaderBar,.ColumnPageHeader-Wrapper,#root .css-1g41cri{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}',
      },
    ],
    [
      {
        label: '回答和文章中的知学堂推广商品模块',
        value: 'hiddenZhihuZhiShop',
        tooltip: '回答/文章正文里插入的知学堂课程推广卡片',
        css: '.RichText-EduCardContainer{display:none;}',
      },
    ],
  ],
};

/**
 * 导航菜单：顶部栏与左侧栏的入口。
 * ===== 知乎新版导航（页面结构改版后的适配）=====
 * 顶部栏容器由 .AppHeader 改为 header.LeanAppHeaderBar，只保留「关注 / 推荐 / 热榜」；
 * 原顶部菜单栏的其余入口（专栏 / 圈子 / 直答 / AI Works / 盐言故事 / 付费咨询 / 知学堂）
 * 全部迁移到左侧竖排导航 aside 内，且 href 为完整绝对 URL（不是 /consult 这类相对路径）。
 *
 * 因此按所在位置拆成「顶部栏」与「左侧栏」两组，各自用容器限定范围：
 * 若不限定容器而直接按 href 全局匹配，会误伤回答正文、卡片里出现的同名链接。
 * css-xxxxx 哈希类名会随知乎发版变化，故优先用 href / 语义类名 / :has() 等稳定特征定位。
 */
const HIDDEN_ITEM_NAV: IHiddenItem = {
  key: 'CTZ_HIDDEN_NAV',
  name: '导航菜单',
  desc: '顶部栏与左侧栏入口',
  content: [
    [
      {
        label: '顶部栏 - 关注',
        value: 'hiddenHeaderFollow',
        tooltip: '顶部导航的「关注」入口',
        css: 'header.LeanAppHeaderBar a[href="https://www.zhihu.com/follow"]{display:none}',
      },
      {
        label: '顶部栏 - 推荐',
        value: 'hiddenHeaderRecommend',
        tooltip: '顶部导航的「推荐」入口',
        css: 'header.LeanAppHeaderBar a[href="https://www.zhihu.com/"]{display:none}',
      },
      {
        label: '顶部栏 - 热榜',
        value: 'hiddenHeaderHot',
        tooltip: '顶部导航的「热榜」入口',
        css: 'header.LeanAppHeaderBar a[href="https://www.zhihu.com/hot"]{display:none}',
      },
    ],
    [
      {
        label: '左侧栏 - 专栏',
        value: 'hiddenHeaderColumnSquare',
        tooltip: '左侧导航的「专栏」入口',
        css: 'aside a[href="https://www.zhihu.com/column-square"]{display:none}',
      },
      {
        label: '左侧栏 - 圈子',
        value: 'hiddenHeaderColumnRingFeeds',
        tooltip: '左侧导航的「圈子」入口',
        css: 'aside a[href="https://www.zhihu.com/ring-feeds"]{display:none}',
      },
      {
        label: '左侧栏 - 付费咨询',
        value: 'hiddenHeaderConsult',
        tooltip: '左侧导航的「付费咨询」入口',
        css: 'aside a[href="https://www.zhihu.com/consult"]{display:none}',
      },
      {
        label: '左侧栏 - 知学堂',
        value: 'hiddenHeaderEducationLearning',
        tooltip: '左侧导航的「知学堂」入口',
        css: 'aside a[href="https://www.zhihu.com/education/learning"]{display:none}',
      },
      {
        label: '左侧栏 - 直答',
        value: 'hiddenHeaderZhida',
        tooltip: '左侧导航的「直答」入口',
        css: 'aside a[href="https://zhida.zhihu.com/"]{display:none}',
      },
      {
        label: '左侧栏 - AI Works',
        value: 'hiddenHeaderSquare',
        tooltip: '左侧导航的「AI Works」入口',
        css: 'aside a[href="https://www.zhihu.com/project-square"]{display:none}',
      },
      {
        label: '左侧栏 - 盐言故事',
        value: 'hiddenHeaderVipWeb',
        tooltip: '左侧导航的「盐言故事」入口',
        css: 'aside a[href="https://www.zhihu.com/fiore/h5/vip-web"]{display:none}',
      },
    ],
    [
      {
        // 看山悬浮入口用稳定语义类名，不依赖会随发版变化的 css-xxxxx 哈希类名
        label: '看山悬浮入口',
        value: 'hiddenKanshanFloatingButton',
        tooltip: '页面右下角的「看山」AI 助手悬浮按钮',
        css: '.KanshanCornerButton{display:none!important;}',
      },
    ],
  ],
};

/** 操作栏 */
const HIDDEN_ITEM_ACTION: IHiddenItem = {
  key: 'CTZ_HIDDEN_ACTION',
  name: '操作栏',
  desc: '',
  content: [
    [
      {
        label: '推荐、关注列表操作栏',
        value: 'hiddenItemActions',
        tooltip: '首页信息流每条回答底部的赞同/评论/收藏工具条',
        css: '#TopstoryContent .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;padding:0;}',
      },
      {
        label: '推荐、关注列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixed',
        tooltip: '滚动时吸附在屏幕底部的赞同/评论工具条',
        css: '#TopstoryContent .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '搜索页列表操作栏',
        value: 'hiddenItemActionsSearch',
        tooltip: '搜索结果每条内容底部的赞同/评论工具条',
        css: '#SearchMain .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '搜索页列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedSearch',
        tooltip: '搜索页滚动时吸附在底部的工具条',
        css: '#SearchMain .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '问题页面详情操作栏',
        value: 'hiddenQuestionActions',
        tooltip: '问题标题下方的关注/写回答/邀请按钮组',
        css: '.QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}',
      },
      {
        label: '问题页面回答内容操作栏',
        value: 'hiddenAnswerItemActions',
        tooltip: '问题页每条回答底部的赞同/评论/收藏工具条',
        css: '.Question-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '问题页面回答内容操作栏 - 底部悬浮',
        value: 'hiddenFixedActions',
        tooltip: '问题页滚动时吸附在底部的工具条',
        css: '.Question-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '文章页面底部悬浮操作栏',
        value: 'hiddenZhuanlanActions',
        tooltip: '文章页滚动时吸附在底部的赞同/评论工具条',
        css: '.zhuanlan .RichContent-actions.is-fixed>.ContentItem-actions{display: none;}',
      },
    ],
    [
      {
        label: '收藏夹列表操作栏',
        value: 'hiddenItemActionsCollection',
        tooltip: '收藏夹里每条内容底部的操作工具条',
        css: '.CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '收藏夹列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedCollection',
        tooltip: '收藏夹滚动时吸附在底部的工具条',
        css: '.CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '个人主页动态、回答、文章等操作栏',
        value: 'hiddenItemActionsUser',
        tooltip: '用户主页每条内容底部的赞同/评论工具条',
        css: '.Profile-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '个人主页动态、回答、文章等操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedUser',
        tooltip: '用户主页滚动时吸附在底部的工具条',
        css: '.Profile-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '评论「回复」按钮',
        value: 'hiddenCommitReply',
        tooltip: '每条评论下的「回复」按钮',
        css: '.Comments-container .css-140jo2 button:first-of-type{display:none;}',
      },
      {
        label: '评论「点赞」按钮',
        value: 'hiddenCommitVote',
        tooltip: '每条评论下的点赞按钮',
        css: '.Comments-container .css-140jo2 button:last-of-type{display:none;}',
      },
      {
        label: '评论底部信息',
        value: 'hiddenCommitBottom',
        tooltip: '评论底部的时间/IP/回复数等信息行',
        css: '.Comments-container .css-140jo2{display:none;}',
      },
    ],
  ],
};

/** 列表页面 */
const HIDDEN_ITEM_LIST: IHiddenItem = {
  key: 'CTZ_HIDDEN_LIST',
  name: '列表页面',
  desc: '只在列表中隐藏相应内容',
  content: [
    [
      {
        label: '顶部分享此刻想法',
        value: 'hiddenWriteArea',
        tooltip: '首页信息流顶部的「分享此刻的想法」输入框卡片',
        css: '.Topstory .WriteArea{display:none;}',
      },
      {
        label: '首页分享想法（旧版入口）',
        value: 'hiddenHomeWriteArea',
        tooltip: '旧版首页写想法入口（主列内），通常与上一项作用相同，兼容旧配置',
        css: '.Topstory-mainColumn .WriteArea{display: none}',
      },
    ],
    [
      {
        label: '创作中心',
        value: 'hiddenHomeCreatorEntrance',
        tooltip: '右侧栏「创作中心 Lv1」卡片（含草稿箱、投稿入口）',
        // 新版创作中心有稳定语义类 .CreatorEntrance，保留旧哈希以兼容旧版
        css: '.Topstory .CreatorEntrance,.Topstory .css-19idom{display: none;}',
      },
      {
        label: '盐选作者平台',
        value: 'hiddenYanXuanWriter',
        tooltip: '右侧栏「盐言作者平台 / 去投稿」卡片',
        // 新版该类改名为 New-KfeCollection-CreateSaltCard，两个类名都覆盖
        css: '.New-KfeCollection-CreateSaltCard,.KfeCollection-CreateSaltCard{display:none!important;}',
      },
      {
        label: '推荐关注',
        value: 'hiddenHomeRecommendFollow',
        tooltip: '右侧栏「推荐关注」用户卡片列表',
        // 新版推荐关注卡片是右侧栏的 .Card，含用户链接且顶部有操作按钮。
        // 用 :has(> div > button):has(a[href*="/people/"]) 精准命中，
        // 只靠 a[href*="/people/"] 会误伤「分享此刻想法」卡，纯哈希类名又会随改版变化。
        css: '.Card:has(> div > button):has(a[href*="/people/"]){display: none;}',
      },
      {
        label: '知乎指南',
        value: 'hiddenHomeFooter',
        tooltip: '右侧栏底部的「知乎指南 / 备案信息」页脚',
        css: '.Topstory .Footer,.Topstory footer{display: none;}',
      },
      {
        label: '大家都在搜',
        value: 'hiddenHomeHotSearch',
        tooltip: '右侧栏「大家都在搜」热搜榜单卡片',
        css: '.Topstory .HotSearchCard{display: none;}',
      },
    ],
    [
      {
        label: '列表切换模块',
        value: 'hiddenHomeListTab',
        tooltip: '顶部「关注 / 推荐 / 热榜」整组切换标签',
        // 新版顶部导航 tab 已移到 header.LeanAppHeaderBar 内，改用稳定的 href 定位
        css: 'header.LeanAppHeaderBar a[href$="/follow"],header.LeanAppHeaderBar a[href$="/hot"],header.LeanAppHeaderBar a[href="https://www.zhihu.com/"]{display: none}',
      },
      {
        label: '列表切换 - 关注',
        value: 'hiddenHomeListTabFollow',
        tooltip: '只隐藏「关注」切换标签',
        css: 'header.LeanAppHeaderBar a[href$="/follow"]{display: none}',
      },
      {
        label: '列表切换 - 推荐',
        value: 'hiddenHomeListTabRecommend',
        tooltip: '只隐藏「推荐」切换标签',
        css: 'header.LeanAppHeaderBar a[href="https://www.zhihu.com/"]{display: none}',
      },
      {
        label: '列表切换 - 热榜',
        value: 'hiddenHomeListTabHot',
        tooltip: '只隐藏「热榜」切换标签',
        css: 'header.LeanAppHeaderBar a[href$="/hot"]{display: none}',
      },
    ],
    [
      {
        label: '列表内容',
        value: 'hiddenAnswers',
        tooltip: '隐藏信息流里每条回答/文章的正文摘要，只留标题',
        css:
          '.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine' +
          ',.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt' +
          ',.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer' +
          '{display: none;}',
      },
      {
        label: '列表视频',
        value: 'hiddenListVideoContent',
        tooltip: '隐藏信息流里的视频内容',
        css: '.Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}',
      },
      {
        label: '列表图片',
        value: 'hiddenListImg',
        tooltip: '隐藏信息流条目里的封面图和配图',
        css: '.RichContent-cover,.HotItem-img,.TopstoryItem .Image-Wrapper-Preview{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}',
      },
      {
        label: '列表阅读全文文字',
        value: 'hiddenReadMoreText',
        tooltip: '隐藏「阅读全文」字样（仍可点击卡片进入正文）',
        css: '.ContentItem-more{font-size:0!important;}',
      },
      {
        label: '列表"亲自答"标签',
        value: 'hiddenListAnswerInPerson',
        tooltip: '隐藏条目上的「亲自答」等答案类型标签',
        css: '.Topstory-mainColumn .LabelContainer{display: none;}',
      },
    ],
    // [
    //   {
    //     label: '关注列表关注人操作',
    //     value: 'hiddenFollowAction',
    //     css: '.TopstoryItem-isFollow .FeedSource-firstline{display: none;}',
    //   },
    //   {
    //     label: '关注列表用户信息',
    //     value: 'hiddenFollowChooseUser',
    //     css: '.TopstoryItem-isFollow .AuthorInfo{display: none;}',
    //   },
    // ],
    [
      {
        label: '热榜排序编号',
        value: 'hiddenHotItemIndex',
        tooltip: '热榜条目左侧的排名数字（1/2/3…）',
        css: '.HotItem-index{display: none;}.HotItem{padding: 16px!important;}',
      },
      {
        label: '热榜"新"元素',
        value: 'hiddenHotItemLabel',
        tooltip: '热榜条目上的「新」标记',
        css: '.HotItem-label{display: none;}',
      },
      {
        label: '热榜热度值',
        value: 'hiddenHotItemMetrics',
        tooltip: '热榜条目右侧的热度数值（如 524 万）',
        css: '.HotItem-content .HotItem-metrics{display: none;}',
      },
      {
        label: '热榜顶部滚动新闻',
        value: 'hiddenHotTopNews',
        tooltip: '热榜页面顶部滚动的置顶新闻条',
        css: '#TopstoryContent .css-172osot{display:none;}',
      },
    ],
  ],
};

/** 搜索页面：搜索页与搜索结果里的推广/辅助模块 */
const HIDDEN_ITEM_SEARCH: IHiddenItem = {
  key: 'CTZ_HIDDEN_SEARCH',
  name: '搜索页面',
  desc: '只在搜索页/搜索结果中隐藏',
  content: [
    [
      {
        label: '搜索栏大家都在搜',
        value: 'hiddenSearchBoxTopSearch',
        tooltip: '搜索框下方「大家都在搜」的下拉热搜',
        css: '.Search-container .HotSearchCard{display:none;}',
      },
      {
        label: '搜索页知乎热搜',
        value: 'hiddenSearchPageTopSearch',
        tooltip: '搜索结果页侧边栏的「知乎热搜」榜单',
        css: '.Search-container .TopSearch{display: none;}',
      },
      {
        label: '搜索页知乎指南',
        value: 'hiddenSearchPageFooter',
        tooltip: '搜索结果页侧边栏底部的「知乎指南 / 备案信息」',
        css: '.Search-container .Footer,.Search-container footer{display: none;}',
      },
      {
        label: '搜索结果知乎直达',
        value: 'hiddenSearchResultZhida',
        tooltip: '搜索结果顶部的「知乎直达」推广卡片',
        css: '.Search-container .css-q1rdu9{display: none;}',
      },
    ],
  ],
};

const AnswerRightHidden = '.Question-sideColumn{display: none!important;}.Question-mainColumn{width: auto;}';

/** 回答 */
const HIDDEN_ITEM_ANSWER: IHiddenItem = {
  key: 'CTZ_HIDDEN_ANSWER',
  name: '问答页面',
  desc: '只在问答页面/回答内容中隐藏相应内容',
  content: [
    [
      /**
       * ===== 问题头部按钮组（新版结构适配）=====
       * 旧版问题头部容器是 .QuestionHeader / .QuestionHeaderActions，改版后已不存在。
       * 新版结构（登录态实测）：
       *   .QuestionPage（稳定语义类，带 data-za=QuestionItem）= 整个问题页主容器；
       *   其内 [data-za-detail-view-path-module="QuestionDescription"] = 问题头部描述区，
       *   话题标签、评论、分享、好问题、"更多"按钮都在这个描述区内；
       *   .PageHeader = 顶部工具栏，含 .QuestionButtonGroup（关注/写回答/邀请）。
       * 统一用 .QuestionPage / @QuestionDescription 限定范围，避免命中回答区的同名按钮
       * （如每个回答都有自己的 .Popover.ShareMenu 和 [aria-label="更多"]）。
       */
      {
        label: '问题话题',
        value: 'hiddenQuestionTag',
        tooltip: '问题标题下方的话题标签',
        // 新版话题是 a.TopicLink（祖先 div.Tag，带 @TopicItem），限定在 .QuestionPage 内避免命中侧栏话题
        css: '.QuestionPage .Tag:has(a.TopicLink){display: none!important;}',
      },
      {
        label: '问题分享按钮',
        value: 'hiddenQuestionShare',
        tooltip: '问题头部的「分享」按钮',
        // ShareMenu 在页面上有多个（含每个回答），限定在问题头部描述区
        css: '[data-za-detail-view-path-module="QuestionDescription"] .Popover.ShareMenu{display: none!important;}',
      },
      {
        label: '"好问题"按钮',
        value: 'hiddenQuestionGoodQuestion',
        tooltip: '问题头部的「好问题」标记按钮',
        // 好问题按钮本身无独立语义类，是"包含 .QuestionHeader-Comment 的 div"下的首个 button；
        // :has() 按结构精确定位，不依赖会变的 css-xxxxx 哈希类名
        css: 'div:has(> .QuestionHeader-Comment) > button{display: none!important;}',
      },
      {
        label: '问题添加评论按钮',
        value: 'hiddenQuestionComment',
        tooltip: '问题头部的「添加评论」按钮',
        // .QuestionHeader-Comment 语义类名改版后仍保留，仅去掉已失效的 .QuestionHeader 前缀
        css: '.QuestionHeader-Comment{display: none}',
      },
      {
        label: '问题"..."按钮',
        value: 'hiddenQuestionMore',
        tooltip: '问题头部的「更多」省略号按钮',
        // 限定在问题头部描述区，避免误伤每个回答的"更多"按钮
        css: '[data-za-detail-view-path-module="QuestionDescription"] [aria-label="更多"]{display: none;}',
      },
      {
        label: '问题专题收录标签',
        value: 'hiddenQuestionSpecial',
        tooltip: '问题头部的「专题收录」标签',
        // .LabelContainer-wrapper 语义类名改版后仍保留，仅去掉已失效的 .QuestionHeader 前缀
        css: '.LabelContainer-wrapper{display: none;}',
      },
      {
        label: '问题关注按钮',
        value: 'hiddenQuestionFollowing',
        tooltip: '问题头部的「关注问题」按钮',
        // 关注按钮语义类 FollowButton 仍在，但位置从 .QuestionHeader 移到 .PageHeader
        css: '.PageHeader .FollowButton{display: none;}',
      },
      {
        label: '问题写回答按钮',
        value: 'hiddenQuestionAnswer',
        tooltip: '问题头部的「写回答」按钮',
        // 新版写回答按钮有独立语义类 WriteAnswerButton，不用再依赖相邻兄弟选择器
        css: '.WriteAnswerButton{display: none;}',
      },
      {
        label: '问题邀请回答按钮',
        value: 'hiddenQuestionInvite',
        tooltip: '问题头部的「邀请回答」按钮',
        // 新版邀请按钮有独立语义类 QuestionButtonGroup-invite
        css: '.QuestionButtonGroup-invite{display: none;}',
      },
      {
        label: '问题标题卡片广告和榜单',
        value: 'hiddenQuestionAD',
        tooltip: '问题头部卡片里的广告推广位（新版通常不再显示）',
        // 旧纯哈希选择器在新版已全部无法命中（实测 .css-e69dqy/.Card.css-15hh8yc 均为 0），
        // 知乎当前问题头部不再渲染这类广告卡片，保留原选择器以兼容旧版页面
        css: '.css-e69dqy,.Card.css-15hh8yc{display: none;}',
      },
      {
        label: '问题关注和被浏览数模块',
        value: 'hiddenQuestionSide',
        tooltip: '问题头部的关注数/被浏览数统计（新版位置已变，可能不生效）',
        // 旧 .QuestionHeader-side 已移除，实测无对应新容器（该信息改版后并入别处），
        // 保留原选择器以兼容旧版页面，新版暂不生效
        css: '.QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}',
      },
    ],
    [
      {
        label: '查看全部回答按钮',
        value: 'hiddenQuestionViewAll',
        tooltip: '回答列表底部的「查看全部回答」按钮',
        css: '.Question-mainColumn .ViewAll{display:none;}',
      },
    ],
    [
      {
        label: '回答人头像',
        value: 'hiddenDetailAvatar',
        tooltip: '每条回答顶部的答主头像',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}',
      },
      {
        label: '回答人姓名',
        value: 'hiddenDetailName',
        tooltip: '每条回答顶部的答主昵称',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}',
      },
      {
        label: '回答人简介',
        value: 'hiddenDetailBadge',
        tooltip: '答主昵称下方的认证/简介一行',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}',
      },
      {
        label: '回答人关注按钮',
        value: 'hiddenDetailFollow',
        tooltip: '每条回答里答主旁的「关注」按钮',
        css: '.AnswerItem .AuthorInfo .FollowButton{display: none;}',
      },
      {
        label: '回答人下赞同数',
        value: 'hiddenDetailVoters',
        tooltip: '答主信息里的获赞数统计',
        css: '.AnswerItem .css-dvccr2{display: none;}',
      },
      {
        label: '回答人下方标签',
        value: 'hiddenAnswerDownTags',
        tooltip: '答主名下方的身份标签（如「优秀答主」）',
        css: '.css-9x8rdd{display: none;margin: 0;}',
      },
      {
        label: '回答「谢邀」标签',
        value: 'hiddenThanksInvite',
        tooltip: '回答内容里的「谢邀」字样标记',
        css: '.css-1l65l8l{display: none;margin: 0;}',
      },
    ],
    [
      {
        label: '回答底部发布编辑时间和IP',
        value: 'hiddenAnswerItemTime',
        tooltip: '回答末尾的「发布于/编辑于 … IP属地」整行',
        css: '.QuestionPage .ContentItem-time{display: none;margin: 0;}',
      },
      {
        label: '回答底部发布编辑时间（保留IP）',
        value: 'hiddenAnswerItemTimeButHaveIP',
        tooltip: '只隐藏发布时间文字，保留 IP 属地信息',
        css: '.QuestionPage .ContentItem-time>a,.RichContent .ContentItem-time>a{display: none;}.QuestionPage .ContentItem-time:empty{display: none;margin: 0;}',
      },
      {
        label: '回答底部「继续追问」模块',
        value: 'hiddenAnswerKeepAsking',
        tooltip: '回答末尾的「继续追问」提问入口',
        css: '.css-jghqwm{display: none!important;}',
      },
      {
        label: '回答内容「所属专栏」模块',
        value: 'hiddenAnswerBelongZhuanlan',
        tooltip: '回答正文里标注的「所属专栏」链接',
        css: '.css-3ibr72,.css-n4rzfz{display: none!important;}',
      },
      {
        label: '回答内容赞赏按钮',
        value: 'hiddenReward',
        tooltip: '回答末尾的「赞赏」按钮',
        css: '.Reward{display: none!important;}',
      },
      {
        label: '回答内容底部热评',
        value: 'hiddenAnswerBottomComment',
        tooltip: '回答正文下方展示的精选评论',
        css: '.css-7v0dz0{display: none!important;}',
      },
    ],
    [
      {
        label: '问答页面右侧信息栏',
        value: 'hiddenAnswerRightFooter',
        tooltip: '隐藏整个问题页右侧栏（含作者卡片、相关问题、页脚等）',
        css: AnswerRightHidden,
      },
      {
        label: '问答页面信息栏 - 关于作者',
        value: 'hiddenAnswerRightFooterAnswerAuthor',
        tooltip: '右栏的「关于作者」卡片',
        css: '.Question-sideColumn .AnswerAuthor{display: none;}',
      },
      {
        label: '问答页面信息栏 - 被收藏次数',
        value: 'hiddenAnswerRightFooterFavorites',
        tooltip: '右栏的「被收藏次数」统计卡片',
        css: '.Question-sideColumn .AnswerAuthor + .Card{display: none;}',
      },
      {
        label: '问答页面信息栏 - 相关问题',
        value: 'hiddenAnswerRightFooterRelatedQuestions',
        tooltip: '右栏的「相关问题」列表',
        css: '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}',
      },
      {
        label: '问答页面信息栏 - 相关推荐',
        value: 'hiddenAnswerRightFooterContentList',
        tooltip: '右栏的「相关推荐」内容列表',
        css: '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}',
      },
      {
        label: '问答页面信息栏 - 知乎指南',
        value: 'hiddenAnswerRightFooterFooter',
        tooltip: '右栏底部的「知乎指南 / 备案信息」',
        css: '.Question-sideColumn footer{display: none;}',
      },
      {
        label: '问答页面信息栏 - 大家都在搜',
        value: 'hiddenAnswerRightHotSearchCard',
        tooltip: '右栏的「大家都在搜」热搜卡片',
        css: '.Question-sideColumn .HotSearchCard{display: none;}',
      },
    ],
  ],
};

/** 文章专栏 */
const HIDDEN_ITEM_ARTICLE: IHiddenItem = {
  key: 'CTZ_HIDDEN_ARTICLE',
  name: '文章专栏',
  desc: '只在文章页面/文章内容中隐藏相应内容',
  content: [
    [
      {
        label: '文章关联话题',
        value: 'hiddenZhuanlanTag',
        tooltip: '文章标题下方关联的话题标签',
        css: '.Post-topicsAndReviewer{display: none!important;}',
      },
      {
        label: '文章标题图片',
        value: 'hiddenZhuanlanTitleImage',
        tooltip: '文章标题区的封面大图',
        css: '.zhuanlan .Post-Row-Content-left-article .css-1ac3ifk{display: none!important;}',
        // css: '.css-1ntkiwo,.TitleImage,.css-78p1r9,.ArticleItem .RichContent>div:first-of-type:not(.RichContent-cover)>div:last-of-type{display: none!important;}',
      },
      // {
      //   label: '文章悬浮分享按钮',
      //   value: 'hiddenZhuanlanShare',
      //   css: '.zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}',
      // },
      // {
      //   label: '文章悬浮赞同按钮',
      //   value: 'hiddenZhuanlanVoters',
      //   css: '.zhuanlan .Post-SideActions .like{display: none!important;}',
      // },
      // {
      //   label: '文章底部知乎热榜',
      //   value: 'hiddenZhuanlanButtonHot',
      //   css: '.zhuanlan .Post-Sub .css-1ildg7g{display: none;}',
      // },
      {
        label: '文章所属专栏',
        value: 'hiddenZhuanlanContributions',
        tooltip: '文章标题处的「所属专栏」入口',
        css: '.zhuanlan .PostIndex-Contributions,.zhuanlan .css-3ibr72{display: none;}',
      },
      {
        label: '推荐阅读',
        value: 'hiddenZhuanlan',
        tooltip: '文章正文末尾的「推荐阅读」列表',
        css: '.zhuanlan .Post-NormalSub{display:none;}',
      },
    ],
    [
      {
        label: '文章作者头像',
        value: 'hiddenZhuanlanAvatarWrapper',
        tooltip: '文章标题区的作者头像',
        css: '.zhuanlan .AuthorInfo-avatarWrapper{display: none;}.zhuanlan .AuthorInfo-content{margin-left:0;}',
      },
      {
        label: '文章作者姓名',
        value: 'hiddenZhuanlanAuthorInfoHead',
        tooltip: '文章标题区的作者昵称',
        css: '.zhuanlan .AuthorInfo-head{display: none;}',
      },
      {
        label: '文章作者简介',
        value: 'hiddenZhuanlanAuthorInfoDetail',
        tooltip: '作者昵称下方的认证/简介',
        css: '.zhuanlan .AuthorInfo-detail{display: none;}',
      },
      {
        label: '文章作者关注按钮',
        value: 'hiddenZhuanlanFollowButton',
        tooltip: '作者旁的「关注」按钮',
        css: '.zhuanlan .FollowButton{display: none;}',
      },
      {
        label: '关于作者',
        value: 'hiddenZhuanlanAuthorCard',
        tooltip: '文章末尾的「关于作者」卡片',
        css: '.zhuanlan .Card.AuthorCard{display:none}',
      },
      {
        label: '大家都在搜',
        value: 'hiddenZhuanlanHotSearchCard',
        tooltip: '文章页侧栏的「大家都在搜」卡片',
        css: '.zhuanlan .HotSearchCard{display:none}',
      },
    ],
  ],
};

/** 用户主页 */
const HIDDEN_ITEM_USER_HOME: IHiddenItem = {
  key: 'CTZ_HIDDEN_USER_HOME',
  name: '用户主页',
  desc: '只在用户主页隐藏相应内容',
  content: [
    [
      {
        label: '用户主页付费咨询、认证和成就',
        value: 'hiddenUserHomeOtherCard',
        tooltip: '右栏的付费咨询/认证/成就等杂项卡片',
        css: '.Profile-sideColumn .Card:not(.Publications):not(.FollowshipCard){display:none;}',
      },
      {
        label: '用户主页出版作品',
        value: 'hiddenUserHomePublications',
        tooltip: '右栏的「出版作品」卡片',
        css: '.Profile-sideColumn .Card.Publications{display:none;}',
      },
      {
        label: '用户主页创作中心',
        value: 'hiddenUserHomeCreateEntrance',
        tooltip: '右栏的「创作中心」卡片',
        css: '.Profile-sideColumn .CreatorEntrance{display:none;}',
      },
      {
        label: '用户主页关注和关注者卡片',
        value: 'hiddenUserHomeFollow',
        tooltip: '右栏的「关注 / 关注者」数字卡片',
        css: '.Profile-sideColumn .FollowshipCard{display:none;}',
      },
      {
        label: '用户主页关注的内容和赞助',
        value: 'hiddenUserHomeLightList',
        tooltip: '右栏的「关注的内容 / 赞助」列表',
        css: '.Profile-sideColumn .Profile-lightList{display:none;}',
      },
      {
        label: '用户主页右侧屏蔽·举报用户、个人主页被浏览次数',
        value: 'hiddenUserHomeFooterOperate',
        tooltip: '右栏底部的「屏蔽/举报用户」和被浏览次数',
        css: '.Profile-sideColumn .Profile-footerOperations{display:none;}',
      },
      {
        label: '用户主页知乎指南',
        value: 'hiddenUserHomeFooter',
        tooltip: '右栏底部的「知乎指南 / 备案信息」',
        css: '.Profile-sideColumn footer{display:none;}',
      },
    ],
  ],
};

/** 收藏夹 */
const HIDDEN_ITEM_COLLECTIONS: IHiddenItem = {
  key: 'CTZ_HIDDEN_USER_COLLECTIONS',
  name: '收藏夹',
  desc: '只在我的收藏夹隐藏相应内容',
  content: [
    [
      {
        label: '收藏夹创作中心',
        value: 'hiddenCollectionsCreate',
        tooltip: '收藏页右栏的「创作中心」卡片',
        css: '.Collections-container .Card.CreatorEntrance{display:none;}',
      },
      {
        label: '收藏夹推荐关注',
        value: 'hiddenCollectionsRecommendFollow',
        tooltip: '收藏页右栏的「推荐关注」卡片',
        css: '.Collections-container [data-za-detail-view-path-module="RightSideBar"]>div:last-of-type>.Card{display:none;}',
      },
      {
        label: '收藏夹圆桌入口',
        value: 'hiddenCollectionsCategory',
        tooltip: '收藏页右栏的「圆桌」入口卡片',
        css: '.Collections-container .Card.GlobalSideBar-category{display:none;}',
      },
      {
        label: '收藏夹更多分类',
        value: 'hiddenCollectionsComplementary',
        tooltip: '收藏页右栏的「更多分类入口」卡片',
        css: '.Collections-container .Card[aria-label="更多分类入口"]{display:none;}',
      },
      {
        label: '收藏夹知乎指南',
        value: 'hiddenCollectionsFooter',
        tooltip: '收藏页右栏底部的「知乎指南 / 备案信息」',
        css: '.Collections-container footer{display:none;}',
      },
    ],
  ],
};

/** 话题 */
const HIDDEN_ITEM_TOPIC: IHiddenItem = {
  key: 'CTZ_HIDDEN_TOPIC',
  name: '话题',
  desc: '只在话题隐藏相应内容',
  content: [
    [
      {
        label: '话题主页右侧浏览/讨论量模块',
        value: 'hiddenTopicRightNumberBoard',
        tooltip: '话题页右栏的浏览量/讨论量统计',
        // 新版话题浏览/讨论量改用 .TopicMetaCard-voteCard，旧 .NumberBoard 已不渲染；两个都覆盖
        css: '[data-za-detail-view-path-module="TopicItem"] .Card .NumberBoard,[data-za-detail-view-path-module="TopicItem"] .TopicMetaCard-voteCard{display:none;}',
      },
      {
        label: '话题主页右侧父子话题模块',
        value: 'hiddenTopicRightParentChild',
        tooltip: '话题页右栏的「父话题 / 子话题」列表',
        css: '[data-za-detail-view-path-module="TopicItem"] .Card .Card-section{display:none;}',
      },
      {
        label: '话题主页右侧知乎指南',
        value: 'hiddenTopicRightFooter',
        tooltip: '话题页右栏底部的「知乎指南 / 备案信息」',
        css: '[data-za-detail-view-path-module="TopicItem"] footer{display:none;}',
      },
    ],
  ],
};

/**
 * 隐藏模块二级 tab 统一为「按页面」维度：
 * - 「通用」= 原通用（跨页面元素）+ 原导航菜单（顶部/左侧栏入口）+ 原操作栏（各页面工具条与评论）。
 *   三者都是跨页面或按功能归类的隐藏项，合并后不再与下面按页面划分的 tab 混用维度。
 *   各项 label 自带语义前缀（如「顶部栏 -」「推荐、关注列表操作栏」）+ tooltip，足以区分。
 * - 其余 7 个 tab 各自对应一个页面，维度一致。
 * 各分组定义保留、value/css 原样不动，这里只合并 content，避免触碰失效检测与配置逻辑。
 */
const HIDDEN_ITEM_COMMON_MERGED: IHiddenItem = {
  ...HIDDEN_ITEM_COMMON,
  name: '通用',
  desc: '跨页面元素、导航入口与操作栏',
  content: [...HIDDEN_ITEM_COMMON.content, ...HIDDEN_ITEM_NAV.content, ...HIDDEN_ITEM_ACTION.content],
};

// 勾选隐藏对应内容
export const HIDDEN_ARRAY: IHiddenArray = [
  HIDDEN_ITEM_COMMON_MERGED,
  HIDDEN_ITEM_LIST,
  HIDDEN_ITEM_SEARCH,
  HIDDEN_ITEM_ANSWER,
  HIDDEN_ITEM_ARTICLE,
  HIDDEN_ITEM_USER_HOME,
  HIDDEN_ITEM_COLLECTIONS,
  HIDDEN_ITEM_TOPIC,
];

/** 多个配置影响到的隐藏内容 */
export const HIDDEN_ARRAY_MORE = [
  {
    keys: [
      'hiddenUserHomeOtherCard',
      'hiddenUserHomePublications',
      'hiddenUserHomeCreateEntrance',
      'hiddenUserHomeFollow',
      'hiddenUserHomeLightList',
      'hiddenUserHomeFooterOperate',
      'hiddenUserHomeFooter',
    ],
    value: '.Profile-sideColumn{display: none}',
  },
  {
    keys: ['hiddenSearchPageTopSearch', 'hiddenSearchPageFooter'],
    value: '.SearchSideBar{display: none}',
  },
  {
    // 首页右侧栏 5 项全部隐藏时，连整个右侧栏容器一并隐藏。
    // 实测（登录态）：创作中心/盐言作者平台/推荐关注/知乎指南/大家都在搜这 5 个卡片的
    // 公共容器是 [data-za-detail-view-path-module="RightSideBar"]（宽 320px）。
    // 只隐藏卡片会留下这一整栏空白占位（用户反馈的「空盒子」），故整栏隐藏并让主列居中。
    // 用 .Topstory-container 限定在首页信息流：既精准命中，又让失效检测把它归为「列表页面」规则，
    // 避免在问答页等无该容器的页面误报失效。
    keys: [
      'hiddenHomeCreatorEntrance',
      'hiddenYanXuanWriter',
      'hiddenHomeRecommendFollow',
      'hiddenHomeFooter',
      'hiddenHomeHotSearch',
    ],
    value:
      '.Topstory-container [data-za-detail-view-path-module="RightSideBar"]{display:none;}' +
      '.Topstory-mainColumn{margin: 0 auto;}',
  },
  {
    keys: ['hiddenHomeListTabFollow', 'hiddenHomeListTabRecommend', 'hiddenHomeListTabHot'],
    value: 'header.LeanAppHeaderBar a[href$="/follow"],header.LeanAppHeaderBar a[href$="/hot"],header.LeanAppHeaderBar a[href="https://www.zhihu.com/"]{display: none}',
  },
  {
    keys: ['hiddenTopicRightNumberBoard', 'hiddenTopicRightParentChild', 'hiddenTopicRightFooter'],
    value: '[data-za-detail-view-path-module="TopicItem"]>div:nth-child(2){display: none;}',
  },
  {
    keys: [
      'hiddenAnswerRightFooterAnswerAuthor',
      'hiddenAnswerRightFooterFavorites',
      'hiddenAnswerRightFooterFavorites',
      'hiddenAnswerRightFooterRelatedQuestions',
      'hiddenAnswerRightFooterContentList',
      'hiddenAnswerRightFooterFooter',
      'hiddenAnswerRightHotSearchCard',
    ],
    value: AnswerRightHidden,
  },
];
