
/**
 * 缩放模式
 */
export enum ResizeMode {
  /**
   * 等比缩放至指定宽高区域内最大图形。
   */
  L_FIT = 'lfit',
  /**
   * 等比缩放至覆盖指定宽高区域。
   */
  M_FIT = 'mfit',
  /**
   * 等比缩放至覆盖指定宽高区域并居中裁剪。
   */
  FILL = 'fill',
  /**
   * 等比缩放至指定宽高内最大图形并填充颜色至指定尺寸。
   */
  PAD = 'pad',
  /**
   * 固定宽高，强制缩放。
   */
  FIXED = 'fixed'
}

/**
 * 缩放参数。
 */
export interface ResizeParams {
  /**
   * 按百分比缩放图片，取值范围 [1,1000]。小于100为缩小，大于100为放大。
   */
  p?: number
  /**
   * 指定目标缩放图的宽度，取值范围 [1,16384]。
   */
  w?: number
  /**
   * 指定目标缩放图的高度，取值范围 [1,16384]。
   */
  h?: number
  /**
   * 指定缩放的模式。默认为 L_FIT。
   */
  m?: ResizeMode
  /**
   * 指定目标缩放图的最长边，取值范围 [1,16384]。
   */
  l?: number
  /**
   * 指定目标缩放图的最短边，取值范围 [1,16384]。
   */
  s?: number
  /**
   * 当目标图片分辨率大于原图分辨率时，设置是否进行缩放。默认为 1（不缩放）。
   */
  limit?: 0 | 1
  /**
   * 当缩放模式选择为pad（缩放填充）时，可以设置填充的颜色（RGB 表示，不带 #）。
   */
  color: string
}
