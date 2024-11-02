import type { BaseAPIListResult } from "@/types/api";
import type { BaseTitleResponse } from "@/types/api/title";
import type { BaseReleaseResponse } from "./release";

/**
 * Titles returned from `/api/collections/titles/browse`
 *
 * @see {@link BaseTitleResponse}
 */
export type APISearchResponse = BaseAPIListResult<BaseTitleResponse>;

/**
 * Releases returned from `/api/collections/releases/browse`
 *
 * @see {@link BaseReleaseResponse }
 */
export type APIReleaseResponse = BaseAPIListResult<BaseReleaseResponse>;
