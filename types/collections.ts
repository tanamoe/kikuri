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
  BooksRecord,
  CollectionBooksStatusOptions,
} from "@/types/pb";

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
  collectionId: string;
  userId: string;
  collection?: CollectionsRecord & BaseAPIFields;
  user?: UsersRecord & BaseAPIFields;
  role: CollectionMembersRoleOptions;
};

/**
 * User collections returned from `/api/user-collections/:userId`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection_member.go}
 */
export type UserCollectionsResponse = BaseAPIListResult<CollectionResponse>;

/**
 * User collection returned from `/api/user-collection/:collectionId`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection.go}
 */
export type UserCollectionResponse = BaseAPISingleResult<
  CollectionsRecord & BaseAPIFields
>;

/**
 * Book items returned from `/api/user-collection/:userId/books`
 *
 * Slightly modified (and similar to) PocketBase {@link PBCollectionBooksResponse|CollectionBooksResponse} schema
 *
 * `collectionId` here is explicitly "Tana.moe user's books collection", not "PocketBase collections"
 *
 * @see {@link UserCollectionBooksResponse}
 */
export type CollectionBooksResponse = {
  collectionId: string;
  bookId: string;
  collection?: CollectionsRecord & BaseAPIFields;
  book?: BooksRecord & BaseAPIFields;
  quantity: number;
  status: CollectionBooksStatusOptions;
};

/**
 * User collection books returned from `/api/user-collection/:userId/books`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection_book.go}
 */
export type UserCollectionBooksResponse =
  BaseAPIListResult<CollectionBooksResponse>;

/**
 * Members items returned from `/api/user-collection/:userId/members`
 *
 * Slightly modified (and similar to) PocketBase {@link PBCollectionMembersResponse|CollectionMembersResponse} schema
 *
 * `collectionId` here is explicitly "Tana.moe user's books collection", not "PocketBase collections"
 *
 * @see {@link UserCollectionMembersResponse}
 */
export type CollectionMembersResponse = {
  collectionId: string;
  userId: string;
  collection?: CollectionsRecord & BaseAPIFields;
  user?: UsersRecord & BaseAPIFields;
  role: CollectionMembersRoleOptions;
};

/**
 * User collection members returned from `/api/user-collection/:userId/members`
 *
 * @see {@link https://github.com/tanamoe/momoka-lite/blob/master/models/collection_member.go}
 */
export type UserCollectionMembersResponse =
  BaseAPIListResult<CollectionMembersResponse>;
