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
};

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const display = ref<DisplaySettings>({
      bookDetails: true,
      bookPrice: true,
      digital: "show",
      editionedBook: true,
      datePosition: "left",
    });

    const library = ref<LibrarySettings>({
      defaultLibraryId: undefined,
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
