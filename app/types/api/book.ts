import type { BaseAPIFields } from "@/types/api";
import type { AssetsRecord, BooksRecord, RecordIdString } from "@/types/pb";
import type { BasePublicationResponse } from "@/types/api/publication";
import type { MetadataImages } from "@/types/common";

export type BaseBookRecord<T> = T &
  Omit<BooksRecord, "publication" | "defaultAsset"> & {
    publicationId: RecordIdString;
  };

export type BaseBookResponse = Required<BaseBookRecord<BaseAPIFields>> & {
  publication?: BasePublicationResponse;
  defaultAsset?: Required<AssetsRecord<MetadataImages>>;
};
