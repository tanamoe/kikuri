/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
  AdditionalTitleNames = "additionalTitleNames",
  AssetTypes = "assetTypes",
  Assets = "assets",
  BookDetails = "bookDetails",
  BookMetadata = "bookMetadata",
  Books = "books",
  BooksComplete = "booksComplete",
  CollectionBooks = "collectionBooks",
  CollectionMembers = "collectionMembers",
  Collections = "collections",
  Demographics = "demographics",
  Formats = "formats",
  Genres = "genres",
  LinkSources = "linkSources",
  Links = "links",
  Publications = "publications",
  Publishers = "publishers",
  ReleaseDetails = "releaseDetails",
  Releases = "releases",
  Reviews = "reviews",
  Staffs = "staffs",
  States = "states",
  TitleCovers = "titleCovers",
  Titles = "titles",
  Users = "users",
  Works = "works",
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type AdditionalTitleNamesRecord = {
  language?: string;
  name?: string;
  title: RecordIdString;
};

export type AssetTypesRecord = {
  name: string;
};

export type AssetsRecord<TresizedImage = unknown> = {
  book?: RecordIdString;
  description?: string;
  image?: string;
  priority?: number;
  resizedImage?: null | TresizedImage;
  type?: RecordIdString;
};

export type BookDetailsRecord<
  Tmetadata = unknown,
  TparentCollection = unknown,
> = {
  covers?: string[];
  edition?: string;
  metadata?: null | Tmetadata;
  note?: HTMLString;
  parentCollection?: null | TparentCollection;
  parentId?: RecordIdString;
  price?: number;
  publication?: RecordIdString;
  publishDate?: IsoDateString;
  release: RecordIdString;
};

export type BookMetadataRecord = {
  book: RecordIdString;
  fahasaSKU?: string;
  isbn?: string;
  pageCount?: number;
  sizeX?: number;
  sizeY?: number;
  sizeZ?: number;
  weight?: number;
};

export type BooksRecord<Tmetadata = unknown> = {
  covers?: string[];
  edition?: string;
  metadata?: null | Tmetadata;
  note?: HTMLString;
  old_id?: string;
  price?: number;
  publication: RecordIdString;
  publishDate?: IsoDateString;
};

export type BooksCompleteRecord = {
  assets?: RecordIdString;
  digital?: boolean;
  edition?: string;
  metadata?: RecordIdString;
  note?: HTMLString;
  price?: number;
  publication?: RecordIdString;
  publishDate?: IsoDateString;
  release: RecordIdString;
  title: RecordIdString;
  volume?: number;
};

export enum CollectionBooksStatusOptions {
  "PLANNING" = "PLANNING",
  "COMPLETED" = "COMPLETED",
}
export type CollectionBooksRecord = {
  book: RecordIdString;
  collection: RecordIdString;
  notes?: string;
  quantity: number;
  status: CollectionBooksStatusOptions;
};

export enum CollectionMembersRoleOptions {
  "EDITOR" = "EDITOR",
  "MEMBER" = "MEMBER",
}
export type CollectionMembersRecord = {
  collection: RecordIdString;
  role: CollectionMembersRoleOptions;
  user: RecordIdString;
};

export enum CollectionsVisibilityOptions {
  "PRIVATE" = "PRIVATE",
  "UNLISTED" = "UNLISTED",
  "PUBLIC" = "PUBLIC",
}
export type CollectionsRecord = {
  default?: boolean;
  description?: HTMLString;
  name: string;
  order?: number;
  owner: RecordIdString;
  visibility?: CollectionsVisibilityOptions;
};

export type DemographicsRecord = {
  name: string;
  slug: string;
};

export type FormatsRecord = {
  color: string;
  decription?: HTMLString;
  name: string;
  slug: string;
  thumbnail?: string;
};

export type GenresRecord = {
  name: string;
  slug: string;
};

export type LinkSourcesRecord = {
  color: string;
  icon?: string;
  name: string;
};

export type LinksRecord = {
  source: RecordIdString;
  title: RecordIdString;
  url: string;
};

export type PublicationsRecord<Tmetadata = unknown> = {
  covers?: string[];
  defaultBook?: RecordIdString;
  description?: HTMLString;
  metadata?: null | Tmetadata;
  name: string;
  old_id?: string;
  release: RecordIdString;
  subtitle?: string;
  volume?: number;
};

export type PublishersRecord = {
  color: string;
  logo?: string;
  name: string;
  slug: string;
};

export enum ReleaseDetailsStatusOptions {
  "WAITING_FOR_APPROVAL" = "WAITING_FOR_APPROVAL",
  "REGISTERED" = "REGISTERED",
  "LICENSED" = "LICENSED",
  "ON_GOING" = "ON_GOING",
  "COMPLETED" = "COMPLETED",
  "HIATUS" = "HIATUS",
  "CANCELLED" = "CANCELLED",
}
export type ReleaseDetailsRecord<Tmetadata = unknown> = {
  cover?: string;
  metadata?: null | Tmetadata;
  name?: string;
  publisher: RecordIdString;
  status?: ReleaseDetailsStatusOptions;
  title: RecordIdString;
};

