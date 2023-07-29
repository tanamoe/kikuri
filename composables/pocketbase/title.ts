import {
  Collections,
  FormatResponse,
  PublisherResponse,
  ReleaseResponse,
  TitleResponse,
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

  const releases = await $pb.collection(Collections.Release).getFullList<
    ReleaseResponse<{
      publisher: PublisherResponse;
    }>
  >({
    filter: `title='${id}'`,
    expand: "publisher",
  });

  return { title, releases };
};
