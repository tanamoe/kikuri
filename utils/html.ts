export function parseToText(text: string) {
  return text.replace(/<[^>]*>/g, "");
}
