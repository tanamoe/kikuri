<script setup lang="ts">
import { ClientResponseError, Record } from "pocketbase";

const { $pb } = useNuxtApp();

const loading = ref(false);
const alert = ref<{
  intent: "success" | "error";
  message: string;
  show: boolean;
}>({
  intent: "error",
  message: "",
  show: false,
});
const username = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

const register = async () => {
  loading.value = true;

  if (username.value === "") {
    alert.value.intent = "error";
    alert.value.message = "Tên tài khoản không được để trống";
    alert.value.show = true;
  } else if (email.value === "") {
    alert.value.intent = "error";
    alert.value.message = "Email không được để trống";
    alert.value.show = true;
  } else if (password.value === "" || passwordConfirm.value === "") {
    alert.value.intent = "error";
    alert.value.message = "Mật khẩu không được để trống";
    alert.value.show = true;
  } else if (password.value !== passwordConfirm.value) {
    alert.value.intent = "error";
    alert.value.message = "Mật khẩu không trùng";
    alert.value.show = true;
  } else {
    try {
      await $pb.collection("users").create({
        username: username.value,
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      });

      await $pb.collection("users").requestVerification(email.value);

      await $pb
        .collection("users")
        .authWithPassword(username.value, password.value);

      alert.value.intent = "success";
      alert.value.message = "Đăng ký thành công, đang chuyển hướng...";
      alert.value.show = true;

      navigateTo("/");
    } catch (err) {
      if (err instanceof ClientResponseError) {
        alert.value.intent = "error";
        alert.value.message = `Lỗi: ${err.message}`;
        alert.value.show = true;
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
      class="flex h-full flex-col items-center justify-center gap-6 overflow-y-scroll"
    >
      <div
        class="w-full min-w-fit max-w-sm rounded-lg bg-zinc-200 p-6 dark:bg-zinc-700/50"
      >
        <AppHeading>Đăng ký</AppHeading>
        <form @submit.prevent="register">
          <div class="space-y-3">
            <div class="space-y-1">
              <label class="block" for="username">Tên tài khoản</label>
              <AppInput
                id="username"
                v-model="username"
                type="text"
                placeholder="kikuri"
              />
            </div>
            <div class="space-y-1">
              <label class="block" for="email">Email</label>
              <AppInput
                id="email"
                v-model="email"
                type="email"
                placeholder="konnichiwa@tana.moe"
              />
            </div>
            <div class="space-y-1">
              <label class="block" for="password">Mật khẩu</label>
              <AppInput
                id="password"
                v-model="password"
                type="password"
                placeholder="dotdotdot"
              />
            </div>
            <div class="space-y-1">
              <label class="block" for="passwordConfirm"
                >Nhập lại mật khẩu</label
              >
              <AppInput
                id="passwordConfirm"
                v-model="passwordConfirm"
                type="password"
                placeholder="dotdotdot"
              />
            </div>
          </div>
          <AppButton class="mt-6 w-full" intent="primary" @click="register"
            >Đăng ký</AppButton
          >
          <div class="mt-3 text-center text-zinc-600 dark:text-zinc-400">
            <NuxtLink
              class="decoration-primary decoration-2 hover:underline"
              to="/login"
            >
              Đăng nhập
            </NuxtLink>
          </div>
        </form>
      </div>

      <AppAlert
        :class="[alert.show ? '' : 'hidden', 'max-w-sm']"
        :intent="alert.intent"
      >
        {{ alert.message }}
      </AppAlert>
    </div>
  </div>
</template>
