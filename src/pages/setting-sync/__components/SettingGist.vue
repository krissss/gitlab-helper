<script lang="ts" setup>
import { usePageStore } from '../__store'
import type { GistApiType } from './gist'
import { useGist } from './gist'

const props = defineProps<{
  type: GistApiType
}>()

const configsMap = {
  github: {
    token: {
      generate: 'https://github.com/settings/tokens/new',
      scope: 'gist',
    },
    gist: {
      create: 'https://gist.github.com/',
      can_open: true,
      created: 'https://gist.github.com/[your]',
    },
  },
  gitee: {
    token: {
      generate: 'https://gitee.com/profile/personal_access_tokens/new',
      scope: 'gists',
    },
    gist: {
      create: 'https://gitee.com/[your]/codes/new',
      can_open: false,
      created: 'https://gitee.com/[your]/codes/new',
    },
  },
}
const config = configsMap[props.type]
const setting = usePageStore().setting[props.type]

function getGist() {
  if (!setting.token) {
    messageToast.error('请先填写 token')
    return
  }
  return useGist(props.type, setting.token)
}
async function uploadSetting() {
  const gist = getGist()
  if (!gist) {
    return
  }

  const allSettingJson = useIStorageSetting.getAllData()
  const data = setting.gist
    ? await gist.update(setting.gist, allSettingJson)
    : await gist.create(allSettingJson)

  if (!setting.gist) {
    setting.gist = data.gist
  }
  setting.last_updated = data.updated_at
}
async function downloadSetting() {
  const gist = getGist()
  if (!gist || !setting.gist) {
    return
  }
  const data = await gist.get(setting.gist)
  setting.last_updated = data.updated_at
  await useIStorageSetting.setAllData(data.content, {
    notSettingSync: true,
  })
}
</script>

<template>
  <el-form label-width="120px">
    <el-form-item label="token" required>
      <template #label>
        <FormLableWithQuestion label="token" tooltip="私人令牌，见下方说明" />
      </template>
      <el-input v-model="setting.token" type="password" clearable show-password autocomplete="new-password" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <FormLableWithQuestion label="gist" tooltip="gist ID，见下方说明" />
      </template>
      <el-input v-model="setting.gist" clearable />
    </el-form-item>
    <el-form-item>
      <el-button v-if="useStoreUser().isLogin" type="primary" :disabled="!setting.token" @click="uploadSetting()">
        上传配置
      </el-button>
      <el-button type="primary" :disabled="!setting.token || !setting.gist" @click="downloadSetting()">
        下载配置
      </el-button>
    </el-form-item>

    <el-alert v-if="setting.last_updated" type="warning" :closable="false" :title="`最后同步时间：${setting.last_updated}`" class="!mb-4" />
    <el-alert :closable="false">
      <strong>关于 token</strong>
      <p>
        登录到 {{ props.type }}, 到
        <el-link :href="config.token.generate" type="primary" target="_blank">
          {{ config.token.generate }}
        </el-link>
        创建新的私人令牌（或使用已有的），<strong>仅需要 {{ config.token.scope }} 权限</strong>，建议复制后保存，以防忘记。
      </p>
      <strong>关于 gist</strong>
      <p>
        如果不填写 gist, 会自动创建私人 gist 代码片段，
        也可以使用已经存在的 gist， 或者到
        <el-link :href="config.gist.can_open ? config.gist.create : 'javascript:;'" type="primary" target="_blank">
          {{ config.gist.create }}
        </el-link>
        创建新的代码片段来获得 gist, 可以从代码片段网址获取 gist ID, {{ config.gist.created }}/xxxx, xxxx 就是 gist ID
      </p>
    </el-alert>
  </el-form>
</template>
