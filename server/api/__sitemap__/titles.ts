import PocketBase from "pocketbase";
import { Collections, type TypedPocketBase } from "@/types/pb";
import { joinURL } from "ufo";

export default defineSitemapEventHandler(async () => {
  const { pocketbaseUrl } = useRuntimeConfig().public;
  const pb = new PocketBase(pocketbaseUrl) as TypedPocketBase;

  const titles = await pb.collection(Collections.Titles).getFullList({
    fields: "slug, updated",
  });

  return [
    ...titles.map((title) =>
      asSitemapUrl({
        loc: joinURL("title", title.slug),
        lastmod: new Date(title.updated),
      }),
    ),
  ];
});
