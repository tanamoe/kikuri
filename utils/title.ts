import {
  type BaseSystemFields,
  type BookDetailedResponse,
  Collections,
} from "@/types/pb";

export async function getTitleCoverImages(id: string) {
  const { $pb } = useNuxtApp();

  const images: (Pick<BaseSystemFields, "id" | "collectionId"> & {
    cover: string[];
  })[] = [];

  const data = await $pb
    .collection(Collections.BookDetailed)
    .getFullList<
      Pick<
        BookDetailedResponse,
        "id" | "collectionId" | "edition" | "cover" | "baseCover"
      >
    >({
      filter: `title='${id}'`,
      fields: "id,collectionId,edition,cover,baseCover",
      sort: "+edition,+volume",
    });

  data.forEach(({ id, collectionId, edition, cover, baseCover }) => {
    const parsedCover = [];

    if (edition !== "" && cover.length > 0) parsedCover.push(...cover);
    else if (edition === "" && baseCover.length > 0)
      parsedCover.push(...baseCover);
    else return;

    images.push({
      id,
      collectionId,
      cover: parsedCover,
    });
  });

  return images;
}
