export { useLibrary } from "./library/library";
export { useLibraryBooks } from "./library/books";
export { useLibraryCollections } from "./library/collections";

export function useLibraryCollectionCreate() {
  const isOpen = useState(() => false);

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return { isOpen, open, close };
}
