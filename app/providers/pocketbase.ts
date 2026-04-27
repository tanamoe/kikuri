import { joinURL } from "ufo";
import { defineProvider } from "@nuxt/image/runtime";

interface PocketBaseOptions {
  baseURL: string;
}

export default defineProvider<PocketBaseOptions>({
  getImage(src, { modifiers, baseURL }) {
    const { width, height } = modifiers;

    let url = joinURL(baseURL, src);

    if (width || height) {
      url = `${url}?thumb=${width || 0}x${height || 0}`;
    }

    return {
      url,
    };
  },
});
