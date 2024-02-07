<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { UsersResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { pending, update } = useUpdateAccount();

const schema = z.object({
  displayName: z
    .string()
    .min(1, t("error.displayNameLength"))
    .max(32, t("error.displayNameLength")),
  bio: z.string().max(256, t("error.bioLength")),
  avatar: z.any(),
  banner: z.any(),
});

type Schema = z.output<typeof schema>;

const state = ref({
  displayName: $pb.authStore.model?.displayName,
  bio: $pb.authStore.model?.bio,
  avatar: $pb.authStore.model?.avatar,
  banner: $pb.authStore.model?.banner,
});

const currentUser = ref($pb.authStore.model as UsersResponse);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const res = await update({
    id: $pb.authStore.model!.id,
    record: event.data,
  });
  if (res) {
    currentUser.value = res;
  }
}

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div
    v-if="$pb.authStore.isAuthRecord"
    class="flex flex-col gap-6 lg:flex-row-reverse"
  >
    <PageSettingsProfilePreview
      :user="currentUser"
      @change:avatar="(avatar) => (state.avatar = avatar)"
      @change:banner="(banner) => (state.banner = banner)"
    />

    <UForm
      class="flex-1 space-y-6"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
    >
      <UFormGroup name="displayName" :label="$t('account.displayName')">
        <UInput v-model="state.displayName" />
      </UFormGroup>
      <UFormGroup name="bio" :label="$t('account.bio')">
        <UTextarea v-model="state.bio" />
      </UFormGroup>
      <div class="flex justify-end gap-3">
        <UButton :loading="pending" type="submit">
          {{ $t("general.save") }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
