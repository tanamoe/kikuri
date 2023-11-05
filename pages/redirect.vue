<script setup lang="ts">
import { type AuthProviderInfo } from "pocketbase";
import { joinURL } from "ufo";

const runtimeConfig = useRuntimeConfig();
const { query } = useRoute();
const { t } = useI18n({ useScope: "global" });
const authProvider = useCookie<AuthProviderInfo>("auth_provider");

if (!query.code) navigateTo("/");

if (authProvider.value.state !== query.state)
  throw createError(t("auth.oauthInvalidState"));

const res = await loginWithOAuth2(
  authProvider.value.name,
  query.code as string,
  authProvider.value.codeVerifier,
  joinURL(runtimeConfig.public.siteUrl, "redirect"),
);

if (res) navigateTo("/");

definePageMeta({
  middleware: ["guest"],
});
</script>

<template>
  <div class="my-12 flex h-[80vh] flex-col items-center justify-center gap-6">
    <Head>
      <Title>{{ $t("account.login") }}</Title>
    </Head>

    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppH1 class="mb-6">{{ $t("account.login") }}</AppH1>
      <p class="mb-6">{{ $t("auth.oauthPending") }}</p>
      <UButton to="/login">{{ $t("auth.oauthStuck") }}</UButton>
    </div>
  </div>
</template>
