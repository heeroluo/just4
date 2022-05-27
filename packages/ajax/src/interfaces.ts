/**
 * 接口和类型。
 * @packageDocumentation
 */

/**
 * 请求方法。
 */
export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * 请求格式。
 */
export type RequestType = '' | 'form' | 'json';

/**
 * 请求主体（xhr.send 可以直接发送的类型）。
 */
export type BodyType = string | FormData | Blob | ArrayBuffer;

/**
 * 响应格式。
 */
export type ResponseType = 'json' | 'xml' | 'text' | 'blob' | 'arraybuffer';


/**
 * AJAX 请求选项。
 */
export interface IAJAXOptions {
  /**
   * URL 参数。
   */
  params?: string | object,
  /**
   * 请求体数据。
   */
  data?: string | object,
  /**
   * 自定义请求头。
   */
  headers?: object,
  /**
   * 请求方法，get、post、put 或 delete。
   */
  method?: RequestMethod,
  /**
   * 请求方式，form 或 json。POST 或 PUT 时有效，默认为 form。
   */
  requestType?: RequestType,
  /**
   * 响应格式，json、xml、text 或 unknown，默认为 json。unknown 表示不解析响应数据。
   */
  responseType?: ResponseType,
  /**
   * 跨域请求时是否提供凭据（cookie）信息。
   */
  withCredentials?: boolean,
  /**
   * 超时时间。
   */
  timeout?: number,
  /**
   * 是否在 URL 中增加时间戳参数避免缓存。
   */
  preventCaching?: boolean,
  /**
   * 认证用户名。
   */
  username?: string,
  /**
   * 认证密码。
   */
  password?: string,
  /**
   * 发送请求前执行的操作。
   */
  beforeSend?: (xhr: XMLHttpRequest) => void,
  /**
   * 提供一个编号，可用于中断请求。
   */
  receiveCancelId?: (id: number) => void,
  /**
   * 上传进度变化时触发的回调。
   */
  onUploadProgress?: (evt: ProgressEvent) => void,
  /**
   * 下载进度变化时触发的回调。
   */
  onDownloadProgress?: (evt: ProgressEvent) => void
}


/**
 * AJAX 请求响应。
 */
export interface IAJAXResponse {
  /**
   * 用于发送请求的 XMLHttpRequest 对象。
   */
  xhr: XMLHttpRequest,

  /**
   * 发送请求的选项。
   */
  options: IAJAXOptions,

  /**
   * 请求响应的数据。
   */
  data?: unknown
}
