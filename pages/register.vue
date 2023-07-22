<script setup lang="ts">
import { Record } from "pocketbase";

const username = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

const { pending, register } = useRegister();

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
    class="mx-6 my-12 flex h-[80vh] flex-col items-center justify-center gap-6 overflow-y-scroll"
  >
    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppHeading class="mb-6">{{ $t("account.register") }}</AppHeading>
      <form
        class="space-y-6"
        @submit.prevent="
          register(0, { username, email, password, passwordConfirm })
        "
      >
        <div class="space-y-3">
          <UFormGroup name="username" :label="$t('account.username')">
            <UInput
              v-model="username"
              placeholder="kikuri"
              icon="i-fluent-person-20-filled"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup name="email" :label="$t('account.email')">
            <UInput
              v-model="email"
              placeholder="user@tana.moe"
              icon="i-fluent-mail-20-filled"
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
          <UFormGroup
            name="passwordConfirm"
            :label="$t('account.passwordConfirm')"
          >
            <UInput
              v-model="passwordConfirm"
              placeholder="•••••••••••••••"
              icon="i-fluent-key-20-filled"
              type="password"
              size="lg"
            />
          </UFormGroup>
        </div>
        <UButton :loading="pending" type="submit" block>
          {{ $t("account.register") }}
        </UButton>
      </form>
      <div class="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/login"
        >
          {{ $t("account.login") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
