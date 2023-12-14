<script setup lang="ts">
const { currentUser } = useAuthentication();
const { pending, requestEmail } = useRequestVerification();

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div class="my-12 flex h-[80vh] flex-col items-center justify-center gap-6">
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
              email: currentUser!.email,
            })
          "
        >
          {{ $t("account.sendVerificationEmail") }}
        </UButton>
        <UButton color="gray" to="/" block>
          {{ $t("account.verifyLater") }}
        </UButton>
      </div>
    </div>
  </div>
</template>
