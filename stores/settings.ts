import type { FilterDigital } from "@/utils/releases";

export type DisplaySettings = {
  bookDetails: boolean;
  bookPrice: boolean;
  digital: FilterDigital;
  editionedBook: boolean;
  datePosition: "left" | "top";
  bookMetadata: boolean;
};

export type LibrarySettings = {
  defaultLibraryId?: string;
  groupBy: "none" | "release" | "status";
  sort:
    | "+updated"
    | "-updated"
    | "+book.publication.name"
    | "-book.publication.name";
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
      bookMetadata: true,
    });

    const library = ref<LibrarySettings>({
      defaultLibraryId: undefined,
      groupBy: "none",
      sort: "+updated",
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
