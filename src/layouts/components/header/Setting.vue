<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const storeUser = useStoreUser()
const appVersion = ref('')
onMounted(async () => {
  const version = (await tauriVersion()) || ''
  if (version) {
    appVersion.value = `v${version}`
  }
})
</script>

<template>
  <el-dropdown v-if="storeUser.isLogin" class="pl-5">
    <el-avatar
      v-if="storeUser.isLogin"
      :size="50"
      :src="storeUser.avatar_url"
      class="!w-8 !h-8"
      :title="storeUser.name"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="navigateTo('/setting-sync')">
          {{ t('配置同步') }}
        </el-dropdown-item>
        <el-dropdown-item v-if="appVersion" divided :disabled="!tauriIsIn()" @click="tauriCheckUpdater()">
          <span v-if="tauriIsIn()" class="mr-1">{{ t('检查更新') }}</span>
          {{ appVersion }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="storeUser.logout()">
          {{ t('退出登录') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <div v-else>
    <el-button size="small" @click="navigateTo('/setting-sync')">
      {{ t('配置同步') }}
    </el-button>
    <el-button type="primary" link @click="navigateTo('/login')">
      {{ t('登录') }}
    </el-button>
  </div>
</template>

<i18n lang="yaml" locale="en">
配置同步: Setting Sync
检查更新: Check update
退出登录: Logout
登录: Login
</i18n>
