import {
  Collections,
  type BookDetailedResponse,
  type TitleResponse,
} from "@/types/pb";
import { parseVolume } from "@/utils/parseVolume";

export const useRecentBooks = (count: number) => {
  const { $pb } = useNuxtApp();

  return useAsyncData(
    () =>
      $pb.collection(Collections.BookDetailed).getList<
        BookDetailedResponse<{
          title: TitleResponse;
        }>
      >(1, count, {
        sort: "-created",
        expand: "title",
      }),
    {
      transform: (books) =>
        structuredClone(books).items.map((book) => ({
          ...book,
          volume: parseVolume(book.volume),
        })),
    }
  );
};

export const useAsyncBookDetailed = () => {
  const { $pb } = useNuxtApp();

  return useAsyncState(
    async (releaseId: string) =>
      (
        await $pb
          .collection(Collections.BookDetailed)
          .getFullList<BookDetailedResponse>({
            filter: `release='${releaseId}'`,
          })
      ).map((release) => ({
        ...release,
        volume: parseVolume(release.volume),
      })),
    null,
    { immediate: false }
  );
};
