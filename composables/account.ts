import { ClientResponseError } from "pocketbase";
import { Collections, UsersRecord, UsersResponse } from "@/types/pb";

export const useUpdateAccount = () => {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = ref(false);

  async function update(args: {
    id: string;
    record: Partial<UsersRecord> | FormData | { [k: string]: any };
  }) {
    const { id, record } = args;

    pending.value = true;

    try {
      const response = await $pb
        .collection(Collections.Users)
        .update<UsersResponse>(id, record);

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

  return { pending, update };
};

export const useRequestVerification = () => {
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
};
