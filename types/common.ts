import type {
  BookDetailsResponse,
  PublicationsResponse,
  ReleasesResponse,
  TitleCoversResponse,
} from "@/types/pb";

export type MetadataImages = {
  "160w": string;
  "320w": string;
  "480w": string;
  "640w": string;
  "1280w": string;
  "1920w": string;
};

export type MetadataCommon = {
  images: MetadataImages | MetadataImages[];
};

export type BookDetailsCommon = BookDetailsResponse<
  MetadataCommon,
  string,
  {
    publication: Pick<PublicationsResponse, "volume" | "name" | "digital">;
    release: Pick<
      ReleasesResponse<{
        title: Pick<ReleasesResponse, "name">;
      }>,
      "expand" | "title"
    >;
  }
>;

export type TitleCoversCommon = TitleCoversResponse<
  string[],
  MetadataCommon,
  string,
  string,
  number
>;
