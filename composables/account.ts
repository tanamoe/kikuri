import { ClientResponseError } from "pocketbase";
import { Collections, type UsersRecord, type UsersResponse } from "@/types/pb";

export function useUpdateAccount() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = ref(false);

  async function update(args: {
    id: string;
    record: Partial<UsersRecord> | FormData | { [k: string]: unknown };
  }) {
    pending.value = true;

    try {
      const response = await $pb
        .collection(Collections.Users)
        .update<UsersResponse>(args.id, args.record);

      toast.add({
        color: "primary",
        title: t("account.updateSuccessful"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

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
    } finally {
      pending.value = false;
    }
  }

  async function requestEmailChange(args: { email: string }) {
    pending.value = true;

    try {
      const response = await $pb
        .collection(Collections.Users)
        .requestEmailChange(args.email);

      toast.add({
        color: "primary",
        title: t("account.requestSuccessful"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

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
    } finally {
      pending.value = false;
    }
  }

  return { pending, update, requestEmailChange };
}

export function useRequestVerification() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = ref(false);

  async function requestEmail(args: { email: string }) {
    const { email } = args;

    pending.value = true;

    try {
      const res = await $pb.collection("users").requestVerification(email);

      toast.add({
        color: "primary",
        title: t("general.success"),
        description: t("account.requestVerificationEmailSent"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      return res;
    } catch (err) {
      if (err instanceof ClientResponseError) {
        toast.add({
          color: "red",
          title: t("general.error"),
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  return { pending, requestEmail };
}
