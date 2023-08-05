import { defineStore } from "pinia";
import { InterfaceSettings } from "@/types/settingsInterface";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const settings = ref<InterfaceSettings>({
      showBookDetails: true,
      showBookPrice: true,
      showDigital: "show",
    });

    return { settings };
  },
  {
    persist: true,
  }
);
