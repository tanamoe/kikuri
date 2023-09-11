<script setup lang="ts">
import { z } from "zod";
import type { Form } from "@nuxt/ui/dist/runtime/types";
import type { UsersResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { pending, update } = useUpdateAccount();

const currentUser = ref<UsersResponse>($pb.authStore.model! as UsersResponse);

const schema = z.object({
  username: z
    .string()
    .min(3, t("error.account.usernameInvalidMin"))
    .max(150, t("error.account.usernameInvalidMax"))
    .regex(/^[^\s]*$/, t("error.account.usernameIncludedSpace")),
});

type Schema = z.output<typeof schema>;

const form = ref<Form<Schema>>();
const state = ref({
  username: currentUser.value.username,
});

async function handleUpdate() {
  const data = await form.value!.validate();
  const res = await update({ id: currentUser.value.id, record: data });
  if (res) currentUser.value = res;
}

definePageMeta({
  layout: "setting",
  middleware: "with-auth",
});
</script>

<template>
  <div>
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-6"
      @submit.prevent="handleUpdate"
    >
      <UFormGroup name="username" :label="$t('account.username')">
        <UInput v-model="state.username" icon="i-fluent-person-20-filled" />
      </UFormGroup>
      <div class="text-right">
        <UButton :loading="pending" :label="$t('general.save')" type="submit" />
      </div>
    </UForm>
  </div>
</template>
