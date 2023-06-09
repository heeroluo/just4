/**
 * 接口和类型。
 * @packageDocumentation
 */

/**
 * 请求方法。
 */
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 请求格式。
 */
export type RequestType = '' | 'form' | 'json';

/**
 * 请求体。
 */
export type BodyType = string | FormData | Blob | ArrayBuffer;

/**
 * 响应格式。
 */
export type ResponseType = 'json' | 'xml' | 'text' | 'blob' | 'arraybuffer';


/**
 * 请求选项。
 */
export interface IRequestOptions {
  /**
   * 基础 URL。
   */
  baseURL?: string,
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
   * 请求方法，get、post、put 或 delete，默认为 get。
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
   * 跨域请求时是否提供凭据（cookie）信息，仅在 XMLHttpRequest 请求方式下有效。
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
   * 认证用户名，仅在 XMLHttpRequest 请求方式下有效。
   */
  username?: string,
  /**
   * 认证密码，仅在 XMLHttpRequest 请求方式下有效。
   */
  password?: string,
  /**
   * 发送请求前执行的操作。
   */
  beforeSend?: (xhr?: XMLHttpRequest) => void,
  /**
   * 提供一个编号，可用于中断请求。
   */
  receiveCancelId?: (id: number) => void,
  /**
   * 上传进度变化时触发的回调，仅在 XMLHttpRequest 请求方式下有效。
   */
  onUploadProgress?: (evt: ProgressEvent) => void,
  /**
   * 下载进度变化时触发的回调，仅在 XMLHttpRequest 请求方式下有效。
   */
  onDownloadProgress?: (evt: ProgressEvent) => void
}


/**
 * 请求方式。
 */
export enum RequestWith {
  /**
   * XMLHttpRequest。
   */
  XHR = 'XMLHttpRequest',
  /**
   * 微信小程序 wx.request。
   */
  WX_REQUEST = 'wx.request'
}

/**
 * 请求结果。
 */
export interface IRequestResult {
  /**
   * 请求选项。
   */
  options: Readonly<IRequestOptions>,
  /**
   * 响应数据。
   */
  data?: unknown,
  /**
   * 请求方式。
   */
  requestWith?: RequestWith
}


// 请求选项的必备属性。
type RequiredRequestOptions = 'method' | 'requestType' | 'responseType' | 'headers';

/**
 * 请求适配器的初始化选项。
 */
/* eslint-disable @typescript-eslint/indent */
export type RequestAdapterOptions = Required<Pick<IRequestOptions, RequiredRequestOptions>> &
  Pick<IRequestOptions, Exclude<keyof IRequestOptions, RequiredRequestOptions>> &
  {
    /**
     * 完整的请求地址。
     */
    url: string
  };
/* eslint-enable @typescript-eslint/indent */

/**
 * 请求适配器。
 */
export interface IRequestAdapter {
  /**
   * 发送请求。
   * @param url 已拼接 GET 参数的请求 URL。
   * @param opts 包含必备参数的请求选项。
   * @returns 发送请求的 promise 实例。
   */
  send: (
    opts: Readonly<RequestAdapterOptions>
  ) => Promise<Readonly<IRequestResult>>

  /**
   * 中断请求。
   * @param id 请求编号。
   * @returns 中断请求操作是否有被执行。
   */
  abort: (id: number) => boolean
}
