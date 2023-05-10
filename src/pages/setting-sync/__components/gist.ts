interface GistResult {
  gist: string
  url: string
  updated_at: string
  content: string
}
interface ApiGistResult {
  id: string
  files: {
    [key: string]: {
      content: string
    }
  }
  html_url: string
  updated_at: string
}
export type GistApiType = 'github' | 'gitee'

const gistDescription = 'sync gitlab-helper setting'
const gistFileName = 'gitlab-helper-sync.json'
const apiMap = {
  github: {
    http: useHttpGithub,
    api: '/gists',
  },
  gitee: {
    http: useHttpGitee,
    api: '/api/v5/gists',
  },
}

interface GistInterface {
  create(name: string, content: string): Promise<GistResult>
  update(gist: string, content: string): Promise<GistResult>
  get(gist: string): Promise<GistResult>
}

class Gist implements GistInterface {
  private http
  private api

  constructor(type: GistApiType, token: string) {
    this.http = apiMap[type].http(token)
    this.api = apiMap[type].api
  }

  private parseGistInfo(data: ApiGistResult): GistResult {
    if (!data.files[gistFileName]) {
      messageToast.error('获取配置失败')
      throw new Error('获取配置失败')
    }

    return {
      gist: data.id,
      url: data.html_url,
      updated_at: data.updated_at,
      content: data.files[gistFileName].content,
    }
  }

  async create(content: string): Promise<GistResult> {
    const { data } = await this.http.post<ApiGistResult>(this.api, {
      files: {
        [gistFileName]: {
          content,
        },
      },
      description: gistDescription,
    })
    if (!data.value) {
      throw new Error('创建失败')
    }
    return this.parseGistInfo(data.value)
  }

  async update(gist: string, content: string): Promise<GistResult> {
    const { data } = await this.http.patch<ApiGistResult>(`${this.api}/${gist}`, {
      id: gist,
      files: {
        [gistFileName]: {
          content,
        },
      },
    })
    if (!data.value) {
      throw new Error('更新失败')
    }
    return this.parseGistInfo(data.value)
  }

  async get(gist: string): Promise<GistResult> {
    const { data } = await this.http.get<ApiGistResult>(`${this.api}/${gist}`)
    if (!data.value) {
      throw new Error('获取失败')
    }
    return this.parseGistInfo(data.value)
  }
}

export function useGist(type: GistApiType, token: string) {
  return new Gist(type, token)
}
