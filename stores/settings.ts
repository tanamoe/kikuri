import { joinURL } from "ufo";
import type { FilterDigital } from "@/utils/releases";
import type { UserCollectionsResponse } from "@/types/collections";

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
    $pb.authStore.onChange(async () => {
      if (!$pb.authStore.model) {
        library.value.defaultLibraryId = undefined;
      } else {
        const res = await $pb.send<UserCollectionsResponse>(
          joinURL("/api/user-collections", $pb.authStore.model.id),
          {
            method: "GET",
          },
        );
        if (res.totalItems > 0) {
          library.value.defaultLibraryId = res.items.at(0)?.collectionId;
        }
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
