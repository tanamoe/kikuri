<script setup lang="ts">
import { Record } from "pocketbase";

const { pending, requestPasswordReset } = usePasswordReset();

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
    class="mx-6 my-12 flex h-[80vh] flex-col items-center justify-center gap-6 overflow-y-scroll"
  >
    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppHeading class="mb-6">{{ $t("account.forgetPassword") }}</AppHeading>
      <form
        class="space-y-6"
        @submit.prevent="requestPasswordReset(0, { email })"
      >
        <UFormGroup name="email" :label="$t('account.email')">
          <UInput
            v-model="email"
            placeholder="user@tana.moe"
            icon="i-fluent-mail-20-filled"
            size="lg"
            type="email"
          />
        </UFormGroup>
        <UButton :loading="pending" type="submit" block>
          {{ $t("general.request") }}
        </UButton>
      </form>
      <div
        class="mt-3 space-x-1 text-center text-sm text-zinc-600 dark:text-zinc-400"
      >
        <NuxtLink
          class="decoration-tanablue-500 decoration-2 hover:underline"
          to="/login"
        >
          {{ $t("account.login") }}
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
