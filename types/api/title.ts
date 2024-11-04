import type { BaseAPIFields } from "@/types/api";
import type {
  TitlesRecord,
  FormatsRecord,
  DemographicsRecord,
  GenresRecord,
  RecordIdString,
} from "@/types/pb";
import type { BaseReleaseResponse } from "./release";

export type BaseTitleRecord<T> = T &
  Omit<TitlesRecord, "format" | "demographic" | "genres" | "defaultRelease"> & {
    formatId: RecordIdString;
    demographicId: RecordIdString;
    genreIds: RecordIdString[];
    defaultReleaseId?: RecordIdString;
  };

export type BaseTitleResponse = Required<BaseTitleRecord<BaseAPIFields>> & {
  format?: Required<FormatsRecord & BaseAPIFields>;
  demographic?: Required<DemographicsRecord & BaseAPIFields>;
  genres?: (GenresRecord & BaseAPIFields)[];
  defaultRelease?: BaseReleaseResponse;
};
