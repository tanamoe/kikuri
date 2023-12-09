import { ClientResponseError } from "pocketbase";
import { joinURL } from "ufo";
import type { CollectionBooksStatusOptions } from "@/types/pb";
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

  return { pending, update };
}

export function useLibraryPrompt() {
  const isOpen = useState(() => ({
    add: false,
    quickAdd: false,
    edit: false,
  }));

  const book = useState<
    | {
        id: string;
        name: string;
      }
    | undefined
  >();

  const state = useState<{
    status?: CollectionBooksStatusOptions;
    quantity: number;
    collection?: string;
  }>(() => ({
    quantity: 1,
  }));

  function add(
    data: {
      id: string;
      name: string;
    },
    mobile = false,
  ) {
    isOpen.value.add = false;
    isOpen.value.quickAdd = false;

    if (mobile) {
      isOpen.value.quickAdd = true;
    } else {
      isOpen.value.add = true;
    }
    book.value = data;
    state.value = {
      quantity: 1,
    };
  }

  function edit(data: {
    id: string;
    name: string;
    quantity: number;
    collection: string;
    status: CollectionBooksStatusOptions;
  }) {
    isOpen.value.edit = true;
    book.value = {
      id: data.id,
      name: data.name,
    };
    state.value = {
      quantity: data.quantity,
      collection: data.collection,
      status: data.status,
    };
  }

  return { isOpen, book, state, add, edit };
}
