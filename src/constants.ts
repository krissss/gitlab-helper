// storage 存储的前缀
export const STORAGE_PREFIX = 'MyApp-'
// storage 所有的 key
export const STORAGE_KEYS = [
  'user',
  'userSetting',
  'settingSync',
  'gitlabUrl',
  'gitlabToken',
  'pageMergeRequestCheck',
  'pageMergeRequestCheckSetting',
  'pageRelease',
  'pageReleaseSetting',
  'pageMergeRequestMerge',
  'pageMergeRequestCreate',
] as const
export type STORAGE_KEY = typeof STORAGE_KEYS[number]
// 当用户未设置自动更新时，是否自动更新
export const DEFAULT_AUTO_UPDATE = false
