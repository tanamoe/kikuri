import type { ListResult } from "pocketbase";
import type { BaseSystemFields } from "@/types/pb";

export type BaseAPIFields = Omit<
  BaseSystemFields,
  "collectionId" | "collectionName" | "expand"
>;

export type BaseAPIResponse = {
  success: boolean;
  message?: string;
};

export type BaseAPIListResult<T> = BaseAPIResponse &
  ListResult<T & BaseAPIFields>;

export type BaseAPISingleResult<T> = BaseAPIResponse & {
  item: T & BaseAPIFields;
};
