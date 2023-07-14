import { ClientResponseError, Record } from "pocketbase";

export const useAccount = () => {
  const { $pb } = useNuxtApp();
  const pending = ref(false);

  const updateAccount = async (id: string, record: Partial<Record>) => {
    pending.value = true;
    const data = ref<Record | null>(null);
    const error = ref<ClientResponseError | null>(null);

    try {
      data.value = await $pb.collection("users").update(id, record);
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