export enum ReleasesStatusOptions {
  "WAITING_FOR_APPROVAL" = "WAITING_FOR_APPROVAL",
  "REGISTERED" = "REGISTERED",
  "LICENSED" = "LICENSED",
  "ON_GOING" = "ON_GOING",
  "COMPLETED" = "COMPLETED",
  "HIATUS" = "HIATUS",
  "CANCELLED" = "CANCELLED",
}
export type ReleasesRecord = {
  banner?: RecordIdString;
  digital?: boolean;
  disambiguation?: string;
  front?: RecordIdString;
  logo?: RecordIdString;
  name?: string;
  old_id?: number;
  partner?: RecordIdString;
  publisher: RecordIdString;
  status?: ReleasesStatusOptions;
  title: RecordIdString;
  type: string;
};

export type ReviewsRecord = {
  content: HTMLString;
  header: string;
  release: RecordIdString;
  score?: number;
  user: RecordIdString;
};

export type StaffsRecord = {
  name: string;
};

export type StatesRecord = {
  value?: string;
};

export type TitleCoversRecord<
  Tcovers = unknown,
  Tmetadata = unknown,
  TparentCollection = unknown,
  Ttitle = unknown,
  Tvolume = unknown,
> = {
  covers?: null | Tcovers;
  metadata?: null | Tmetadata;
  parentCollection?: null | TparentCollection;
  title?: null | Ttitle;
  volume?: null | Tvolume;
};

export type TitlesRecord<Tmetadata = unknown> = {
  cover?: string;
  defaultRelease?: RecordIdString;
  demographic?: RecordIdString;
  description?: HTMLString;
  format: RecordIdString;
  genres?: RecordIdString[];
  metadata?: null | Tmetadata;
  name: string;
  slug?: string;
  slugGroup?: string;
};

export type UsersRecord = {
  avatar?: string;
  banner?: string;
  bio?: string;
  displayName?: string;
};

export type WorksRecord = {
  name: string;
  priority?: number;
  staff: RecordIdString;
  title: RecordIdString;
};

// Response types include system fields and match responses from the PocketBase API
export type AdditionalTitleNamesResponse<Texpand = unknown> =
  Required<AdditionalTitleNamesRecord> & BaseSystemFields<Texpand>;
export type AssetTypesResponse<Texpand = unknown> = Required<AssetTypesRecord> &
  BaseSystemFields<Texpand>;
export type AssetsResponse<
  TresizedImage = unknown,
  Texpand = unknown,
> = Required<AssetsRecord<TresizedImage>> & BaseSystemFields<Texpand>;
export type BookDetailsResponse<
  Tmetadata = unknown,
  TparentCollection = unknown,
  Texpand = unknown,
> = Required<BookDetailsRecord<Tmetadata, TparentCollection>> &
  BaseSystemFields<Texpand>;
export type BookMetadataResponse<Texpand = unknown> =
  Required<BookMetadataRecord> & BaseSystemFields<Texpand>;
export type BooksResponse<Tmetadata = unknown, Texpand = unknown> = Required<
  BooksRecord<Tmetadata>
> &
  BaseSystemFields<Texpand>;
export type BooksCompleteResponse<Texpand = unknown> =
  Required<BooksCompleteRecord> & BaseSystemFields<Texpand>;
export type CollectionBooksResponse<Texpand = unknown> =
  Required<CollectionBooksRecord> & BaseSystemFields<Texpand>;
export type CollectionMembersResponse<Texpand = unknown> =
  Required<CollectionMembersRecord> & BaseSystemFields<Texpand>;
export type CollectionsResponse<Texpand = unknown> =
  Required<CollectionsRecord> & BaseSystemFields<Texpand>;
export type DemographicsResponse<Texpand = unknown> =
  Required<DemographicsRecord> & BaseSystemFields<Texpand>;
export type FormatsResponse<Texpand = unknown> = Required<FormatsRecord> &
  BaseSystemFields<Texpand>;
export type GenresResponse<Texpand = unknown> = Required<GenresRecord> &
  BaseSystemFields<Texpand>;
export type LinkSourcesResponse<Texpand = unknown> =
  Required<LinkSourcesRecord> & BaseSystemFields<Texpand>;
export type LinksResponse<Texpand = unknown> = Required<LinksRecord> &
  BaseSystemFields<Texpand>;
export type PublicationsResponse<
  Tmetadata = unknown,
  Texpand = unknown,
> = Required<PublicationsRecord<Tmetadata>> & BaseSystemFields<Texpand>;
export type PublishersResponse<Texpand = unknown> = Required<PublishersRecord> &
  BaseSystemFields<Texpand>;
export type ReleaseDetailsResponse<
  Tmetadata = unknown,
  Texpand = unknown,
> = Required<ReleaseDetailsRecord<Tmetadata>> & BaseSystemFields<Texpand>;
export type ReleasesResponse<Texpand = unknown> = Required<ReleasesRecord> &
  BaseSystemFields<Texpand>;
export type ReviewsResponse<Texpand = unknown> = Required<ReviewsRecord> &
  BaseSystemFields<Texpand>;
