<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { t } = useI18n({ useScope: "global" });
const { pending, requestEmailChange } = useUpdateAccount();

const { currentUser } = useAuthentication();

const schema = z.object({
  email: z.string().email(t("error.account.emailInvalid")),
});

type Schema = z.output<typeof schema>;

const state = ref({
  email: currentUser.value!.email,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await requestEmailChange({
    email: event.data.email,
  });
}

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div>
    <UForm class="space-y-6" :schema="schema" :state="state" @submit="onSubmit">
      <UFormGroup name="email" :label="$t('account.email')">
        <UInput v-model="state.email" icon="i-fluent-mail-20-filled" />
      </UFormGroup>
      <div class="flex justify-end gap-3">
        <UButton :loading="pending" type="submit">
          {{ $t("settings.requestEmailChange") }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
