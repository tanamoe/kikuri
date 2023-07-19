import { ClientResponseError } from "pocketbase";
import { Collections, UsersRecord } from "@/types/pb";

export const useUpdateAccount = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n({ useScope: "global" });

  const {
    state: data,
    isLoading: pending,
    execute: update,
  } = useAsyncState(
    async (args: { id: string; record: Partial<UsersRecord> | FormData }) => {
      const { id, record } = args;

      try {
        const response = await $pb
          .collection(Collections.Users)
          .update<UsersRecord>(id, record);

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
      }
    },
    null,
    { immediate: false }
  );

  return { pending, data, update };
};

export const useRequestVerification = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n({ useScope: "global" });

  const {
    state: data,
    isLoading: pending,
    execute: requestEmail,
  } = useAsyncState(
    async (args: { email: string }) => {
      const { email } = args;

      try {
        await $pb.collection("users").requestVerification(email);

        toast.add({
          color: "primary",
          title: t("general.success"),
          description: t("account.requestVerificationEmailSent"),
          icon: "i-fluent-checkmark-circle-20-filled",
        });
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

  return { pending, data, requestEmail };
};
