import type { PublishersRecord } from "~/types/pb";

export type FilterDigital = "show" | "hide" | "only";

export type FilterPublishers = {
  id: string;
  label: string;
  avatar?: {
    src: string;
  };
  [k: string]: unknown;
};

export function parseCalendarFilter(
  from: string,
  to: string,
  filters: {
    publishers?: string[];
    digital?: FilterDigital;
    edition?: boolean;
  } = {},
) {
  const { publishers, digital, edition } = filters;

  const query = [`publishDate >= '${from}'`, `publishDate <= '${to}'`];

  if (publishers && publishers.length > 0) {
    query.push(
      "(" +
        publishers
          .map((publisher) => `release.publisher = '${publisher}'`)
          .join(" || ") +
        ")",
    );
  }

  if (digital === "hide") {
    query.push("publication.digital = false");
  } else if (digital === "only") {
    query.push("publication.digital = true");
  }

  if (edition === false) {
    query.push("edition = ''");
  }

  return query.join(" && ");
}
