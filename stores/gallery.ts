export const useGalleryStore = defineStore("gallery", () => {
  const isOpen = ref(false);
  const currentIndex = ref(0);
  const images = ref<
    {
      alt: string;
      src: string;
      srcset: string;
    }[]
  >();
  const transitionName = ref<"slide-rtl" | "slide-ltr">("slide-rtl");

  function open(i: number) {
    isOpen.value = true;
    currentIndex.value = i;
  }

  function prev() {
    transitionName.value = "slide-ltr";
    if (images.value) {
      if (currentIndex.value - 1 >= 0) currentIndex.value--;
      else currentIndex.value = images.value.length - 1;
    }
  }

  function next() {
    transitionName.value = "slide-rtl";
    if (images.value) {
      if (currentIndex.value + 1 < images.value.length) currentIndex.value++;
      else currentIndex.value = 0;
    }
  }

  return { isOpen, currentIndex, images, transitionName, open, prev, next };
});
