<script setup lang="ts">
import { Record } from "pocketbase";
import { useUserStore } from "@/stores/user";

const { currentUser } = useUserStore();
const { pending, updateAccount } = useAccount();

const account = ref<Partial<Record>>({ ...currentUser, avatar: undefined });
const profileForm = ref<HTMLFormElement>();

const handleUpdate = async () => {
  const formData = new FormData(profileForm.value);
  await updateAccount(account.value.id!, formData);
};

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div class="flex flex-col gap-6 lg:flex-row-reverse">
    <AppCard class="w-full lg:max-w-sm">
      <AppUserProfile :user="currentUser!" />
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
