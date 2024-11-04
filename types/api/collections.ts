/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  BaseAPIFields,
  BaseAPISingleResult,
  BaseAPIListResult,
} from "@/types/api";
import type {
  CollectionsRecord,
  CollectionsResponse as PBCollectionsResponse,
  CollectionBooksResponse as PBCollectionBooksResponse,
  CollectionMembersResponse as PBCollectionMembersResponse,
  UsersRecord,
  CollectionMembersRoleOptions,
  CollectionBooksStatusOptions,
  CollectionsVisibilityOptions,
  UsersResponse,
} from "@/types/pb";
import type { BaseBookRecord, BaseBookResponse } from "@/types/api/book";

/**
 * Collection items returned from `/api/user-collections/:userId`
 *
 * Slightly modified (and similar to) PocketBase {@link PBCollectionsResponse|CollectionsResponse} schema
 *
 * `collectionId` here is explicitly "Tana.moe user's books collection", not "PocketBase collections"
 *
 * @see {@link UserCollectionsResponse}
 */
export type CollectionResponse = {
  ownerId: string;
  visibility: CollectionsVisibilityOptions;
  name: string;
  default: boolean;
  description: string;
  order: number;
  owner?: {
    email: string;
    emailVisibility: boolean;
    username: string;
    verified: boolean;
  } & UsersRecord &
    BaseAPIFields;
};

/**
 * User collection returned from `/api/user-collection/:collectionId`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection.go}
 */
export type UserCollectionResponse = BaseAPISingleResult<CollectionResponse>;

/**
 * Book items returned from `/api/user-collection/:userId/books`
 *
 * Slightly modified (and similar to) PocketBase {@link PBCollectionBooksResponse|CollectionBooksResponse} schema
 *
 * `collectionId` here is explicitly "Tana.moe user's books collection", not "PocketBase collections"
 *
 * @see {@link UserCollectionBooksResponse}
 */
export type CollectionBookRecord<T> = T & {
  collectionId: string;
  bookId: string;
  quantity: number;
  status: CollectionBooksStatusOptions;
};

export type CollectionBookResponse = Required<
  CollectionBookRecord<BaseAPIFields>
> & {
  collection?: Required<CollectionsRecord & BaseAPIFields>;
  book?: BaseBookResponse;
};

/**
 * User collection books returned from `/api/user-collection/:userId/books`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection_book.go}
 */
export type UserCollectionBooksResponse =
  BaseAPIListResult<CollectionBookResponse>;

/**
 * User collection book returned from <b>editing</b> `/api/user-collection/:userId/books`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection_book.go}
 */
export type UserCollectionBookResponse =
  BaseAPISingleResult<CollectionBookResponse>;

/**
 * Members items returned from `/api/user-collection/:userId/members` and `/api/user-collections/:userId`
 *
 * Slightly modified (and similar to) PocketBase {@link PBCollectionMembersResponse|CollectionMembersResponse} schema
 *
 * `collectionId` here is explicitly "Tana.moe user's books collection", not "PocketBase collections"
 *
 * @see {@link UserCollectionMembersResponse}
 */
export type CollectionMemberResponse = {
  collectionId: string;
  userId: string;
  collection?: CollectionsRecord & BaseAPIFields;
  user?: UsersResponse;
  role: CollectionMembersRoleOptions;
};

/**
 * User collection members returned from `/api/user-collection/:userId/members`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection_member.go}
 */
export type UserCollectionMembersResponse =
  BaseAPIListResult<CollectionMemberResponse>;

/**
 * User collections returned from `/api/user-collections/:userId`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection_member.go}
 */
export type UserCollectionsResponse =
  BaseAPIListResult<CollectionMemberResponse>;
