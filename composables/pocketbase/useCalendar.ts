import { GroupArray } from "@/utils/groupByDate";
import type { FilterDigital } from "@/types/calendarFilter";

export const useCalendar = (
  from: string | Ref<string>,
  to: string | Ref<string>,
  publishers?: string[] | Ref<string[]>,
  digital?: FilterDigital | Ref<FilterDigital>
) => {
  const { $pb } = useNuxtApp();

  const pending = ref(false);
  const data = ref<Partial<GroupArray>[]>();
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
      const res = await $pb.collection("release_calendar").getFullList({
        filter: filter.join(" && "),
        sort: "+publish_date",
        expand: "title, publisher",
      });

      data.value = groupByDate(
        structuredClone(res).map((release) => ({
          ...release,
          cover: release.base_cover ? release.cover : null,
          volume: release.volume / 10000 + (release.volume % 10),
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
