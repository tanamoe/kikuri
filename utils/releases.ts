export type FilterDigital = "show" | "hide" | "only";

export type FilterPublishers = {
  id: string;
  label: string;
  [k: string]: any;
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
          .map((publisher) => `publisher = '${publisher}'`)
          .join(" || ") +
        ")",
    );
  }

  if (digital === "hide") {
    query.push("digital = false");
  } else if (digital === "only") {
    query.push("digital = true");
  }

  if (edition === false) {
    query.push("edition = ''");
  }

  return query.join(" && ");
}
