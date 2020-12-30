/**
 * 接口和类型。
 * @packageDocumentation
 */


/**
 * 加载脚本文件的选项。
 */
export interface IGetScriptOptions {
  /**
   * URL 参数。
   */
  data?: string | { [key: string]: unknown },
  /**
   * 脚本编码。
   */
  charset?: string,
  /**
   * 超时时间（毫秒）。
   */
  timeout?: number,
  /**
   * 是否不重复请求。
   */
  once?: boolean
}

/**
 * 请求方法。
 */
export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * 请求主体（xhr.send 可以直接发送的类型）。
 */
export type BodyType = string | FormData | Blob | ArrayBuffer;

/**
 * 请求数据。
 */
export type DataType = { [key: string]: unknown } | BodyType;

/**
 * URL 参数。
 */
export type URLParams = string | { [key: string]: unknown };

/**
 * 响应格式。
 */
export type ResponseType = 'json' | 'xml' | 'text';

/**
 * 完成响应格式的解析后执行的操作。
 */
export type AfterResponse = (((arg?: any) => void)[])[];

/**
 * AJAX 请求选项的合并策略。
 */
export type MergeMode = 'replace' | 'append';


/**
 * AJAX 请求选项。
 */
export interface IAJAXOptions {
  /**
   * URL 参数。
   */
  params?: URLParams,
  /**
   * 请求体数据。
   */
  data?: DataType,
  /**
   * 自定义请求头。
   */
  headers?: { [key: string]: unknown },
  /**
   * 请求方法，get、post、put 或 delete。
   */
  method?: RequestMethod,
  /**
   * 请求方式，form 或 json。POST 或 PUT 时有效，默认为 form。
   */
  requestType?: '' | 'form' | 'json',
  /**
   * 响应格式，json、xml 或 text，默认为 json。
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
   * 完成响应格式的解析后执行的操作。
   */
  afterResponse?: AfterResponse,
  /**
   * 提供一个编号，可用于中断请求。
   */
  receiveCancelId?: (id: number) => void
}
