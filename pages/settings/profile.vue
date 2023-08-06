<script setup lang="ts">
import type { Form } from "@nuxthq/ui/dist/runtime/types";
import { z } from "zod";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const store = useUserStore();
const { t } = useI18n({ useScope: "global" });
const { pending, update } = useUpdateAccount();

const schema = z.object({
  displayName: z
    .string()
    .min(1, t("error.displayNameLength"))
    .max(32, t("error.displayNameLength")),
  bio: z.string().max(256, t("error.bioLength")),
});

type Schema = z.output<typeof schema>;

const { currentUser } = storeToRefs(store);
const form = ref<Form<Schema>>();
const state = ref({
  displayName: currentUser.value?.displayName,
  bio: currentUser.value?.bio,
});

const submit = async () => {
  const data = await form.value!.validate();
  update(0, { id: currentUser.value!.id, record: data });
};

const upload = (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement);
  update(0, { id: currentUser.value!.id, record: formData });
};

const removeAvatar = () =>
  update(0, { id: currentUser.value!.id, record: { avatar: "" } });

const removeBanner = () =>
  update(0, { id: currentUser.value!.id, record: { banner: "" } });

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div class="flex flex-col gap-6 lg:flex-row-reverse">
    <AppCard class="w-full lg:max-w-sm" :hoverable="false">
      <AppUserProfile v-if="currentUser" :user="currentUser" />
    </AppCard>

    <div class="flex-1 space-y-6">
      <UForm
        ref="form"
        class="space-y-6"
        :schema="schema"
        :state="state"
        @submit.prevent="submit"
      >
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
            icon="i-fluent-arrow-upload-20-filled"
            type="submit"
          >
            {{ $t("account.upload") }}
          </UButton>
          <UButton
            v-if="currentUser?.avatar"
            :loading="pending"
            color="red"
            icon="i-fluent-delete-20-filled"
            @click="removeAvatar"
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
            icon="i-fluent-arrow-upload-20-filled"
            type="submit"
          >
            {{ $t("account.upload") }}
          </UButton>
          <UButton
            v-if="currentUser?.banner"
            :loading="pending"
            color="red"
            icon="i-fluent-delete-20-filled"
            @click="removeBanner"
          >
            {{ $t("account.removeBanner") }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
