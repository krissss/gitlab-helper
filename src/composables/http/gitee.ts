/**
 * https://gitee.com/api/v5/swagger
 */
import type { UseFetchOptions } from '#app'

type ReqType = string | (() => string)
type ReqOptions<ResT> = UseFetchOptions<ResT>

class HttpGitee {
  constructor(private token: string) {
  }

  defaultOptions<ResT>(): ReqOptions<ResT> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    return {
      onRequest({ options }) {
        options.baseURL = 'https://gitee.com/'
        options.method = options.method || 'GET'
        if (_this.token && options.method) {
          if (['GET', 'HEAD'].includes(options.method.toUpperCase())) {
            options.query = options.query || {}
            options.query.access_token = _this.token
          }
          else {
            options.body = options.body || {}
            options.body = Object.assign({ access_token: _this.token }, options.body)
          }
        }
      },
      onResponseError({ response }) {
        const error: string = response._data.message || '未知错误'
        messageToast.error(error)
      },
    }
  }

  request<ResT>(url: ReqType, options: ReqOptions<ResT> = {}) {
    options = {
      ...this.defaultOptions(),
      ...options,
    }
    return useFetch(url, options)
  }

  get<ResT>(url: ReqType, query: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      query,
      ...options,
    })
  }

  post<ResT>(url: ReqType, body: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      method: 'POST',
      body,
      ...options,
    })
  }

  patch<ResT>(url: ReqType, body: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      method: 'PATCH',
      body,
      ...options,
    })
  }
}

export function useHttpGitee(token: string) {
  return new HttpGitee(token)
}
