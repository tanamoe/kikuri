import { joinURL } from "ufo";
import type { BaseSystemFields } from "@/types/pb";

export const usePocketbaseImage = (
  record: Pick<BaseSystemFields, "id" | "collectionId">,
  src: string
) => {
  return joinURL(record.collectionId, record.id, src);
};
