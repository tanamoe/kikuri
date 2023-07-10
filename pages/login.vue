<script setup lang="ts">
import { Record } from "pocketbase";

const { pending, loginWithPassword } = useAuth();

const user = ref("");
const password = ref("");

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
      <AppHeading>Đăng nhập</AppHeading>
      <form
        class="space-y-6"
        @submit.prevent="loginWithPassword(user, password)"
      >
        <div class="space-y-3">
          <UFormGroup name="user" label="Tên tài khoản hoặc email">
            <UInput
              v-model="user"
              placeholder="user@tana.moe"
              icon="i-fluent-person-20-filled"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup name="password" label="Mật khẩu">
            <UInput
              v-model="password"
              placeholder="•••••••••••••••"
              icon="i-fluent-key-20-filled"
              type="password"
              size="lg"
            />
          </UFormGroup>
        </div>
        <UButton :loading="pending" type="submit" block>Đăng nhập</UButton>
      </form>
      <div class="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/forget"
        >
          Quên mật khẩu?
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
