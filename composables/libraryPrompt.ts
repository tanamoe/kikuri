import type { CollectionBooksStatusOptions } from "@/types/pb";

export function useLibraryPrompt() {
  const settingsStore = useSettingsStore();

  const updateFn = useState<(() => any) | undefined>();

  const isOpen = useState(() => ({
    add: false,
    edit: false,
    remove: false,
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
    quantity?: number;
    collection?: string;
  }>(() => ({
    quantity: 1,
  }));

  function add(data: { id: string; name: string }) {
    isOpen.value.add = true;
    book.value = data;
    state.value = {
      quantity: 1,
    };

    if (settingsStore.library.defaultLibraryId) {
      state.value.collection = settingsStore.library.defaultLibraryId;
    }
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

  function remove(data: { id: string; name: string; collection: string }) {
    isOpen.value.remove = true;
    book.value = {
      id: data.id,
      name: data.name,
    };
    state.value = {
      collection: data.collection,
    };
  }

  return { updateFn, isOpen, book, state, add, edit, remove };
}
