/**
 * https://docs.github.com/zh/rest
 */
import type { UseFetchOptions } from '#app'

type ReqType = string | (() => string)
type ReqOptions<ResT> = UseFetchOptions<ResT>

class HttpGithub {
  constructor(private token: string) {
  }

  defaultOptions<ResT>(): ReqOptions<ResT> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    return {
      onRequest({ options }) {
        options.baseURL = 'https://api.github.com/'
        options.headers = new Headers(options.headers)
        options.headers.set('Accept', 'application/vnd.github+json')
        options.headers.set('Authorization', `Bearer ${_this.token}`)
        options.headers.set('X-GitHub-Api-Version', '2022-11-28')
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

export function useHttpGithub(token: string) {
  return new HttpGithub(token)
}
