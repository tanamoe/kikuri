<script setup lang="ts">
import type { Form } from "@nuxthq/ui/dist/runtime/types";
import { type AuthProviderInfo, Record } from "pocketbase";
import { joinURL } from "ufo";
import { z } from "zod";
import { getAuthMethods } from "@/utils/auth";

const runtimeConfig = useRuntimeConfig();
const authProvider = useCookie<AuthProviderInfo>("auth_provider");
const { pending, login } = useLogin();
const { t } = useI18n({ useScope: "global" });

const authMethods = await getAuthMethods();
const redirectUrl = joinURL(runtimeConfig.public.siteUrl, "redirect");

const schema = z.object({
  user: z
    .string()
    .min(1, t("error.usernameEmpty"))
    .regex(/^[^\s]*$/, t("error.usernameIncludesSpace")),
  password: z.string(),
});

type Schema = z.output<typeof schema>;

const form = ref<Form<Schema>>();
const state = ref<Schema>({
  user: "",
  password: "",
});

const submit = async () => {
  const data = await form.value!.validate();
  await login(0, data);
};

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
          ref="form"
          class="space-y-6"
          :schema="schema"
          :state="state"
          @submit.prevent="submit"
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
        <ul>
          <li
            v-for="provider in authMethods.authProviders"
            :key="provider.name"
          >
            <UButton
              v-if="provider.name === 'discord'"
              icon="i-simple-icons-discord"
              :ui="{
                variant: {
                  solid:
                    'shadow-sm text-white bg-[#5865F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:focus-visible:outline-gray-400',
                },
              }"
              block
              :to="provider.authUrl + redirectUrl"
              @click="authProvider = provider"
            >
              {{ $t("auth.loginWithDiscord") }}
            </UButton>
          </li>
        </ul>
      </div>
    </div>
  </UContainer>
</template>
