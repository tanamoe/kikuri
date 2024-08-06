import type { BaseAPIFields } from "@/types/api";
import type {
  ReleasesRecord,
  RecordIdString,
  PublishersRecord,
} from "@/types/pb";
import type { BaseTitleRecord } from "@/types/api/title";

export type BaseReleaseRecord<T> = T &
  Omit<ReleasesRecord, "partner" | "publisher" | "title"> & {
    partnerId?: RecordIdString;
    partner?: PublishersRecord & T;
    publisherId: RecordIdString;
    publisher?: PublishersRecord & T;
    titleId: RecordIdString;
    title?: BaseTitleRecord<T>;
  };

export type BaseReleaseResponse = BaseReleaseRecord<BaseAPIFields>;
