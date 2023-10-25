<script setup lang="ts">
import { type AuthProviderInfo } from "pocketbase";
import { joinURL } from "ufo";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { pending, login } = useAuthentication();
const runtimeConfig = useRuntimeConfig();
const authProvider = useCookie<AuthProviderInfo>("auth_provider");

const { data: authMethods } = await useLazyAsyncData(
  () => $pb.collection("users").listAuthMethods(),
  { server: false },
);

const redirectUrl = joinURL(runtimeConfig.public.siteUrl, "redirect");

const schema = z.object({
  user: z
    .string()
    .min(3, t("error.account.usernameInvalidMin"))
    .max(150, t("error.account.usernameInvalidMax"))
    .regex(/^[^\s]*$/, t("error.account.usernameIncludedSpace")),
  password: z.string().min(8, t("error.account.passwordInvalidMin")),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  user: "",
  password: "",
});

async function submit(event: FormSubmitEvent<Schema>) {
  await login(event.data);
}

function parseIcon(name: string) {
  switch (name) {
    case "twitter":
      return "i-simple-icons-x";
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
  <UContainer
    class="my-12 flex h-[80vh] flex-col items-center justify-center gap-6"
  >
    <Head>
      <Title>{{ $t("account.login") }}</Title>
    </Head>

    <div
      class="w-full max-w-sm space-y-6 rounded-lg bg-gray-100 p-6 dark:bg-gray-800"
    >
      <AppH1>{{ $t("account.login") }}</AppH1>

      <div>
        <UForm
          class="space-y-6"
          :schema="schema"
          :state="state"
          @submit="submit"
        >
          <div class="space-y-3">
            <UFormGroup name="user" :label="$t('account.usernameOrEmail')">
              <UInput
                v-model="state.user"
                placeholder="user@tana.moe"
                icon="i-fluent-person-20-filled"
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
          </div>
          <UButton :loading="pending" type="submit" block>
            {{ $t("account.login") }}
          </UButton>
        </UForm>

        <div
          class="mt-3 space-x-1 text-center text-sm text-gray-600 dark:text-gray-400"
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

      <div v-if="authMethods" class="space-y-6">
        <div
          class="relative text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <hr
            class="absolute inset-x-0 top-1/2 w-full -translate-y-1/2 transform border border-gray-600 dark:border-gray-600"
          />
          <span class="relative bg-gray-100 px-1 dark:bg-gray-800">
            {{ $t("auth.or") }}
          </span>
        </div>

        <div>
          <ul class="space-y-3">
            <li
              v-for="provider in authMethods.authProviders"
              :key="provider.name"
            >
              <UButton
                :icon="parseIcon(provider.name)"
                color="gray"
                block
                :ui="{
                  color: {
                    gray: {
                      solid: 'ring-0 bg-gray-50 dark:bg-gray-900',
                    },
                  },
                }"
                :to="provider.authUrl + redirectUrl"
                @click="authProvider = provider"
              >
                {{
                  $t("auth.loginWith", {
                    name: $t(`provider.${provider.name}`),
                  })
                }}
              </UButton>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </UContainer>
</template>
