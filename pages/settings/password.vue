<script setup lang="ts">
import type { Form } from "@nuxthq/ui/dist/runtime/types";
import { z } from "zod";

const { $pb } = useNuxtApp();
const { pending, update } = useUpdateAccount();
const { t } = useI18n({ useScope: "global" });

const schema = z.object({
  oldPassword: z.string().min(8, t("error.passwordShort")),
  password: z.string().min(8, t("error.passwordShort")),
  passwordConfirm: z
    .string()
    .min(8, t("error.passwordShort"))
    .refine(
      (val) => val === state.value.password,
      () => ({ message: t("error.passwordNotMatch") }),
    ),
});

type Schema = z.output<typeof schema>;

const form = ref<Form<Schema>>();
const state = ref({
  oldPassword: "",
  password: "",
  passwordConfirm: "",
});

const submit = async () => {
  const data = await form.value!.validate();
  update({ id: $pb.authStore.model!.id, record: data });
};

definePageMeta({
  layout: "setting",
  middleware: "with-auth",
});
</script>

<template>
  <div>
    <UForm
      ref="form"
      class="space-y-6"
      :schema="schema"
      :state="state"
      @submit.prevent="submit"
    >
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
