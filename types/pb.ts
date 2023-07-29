/**
 * This file was @generated using pocketbase-typegen
 */

export enum Collections {
  Book = "book",
  BookData = "book_data",
  BookDetailed = "book_detailed",
  Format = "format",
  Publication = "publication",
  Publisher = "publisher",
  Release = "release",
  Title = "title",
  TitleWithCover = "title_with_cover",
  Users = "users",
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

export type BookRecord<Tmetadata = unknown> = {
  publication: RecordIdString;
  edition?: string;
  publishDate?: IsoDateString;
  cover?: string[];
  price?: number;
  metadata?: null | Tmetadata;
  old_id?: string;
};

export type BookDataRecord = {
  titleId?: RecordIdString;
  name: string;
  description?: HTMLString;
  format: RecordIdString;
  publication_name: string;
  baseCover?: string[];
  cover?: string[];
  publishDate?: IsoDateString;
};

export type BookDetailedRecord = {
  name: string;
  volume?: number;
  release: RecordIdString;
  publishDate?: IsoDateString;
  baseCover?: string[];
  cover?: string[];
  edition?: string;
  price?: number;
  digital?: boolean;
  publisher: RecordIdString;
  title: RecordIdString;
};

export type FormatRecord = {
  name: string;
  slug: string;
  color: string;
  decription?: HTMLString;
  thumbnail?: string;
};

export type PublicationRecord<Tmetadata = unknown> = {
  release: RecordIdString;
  name: string;
  volume?: number;
  cover?: string[];
  digital?: boolean;
  metadata?: null | Tmetadata;
  old_id?: string;
};

export type PublisherRecord = {
  name: string;
  logo?: string;
  slug: string;
  color: string;
};

export enum ReleaseStatusOptions {
  "WAITING_FOR_APPROVAL" = "WAITING_FOR_APPROVAL",
  "REGISTERED" = "REGISTERED",
  "LICENSED" = "LICENSED",
  "ON_GOING" = "ON_GOING",
  "COMPLETED" = "COMPLETED",
  "HIATUS" = "HIATUS",
  "CANCELLED" = "CANCELLED",
}
export type ReleaseRecord = {
  title: RecordIdString;
  name: string;
  publisher: RecordIdString;
  status?: ReleaseStatusOptions;
  old_id?: number;
};

export type TitleRecord = {
  name: string;
  description?: HTMLString;
  format: RecordIdString;
  cover?: string;
};

export type TitleWithCoverRecord = {
  name: string;
  description?: HTMLString;
  format: RecordIdString;
  baseCover?: string[];
};

export type UsersRecord = {
  displayName?: string;
  bio?: HTMLString;
  avatar?: string;
  banner?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type BookResponse<Tmetadata = unknown, Texpand = unknown> = Required<
  BookRecord<Tmetadata>
> &
  BaseSystemFields<Texpand>;
export type BookDataResponse<Texpand = unknown> = Required<BookDataRecord> &
  BaseSystemFields<Texpand>;
export type BookDetailedResponse<Texpand = unknown> =
  Required<BookDetailedRecord> & BaseSystemFields<Texpand>;
export type FormatResponse<Texpand = unknown> = Required<FormatRecord> &
  BaseSystemFields<Texpand>;
export type PublicationResponse<
  Tmetadata = unknown,
  Texpand = unknown
> = Required<PublicationRecord<Tmetadata>> & BaseSystemFields<Texpand>;
export type PublisherResponse<Texpand = unknown> = Required<PublisherRecord> &
  BaseSystemFields<Texpand>;
export type ReleaseResponse<Texpand = unknown> = Required<ReleaseRecord> &
  BaseSystemFields<Texpand>;
export type TitleResponse<Texpand = unknown> = Required<TitleRecord> &
  BaseSystemFields<Texpand>;
export type TitleWithCoverResponse<Texpand = unknown> =
  Required<TitleWithCoverRecord> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  book: BookRecord;
  book_data: BookDataRecord;
  book_detailed: BookDetailedRecord;
  format: FormatRecord;
  publication: PublicationRecord;
  publisher: PublisherRecord;
  release: ReleaseRecord;
  title: TitleRecord;
  title_with_cover: TitleWithCoverRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  book: BookResponse;
  book_data: BookDataResponse;
  book_detailed: BookDetailedResponse;
  format: FormatResponse;
  publication: PublicationResponse;
  publisher: PublisherResponse;
  release: ReleaseResponse;
  title: TitleResponse;
  title_with_cover: TitleWithCoverResponse;
  users: UsersResponse;
};
