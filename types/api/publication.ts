import type { BaseAPIFields } from "@/types/api";
import type { PublicationsRecord, RecordIdString } from "@/types/pb";
import type { BaseBookRecord } from "@/types/api/book";
import type { BaseReleaseRecord } from "@/types/api/release";

export type BasePublicationRecord<T> = T &
  Omit<PublicationsRecord, "defaultBook" | "release"> & {
    defaultBookId: RecordIdString;
    defaultBook?: BaseBookRecord<T>;
    releaseId: RecordIdString;
    release?: BaseReleaseRecord<T>;
  };

export type BasePublicationResponse = BasePublicationRecord<BaseAPIFields>;
