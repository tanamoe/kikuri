<script setup lang="ts">
import { Record } from "pocketbase";
import { useUserStore } from "@/stores/user";

const { currentUser } = useUserStore();
const { pending, update } = useUpdateAccount();

const account = ref<Partial<Record>>({
  id: currentUser!.id,
  oldPassword: "",
  password: "",
  passwordConfirm: "",
});
const passwordForm = ref<HTMLFormElement>();

const handleUpdate = () => {
  const formData = new FormData(passwordForm.value);
  update(0, { id: account.value.id!, record: formData });
};

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <div>
    <form ref="passwordForm" class="space-y-6" @submit.prevent="handleUpdate">
      <UFormGroup name="oldPassword" :label="$t('account.oldPassword')">
        <UInput v-model="account.oldPassword" type="password" />
      </UFormGroup>
      <UFormGroup name="password" :label="$t('account.password')">
        <UInput v-model="account.password" type="password" />
      </UFormGroup>
      <UFormGroup name="passwordConfirm" :label="$t('account.passwordConfirm')">
        <UInput v-model="account.passwordConfirm" type="password" />
      </UFormGroup>
      <div class="text-right">
        <UButton
          :loading="pending"
          :label="$t('general.changePassword')"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>
