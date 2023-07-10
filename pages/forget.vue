<script setup lang="ts">
import { Record } from "pocketbase";

const { pending, requestPasswordReset } = useAuth();

const email = ref("");

definePageMeta({
  middleware: [
    () => {
      const { $pb } = useNuxtApp();

      if ($pb.authStore.model instanceof Record) {
        return navigateTo("/");
      }
    },
  ],
});
</script>

<template>
  <div
    class="mx-6 my-12 flex h-full flex-col items-center justify-center gap-6 overflow-y-scroll"
  >
    <div class="w-full max-w-sm rounded-lg bg-zinc-100 p-6 dark:bg-zinc-800">
      <AppHeading>Quên mật khẩu</AppHeading>
      <form class="space-y-6" @submit.prevent="requestPasswordReset(email)">
        <UFormGroup name="email" label="Email">
          <UInput
            v-model="email"
            placeholder="user@tana.moe"
            icon="i-fluent-person-20-filled"
            size="lg"
            type="email"
          />
        </UFormGroup>
        <UButton :loading="pending" type="submit" block>Yêu cầu</UButton>
      </form>
      <div class="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/login"
        >
          Đăng nhập
        </NuxtLink>
        <span>&middot;</span>
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/register"
        >
          Đăng ký
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
