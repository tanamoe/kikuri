import dayjs from "dayjs";
import { GroupArray } from "@/utils/groupByDate";
import type { FilterDigital } from "@/types/calendarFilter";
import {
  Collections,
  type PublisherResponse,
  type BookDetailedResponse,
  type TitleResponse,
} from "@/types/pb";
import { parseVolume } from "@/utils/parseVolume";

export const useCalendar = (
  from: string | Ref<string>,
  to: string | Ref<string>,
  publishers?: string[] | Ref<string[]>,
  digital?: FilterDigital | Ref<FilterDigital>
) => {
  const { $pb } = useNuxtApp();

  const pending = ref(false);
  const data = ref<
    GroupArray<
      BookDetailedResponse<{
        title: TitleResponse;
        publisher: PublisherResponse;
      }>
    >[]
  >();
  const error = ref();

  watchEffect(async () => {
    const filter = [
      `publishDate >= '${unref(from)}'`,
      `publishDate <= '${unref(to)}'`,
    ];

    if (publishers && unref(publishers).length > 0) {
      const p = [
        ...unref(publishers).map(
          (publisher) => `publisher.id = '${publisher}'`
        ),
      ].join(" || ");

      filter.push("(" + p + ")");
    }

    if (unref(digital) === "hide") filter.push("digital = false");
    if (unref(digital) === "only") filter.push("digital = true");

    pending.value = true;

    try {
      const res = await $pb.collection(Collections.BookDetailed).getFullList<
        BookDetailedResponse<{
          title: TitleResponse;
          publisher: PublisherResponse;
        }>
      >({
        filter: filter.join(" && "),
        sort: "+publishDate",
        expand: "title, publisher",
      });

      data.value = groupByDate(
        structuredClone(res).map((release) => ({
          ...release,
          volume: parseVolume(release.volume),
          date: release.publishDate,
        }))
      );
    } catch (err) {
      error.value = err;
    }

    pending.value = false;
  });

  return { pending, data, error };
};

export const useRecentReleases = () => {
  const { $pb } = useNuxtApp();
  const now = dayjs();

  return useAsyncData(
    () =>
      $pb.collection(Collections.BookDetailed).getFullList<
        BookDetailedResponse<{
          publisher: PublisherResponse;
        }>
      >({
        sort: "+publishDate",
        filter: `publishDate >= '${now.toISOString()}' && publishDate <= '${now
          .add(2, "days")
          .toISOString()}'`,
        expand: "publisher",
      }),
    {
      transform: (data) =>
        structuredClone(data).map((book) => ({
          ...book,
          volume: Math.floor(book.volume / 10000) + (book.volume % 10) * 0.1,
        })),
    }
  );
};
