import { inc } from 'semver'
import type { ReleaseType } from 'semver'
import dayjs from 'dayjs'

export function semverInc(version: string, releaseType: ReleaseType): string {
  // v10.02.2-20230411-release
  const matches = version.match(/^([A-Za-z]+?)?(\d+)\.(\d+).(\d+)-(.*?)-(.*)/)
  if (!matches || !matches[2] || !matches[3] || !matches[4]) {
    console.warn(`Invalid version: ${version}`)
    return version
  }
  const v = `${matches[2]}.${matches[3]}.${matches[4]}`
  const newVersion = inc(v, releaseType)
  if (!newVersion) {
    console.warn(`inc version error: ${version}`)
    return version
  }
  return `${matches[1]}${newVersion}-${dayjs().format('YYYYMMDD')}-${matches[6]}`
}
