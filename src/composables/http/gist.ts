export type GistType = 'github' | 'gitee'

interface GistConfig {
  token: string
  gist?: string
}

interface Gist {
  create(files: any): Promise<boolean>

  update(gist: string, files: any): Promise<boolean>

  get(gist: string): Promise<string>
}

class Github implements Gist {
  create(files: any): Promise<boolean> {
    return Promise.resolve(false)
  }

  get(gist: string): Promise<string> {
    return Promise.resolve('')
  }

  update(gist: string, files: any): Promise<boolean> {
    return Promise.resolve(false)
  }
}

export function useHttpGist(type: GistType, config: GistConfig) {

}
