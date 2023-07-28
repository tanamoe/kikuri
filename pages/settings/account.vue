<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import type { UsersResponse } from "@/types/pb";

const { currentUser } = useUserStore();
const { pending, update } = useUpdateAccount();

const account = ref<UsersResponse>({ ...currentUser! });
const accountForm = ref<HTMLFormElement>();

const handleUpdate = () => {
  const formData = new FormData(accountForm.value);
  update(0, { id: account.value.id, record: formData });
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
