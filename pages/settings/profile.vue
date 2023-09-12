<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { t } = useI18n({ useScope: "global" });
const { pending, update } = useUpdateAccount();

const { currentUser } = useAuthentication();

const schema = z.object({
  displayName: z
    .string()
    .min(1, t("error.displayNameLength"))
    .max(32, t("error.displayNameLength")),
  bio: z.string().max(256, t("error.bioLength")),
});

type Schema = z.output<typeof schema>;

const state = ref({
  displayName: currentUser.value!.displayName,
  bio: currentUser.value!.bio,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await update({ id: currentUser.value!.id, record: event.data });
  if (res) currentUser.value = res;
}

async function upload(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement);
  const res = await update({ id: currentUser.value!.id, record: formData });
  if (res) currentUser.value = res;
}

definePageMeta({
  layout: "setting",
  middleware: "with-auth",
});
</script>

<template>
  <div class="flex flex-col gap-6 lg:flex-row-reverse">
    <AppCard class="w-full lg:max-w-sm" :hoverable="false">
      <AppUserProfile :user="currentUser!" />
    </AppCard>

    <div class="flex-1 space-y-6">
      <UForm class="space-y-6" :schema="schema" :state="state" @submit="submit">
        <UFormGroup name="displayName" :label="$t('account.displayName')">
          <UInput v-model="state.displayName" />
        </UFormGroup>
        <UFormGroup name="bio" :label="$t('account.bio')">
          <UTextarea v-model="state.bio" />
        </UFormGroup>
        <div class="text-right">
          <UButton :loading="pending" type="submit">
            {{ $t("general.save") }}
          </UButton>
        </div>
      </UForm>

      <form @submit.prevent="upload">
        <UFormGroup name="avatar" :label="$t('account.avatar')">
          <UInput type="file" accept="image/*" />
        </UFormGroup>

        <div class="mt-3 space-x-3">
          <UButton
            :loading="pending"
            color="gray"
            icon="i-fluent-arrow-upload-20-filled"
            type="submit"
          >
            {{ $t("account.upload") }}
          </UButton>
          <UButton
            v-if="currentUser!.avatar"
            :loading="pending"
            color="red"
            variant="ghost"
            icon="i-fluent-delete-20-filled"
            @click="update({ id: currentUser!.id, record: { avatar: '' } })"
          >
            {{ $t("account.removeAvatar") }}
          </UButton>
        </div>
      </form>

      <form @submit.prevent="upload">
        <UFormGroup name="banner" :label="$t('account.banner')">
          <UInput type="file" accept="image/*" />
        </UFormGroup>

        <div class="mt-3 space-x-3">
          <UButton
            :loading="pending"
            color="gray"
            icon="i-fluent-arrow-upload-20-filled"
            type="submit"
          >
            {{ $t("account.upload") }}
          </UButton>
          <UButton
            v-if="currentUser!.banner"
            :loading="pending"
            color="red"
            variant="ghost"
            icon="i-fluent-delete-20-filled"
            @click="update({ id: currentUser!.id, record: { banner: '' } })"
          >
            {{ $t("account.removeBanner") }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
