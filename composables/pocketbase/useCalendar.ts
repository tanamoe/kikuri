import { GroupArray } from "@/utils/groupByDate";
import type { FilterDigital } from "@/types/calendarFilter";
import {
  Collections,
  PublisherResponse,
  ReleaseCalendarResponse,
  TitleResponse,
} from "@/types/pb";

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
      ReleaseCalendarResponse<{
        title: TitleResponse;
        publisher: PublisherResponse;
      }>
    >[]
  >();
  const error = ref();

  watchEffect(async () => {
    const filter = [
      `publish_date >= '${unref(from)}'`,
      `publish_date <= '${unref(to)}'`,
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
      const res = await $pb.collection(Collections.ReleaseCalendar).getFullList<
        ReleaseCalendarResponse<{
          title: TitleResponse;
          publisher: PublisherResponse;
        }>
      >({
        filter: filter.join(" && "),
        sort: "+publish_date",
        expand: "title, publisher",
      });

      data.value = groupByDate(
        structuredClone(res).map((release) => ({
          ...release,
          cover: release.base_cover ? release.cover : null,
          volume:
            Math.floor(release.volume / 10000) + (release.volume % 10) * 0.1,
          date: release.publish_date,
        }))
      );
    } catch (err) {
      error.value = err;
    }

    pending.value = false;
  });

  return { pending, data, error };
};
