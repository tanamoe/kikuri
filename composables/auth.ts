import { ClientResponseError } from "pocketbase";
import { Collections, UsersResponse } from "@/types/pb";

export const useRegister = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n({ useScope: "global" });

  const {
    state: data,
    isLoading: pending,
    execute: register,
  } = useAsyncState(
    async (args: {
      username: string;
      email: string;
      password: string;
      passwordConfirm: string;
    }) => {
      const { username, email, password, passwordConfirm } = args;

      try {
        await $pb.collection(Collections.Users).create({
          username,
          email,
          password,
          passwordConfirm,
        });

        await $pb.collection(Collections.Users).requestVerification(email);

        const response = await $pb
          .collection(Collections.Users)
          .authWithPassword<UsersResponse>(username, password);

        toast.add({
          color: "primary",
          title: t("auth.loginSuccessful"),
          description: t("auth.redirecting"),
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        navigateTo("/verification");

        return response;
      } catch (err) {
        if (err instanceof ClientResponseError) {
          toast.add({
            color: "red",
            title: t("general.error"),
            description: err.message,
            icon: "i-fluent-error-circle-20-filled",
          });
        }
      }
    },
    null,
    { immediate: false }
  );

  return { pending, data, register };
};

export const useLogin = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n({ useScope: "global" });

  const {
    state: data,
    isLoading: pending,
    execute: login,
  } = useAsyncState(
    async (args: { user: string; password: string }) => {
      const { user, password } = args;

      try {
        const response = await $pb
          .collection(Collections.Users)
          .authWithPassword<UsersResponse>(user, password);

        toast.add({
          color: "primary",
          title: t("auth.loginSuccessful"),
          description: t("auth.redirecting"),
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        navigateTo("/");

        return response;
      } catch (err) {
        if (err instanceof ClientResponseError) {
          toast.add({
            color: "red",
            title: t("general.error"),
            description: err.message,
            icon: "i-fluent-error-circle-20-filled",
          });
        }
      }
    },
    null,
    {
      immediate: false,
    }
  );

  return { pending, data, login };
};

export const useOAuthLogin = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n({ useScope: "global" });

  const {
    state: data,
    isLoading: pending,
    execute: login,
  } = useAsyncState(
    async (args: { provider: string }) => {
      const { provider } = args;

      try {
        const response = await $pb
          .collection(Collections.Users)
          .authWithOAuth2<UsersResponse>({ provider });

        toast.add({
          color: "primary",
          title: t("auth.loginSuccessful"),
          description: t("auth.redirecting"),
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        navigateTo("/");

        return response;
      } catch (err) {
        if (err instanceof ClientResponseError) {
          toast.add({
            color: "red",
            title: t("general.error"),
            description: err.message,
            icon: "i-fluent-error-circle-20-filled",
          });
        }
      }
    },
    null,
    {
      immediate: false,
    }
  );

  return { pending, data, login };
};

export const usePasswordReset = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n({ useScope: "global" });

  const {
    state: data,
    isLoading: pending,
    execute: requestPasswordReset,
  } = useAsyncState(
    async (args: { email: string }) => {
      const { email } = args;

      if (email === "") {
        toast.add({
          color: "red",
          title: t("general.error"),
          description: t("auth.emailCannotBeEmpty"),
          icon: "i-fluent-error-circle-20-filled",
        });
      } else {
        try {
          await $pb.collection(Collections.Users).requestPasswordReset(email);

          toast.add({
            color: "primary",
            title: t("auth.requestSuccessful"),
            description: t("auth.checkEmailInbox"),
            icon: "i-fluent-checkmark-circle-20-filled",
          });

          await navigateTo("/login");
        } catch (err) {
          if (err instanceof ClientResponseError) {
            toast.add({
              color: "red",
              title: t("general.error"),
              description: err.message,
              icon: "i-fluent-error-circle-20-filled",
            });
          }
        }
      }
    },
    null,
    { immediate: false }
  );

  return { data, pending, requestPasswordReset };
};
