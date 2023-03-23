// TODO: type SearchResult and SearchResponse from `Quang19992/momoka` GraphQL api

interface SearchResult {
  id: number;
  name: string;
  publisher: {
    id: string;
    name: string;
  };
  type: {
    id: string;
    name: string;
    color: string;
  };
  status: string;
  image_url: string;
}

interface SearchResponse {
  hits: SearchResult[];
}

export default function (query: Ref<string>, limit = 5) {
  const data = ref<SearchResponse | null>(null);
  const error = ref();
  const pending = ref<Boolean>();

  async function doFetch() {
    // shows no result when query is <empty string>
    if (query.value === "") {
      data.value = null;
      return;
    }

    // initialise values
    pending.value = true;
    data.value = {
      hits: [],
    };

    const res = await useFetch<SearchResponse>(
      computed(
        () =>
          `${useRuntimeConfig().public.search_endpoint}?q=${
            query.value
          }&limit=${limit}`
      ),
      {
        headers: {
          Authorization: `Bearer ${useRuntimeConfig().public.search_token}`,
        },
      }
    );

    data.value = res.data.value;
    pending.value = res.pending.value;
    error.value = res.error.value;
  }

  // setup reactive re-fetch if input URL is a ref
  watchEffect(doFetch);

  return { data, pending, error };
}
