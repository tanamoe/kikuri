import type { ListResult } from "pocketbase";
import type { BaseSystemFields } from "@/types/pb";

export type BaseAPIFields = Omit<
  BaseSystemFields,
  "collectionId" | "collectionName" | "expand"
>;

export type BaseAPIListResult<T> = {
  success: boolean;
} & ListResult<T & BaseAPIFields>;

export type BaseAPISingleResult<T> = {
  success: boolean;
  item: T;
};
