<script lang="ts" setup>
const { t } = useI18n({ useScope: 'local' })
const activeMenu = computed(() => {
  return useRoute().path
})

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
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    :ellipsis="false"
    :router="true"
    class="!px-5 flex items-center"
  >
    <div class="flex items-center mr-5 hover:(opacity-60 cursor-pointer)" @click="navigateTo('/')">
      <img src="~/assets/images/logo.png" alt="" class="w-50px h-50px">
    </div>

    <div class="flex-grow" />

    <el-menu-item index="/merge-request/create">
      {{ $t('创建MR') }}
    </el-menu-item>
    <el-menu-item index="/merge-request/merge">
      {{ $t('合并MR') }}
    </el-menu-item>
    <el-menu-item index="/merge-request/check">
      {{ $t('检查MR') }}
    </el-menu-item>
    <el-menu-item index="/release">
      {{ $t('发版') }}
    </el-menu-item>

    <div class="flex-grow" />

    <LocaleChange />

    <el-divider direction="vertical" />

    <ThemeChange />
    <el-link href="https://github.com/krissss/gitlab-helper" target="_blank" class="hover:decoration-none ml-2">
      <i class="iconfont icon-github text-5" />
    </el-link>

    <el-divider direction="vertical" />

    <el-dropdown v-if="storeUser.isLogin">
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
  </el-menu>
</template>

<i18n lang="yaml" locale="en">
配置同步: Setting Sync
检查更新: Check update
退出登录: Logout
登录: Login
</i18n>
