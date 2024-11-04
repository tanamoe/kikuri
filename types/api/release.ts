import type { BaseAPIFields } from "@/types/api";
import type {
  ReleasesRecord,
  RecordIdString,
  PublishersRecord,
  AssetsResponse,
} from "@/types/pb";
import type { BaseTitleResponse } from "@/types/api/title";
import type { MetadataImages } from "@/types/common";

export type BaseReleaseRecord<T> = T &
  Omit<
    ReleasesRecord,
    "partner" | "publisher" | "title" | "front" | "logo" | "banner"
  > & {
    partnerId?: RecordIdString;
    publisherId: RecordIdString;
    titleId: RecordIdString;
    frontId: RecordIdString;
    logoId: RecordIdString;
    bannerId: RecordIdString;
  };

export type BaseReleaseResponse = Required<BaseReleaseRecord<BaseAPIFields>> & {
  partner?: Required<PublishersRecord & BaseAPIFields>;
  publisher?: Required<PublishersRecord & BaseAPIFields>;
  title?: BaseTitleResponse;
  front?: AssetsResponse<MetadataImages>;
  logo?: AssetsResponse<MetadataImages>;
  banner?: AssetsResponse<MetadataImages>;
};
