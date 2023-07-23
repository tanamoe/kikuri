<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const { pending, requestEmail } = useRequestVerification();

const store = useUserStore();

const { currentUser } = storeToRefs(store);

definePageMeta({
  middleware: [
    "auth",
    () => {
      const { $pb } = useNuxtApp();

      if ($pb.authStore.model?.verified === true) return navigateTo("/");
    },
  ],
});
</script>

<template>
  <div
    class="mx-6 my-12 flex h-[80vh] flex-col items-center justify-center gap-6"
  >
    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppHeading class="mb-6">{{ $t("account.verify") }}</AppHeading>
      <p class="mb-6">{{ $t("account.verifyDescription") }}</p>
      <div class="space-y-2">
        <UButton
          :loading="pending"
          block
          @click="requestEmail(0, { email: currentUser?.email })"
        >
          {{ $t("account.sendVerificationEmail") }}
        </UButton>
        <UButton variant="soft" to="/" block>
          {{ $t("account.verifyLater") }}
        </UButton>
      </div>
    </div>
  </div>
</template>
