<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { pending, register } = useAuthentication();
const { t } = useI18n({ useScope: "global" });

const schema = z.object({
  username: z
    .string()
    .min(3, t("error.account.usernameInvalidMin"))
    .max(150, t("error.account.usernameInvalidMax"))
    .regex(/^[^\s]*$/, t("error.account.usernameIncludedSpace")),
  email: z.string().email(t("error.account.emailInvalid")),
  password: z.string().min(8, t("error.account.passwordInvalidMin")),
  passwordConfirm: z
    .string()
    .min(8, t("error.account.passwordInvalidMin"))
    .refine(
      (val) => val === state.value.password,
      () => ({ message: t("error.account.passwordNotMatch") }),
    ),
});

type Schema = z.output<typeof schema>;

const state = ref({
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

async function submit(event: FormSubmitEvent<Schema>) {
  await register(event.data);
}

definePageMeta({
  middleware: ["guest"],
});
</script>

<template>
  <div class="my-12 flex h-[80vh] flex-col items-center justify-center gap-6">
    <Head>
      <Title>{{ $t("account.register") }}</Title>
    </Head>

    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppH1 class="mb-6">{{ $t("account.register") }}</AppH1>
      <UForm class="space-y-6" :schema="schema" :state="state" @submit="submit">
        <div class="space-y-3">
          <UFormGroup name="username" :label="$t('account.username')">
            <UInput
              v-model="state.username"
              placeholder="kikuri"
              icon="i-fluent-person-20-filled"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup name="email" :label="$t('account.email')">
            <UInput
              v-model="state.email"
              placeholder="user@tana.moe"
              icon="i-fluent-mail-20-filled"
              size="lg"
            />
          </UFormGroup>
          <UFormGroup name="password" :label="$t('account.password')">
            <UInput
              v-model="state.password"
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
              v-model="state.passwordConfirm"
              placeholder="•••••••••••••••"
              icon="i-fluent-key-20-filled"
              type="password"
              size="lg"
            />
          </UFormGroup>
        </div>

        <i18n-t
          keypath="auth.registerPrivacyPolicy"
          tag="p"
          class="prose prose-sm text-gray-600 dark:prose-invert dark:text-gray-400"
        >
          <nuxt-link to="/terms-of-service">
            {{ $t("general.termsOfService") }}
          </nuxt-link>
          <nuxt-link to="/privacy-policy">
            {{ $t("general.privacyPolicy") }}
          </nuxt-link>
        </i18n-t>

        <UButton :loading="pending" type="submit" block>
          {{ $t("account.register") }}
        </UButton>
      </UForm>

      <div class="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
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
