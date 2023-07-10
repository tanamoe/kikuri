<script setup lang="ts">
import { Record } from "pocketbase";

const { pending, register } = useAuth();

const username = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

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
    <div class="w-full max-w-sm rounded-lg bg-zinc-200 p-6 dark:bg-zinc-800">
      <AppHeading>Đăng ký</AppHeading>
      <form
        class="space-y-6"
        @submit.prevent="register(username, email, password, passwordConfirm)"
      >
        <div class="space-y-3">
          <UFormGroup name="username" label="Tên tài khoản">
            <UInput
              v-model="username"
              placeholder="kikuri"
              icon="i-fluent-person-20-filled"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup name="email" label="Email">
            <UInput
              v-model="email"
              placeholder="user@tana.moe"
              icon="i-fluent-mail-20-filled"
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
          <UFormGroup name="passwordConfirm" label="Xác nhận mật khẩu">
            <UInput
              v-model="passwordConfirm"
              placeholder="•••••••••••••••"
              icon="i-fluent-key-20-filled"
              type="password"
              size="lg"
            />
          </UFormGroup>
        </div>
        <UButton :loading="pending" type="submit" block>Đăng ký</UButton>
      </form>
      <div class="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/login"
        >
          Đăng nhập
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
