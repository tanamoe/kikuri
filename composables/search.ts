export function useSearch() {
  const isActive = useState(() => false);

  function open() {
    isActive.value = true;
  }

  function close() {
    isActive.value = false;
  }

  return { isActive, open, close };
}
