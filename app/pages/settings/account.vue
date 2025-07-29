<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { pending, update } = useUpdateAccount();

const schema = z.object({
  username: z
    .string()
    .min(3, t("error.account.usernameInvalidMin"))
    .max(150, t("error.account.usernameInvalidMax"))
    .regex(/^[^\s]*$/, t("error.account.usernameIncludedSpace")),
});

type Schema = z.output<typeof schema>;

const state = ref({
  username: $pb.authStore.model?.username,
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
    <UForm :schema :state class="space-y-6" @submit="onSubmit">
      <UFormField name="username" :label="$t('account.username')">
        <UInput
          v-model="state.username"
          icon="i-fluent-person-20-filled"
          class="w-full"
        />
      </UFormField>
      <div class="text-right">
        <UButton :loading="pending" :label="$t('general.save')" type="submit" />
      </div>
    </UForm>
  </div>
</template>
