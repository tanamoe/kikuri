import { joinURL } from "ufo";
import type {
  UserCollectionsResponse,
  CollectionMemberResponse,
} from "@/types/api/collections";
import type { BaseAPIFields } from "@/types/api";

/**
 * Composable for getting current user library that include collections.
 *
 * @author Nguyen Do <khoanguyen.do@outlook.com>
 */
export function useLibrary() {
  const { $pb } = useNuxtApp();
  const settingsStore = useSettingsStore();

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

      if (res.success && res.items.length > 0) {
        collections.value = res.items;
        settingsStore.library.defaultLibraryId = res.items[0]?.collectionId;
      } else {
        collections.value = [];
        settingsStore.library.defaultLibraryId = undefined;
      }
    } else {
      collections.value = [];
      settingsStore.library.defaultLibraryId = undefined;
    }
  }

  return { collections, update };
}
