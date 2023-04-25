<script lang="ts" setup>
const { t } = useI18n({
  useScope: 'local',
})

useHead({
  title: t('登录'),
})

const storeGitlab = useStoreGitlab()

const submitForm = async () => {
  const storeUser = useStoreUser()
  await storeUser.login()
  return navigateTo('/')
}
</script>

<template>
  <div class="mt-20 max-w-400px mx-auto">
    <div class="mb-5 flex items-center ml-120px">
      <img src="~/assets/images/logo.png" alt="" class="w-60px h-60px" />
      <span class="font-bold ml-10px">Gitlab</span>
    </div>
    <el-form :model="storeGitlab" label-width="120px">
      <el-form-item
        prop="url"
        :label="t('Gitlab地址')"
        :rules="[
          {
            required: true,
            trigger: 'blur',
            type: 'url',
          },
        ]">
        <el-input v-model="storeGitlab.url" />
      </el-form-item>
      <el-form-item
        prop="access_token"
        :label="t('AccessToken')"
        :rules="[
          {
            required: true,
            trigger: 'blur',
            min: 20,
            max: 50,
          },
        ]">
        <el-input v-model="storeGitlab.access_token" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">{{ t('进入') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<i18n lang="yaml" locale="en">
Gitlab地址: Gitlab URL
进入: 'Enter'
</i18n>
