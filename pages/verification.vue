<script setup lang="ts">
import { ClientResponseError } from "pocketbase";
import type { AppToast } from ".nuxt/components";

const { $pb } = useNuxtApp();

const button = ref<{
  intent: "primary" | "secondary" | "success" | "error";
  disabled: boolean;
}>({
  intent: "primary",
  disabled: false,
});
const alert = ref<{
  intent: "success" | "error";
  message: string;
}>({
  intent: "error",
  message: "",
});
const dialog = ref<InstanceType<typeof AppToast>>();

const sendVerificationEmail = async () => {
  button.value.intent = "secondary";

  try {
    await $pb
      .collection("users")
      .requestVerification($pb.authStore.model?.email);

    alert.value.intent = "success";
    alert.value.message = `Đã gửi mail đến ${$pb.authStore.model?.email}!`;
    dialog.value?.show();

    button.value.intent = "success";
    button.value.disabled = true;
  } catch (err) {
    if (err instanceof ClientResponseError) {
      alert.value.intent = "error";
      alert.value.message = `Lỗi: ${err.message}. Hãy thử tải lại trang`;
      dialog.value?.show();

      button.value.intent = "error";
    }
  }
};

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
    class="mx-6 my-12 flex h-full flex-col items-center justify-center gap-6 overflow-y-scroll"
  >
    <div class="w-full max-w-sm rounded-lg bg-zinc-200 p-6 dark:bg-zinc-800">
      <AppHeading>Xác minh tài khoản</AppHeading>
      <p>
        Cảm ơn bạn đã tạo tài khoản tại Tana.moe! Hãy xác minh địa chỉ email để
        gia tăng trải nghiệm sử dụng.
      </p>
      <AppButton
        class="mt-6 w-full"
        :intent="button.intent"
        :disabled="button.disabled"
        @click="sendVerificationEmail"
      >
        <span v-if="button.intent === 'secondary'">Đang gửi...</span>
        <span v-else-if="button.intent === 'success'">Đã gửi!</span>
        <span v-else-if="button.intent === 'error'">Đã có lỗi, thử lại?</span>
        <span v-else>Gửi mail xác minh</span>
      </AppButton>

      <AppButtonLink class="mt-3 w-full" intent="secondary" href="/">
        <span>Để lúc khác</span>
      </AppButtonLink>
    </div>

    <AppToast ref="dialog" :intent="alert.intent">{{ alert.message }}</AppToast>
  </div>
</template>
