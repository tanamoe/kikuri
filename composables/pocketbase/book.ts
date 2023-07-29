import {
  Collections,
  type BookDetailedResponse,
  type TitleResponse,
} from "@/types/pb";

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
          volume: Math.floor(book.volume / 10000) + (book.volume % 10) * 0.1,
        })),
    }
  );
};

export const useAsyncBookDetailed = () => {
  const { $pb } = useNuxtApp();

  return useAsyncState(
    async (releaseId: string) =>
      await $pb
        .collection(Collections.BookDetailed)
        .getFullList<BookDetailedResponse>({
          filter: `release='${releaseId}'`,
        }),
    null,
    { immediate: false }
  );
};
