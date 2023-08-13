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
    <img src="/logo.svg" class="h-32" />
  </div>
</template>
