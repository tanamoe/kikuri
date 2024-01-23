import { ClientResponseError } from "pocketbase";
import { joinURL } from "ufo";
import type { BaseAPIResponse } from "@/types/api";
import type {
  CollectionBookResponse,
  UserCollectionBookResponse,
} from "@/types/collections";

export type LibraryBookArgument = Pick<
  CollectionBookResponse,
  "bookId" | "quantity" | "status"
>;

export type LibraryBookUpdateResponse =
  | [UserCollectionBookResponse, null]
  | [null, ClientResponseError]
  | [UserCollectionBookResponse[], ClientResponseError[]];

export type LibraryBookDeleteResponse = [boolean, ClientResponseError | null];

/**
 * Composable for update and remove books from a library collection.
 *
 * @author Nguyen Do <khoanguyen.do@outlook.com>
 */
export function useLibraryBooks() {
  const { $pb } = useNuxtApp();

  const pending = useState(() => false);

  /**
   * Add or update books from collection
   */
  async function update(
    collectionId: string,
    args: LibraryBookArgument | LibraryBookArgument[],
  ): Promise<LibraryBookUpdateResponse> {
    pending.value = true;

    if (!Array.isArray(args)) {
      try {
        const res = await $pb.send<UserCollectionBookResponse>(
          joinURL("/api/user-collection", collectionId, "/books"),
          {
            method: "POST",
            body: args,
          },
        );

        if (res.success === false) {
          throw new ClientResponseError({
            message: res.message || "Something went wrong",
          });
        }

        return [res, null];
      } catch (error) {
        return [null, new ClientResponseError(error)];
      } finally {
        pending.value = false;
      }
    }

    const responses: UserCollectionBookResponse[] = [];
    const errors: ClientResponseError[] = [];

    for (const book of args) {
      try {
        const res = await $pb.send<UserCollectionBookResponse>(
          joinURL("/api/user-collection", collectionId, "/books"),
          {
            method: "POST",
            body: book,
          },
        );

        if (res.success === false) {
          throw new ClientResponseError({
            message: res.message || "Something went wrong",
          });
        }

        responses.push(res);
      } catch (error) {
        errors.push(new ClientResponseError(error));
      }
    }

    return [responses, errors];
  }

  /**
   * Remove a single book from collection
   */
  async function remove(
    collectionId: string,
    bookId: string,
  ): Promise<LibraryBookDeleteResponse> {
    pending.value = true;

    try {
      const res = await $pb.send<BaseAPIResponse>(
        joinURL("/api/user-collection", collectionId, "/books", bookId),
        {
          method: "DELETE",
        },
      );

      if (res.success === false) {
        throw new ClientResponseError({
          message: res.message ?? "Something went wrong",
        });
      }

      return [true, null];
    } catch (error) {
      return [false, new ClientResponseError(error)];
    } finally {
      pending.value = false;
    }
  }

  return { pending, update, remove };
}
