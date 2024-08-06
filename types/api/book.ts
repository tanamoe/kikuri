import type { BaseAPIFields } from "@/types/api";
import type { AssetsRecord, BooksRecord, RecordIdString } from "@/types/pb";
import type { BasePublicationRecord } from "@/types/api/publication";
import type { MetadataImages } from "@/types/common";

export type BaseBookRecord<T> = T &
  Omit<BooksRecord, "publication"> & {
    publicationId: RecordIdString;
    publication?: BasePublicationRecord<T>;
    defaultAsset?: AssetsRecord<MetadataImages>;
  };

export type BaseBookResponse = BaseBookRecord<BaseAPIFields>;
