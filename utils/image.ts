import { joinURL } from "ufo";
import { FileOptions } from "pocketbase";
import type { BaseSystemFields } from "@/types/pb";

export function getPocketbaseImageURL(
  record: Pick<BaseSystemFields, "id" | "collectionId" | "collectionName">,
  fileName: string,
  options?: FileOptions,
) {
  const { $pb } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  if (options) {
    return $pb.files.getUrl(record, fileName, options);
  }

  return joinURL(
    runtimeConfig.public.pocketbaseUrl,
    "/api/files",
    record.collectionId,
    record.id,
    fileName,
  );
}

export function getPocketBaseImagePath(
  record: Pick<BaseSystemFields, "id" | "collectionId">,
  fileName: string,
) {
  return joinURL(record.collectionId, record.id, fileName);
}
