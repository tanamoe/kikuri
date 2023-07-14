<script setup lang="ts">
import { Record } from "pocketbase";
import { useUserStore } from "@/stores/user";

const { currentUser } = useUserStore();
const { pending, updateAccount } = useAccount();

const account = ref<Partial<Record>>({ ...currentUser });
const accountForm = ref<HTMLFormElement>();

const handleUpdate = async () => {
  const formData = new FormData(accountForm.value);
  await updateAccount(account.value.id!, formData);
};

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div>
    <form ref="accountForm" class="space-y-6" @submit.prevent="handleUpdate">
      <UFormGroup name="username" :label="$t('account.username')">
        <UInput v-model="account.username" icon="i-fluent-person-20-filled" />
      </UFormGroup>
      <div class="text-right">
        <UButton :loading="pending" :label="$t('general.save')" type="submit" />
      </div>
    </form>
  </div>
</template>
