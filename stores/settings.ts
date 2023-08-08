import { defineStore } from "pinia";
import type { FilterDigital } from "@/utils/releases";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const showBookDetails = ref(true);
    const showBookPrice = ref(true);
    const showDigital = ref<FilterDigital>("show");
    const showEditionedBook = ref(true);

    return { showBookDetails, showBookPrice, showDigital, showEditionedBook };
  },
  {
    persist: true,
  }
);
