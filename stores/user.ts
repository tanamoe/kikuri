import { defineStore } from "pinia";
import { Admin, Record } from "pocketbase";

export const useUserStore = defineStore("user", () => {
  const { $pb } = useNuxtApp();

  const currentUser = ref<Record | Admin | null>(null);

  $pb.authStore.onChange(() => (currentUser.value = $pb.authStore.model));

  const fetchUser = () => {
    if (currentUser.value === null && $pb.authStore.model !== null) {
      currentUser.value = $pb.authStore.model;
    }
  };

  fetchUser();

  const isAuthenticated = computed(() => {
    return currentUser.value instanceof Record;
  });

  return { isAuthenticated, fetchUser };
});
