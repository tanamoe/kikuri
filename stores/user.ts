import { defineStore } from "pinia";
import { Record } from "pocketbase";

export const useUserStore = defineStore("user", () => {
  const { $pb } = useNuxtApp();

  const currentUser = ref<Record | null>(
    structuredClone($pb.authStore.model as Record | null)
  );

  $pb.authStore.onChange(
    () =>
      (currentUser.value = structuredClone(
        $pb.authStore.model as Record | null
      ))
  );

  const isAuthenticated = computed(() => {
    return currentUser.value !== null;
  });

  return { isAuthenticated, currentUser };
});
