import {
  type BaseSystemFields,
  type BookDetailedResponse,
  Collections,
  type FormatResponse,
  type PublisherResponse,
  type ReleaseResponse,
  type TitleResponse,
} from "@/types/pb";

export const useTitle = async (id: string) => {
  const { $pb } = useNuxtApp();

  const title = await $pb.collection(Collections.Title).getOne<
    TitleResponse<{
      format: FormatResponse;
    }>
  >(id, {
    expand: "format",
  });

  return title;
};

export const useTitleReleases = async (id: string) => {
  const { $pb } = useNuxtApp();

  const releases = await $pb.collection(Collections.Release).getFullList<
    ReleaseResponse<{
      publisher: PublisherResponse;
    }>
  >({
    filter: `title='${id}'`,
    expand: "publisher",
  });

  return releases;
};

export const useTitleCoverImages = async (id: string) => {
  const { $pb } = useNuxtApp();
  const releases: (Pick<BaseSystemFields, "id" | "collectionId"> & {
    cover: string[];
  })[] = [];

  const res = await $pb
    .collection(Collections.BookDetailed)
    .getFullList<
      Pick<
        BookDetailedResponse,
        "id" | "collectionId" | "edition" | "cover" | "baseCover"
      >
    >({
      filter: `title='${id}'`,
      fields: "id,collectionId,edition,cover,baseCover",
    });

  res.forEach(({ id, collectionId, edition, cover, baseCover }) => {
    const parsedCover = [];

    if (edition !== "" && cover.length > 0) parsedCover.push(...cover);
    else if (edition === "" && baseCover.length > 0)
      parsedCover.push(...baseCover);
    else return;

    releases.push({
      id,
      collectionId,
      cover: parsedCover,
    });
  });

  return releases;
};
