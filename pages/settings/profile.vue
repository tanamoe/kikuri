<script setup lang="ts">
import { Record } from "pocketbase";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const store = useUserStore();
const { currentUser } = storeToRefs(store);
const { pending, update } = useUpdateAccount();

const account = ref<Partial<Record>>({
  ...unref(currentUser),
  avatar: undefined,
});
const profileForm = ref<HTMLFormElement>();

const handleUpdate = () => {
  const formData = new FormData(profileForm.value);
  update(0, { id: account.value.id!, record: formData });
};

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div class="flex flex-col gap-6 lg:flex-row-reverse">
    <AppCard class="w-full lg:max-w-sm">
      <AppUserProfile v-if="currentUser" :user="currentUser" />
    </AppCard>

    <form
      ref="profileForm"
      class="flex-1 space-y-6"
      @submit.prevent="handleUpdate"
    >
      <UFormGroup name="displayName" :label="$t('account.displayName')">
        <UInput v-model="account.displayName" />
      </UFormGroup>
      <UFormGroup name="bio" :label="$t('account.bio')">
        <UTextarea v-model="account.bio" />
      </UFormGroup>
      <div class="text-right">
        <UButton :loading="pending" :label="$t('general.save')" type="submit" />
      </div>
    </form>
  </div>
</template>
