<script setup lang="ts">
import type { Form } from "@nuxthq/ui/dist/runtime/types";
import { Record } from "pocketbase";
import { z } from "zod";

const { pending, requestPasswordReset } = usePasswordReset();
const { t } = useI18n({ useScope: "global" });

const schema = z.object({
  email: z.string().email(t("error.emailInvalid")),
});

type Schema = z.output<typeof schema>;

const form = ref<Form<Schema>>();
const state = ref({
  email: "",
});

const submit = async () => {
  const data = await form.value!.validate();
  requestPasswordReset(0, data);
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
      <Title>{{ $t("account.forgetPassword") }}</Title>
    </Head>

    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppH1 class="mb-6">{{ $t("account.forgetPassword") }}</AppH1>
      <UForm
        ref="form"
        class="space-y-6"
        :state="state"
        :schema="schema"
        @submit.prevent="submit"
      >
        <UFormGroup name="email" :label="$t('account.email')">
          <UInput
            v-model="state.email"
            placeholder="user@tana.moe"
            icon="i-fluent-mail-20-filled"
            size="lg"
            type="email"
          />
        </UFormGroup>
        <UButton :loading="pending" type="submit" block>
          {{ $t("general.request") }}
        </UButton>
      </UForm>
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
  </UContainer>
</template>
