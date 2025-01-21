export interface QualityParams {
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
