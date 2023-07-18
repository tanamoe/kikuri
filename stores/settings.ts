import { defineStore } from "pinia";

export const useSettingsStore = defineStore(
  "setting",
  () => {
    const settings = ref({
      showBookDetails: true,
    });

    return { settings };
  },
  {
    persist: true,
  }
);
