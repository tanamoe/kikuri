import { joinURL } from "ufo";
import type { ProviderGetImage } from "@nuxt/image";

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL } = {},
  { options },
) => {
  const { width, height, quality, ...providerModifiers } = modifiers;

  let url = baseURL;

  if (width || height) url = joinURL(url, `/${width || 0}x${height || 0}`);

  const filters: string[] = [`quality(${quality || options.quality || 90})`];
  for (const [modifier, value] of Object.entries(providerModifiers)) {
    if (value) filters.push(`${modifier}:(${value})`);
  }

  if (filters.length > 0) url = joinURL(url, `/filters:${filters.join(":")}`);

  return {
    url: joinURL(url, src),
  };
};
