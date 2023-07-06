<script setup lang="ts">
import { ClientResponseError, Record } from "pocketbase";
import type { AppToast } from ".nuxt/components";

const { $pb } = useNuxtApp();

const loading = ref(false);
const alert = ref<{
  intent: "success" | "error";
  message: string;
}>({
  intent: "error",
  message: "",
});
const dialog = ref<InstanceType<typeof AppToast>>();

const user = ref("");
const password = ref("");

const loginWithPassword = async () => {
  loading.value = true;

  if (user.value === "") {
    alert.value.intent = "error";
    alert.value.message = "Email không được để trống";
    dialog.value?.show();
  } else if (password.value === "") {
    alert.value.intent = "error";
    alert.value.message = "Mật khẩu không được để trống";
    dialog.value?.show();
  } else {
    try {
      await $pb
        .collection("users")
        .authWithPassword(user.value, password.value);

      alert.value.intent = "success";
      alert.value.message = "Đăng nhập thành công, đang chuyển hướng...";
      dialog.value?.show();

      navigateTo("/");
    } catch (err) {
      if (err instanceof ClientResponseError) {
        alert.value.intent = "error";
        alert.value.message = `Lỗi: ${err.message}`;
        dialog.value?.show();
      }
    }
  }

  loading.value = false;
};

definePageMeta({
  middleware: [
    () => {
      const { $pb } = useNuxtApp();

      if ($pb.authStore.model instanceof Record) {
        return navigateTo("/");
      }
    },
  ],
});
</script>

<template>
  <div class="absolute inset-0">
    <div
      class="mx-6 flex h-full flex-col items-center justify-center gap-6 overflow-y-scroll"
    >
      <div
        class="w-full min-w-fit max-w-sm rounded-lg bg-zinc-200 p-6 dark:bg-zinc-800"
      >
        <AppHeading>Đăng nhập</AppHeading>
        <form @submit.prevent="loginWithPassword">
          <div class="space-y-3">
            <div class="space-y-1">
              <label class="block" for="user">Email/tên tài khoản</label>
              <AppInput
                id="user"
                v-model="user"
                type="text"
                placeholder="kikuri"
                background="100"
              />
            </div>
            <div class="space-y-1">
              <label class="block" for="password">Mật khẩu</label>
              <AppInput
                id="password"
                v-model="password"
                type="password"
                placeholder="dotdotdot"
                background="100"
              />
            </div>
          </div>
          <AppButton
            class="mt-6 w-full"
            :intent="loading ? 'secondary' : 'primary'"
            @submit="loginWithPassword"
          >
            <span v-if="loading">Đang tải...</span>
            <span v-else>Đăng nhập</span>
          </AppButton>
          <div class="mt-3 text-center text-zinc-600 dark:text-zinc-400">
            <NuxtLink
              class="decoration-primary decoration-2 hover:underline"
              to="/forget"
            >
              Quên mật khẩu?
            </NuxtLink>
            &middot;
            <NuxtLink
              class="decoration-primary decoration-2 hover:underline"
              to="/register"
            >
              Đăng ký
            </NuxtLink>
          </div>
        </form>
      </div>

      <AppToast ref="dialog" :intent="alert.intent">{{
        alert.message
      }}</AppToast>
    </div>
  </div>
</template>
