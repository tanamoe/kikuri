import { joinURL } from "ufo";
import type {
  UserCollectionsResponse,
  CollectionMemberResponse,
} from "@/types/collections";
import type { BaseAPIFields } from "@/types/api";

/**
 * Composable for getting current user library that include collections.
 *
 * @author Nguyen Do <khoanguyen.do@outlook.com>
 */
export function useLibrary() {
  const { $pb } = useNuxtApp();

  const collections = useState<(CollectionMemberResponse & BaseAPIFields)[]>(
    () => [],
  );

  /**
   * Method for update the library store with current user data
   */
  async function update() {
    if ($pb.authStore.model) {
      const res = await $pb.send<UserCollectionsResponse>(
        joinURL("/api/user-collections", $pb.authStore.model.id),
        {
          method: "GET",
          expand: "collection",
        },
      );

      if (res.success) {
        collections.value = res.items;
      } else {
        collections.value = [];
      }
    } else {
      collections.value = [];
    }
  }

  return { collections, update };
}
