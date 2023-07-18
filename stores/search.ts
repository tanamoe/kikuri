import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", () => {
  const isActive = ref(false);

  function open() {
    isActive.value = true;
  }

  function close() {
    isActive.value = false;
  }

  return { isActive, open, close };
});
