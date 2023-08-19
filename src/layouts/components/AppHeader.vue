<script lang="ts" setup>
import LocaleChange from './header/LocaleChange.vue'
import ThemeChange from './header/ThemeChange.vue'
import Setting from './header/Setting.vue'
import GithubLink from './header/GithubLink.vue'
import GitlabLink from './header/GitlabLink.vue'

const activeMenu = computed(() => {
  return useRoute().path
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
    <ThemeChange />
    <GithubLink />
    <GitlabLink />

    <el-divider direction="vertical" />

    <Setting />
  </el-menu>
</template>
