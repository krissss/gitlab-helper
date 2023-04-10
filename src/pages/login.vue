<script lang="ts" setup>
definePageMeta({
  layout: 'login',
})

const storeGitlab = useStoreGitlab()

const submitForm = async () => {
  const storeUser = useStoreUser()
  await storeUser.login()
  return navigateTo('/')
}
</script>

<template>
  <div>
    <div class="login-name">Gitlab</div>
    <el-form :model="storeGitlab" label-width="120px">
      <el-form-item
        prop="url"
        label="URL"
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
        label="AccessToken"
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
        <el-button type="primary" @click="submitForm"> 进入 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.login-name {
  margin: 20px;
  text-align: center;
}
</style>
