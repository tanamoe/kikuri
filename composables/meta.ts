import {
  Collections,
  type FormatsResponse,
  type DemographicsResponse,
  type GenresResponse,
  type PublishersResponse,
} from "@/types/pb";
import { ClientResponseError } from "pocketbase";

export function useMeta() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const publishers = useState<PublishersResponse[]>(() => []);
  const demographics = useState<DemographicsResponse[]>(() => []);
  const formats = useState<FormatsResponse[]>(() => []);
  const genres = useState<GenresResponse[]>(() => []);

  async function update(state: globalThis.Ref, collection: Collections) {
    try {
      const data = await $pb.collection(collection).getFullList();
      if (data) {
        state.value = data;
      }
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        toast.add({ title: error.name, description: error.message });
      } else {
        console.error(error);
      }
    }
  }

  async function init() {
    await update(publishers, Collections.Publishers);
    await update(demographics, Collections.Demographics);
    await update(formats, Collections.Formats);
    await update(genres, Collections.Genres);
  }

  return {
    publishers,
    demographics,
    formats,
    genres,
    update,
    init,
  };
}
