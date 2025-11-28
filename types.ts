/**
 * Layout Element definition
 */
export interface LayoutElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

/**
 * Photo Layout definition
 */
export interface PhotoLayout {
  id: string;
  maskUrl?: string;
  rotation: number;
}

/**
 * 样式项
 * Matches user provided StyleItem interface from pepefoto-bridge-lib
 */
export interface StyleItem {
  /** 样式 ID */
  id: string;
  /** 样式名称 */
  style_name: string | null;
  /** 预览图 URL */
  img_preview: string;
  /** 图片类型 */
  img_type: number;
  /** 裁切类型 */
  cut_type: number;
  /** 是否客户端 */
  isClient: boolean;
  /** 是否保留背景图 */
  keepBgImg: boolean;
  /** AR8 参数 */
  ar8: number;
  /** AR 提交参数 */
  arsubmit: number;
  /** 视频参数 */
  videoParams: string | null;
  /** 类型参数 */
  typeParams: string;
  /** 图片样式 ID */
  imgStyleId: number;
  /** 是否 GIF */
  isGif: number;
  /** 分辨率 */
  resolution: string | null;
  /** 视频合并 */
  videoMerge: number;
  /** 客户端合并 */
  clientMerge: number;
  /** 比例裁切状态 */
  ratioCutStatus: number;
  /** 预览图状态 */
  preImgStatus: number;
  /** 预览窗口 */
  preWindow: number;
  /** 布局列表 */
  lst_layout: LayoutElement[];
  /** 合并样式 ID */
  mergeStyleId: number;
  /** AR 视频类型 */
  arVideoType: number;
  /** 照片列表 */
  lst_photo: PhotoLayout[];
  /** 贴纸列表 */
  lst_sticker: unknown[];
  /** 徽章列表 */
  lst_badge: unknown[];
  /** 光栅列表 */
  lst_raster: unknown[];
  /** 价格 */
  price: number;
  /** 免费价格 */
  freePrice: number;
  /** 安全删除 */
  delsafe: boolean;
  /** 删除照片框 */
  delPhotoFrame: boolean;
  /** 资产分割 */
  assetSplit: boolean;
  /** AR 视频来源 */
  arVideoSource: number;
  /** AR 视频音频 */
  arVideoMp3: string;
  /** 免费打印次数 */
  freePrintCount: number;
  /** 重新生成次数 */
  regenerationNum: number;
}

/**
 * UI 样式分类
 * Matches user provided UIStyleCategory interface
 */
export interface UIStyleCategory {
  /** 分类 ID */
  id: string;
  /** 分类名称 */
  cat_name: string;
  /** 样式列表 */
  lst_style: StyleItem[];
  /** 类型 */
  type?: number;
  /** 按钮图片 */
  btnimg?: string;
}

/**
 * API Response Structure
 */
export interface DeviceConfigResponse {
  /** UI 样式配置列表 */
  uistyle: UIStyleCategory[];
}
