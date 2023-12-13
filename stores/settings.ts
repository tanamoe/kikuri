import type { FilterDigital } from "@/utils/releases";

export type DisplaySettings = {
  bookDetails: boolean;
  bookPrice: boolean;
  digital: FilterDigital;
  editionedBook: boolean;
  datePosition: "left" | "top";
};

export type LibrarySettings = {
  defaultLibraryId?: string;
  columns: string[];
};

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const { $pb } = useNuxtApp();

    const display = ref<DisplaySettings>({
      bookDetails: true,
      bookPrice: true,
      digital: "show",
      editionedBook: true,
      datePosition: "left",
    });

    const library = ref<LibrarySettings>({
      defaultLibraryId: undefined,
      columns: [
        "cover",
        "name",
        "quantity",
        "price",
        "publishDate",
        "status",
        "created",
        "updated",
      ],
    });

    // clear default settings on unauthenticated
    $pb.authStore.onChange(() => {
      if (!$pb.authStore.model) {
        library.value.defaultLibraryId = undefined;
      }
    });

    return {
      display,
      library,
    };
  },
  {
    persist: true,
  },
);
