import dayjs from "dayjs";
import {
  Collections,
  type BookDetailedResponse,
  type PublisherResponse,
  type TitleResponse,
  type ReleaseResponse,
} from "@/types/pb";

export type FilterDigital = "show" | "hide" | "only";

export type FilterPublishers = {
  id: string;
  label: string;
  [k: string]: any;
};

function groupBy<T>(arr: T[], fn: (item: T) => any) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}

export const getCalendarReleases = async (
  from: string,
  to: string,
  publishers?: string[],
  digital?: FilterDigital
) => {
  const { $pb } = useNuxtApp();

  const filter = [`publishDate >= '${from}'`, `publishDate <= '${to}'`];

  if (publishers && publishers.length > 0) {
    const p = [
      ...publishers.map((publisher) => `publisher.id = '${publisher}'`),
    ].join(" || ");

    filter.push("(" + p + ")");
  }

  if (digital === "hide") filter.push("digital = false");
  if (digital === "only") filter.push("digital = true");

  const data = await $pb.collection(Collections.BookDetailed).getFullList<
    BookDetailedResponse<{
      title: TitleResponse;
      publisher: PublisherResponse;
    }>
  >({
    filter: filter.join(" && "),
    sort: "+publishDate",
    expand: "title, publisher",
  });

  if (data.length === 0) return null;

  return groupBy<
    BookDetailedResponse<{
      title: TitleResponse;
      publisher: PublisherResponse;
    }>
  >(
    structuredClone(data).map((release) => ({
      ...release,
      volume: parseVolume(release.volume),
    })),
    (p) => p.publishDate
  );
};

export const getReleases = async (id: string) => {
  const { $pb } = useNuxtApp();

  const data = await $pb.collection(Collections.Release).getFullList<
    ReleaseResponse<{
      publisher: PublisherResponse;
    }>
  >({
    filter: `title='${id}'`,
    expand: "publisher",
  });

  return structuredClone(data);
};

export const getRecentReleases = async () => {
  const { $pb } = useNuxtApp();
  const now = dayjs();

  const data = await $pb.collection(Collections.BookDetailed).getFullList<
    BookDetailedResponse<{
      publisher: PublisherResponse;
    }>
  >({
    sort: "+publishDate",
    filter: `publishDate >= '${now.toISOString()}'
    && publishDate <= '${now.add(3, "days").toISOString()}'`,
    expand: "publisher",
  });

  return structuredClone(data).map((book) => ({
    ...book,
    volume: Math.floor(book.volume / 10000) + (book.volume % 10) * 0.1,
  }));
};
