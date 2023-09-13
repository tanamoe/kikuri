import { BookDetailedResponse } from "~/types/pb";

export function useLibraryPrompt() {
  const promptOpen = useState(() => false);
  const quickPromptOpen = useState(() => false);

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

  function open(
    data: Pick<BookDetailedResponse, "id" | "name">,
    mobile = false,
  ) {
    promptOpen.value = false;
    quickPromptOpen.value = false;

    if (mobile) {
      quickPromptOpen.value = true;
    } else {
      promptOpen.value = true;
    }
    book.value = data;
    state.value = {
      quantity: 1,
    };
  }

  return { promptOpen, quickPromptOpen, book, state, open };
}
