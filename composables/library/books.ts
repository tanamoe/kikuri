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

export type LibraryBookDeleteResponse = [boolean, ClientResponseError | null];

/**
 * Composable for update and remove books from a library collection.
 *
 * @author Nguyen Do <khoanguyen.do@outlook.com>
 */
export function useCollectionBooks() {
  const { $pb } = useNuxtApp();

  const pending = useState(() => false);
  const progress = useState(() => 0);

  /**
   * Add or update books from collection
   */
  async function update(
    collectionId: string,
    books: LibraryBookArgument[],
  ): Promise<[UserCollectionBookResponse[], ClientResponseError[]]>;
  async function update(
    collectionId: string,
    books: LibraryBookArgument,
  ): Promise<[UserCollectionBookResponse, null] | [null, ClientResponseError]>;
  async function update(
    collectionId: string,
    books: LibraryBookArgument | LibraryBookArgument[],
  ) {
    pending.value = true;
    progress.value = 0;

    // handle multiple books
    if (Array.isArray(books)) {
      const responses: UserCollectionBookResponse[] = [];
      const errors: ClientResponseError[] = [];

      for (const book of books) {
        try {
          const res = await $pb.send<UserCollectionBookResponse>(
            joinURL("/api/user-collection", collectionId, "/books"),
            {
              method: "POST",
              body: book,
              expand: "book,collection,book.publication",
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
        } finally {
          progress.value++;
        }
      }

      progress.value = 0;
      pending.value = false;

      return [responses, errors];
    }

    try {
      const res = await $pb.send<UserCollectionBookResponse>(
        joinURL("/api/user-collection", collectionId, "/books"),
        {
          method: "POST",
          body: books,
          expand: "book,collection,book.publication",
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

  return { pending, progress, update, remove };
}
