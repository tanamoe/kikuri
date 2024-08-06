import type { BaseAPIFields } from "@/types/api";
import type {
  TitlesRecord,
  FormatsRecord,
  DemographicsRecord,
  GenresRecord,
} from "@/types/pb";

export type BaseTitleRecord<T> = T &
  Omit<TitlesRecord, "format" | "demographic" | "genres"> & {
    formatId: string;
    format?: FormatsRecord & T;
    demographicId: string;
    demographic?: DemographicsRecord & T;
    genreIds: string[];
    genres?: (GenresRecord & T)[];
  };

export type BaseTitleResponse = BaseTitleRecord<BaseAPIFields>;
