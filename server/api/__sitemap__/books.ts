import PocketBase from "pocketbase";
import {
  Collections,
  type BooksResponse,
  type PublicationsResponse,
  type ReleasesResponse,
  type TitlesResponse,
  type TypedPocketBase,
} from "@/types/pb";
import { joinURL } from "ufo";

export default defineSitemapEventHandler(async () => {
  const { pocketbaseUrl } = useRuntimeConfig().public;
  const pb = new PocketBase(pocketbaseUrl) as TypedPocketBase;

  const books = await pb.collection(Collections.Books).getFullList<
    BooksResponse<
      unknown,
      {
        publication: PublicationsResponse<
          unknown,
          { release: ReleasesResponse<{ title: TitlesResponse }> }
        >;
      }
    >
  >({
    expand: "publication.release.title",
    fields:
      "id, updated, expand.publication.expand.release.id, expand.publication.expand.release.expand.title.slug",
  });

  return [
    ...books.map((book) =>
      asSitemapUrl({
        loc: joinURL(
          "title",
          book.expand!.publication.expand!.release.expand!.title.slug,
          book.expand!.publication.expand!.release.id,
          book.id,
        ),
        lastmod: new Date(book.updated),
      }),
    ),
  ];
});
