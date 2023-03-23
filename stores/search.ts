import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", () => {
  const query = ref("");
  const isActive = ref(false);

  function open() {
    isActive.value = true;
  }

  function close() {
    isActive.value = false;
  }

  function changeQuery(value: string) {
    query.value = value;
  }

  return { query, isActive, open, close, changeQuery };
});
