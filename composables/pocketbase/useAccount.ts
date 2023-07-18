import { ClientResponseError, Record } from "pocketbase";
import { Collections, UsersResponse } from "@/types/pb";

export const useAccount = () => {
  const { $pb } = useNuxtApp();
  const pending = ref(false);

  const updateAccount = async (id: string, record: Partial<Record>) => {
    pending.value = true;
    const data = ref<UsersResponse | null>(null);
    const error = ref<ClientResponseError | null>(null);

    try {
      data.value = await $pb
        .collection(Collections.Users)
        .update<UsersResponse>(id, record);
    } catch (err) {
      if (err instanceof ClientResponseError) {
        error.value = err;
      }
    }

    pending.value = false;
    return { data, error };
  };

  return { pending, updateAccount };
};
