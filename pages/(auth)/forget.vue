<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { pending, requestPasswordReset } = useAuthentication();
const { t } = useI18n({ useScope: "global" });

const schema = z.object({
  email: z.string().email(t("error.account.emailInvalid")),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await requestPasswordReset(event.data);
}

definePageMeta({
  middleware: ["guest"],
});
</script>

<template>
  <UContainer
    class="my-12 flex h-[80vh] flex-col items-center justify-center gap-6"
  >
    <Head>
      <Title>{{ $t("account.forgetPassword") }}</Title>
    </Head>

    <div
      class="w-full max-w-sm rounded-lg bg-neutral-100 p-6 dark:bg-neutral-800"
    >
      <AppH1 class="mb-6">{{ $t("account.forgetPassword") }}</AppH1>
      <UForm class="space-y-6" :state :schema @submit="onSubmit">
        <UFormField name="email" :label="$t('account.email')">
          <UInput
            v-model="state.email"
            class="w-full"
            placeholder="user@tana.moe"
            icon="i-fluent-mail-20-filled"
            size="lg"
            type="email"
          />
        </UFormField>
        <UButton :loading="pending" type="submit" block>
          {{ $t("general.request") }}
        </UButton>
      </UForm>
      <div
        class="mt-3 space-x-1 text-center text-sm text-neutral-600 dark:text-neutral-400"
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
  </UContainer>
</template>
