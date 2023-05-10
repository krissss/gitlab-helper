import { useHttpGitee } from '~/composables/http/gitee'

interface GistResult {
  gist: string
  url: string
  updated_at: string
  content: string
}

const gistName = 'sync gitlab-helper setting'
const gistFileName = 'gitlab-helper-sync.json'

interface GistInterface {
  create(name: string, content: string): Promise<GistResult>

  update(gist: string, content: string): Promise<GistResult>

  get(gist: string): Promise<GistResult>
}

interface GiteeGistResult {
  id: string
  files: {
    [key: string]: {
      content: string
    }
  }
  html_url: string
  updated_at: string
}

class GiteeGist implements GistInterface {
  constructor(private token: string) {
  }

  private parseGistInfo(data: GiteeGistResult): GistResult {
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
    const { data } = await useHttpGitee.post<GiteeGistResult>('https://gitee.com/api/v5/gists', {
      access_token: this.token,
      files: {
        [gistFileName]: {
          content,
        },
      },
      description: gistName,
    })
    if (!data.value) {
      throw new Error('创建失败')
    }
    return this.parseGistInfo(data.value)
  }

  async update(gist: string, content: string): Promise<GistResult> {
    const { data } = await useHttpGitee.patch<GiteeGistResult>(`https://gitee.com/api/v5/gists/${gist}`, {
      access_token: this.token,
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
    const { data } = await useHttpGitee.get<GiteeGistResult>(`https://gitee.com/api/v5/gists/${gist}`, {
      access_token: this.token,
    })
    if (!data.value) {
      throw new Error('获取失败')
    }
    return this.parseGistInfo(data.value)
  }
}

export function useGist(type: 'github' | 'gitee', token: string) {
  if (type === 'gitee') {
    return new GiteeGist(token)
  }
  throw new Error('不支持的 type')
}
