<script setup lang="ts">
import { Record } from "pocketbase";

const user = ref("");
const password = ref("");

const { pending, login } = useLogin();

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
    class="mx-6 my-12 flex h-[80vh] flex-col items-center justify-center gap-6"
  >
    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppH1 class="mb-6">{{ $t("account.login") }}</AppH1>
      <form class="space-y-6" @submit.prevent="login(0, { user, password })">
        <div class="space-y-3">
          <UFormGroup name="user" :label="$t('account.usernameOrEmail')">
            <UInput
              v-model="user"
              placeholder="user@tana.moe"
              icon="i-fluent-person-20-filled"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup name="password" :label="$t('account.password')">
            <UInput
              v-model="password"
              placeholder="•••••••••••••••"
              icon="i-fluent-key-20-filled"
              type="password"
              size="lg"
            />
          </UFormGroup>
        </div>
        <UButton :loading="pending" type="submit" block>
          {{ $t("account.login") }}
        </UButton>
      </form>
      <div
        class="mt-3 space-x-1 text-center text-sm text-zinc-600 dark:text-zinc-400"
      >
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/forget"
        >
          {{ $t("account.forgetPassword") }}
        </NuxtLink>
        <span>&middot;</span>
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/register"
        >
          {{ $t("account.register") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
