/**
 * 图片格式
 */
export enum ImageFormat {
  JPG = 'jpg',
  PNG = 'pnp',
  WEBP = 'webp',
  BMP = 'bmp',
  GIF = 'gif',
  TIFF = 'tiff',
  HEIC = 'heic',
  AVIF = 'avif'
}

/**
 * 图片格式转换选项。
 */
export interface ImageFormatOptions {
  /**
   * 图片格式。
   */
  format: ImageFormat
}

/**
 * 图片质量转换选项。
 */
export interface ImageQualityOptions {
  /**
   * 设置图片的相对质量，对原图按百分比进行质量压缩。
   * 取值范围 [1,100]。
   */
  q?: number
  /**
   * 设置图片的绝对质量。
   * 取值范围 [1,100]。
   */
  Q?: number
}

/**
 * 图片缩放选项。
 */
export interface ImageResizingOptions {
  /**
   * 按百分比缩放图片，取值范围 [1,1000]。小于100为缩小，大于100为放大。
   */
  p?: number
  /**
   * 指定目标缩放图的宽度。
   */
  w?: number
  /**
   * 指定目标缩放图的高度。
   */
  h?: number
}

/**
 * 图片处理选项。
 */
export interface ImageProcessingOptions {
  /**
   * 格式转换选项。
   */
  format: ImageFormatOptions
  /**
   * 质量转换选项。
   */
  quality: ImageQualityOptions
  /**
   * 图片缩放选项。
   */
  resize: ImageResizingOptions
}
