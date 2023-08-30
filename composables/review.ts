import { ClientResponseError } from "pocketbase";
import { Collections, ReviewResponse, type ReviewRecord } from "@/types/pb";

export function useCreateReview() {
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
        title: t("review.createSuccess"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      localStorage.removeItem("review-content");

      return navigateTo("/review/" + res.id);
    } catch (error) {
      if (error instanceof ClientResponseError) {
        toast.add({
          color: "red",
          title: t("error.generalMessage"),
          description: error.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  return { pending, post };
}

export function useEditReview() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = ref(false);

  async function edit(id: string, data: FormData | Partial<ReviewRecord>) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Review)
        .update<ReviewResponse>(id, data);

      toast.add({
        color: "primary",
        title: t("review.editSuccess"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      localStorage.removeItem(`review-content-${id}`);

      return navigateTo("/review/" + res.id);
    } catch (error) {
      if (error instanceof ClientResponseError) {
        toast.add({
          color: "red",
          title: t("error.generalMessage"),
          description: error.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  async function remove(id: string) {
    pending.value = true;

    try {
      await $pb.collection(Collections.Review).delete(id);

      toast.add({
        color: "primary",
        title: t("review.removeSuccess"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      localStorage.removeItem(`review-content-${id}`);

      return navigateTo("/");
    } catch (error) {
      if (error instanceof ClientResponseError) {
        toast.add({
          color: "red",
          title: t("error.generalMessage"),
          description: error.message,
          icon: "i-fluent-error-circle-20-filled",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  return { pending, edit, remove };
}
