import { joinURL } from "ufo";
import type { MetadataImages } from "~/types/common";

export function joinSrc(image: string) {
  const {
    public: { imageUrl },
  } = useRuntimeConfig();

  return joinURL(imageUrl, image);
}

export function joinSrcset(images: MetadataImages) {
  const {
    public: { imageUrl },
  } = useRuntimeConfig();
  const ss: string[] = [];
  let src: keyof typeof images;

  for (src in images) {
    ss.push(joinURL(imageUrl, images[src]) + " " + src);
  }

  return ss.join(", ");
}
