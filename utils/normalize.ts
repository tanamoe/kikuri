/**
 * Function to normalize string into latin characters
 *
 * @see https://int3ractive.com/blog/2019/hai-ung-dung-cua-string-normalize-voi-tieng-viet/
 */
export function normalize(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[đĐ]/g, (m) => (m === "đ" ? "d" : "D"));
}
