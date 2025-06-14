import { ClientResponseError } from "pocketbase";
import { Collections, type UsersResponse } from "@/types/pb";

export function useAuthentication() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = useState(() => false);

  async function register(args: {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) {
    const { username, email, password, passwordConfirm } = args;

    pending.value = true;

    try {
      await $pb.collection(Collections.Users).create({
        username,
        email,
        password,
        passwordConfirm,
      });

      await $pb.collection(Collections.Users).requestVerification(email);

      await $pb
        .collection(Collections.Users)
        .authWithPassword<UsersResponse>(username, password);

      toast.add({
        color: "primary",
        title: t("auth.loginSuccessful"),
        description: t("auth.redirecting"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      return navigateTo("/verification");
    } catch (err) {
      if (err instanceof ClientResponseError) {
        toast.add({
          color: "error",
          title: t("general.error"),
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  async function login(args: { user: string; password: string }) {
    const { user, password } = args;

    pending.value = true;

    try {
      await $pb
        .collection(Collections.Users)
        .authWithPassword<UsersResponse>(user, password);

      toast.add({
        color: "primary",
        title: t("auth.loginSuccessful"),
        description: t("auth.redirecting"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      return navigateTo("/");
    } catch (err) {
      if (err instanceof ClientResponseError) {
        toast.add({
          color: "error",
          title: t("general.error"),
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  async function requestPasswordReset(args: { email: string }) {
    const { email } = args;

    pending.value = true;

    try {
      await $pb.collection(Collections.Users).requestPasswordReset(email);

      toast.add({
        color: "primary",
        title: t("account.requestSuccessful"),
        description: t("auth.checkEmailInbox"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      return navigateTo("/login");
    } catch (err) {
      if (err instanceof ClientResponseError) {
        toast.add({
          color: "error",
          title: t("general.error"),
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  return {
    pending,
    register,
    login,
    requestPasswordReset,
  };
}
