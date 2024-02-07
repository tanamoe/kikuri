export function useCollectionCreateModal() {
  const isOpen = useState(() => false);

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return { isOpen, open, close };
}
