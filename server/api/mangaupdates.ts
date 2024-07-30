import { ratio } from "fuzzball";
import type { components } from "@/types/mangaupdates";

export default defineEventHandler(async (event) => {
  const { name } = getQuery(event);

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing `name` query",
    });
  }

  const { results } = await $fetch<
    components["schemas"]["SeriesSearchResponseV1"]
  >("https://api.mangaupdates.com/v1/series/search", {
    method: "POST",
    body: {
      search: name,
      stype: "title",
    },
  });

  const series = results?.[0];
  const seriesId = series?.record?.series_id;
  const hitTitle = series?.hit_title;

  if (!series?.record || !seriesId || !hitTitle) {
    throw createError({ statusCode: 400, statusMessage: "Series not found" });
  }

  if (ratio(hitTitle, name.toString()) < 75) {
    throw createError({
      statusCode: 400,
      statusMessage: "Series not exact match",
    });
  }

  const data = await $fetch<components["schemas"]["SeriesModelV1"]>(
    seriesId.toString(),
    {
      baseURL: "https://api.mangaupdates.com/v1/series",
    },
  );

  return data;
});
