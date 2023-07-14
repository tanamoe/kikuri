import { defineStore } from "pinia";
import { Record, Admin } from "pocketbase";

export const useUserStore = defineStore("user", () => {
  const { $pb } = useNuxtApp();

  const currentUser = ref<Record | Admin | null>(
    structuredClone($pb.authStore.model)
  );

  $pb.authStore.onChange(
    () => (currentUser.value = structuredClone($pb.authStore.model))
  );

  const isAuthenticated = computed(() => {
    return currentUser.value !== null;
  });

  return { isAuthenticated, currentUser };
});
