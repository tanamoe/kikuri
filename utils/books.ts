import {
  Collections,
  type BookDetailedResponse,
  type TitleResponse,
} from "@/types/pb";

/**
 * @param count
 */
export const getRecentBooks = async (count: number) => {
  const { $pb } = useNuxtApp();
  const data = await $pb.collection(Collections.BookDetailed).getList<
    BookDetailedResponse<{
      title: TitleResponse;
    }>
  >(1, count, {
    sort: "-created",
    expand: "title",
  });

  return structuredClone(data).items.map((book) => ({
    ...book,
    volume: parseVolume(book.volume),
  }));
};

/**
 * @param id release ID
 */
export const getBooks = async (id: string) => {
  const { $pb } = useNuxtApp();

  const data = await $pb
    .collection(Collections.BookDetailed)
    .getFullList<BookDetailedResponse>({
      filter: `release='${id}'`,
    });

  return structuredClone(data).map((release) => ({
    ...release,
    volume: parseVolume(release.volume),
  }));
};
