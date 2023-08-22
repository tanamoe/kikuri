import { ClientResponseError } from "pocketbase";
import { Collections, ReviewResponse, type ReviewRecord } from "@/types/pb";

export function useReview() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = ref(false);

  async function post(data: FormData | Partial<ReviewRecord>) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Review)
        .create<ReviewResponse>(data);

      toast.add({
        color: "primary",
        title: t("review.postSuccess"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      return navigateTo("/review/" + res.id);
    } catch (error) {
      if (error instanceof ClientResponseError) {
        toast.add({
          color: "red",
          title: t("error.generalMessage"),
          description: error.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      } else {
        console.error(error);
      }
    } finally {
      pending.value = false;
    }
  }

  return { pending, post };
}
