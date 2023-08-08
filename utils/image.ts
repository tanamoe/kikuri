import { joinURL } from "ufo";
import type { BaseSystemFields } from "@/types/pb";

export const getPockerBaseImagePath = (
  record: Pick<BaseSystemFields, "id" | "collectionId">,
  fileName: string
) => {
  return joinURL(record.collectionId, record.id, fileName);
};
