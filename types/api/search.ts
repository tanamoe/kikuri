import type { BaseAPIListResult } from "@/types/api";
import type { BaseTitleResponse } from "@/types/api/title";

/**
 * Titles returned from `/api/collections/titles/browse`
 *
 * @see {@link BaseTitleResponse}
 */
export type APISearchResponse = BaseAPIListResult<BaseTitleResponse>;
