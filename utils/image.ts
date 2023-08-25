import { joinURL } from "ufo";
import { FileQueryParams } from "pocketbase";
import type { BaseSystemFields } from "@/types/pb";

export function getPocketbaseImageURL(
  record: Pick<BaseSystemFields, "id" | "collectionId" | "collectionName">,
  fileName: string,
  options?: FileQueryParams,
) {
  const runtimeConfig = useRuntimeConfig();

  if (options) {
    const searchParams = new URLSearchParams(options);

    return joinURL(
      runtimeConfig.public.pocketbaseUrl,
      "/api/files",
      record.collectionId,
      record.id,
      fileName,
      "?" + searchParams.toString(),
    );
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
