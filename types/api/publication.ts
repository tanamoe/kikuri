import type { BaseAPIFields } from "@/types/api";
import type { PublicationsRecord, RecordIdString } from "@/types/pb";
import type { BaseBookResponse } from "@/types/api/book";
import type { BaseReleaseResponse } from "@/types/api/release";

export type BasePublicationRecord<T> = T &
  Omit<PublicationsRecord, "defaultBook" | "release"> & {
    defaultBookId: RecordIdString;
    releaseId: RecordIdString;
  };

export type BasePublicationResponse = Required<
  BasePublicationRecord<BaseAPIFields>
> & {
  defaultBook?: BaseBookResponse;
  release?: BaseReleaseResponse;
};
