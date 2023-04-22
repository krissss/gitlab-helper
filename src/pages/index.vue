<script lang="ts" setup>
useHead({
  title: '首页',
})

const storeUser = useStoreUser()
</script>

<template>
  <div class="welcome">
    <span class="gradient">
      Welcome
      <span v-if="storeUser.isLogin">&nbsp;{{ storeUser.name }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.welcome {
  @apply flex items-center justify-center mt-20 text-lg font-bold;

  .gradient {
    color: transparent;
    background-image: linear-gradient(60deg, #e21143, #ffb03a);
    background-clip: text;
  }
}
</style>
