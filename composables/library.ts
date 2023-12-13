import { ClientResponseError } from "pocketbase";
import { joinURL } from "ufo";
import type {
  UserCollectionBooksResponse,
  CollectionBookResponse,
} from "@/types/collections";

export function useLibrary() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = useState(() => false);

  async function update(
    args: Omit<CollectionBookResponse, "book" | "collection">,
  ) {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionBooksResponse>(
        joinURL("/api/user-collection", args.collectionId, "/books"),
        {
          method: "POST",
          body: args,
        },
      );

      if (res.success === false)
        throw new ClientResponseError({
          message: res.message ?? "Something went wrong",
        });

      toast.add({
        color: "primary",
        title: t("library.updateSuccessful"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      return res;
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

  async function remove(args: { bookId: string; collectionId: string }) {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionBooksResponse>(
        joinURL(
          "/api/user-collection",
          args.collectionId,
          "/books",
          args.bookId,
        ),
        {
          method: "DELETE",
        },
      );

      if (res.success === false)
        throw new ClientResponseError({
          message: res.message ?? "Something went wrong",
        });

      toast.add({
        color: "primary",
        title: t("library.removeSuccessful"),
        icon: "i-fluent-checkmark-circle-20-filled",
      });

      return res;
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

  return { pending, update, remove };
}
