import { BookDetailedResponse } from "~/types/pb";

export function useLibraryPrompt() {
  const isOpen = useState("libraryPromptOpen", () => false);

  const book = useState<
    | {
        id: string;
        name: string;
      }
    | undefined
  >();

  const state = useState<{
    status?: string;
    collection?: string;
    quantity: number;
  }>(() => ({
    quantity: 1,
  }));

  function open(data: Pick<BookDetailedResponse, "id" | "name">) {
    isOpen.value = true;
    book.value = data;
    state.value = {
      quantity: 1,
    };
  }

  return { isOpen, book, state, open };
}
