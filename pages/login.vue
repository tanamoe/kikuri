<script setup lang="ts">
import type { Form } from "@nuxthq/ui/dist/runtime/types";
import { Record } from "pocketbase";
import { z } from "zod";

const { pending, login } = useLogin();
const { t } = useI18n({ useScope: "global" });

const schema = z.object({
  user: z
    .string()
    .min(1, t("error.usernameEmpty"))
    .regex(/^[^\s]*$/, t("error.usernameIncludesSpace")),
  password: z.string().min(8, t("error.passwordShort", { length: 8 })),
});

type Schema = z.output<typeof schema>;

const form = ref<Form<Schema>>();
const state = ref<Schema>({
  user: "",
  password: "",
});

const submit = async () => {
  const data = await form.value!.validate();
  login(0, data);
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

    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppH1 class="mb-6">{{ $t("account.login") }}</AppH1>
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
  </UContainer>
</template>
