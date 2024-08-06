import type { CollectionResponse } from "@/types/api/collections";
import type {
  AssetsResponse,
  BookDetailsResponse,
  BooksResponse,
  PublicationsResponse,
  PublishersResponse,
  ReleasesResponse,
  TitleCoversResponse,
  TitlesResponse,
} from "@/types/pb";
import type { BaseAPIFields } from "@/types/api";

export type MetadataImages = {
  "160w": string;
  "320w": string;
  "480w": string;
  "640w": string;
  "1280w": string;
  "1920w": string;
};

export type MetadataLibrary = {
  inCollections?: (CollectionResponse & BaseAPIFields)[];
};

export type MetadataCommon = {
  images?: MetadataImages | MetadataImages[];
};

export type BooksCommon = BooksResponse<
  MetadataLibrary,
  {
    publication: PublicationsResponse<
      unknown,
      {
        release: ReleasesResponse<{
          publisher: PublishersResponse;
          partner?: PublishersResponse;
          title: TitlesResponse;
        }>;
        defaultBook?: BooksResponse<
          unknown,
          {
            assets_via_book?: AssetsResponse<MetadataImages>[];
          }
        >;
      }
    >;
    assets_via_book?: AssetsResponse<MetadataImages>[];
  }
>;

export type BookDetailsCommon = BookDetailsResponse<
  MetadataCommon & MetadataLibrary,
  string,
  {
    publication?: PublicationsResponse;
    release?: ReleasesResponse<{
      title: TitlesResponse;
    }>;
  }
>;

export type TitleCoversCommon = TitleCoversResponse<
  string[],
  MetadataCommon,
  string,
  string,
  number
>;
