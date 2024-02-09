import type { BaseAPIFields } from "@/types/api";
import type {
  TitlesRecord,
  FormatsRecord,
  DemographicsRecord,
  GenresRecord,
} from "@/types/pb";

export type BaseTitleRecord = Omit<
  TitlesRecord,
  "format" | "demographic" | "genres"
> & {
  formatId: string;
  format?: FormatsRecord & BaseAPIFields;
  demographicId: string;
  demographic?: DemographicsRecord & BaseAPIFields;
  genreIds: string[];
  genres?: (GenresRecord & BaseAPIFields)[];
};

export type BaseTitleResponse = BaseTitleRecord & BaseAPIFields;
