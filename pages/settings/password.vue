<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";

const { $pb } = useNuxtApp();
const { pending, update } = useUpdateAccount();
const { t } = useI18n({ useScope: "global" });

const schema = z.object({
  oldPassword: z.string().min(8, t("error.account.passwordInvalidMin")),
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
  oldPassword: undefined,
  password: undefined,
  passwordConfirm: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await update({ id: $pb.authStore.model!.id, record: event.data });
}

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div>
    <UForm class="space-y-6" :schema="schema" :state="state" @submit="onSubmit">
      <UFormGroup name="oldPassword" :label="$t('account.oldPassword')">
        <UInput v-model="state.oldPassword" type="password" />
      </UFormGroup>
      <UFormGroup name="password" :label="$t('account.password')">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UFormGroup name="passwordConfirm" :label="$t('account.passwordConfirm')">
        <UInput v-model="state.passwordConfirm" type="password" />
      </UFormGroup>
      <div class="text-right">
        <UButton
          :loading="pending"
          :label="$t('general.changePassword')"
          type="submit"
        />
      </div>
    </UForm>
  </div>
</template>
