import { joinURL } from "ufo";
import type { ProviderGetImage } from "@nuxt/image-edge";

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL } = {}
) => {
  let url = baseURL;
  const { width, height, quality } = modifiers;

  if (width || height) {
    url = joinURL(url, `/${width || 0}x${height || 0}`);
  }

  url = joinURL(url, `/filters:quality(${quality || 80})`);

  return {
    url: joinURL(url, src),
  };
};
