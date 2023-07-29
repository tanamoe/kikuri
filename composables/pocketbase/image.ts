import { joinURL } from "ufo";
import type { BaseSystemFields } from "@/types/pb";

export const usePocketbaseImage = (
  record: Pick<BaseSystemFields, "id" | "collectionId">,
  src: string
) => {
  const runtimeConfig = useRuntimeConfig();

  const baseUrl = runtimeConfig.public.image_endpoint;

  return joinURL(baseUrl, record.collectionId, record.id, src);
};
