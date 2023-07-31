import { defineStore } from "pinia";
import { Record } from "pocketbase";
import { Collections, type UsersResponse } from "@/types/pb";

export const useUserStore = defineStore(
  "user",
  () => {
    const { $pb } = useNuxtApp();

    const currentUser = ref<UsersResponse | null>(null);

    const isAuthenticated = computed(() => currentUser.value !== null);

    async function updateCurrentUser() {
      if ($pb.authStore.model instanceof Record) {
        const data = await $pb
          .collection(Collections.Users)
          .getOne<UsersResponse>($pb.authStore.model.id);

        currentUser.value = structuredClone(data);
      } else currentUser.value = null;
    }

    return { isAuthenticated, currentUser, updateCurrentUser };
  },
  {
    persist: true,
  }
);
