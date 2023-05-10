import type { UseFetchOptions } from '#app'

type ReqType = string | (() => string)
type ReqOptions<ResT> = UseFetchOptions<ResT>

function defaultOptions<ResT>(): ReqOptions<ResT> {
  return {
    onResponseError({ response }) {
      const error: string = response._data.message || '未知错误'
      messageToast.error(error)
    },
  }
}

export class useHttpGitee {
  static request<ResT>(url: ReqType, options: ReqOptions<ResT> = {}) {
    options = {
      ...defaultOptions(),
      ...options,
    }
    return useFetch(url, options)
  }

  static get<ResT>(url: ReqType, query: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      query,
      ...options,
    })
  }

  static post<ResT>(url: ReqType, body: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      method: 'POST',
      body,
      ...options,
    })
  }

  static patch<ResT>(url: ReqType, body: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      method: 'PATCH',
      body,
      ...options,
    })
  }
}
