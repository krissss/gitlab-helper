import { UseFetchOptions } from '#app'

type ReqType = string | (() => string)
type ReqOptions<ResT> = UseFetchOptions<ResT>
type ReqOptionsFetch = any

const defaultOptions = <ResT>(): ReqOptions<ResT> => ({
  onRequest({ options }) {
    const gitlab = useStoreGitlab()
    options.baseURL = gitlab.url
    if (gitlab.access_token) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${gitlab.access_token}`)
    }
  },
  onResponseError({ response }) {
    console.log(response)
  },
})

export class useHttpGitlab {
  static fetchRaw<ResT>(url: string, options: ReqOptionsFetch = {}) {
    return $fetch.raw<ResT>(url, {
      ...defaultOptions(),
      ...options,
    })
  }

  static request<ResT>(url: ReqType, options: ReqOptions<ResT> = {}) {
    return useFetch(url, {
      ...defaultOptions(),
      ...options,
    } as ReqOptions<ResT>)
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

  static put<ResT>(url: ReqType, body: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      method: 'PUT',
      body,
      ...options,
    })
  }

  static delete<ResT>(url: ReqType, body: any = {}, options: ReqOptions<ResT> = {}) {
    return this.request<ResT>(url, {
      method: 'DELETE',
      body,
      ...options,
    })
  }
}
