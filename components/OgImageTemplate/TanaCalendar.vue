<script setup lang="ts">
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div
    :style="{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }"
    class="bg-zinc-900 text-zinc-200"
  >
    <div>
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }"
      >
        <img src="/apple-touch-icon.png" class="h-16 w-16" />
        <h1>Lịch phát hành</h1>
      </div>
      <img src="/register_banner.png" class="-mb-72" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 64px;
}
</style>
