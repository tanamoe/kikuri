import { joinURL } from "ufo";
import type { ProviderGetImage } from "@nuxt/image";

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL } = {}
) => {
  const { width, height } = modifiers;

  let url = joinURL(baseURL, src);

  if (width || height) {
    url = joinURL(url, `?thumb=${width || 0}x${height || 0}`);
  }

  return {
    url,
  };
};
