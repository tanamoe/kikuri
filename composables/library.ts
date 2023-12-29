import { ClientResponseError } from "pocketbase";
import { joinURL } from "ufo";
import type { CollectionsRecord } from "@/types/pb";
import type {
  UserCollectionBookResponse,
  CollectionBookResponse,
  UserCollectionResponse,
  UserCollectionsResponse,
  CollectionMemberResponse,
} from "@/types/collections";
import type { BaseAPIFields, BaseAPIResponse } from "@/types/api";

export function useLibrary() {
  const { $pb } = useNuxtApp();

  const collections = useState<(CollectionMemberResponse & BaseAPIFields)[]>(
    () => [],
  );

  async function update() {
    if ($pb.authStore.model) {
      const res = await $pb.send<UserCollectionsResponse>(
        `/api/user-collections/${$pb.authStore.model.id}`,
        {
          method: "GET",
          expand: "collection",
        },
      );

      if (res.success) {
        collections.value = res.items;
      }
    } else {
      collections.value = [];
    }
  }

  $pb.authStore.onChange(async () => {
    await update();
  });

  return { collections, update };
}

export function useLibraryBook() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();

  const pending = useState(() => false);

  /**
   * Add or update a book from collection
   * @param collectionId
   * @param args
   */
  async function update(
    collectionId: string,
    args: Pick<CollectionBookResponse, "bookId" | "quantity" | "status">,
  ) {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionBookResponse>(
        joinURL("/api/user-collection", collectionId, "/books"),
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
        title: t("library.updateBookSuccessful"),
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

  /**
   * Remove a book from collection
   * @param collectionId
   * @param bookId
   */
  async function remove(collectionId: string, bookId: string) {
    pending.value = true;

    try {
      const res = await $pb.send<BaseAPIResponse>(
        joinURL("/api/user-collection", collectionId, "/books", bookId),
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
        title: t("library.removeBookSuccessful"),
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

export function useLibraryCollection() {
  const { $pb } = useNuxtApp();
  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();
  const settingsStore = useSettingsStore();

  const pending = useState(() => false);

  /**
   * Create a new user collection
   * @param data
   */
  async function create(data: Partial<CollectionsRecord>) {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionResponse>(
        "/api/user-collection",
        {
          method: "POST",
          body: data,
        },
      );

      if (res.success) {
        toast.add({
          color: "primary",
          title: t("library.createCollectionSuccess"),
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        if (!settingsStore.library.defaultLibraryId) {
          settingsStore.library.defaultLibraryId = res.item.id;
        }

        return res;
      }

      throw new ClientResponseError(res.message);
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

  /**
   * Edit a user collection
   * @param data
   */
  async function edit(id: string, data: Partial<CollectionsRecord>) {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionResponse>(
        joinURL("/api/user-collection", id),
        {
          method: "POST",
          body: data,
        },
      );

      if (res.success) {
        toast.add({
          color: "primary",
          title: t("library.editCollectionSuccess"),
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        await navigateTo(joinURL("/library", res.item.id));

        return res;
      }

      throw new ClientResponseError(res.message);
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

  /**
   * Remove a user collection
   * @param data
   */
  async function remove(id: string) {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionResponse>(
        joinURL("/api/user-collection", id),
        {
          method: "DELETE",
        },
      );

      if (res.success) {
        toast.add({
          color: "primary",
          title: t("library.removeCollectionSuccess"),
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        try {
          const res = await $pb.send<UserCollectionsResponse>(
            joinURL("/api/user-collections", $pb.authStore.model?.id),
            {
              method: "GET",
            },
          );

          if (res.totalItems === 0) throw new Error("No collections");

          settingsStore.library.defaultLibraryId = res.items[0]?.collectionId;
        } catch (error) {
          settingsStore.library.defaultLibraryId = undefined;
        }

        await navigateTo("/");

        return res;
      }

      throw new ClientResponseError(res.message);
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

  return { pending, create, edit, remove };
}

export function useLibraryCollectionCreate() {
  const isOpen = useState(() => false);

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return { isOpen, open, close };
}
