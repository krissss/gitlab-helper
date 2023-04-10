class GitlabLink {
  private readonly link: string

  constructor(link: string) {
    this.link = link
  }

  getNext(): string {
    const regex = /<(.*?)>; rel="(.*?)"/g
    const all = [...this.link.matchAll(regex)]
    const result = all.find(item => item[2] === 'next')
    if (result) {
      return result[1]
    }
    return ''
  }
}

/**
 * @param link <https://git.oristand.com/api/v4/projects/7/merge_requests?created_after=2023-04-02T16:00:00+00:00&created_before=2023-04-09T15:59:59+00:00&id=7&order_by=created_at&page=2&per_page=20&sort=desc&state=merged&with_labels_details=false&with_merge_status_recheck=false>; rel="next", <https://git.oristand.com/api/v4/projects/7/merge_requests?created_after=2023-04-02T16:00:00+00:00&created_before=2023-04-09T15:59:59+00:00&id=7&order_by=created_at&page=1&per_page=20&sort=desc&state=merged&with_labels_details=false&with_merge_status_recheck=false>; rel="first", <https://git.oristand.com/api/v4/projects/7/merge_requests?created_after=2023-04-02T16:00:00+00:00&created_before=2023-04-09T15:59:59+00:00&id=7&order_by=created_at&page=9&per_page=20&sort=desc&state=merged&with_labels_details=false&with_merge_status_recheck=false>; rel="last"
 */
export const gitlabLinkParser = (link: string) => {
  return new GitlabLink(link)
}
