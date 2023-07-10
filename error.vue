<script setup>
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  error: Object,
});

const is404 = computed(() => props.error.statusCode === 404);
const isDev = process.dev;

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <div class="absolute inset-0">
      <div class="flex h-screen items-center justify-center">
        <div class="space-y-6 text-center">
          <h1 class="font-lexend text-8xl font-bold">
            {{ error.statusCode }}
          </h1>
          <p>
            {{ is404 ? "Không tìm thấy đường dẫn" : "Đã có lỗi xảy ra" }}, bạn
            có muốn
            <button class="font-bold text-tanablue-500" @click="handleError">
              về trang chủ</button
            >?
          </p>
          <p v-if="isDev">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
