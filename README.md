# Gitlab Helper

[Nuxt3](https://nuxt.com/)

[Gitlab Docs](https://docs.gitlab.com/ee/api/api_resources.html)

[Tauri](https://tauri.app/)

[Vercel](https://vercel.com/)

[Online](https://gitlab-helper.vercel.app/)

# Release

```bash
# 发布版本
npm version patch|minor|major
# 推送 tag
git push --tags
# 合并分支到 release
git checkout release
git merge main
git push
# 或者创建一个 pull request 到 release 分支
```
