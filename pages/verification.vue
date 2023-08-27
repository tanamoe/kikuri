<script setup lang="ts">
import { UsersResponse } from "@/types/pb";

const { pending, requestEmail } = useRequestVerification();

const { $pb } = useNuxtApp();

definePageMeta({
  middleware: ["without-auth"],
});
</script>

<template>
  <UContainer
    class="my-12 flex h-[80vh] flex-col items-center justify-center gap-6"
  >
    <Head>
      <Title>{{ $t("account.verify") }}</Title>
    </Head>

    <div class="w-full max-w-sm rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <AppH1 class="mb-6">{{ $t("account.verify") }}</AppH1>
      <p class="mb-6">{{ $t("account.verifyDescription") }}</p>
      <div class="space-y-2">
        <UButton
          :loading="pending"
          block
          @click="
            requestEmail({
              email: ($pb.authStore.model! as UsersResponse).email,
            })
          "
        >
          {{ $t("account.sendVerificationEmail") }}
        </UButton>
        <UButton variant="soft" to="/" block>
          {{ $t("account.verifyLater") }}
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
