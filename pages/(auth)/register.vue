<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { pending, register } = useAuthentication();
const { t } = useI18n({ useScope: "global" });

const schema = z
  .object({
    username: z
      .string()
      .min(3, t("error.account.usernameInvalidMin"))
      .max(150, t("error.account.usernameInvalidMax"))
      .regex(/^[^\s]*$/, t("error.account.usernameIncludedSpace")),
    email: z.string().email(t("error.account.emailInvalid")),
    password: z.string().min(8, t("error.account.passwordInvalidMin")),
    passwordConfirm: z.string().min(8, t("error.account.passwordInvalidMin")),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: t("error.account.passwordNotMatch"),
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: undefined,
  email: undefined,
  password: undefined,
  passwordConfirm: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
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

    <div
      class="w-full max-w-sm rounded-lg bg-neutral-100 p-6 dark:bg-neutral-800"
    >
      <AppH1 class="mb-6">{{ $t("account.register") }}</AppH1>
      <UForm class="space-y-6" :schema :state @submit="onSubmit">
        <div class="space-y-3">
          <UFormField name="username" :label="$t('account.username')">
            <UInput
              v-model="state.username"
              class="w-full"
              placeholder="kikuri"
              icon="i-fluent-person-20-filled"
              size="lg"
            />
          </UFormField>
          <UFormField name="email" :label="$t('account.email')">
            <UInput
              v-model="state.email"
              class="w-full"
              placeholder="user@tana.moe"
              icon="i-fluent-mail-20-filled"
              size="lg"
            />
          </UFormField>
          <UFormField name="password" :label="$t('account.password')">
            <UInput
              v-model="state.password"
              class="w-full"
              placeholder="•••••••••••••••"
              icon="i-fluent-key-20-filled"
              type="password"
              size="lg"
            />
          </UFormField>
          <UFormField
            name="passwordConfirm"
            :label="$t('account.passwordConfirm')"
          >
            <UInput
              v-model="state.passwordConfirm"
              class="w-full"
              placeholder="•••••••••••••••"
              icon="i-fluent-key-20-filled"
              type="password"
              size="lg"
            />
          </UFormField>
        </div>

        <i18n-t
          keypath="auth.registerPrivacyPolicy"
          tag="p"
          class="prose prose-sm dark:prose-invert text-neutral-600 dark:text-neutral-400"
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

      <div
        class="mt-3 text-center text-sm text-neutral-600 dark:text-neutral-400"
      >
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
