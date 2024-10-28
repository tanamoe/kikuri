import PocketBase from "pocketbase";
import {
  Collections,
  type ReleasesResponse,
  type TitlesResponse,
  type TypedPocketBase,
} from "@/types/pb";
import { joinURL } from "ufo";

export default defineSitemapEventHandler(async () => {
  const { pocketbaseUrl } = useRuntimeConfig().public;
  const pb = new PocketBase(pocketbaseUrl) as TypedPocketBase;

  const releases = await pb
    .collection(Collections.Releases)
    .getFullList<ReleasesResponse<{ title: TitlesResponse }>>({
      expand: "title",
      fields: "id, updated, expand.title.slug",
    });

  return [
    ...releases.map((release) =>
      asSitemapUrl({
        loc: joinURL("title", release.expand!.title.slug, release.id),
        lastmod: new Date(release.updated),
      }),
    ),
  ];
});
