<script setup lang="ts">
import type { AuthProviderInfo } from "pocketbase";
import { joinURL } from "ufo";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { pending, login } = useAuthentication();
const { siteUrl } = useRuntimeConfig().public;
const authProvider = useCookie<AuthProviderInfo>("auth_provider");

const { data, status } = await useLazyAsyncData(
  () => $pb.collection("users").listAuthMethods(),
  { server: false },
);

const schema = z.object({
  user: z
    .string()
    .min(3, t("error.account.usernameInvalidMin"))
    .max(150, t("error.account.usernameInvalidMax"))
    .regex(/^[^\s]*$/, t("error.account.usernameIncludedSpace")),
  password: z.string().min(8, t("error.account.passwordInvalidMin")),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  user: undefined,
  password: undefined,
});

const redirectUrl = joinURL(siteUrl, "redirect");

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await login(event.data);
}

function getIcon(name: string) {
  switch (name) {
    case "twitter":
      return "i-simple-icons-twitter";
    case "discord":
      return "i-simple-icons-discord";
    case "facebook":
      return "i-simple-icons-facebook";
  }
}

definePageMeta({
  middleware: ["guest"],
});
</script>

<template>
  <div class="my-12 flex h-[80vh] flex-col items-center justify-center gap-6">
    <Head>
      <Title>{{ $t("account.login") }}</Title>
    </Head>

    <div
      class="w-full max-w-sm space-y-6 rounded-lg bg-neutral-100 p-6 dark:bg-neutral-800"
    >
      <AppH1>{{ $t("account.login") }}</AppH1>

      <div>
        <UForm class="space-y-6" :schema :state @submit="onSubmit">
          <div class="space-y-3">
            <UFormField name="user" :label="$t('account.usernameOrEmail')">
              <UInput
                v-model="state.user"
                class="w-full"
                placeholder="user@tana.moe"
                icon="i-fluent-person-20-filled"
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
          </div>
          <UButton :loading="pending" type="submit" block>
            {{ $t("account.login") }}
          </UButton>
        </UForm>

        <div
          class="mt-3 space-x-1 text-center text-sm text-neutral-600 dark:text-neutral-400"
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

      <div class="space-y-6">
        <UDivider
          :label="$t('auth.or')"
          color="neutral"
          :ui="{
            border: { base: 'border-neutral-200 dark:border-neutral-700' },
          }"
        />

        <div>
          <div v-if="status == 'pending'" class="space-y-3">
            <USkeleton
              class="h-10 w-full"
              :ui="{ background: 'bg-neutral-200 dark:bg-neutral-700' }"
            />
            <USkeleton
              class="h-10 w-full"
              :ui="{ background: 'bg-neutral-200 dark:bg-neutral-700' }"
            />
            <USkeleton
              class="h-10 w-full"
              :ui="{ background: 'bg-neutral-200 dark:bg-neutral-700' }"
            />
          </div>
          <ul v-else-if="data" class="space-y-3">
            <li v-for="provider in data.oauth2.providers" :key="provider.name">
              <AppSignInGoogleButton
                v-if="provider.name === 'google'"
                :to="provider.authURL + redirectUrl"
                @click="authProvider = provider"
              />
              <AppSignInDiscordButton
                v-else-if="provider.name === 'discord'"
                :to="provider.authURL + redirectUrl"
                @click="authProvider = provider"
              />
              <AppSignInButton
                v-else
                :icon="getIcon(provider.name)"
                :to="provider.authURL + redirectUrl"
                @click="authProvider = provider"
              >
                {{
                  $t("auth.loginWith", {
                    name: provider.displayName,
                  })
                }}
              </AppSignInButton>
            </li>
          </ul>
        </div>

        <i18n-t
          keypath="auth.loginPrivacyPolicy"
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
      </div>
    </div>
  </div>
</template>
