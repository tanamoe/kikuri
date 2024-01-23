import type { CollectionsRecord } from "@/types/pb";
import type { UserCollectionResponse } from "@/types/collections";
import { ClientResponseError } from "pocketbase";
import { joinURL } from "ufo";

export type LibraryCollectionUpdateResponse =
  | [UserCollectionResponse, null]
  | [null, ClientResponseError];

export type LibraryCollectionDeleteResponse = [
  boolean,
  ClientResponseError | null,
];

/**
 * Composable for update and remove collection from user library.
 *
 * @author Nguyen Do <khoanguyen.do@outlook.com>
 */
export function useLibraryCollections() {
  const { $pb } = useNuxtApp();

  const pending = useState(() => false);

  /**
   * Create a new user collection
   */
  async function create(
    data: Partial<CollectionsRecord>,
  ): Promise<LibraryCollectionUpdateResponse> {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionResponse>(
        "/api/user-collection",
        {
          method: "POST",
          body: data,
        },
      );

      if (!res.success) {
        throw new ClientResponseError(res.message);
      }

      return [res, null];
    } catch (error) {
      return [null, new ClientResponseError(error)];
    } finally {
      pending.value = false;
    }
  }

  /**
   * Edit a user collection
   */
  async function edit(
    id: string,
    data: Partial<CollectionsRecord>,
  ): Promise<LibraryCollectionUpdateResponse> {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionResponse>(
        joinURL("/api/user-collection", id),
        {
          method: "POST",
          body: data,
        },
      );

      if (!res.success) {
        throw new ClientResponseError(res.message);
      }

      return [res, null];
    } catch (error) {
      return [null, new ClientResponseError(error)];
    } finally {
      pending.value = false;
    }
  }

  /**
   * Remove a user collection
   */
  async function remove(id: string) {
    pending.value = true;

    try {
      const res = await $pb.send<UserCollectionResponse>(
        joinURL("/api/user-collection", id),
        {
          method: "DELETE",
        },
      );

      if (!res.success) {
        throw new ClientResponseError(res.message);
      }

      return [res, null];
    } catch (error) {
      return [null, new ClientResponseError(error)];
    } finally {
      pending.value = false;
    }
  }

  return { pending, create, edit, remove };
}
