import { ClientResponseError } from "pocketbase";
import { Collections, type UsersResponse } from "@/types/pb";

export async function loginWithOAuth2(
  provider: string,
  code: string,
  codeVerifier: string,
  redirectUrl: string,
) {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  try {
    const response = await $pb
      .collection(Collections.Users)
      .authWithOAuth2Code<UsersResponse>(
        provider,
        code,
        codeVerifier,
        redirectUrl,
      );

    toast.add({
      color: "primary",
      title: t("auth.loginSuccessful"),
      description: t("auth.redirecting"),
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
}