export type StaffsResponse<Texpand = unknown> = Required<StaffsRecord> &
  BaseSystemFields<Texpand>;
export type StatesResponse<Texpand = unknown> = Required<StatesRecord> &
  BaseSystemFields<Texpand>;
export type TitleCoversResponse<
  Tcovers = unknown,
  Tmetadata = unknown,
  TparentCollection = unknown,
  Ttitle = unknown,
  Tvolume = unknown,
  Texpand = unknown,
> = Required<
  TitleCoversRecord<Tcovers, Tmetadata, TparentCollection, Ttitle, Tvolume>
> &
  BaseSystemFields<Texpand>;
export type TitlesResponse<Tmetadata = unknown, Texpand = unknown> = Required<
  TitlesRecord<Tmetadata>
> &
  BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;
export type WorksResponse<Texpand = unknown> = Required<WorksRecord> &
  BaseSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  additionalTitleNames: AdditionalTitleNamesRecord;
  assetTypes: AssetTypesRecord;
  assets: AssetsRecord;
  bookDetails: BookDetailsRecord;
  bookMetadata: BookMetadataRecord;
  books: BooksRecord;
  booksComplete: BooksCompleteRecord;
  collectionBooks: CollectionBooksRecord;
  collectionMembers: CollectionMembersRecord;
  collections: CollectionsRecord;
  demographics: DemographicsRecord;
  formats: FormatsRecord;
  genres: GenresRecord;
  linkSources: LinkSourcesRecord;
  links: LinksRecord;
  publications: PublicationsRecord;
  publishers: PublishersRecord;
  releaseDetails: ReleaseDetailsRecord;
  releases: ReleasesRecord;
  reviews: ReviewsRecord;
  staffs: StaffsRecord;
  states: StatesRecord;
  titleCovers: TitleCoversRecord;
  titles: TitlesRecord;
  users: UsersRecord;
  works: WorksRecord;
};

export type CollectionResponses = {
  additionalTitleNames: AdditionalTitleNamesResponse;
  assetTypes: AssetTypesResponse;
  assets: AssetsResponse;
  bookDetails: BookDetailsResponse;
  bookMetadata: BookMetadataResponse;
  books: BooksResponse;
  booksComplete: BooksCompleteResponse;
  collectionBooks: CollectionBooksResponse;
  collectionMembers: CollectionMembersResponse;
  collections: CollectionsResponse;
  demographics: DemographicsResponse;
  formats: FormatsResponse;
  genres: GenresResponse;
  linkSources: LinkSourcesResponse;
  links: LinksResponse;
  publications: PublicationsResponse;
  publishers: PublishersResponse;
  releaseDetails: ReleaseDetailsResponse;
  releases: ReleasesResponse;
  reviews: ReviewsResponse;
  staffs: StaffsResponse;
  states: StatesResponse;
  titleCovers: TitleCoversResponse;
  titles: TitlesResponse;
  users: UsersResponse;
  works: WorksResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(
    idOrName: "additionalTitleNames",
  ): RecordService<AdditionalTitleNamesResponse>;
  collection(idOrName: "assetTypes"): RecordService<AssetTypesResponse>;
  collection(idOrName: "assets"): RecordService<AssetsResponse>;
  collection(idOrName: "bookDetails"): RecordService<BookDetailsResponse>;
  collection(idOrName: "bookMetadata"): RecordService<BookMetadataResponse>;
  collection(idOrName: "books"): RecordService<BooksResponse>;
  collection(idOrName: "booksComplete"): RecordService<BooksCompleteResponse>;
  collection(
    idOrName: "collectionBooks",
  ): RecordService<CollectionBooksResponse>;
  collection(
    idOrName: "collectionMembers",
  ): RecordService<CollectionMembersResponse>;
  collection(idOrName: "collections"): RecordService<CollectionsResponse>;
  collection(idOrName: "demographics"): RecordService<DemographicsResponse>;
  collection(idOrName: "formats"): RecordService<FormatsResponse>;
  collection(idOrName: "genres"): RecordService<GenresResponse>;
  collection(idOrName: "linkSources"): RecordService<LinkSourcesResponse>;
  collection(idOrName: "links"): RecordService<LinksResponse>;
  collection(idOrName: "publications"): RecordService<PublicationsResponse>;
  collection(idOrName: "publishers"): RecordService<PublishersResponse>;
  collection(idOrName: "releaseDetails"): RecordService<ReleaseDetailsResponse>;
  collection(idOrName: "releases"): RecordService<ReleasesResponse>;
  collection(idOrName: "reviews"): RecordService<ReviewsResponse>;
  collection(idOrName: "staffs"): RecordService<StaffsResponse>;
  collection(idOrName: "states"): RecordService<StatesResponse>;
  collection(idOrName: "titleCovers"): RecordService<TitleCoversResponse>;
  collection(idOrName: "titles"): RecordService<TitlesResponse>;
  collection(idOrName: "users"): RecordService<UsersResponse>;
  collection(idOrName: "works"): RecordService<WorksResponse>;
};
