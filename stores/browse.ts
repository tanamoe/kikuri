export const useBrowseStore = defineStore("browse", () => {
  const route = useRoute();
  const router = useRouter();

  const page = ref(
    route.query.p && !Array.isArray(route.query.p)
      ? parseInt(route.query.p)
      : 1,
  );

  const query = ref<string>(
    route.query.q && !Array.isArray(route.query.q) ? route.query.q : "",
  );

  const sort = ref(
    route.query.s && !Array.isArray(route.query.s) ? route.query.s : "-updated",
  );

  const formats = ref(
    route.query.format
      ? Array.isArray(route.query.format)
        ? route.query.format
        : [route.query.format]
      : [],
  );
  const publishers = ref(
    route.query.publisher
      ? Array.isArray(route.query.publisher)
        ? route.query.publisher
        : [route.query.publisher]
      : [],
  );
  const demographics = ref(
    route.query.demographic
      ? Array.isArray(route.query.demographic)
        ? route.query.demographic
        : [route.query.demographic]
      : [],
  );
  const status = ref(
    route.query.status
      ? Array.isArray(route.query.status)
        ? route.query.status
        : [route.query.status]
      : [],
  );
  const genres = ref(
    route.query.genre
      ? Array.isArray(route.query.genre)
        ? route.query.genre
        : [route.query.genre]
      : [],
  );

  function reset() {
    query.value = "";
    formats.value = [];
    publishers.value = [];
    demographics.value = [];
    status.value = [];
    genres.value = [];
  }

  watch(
    [page, query, sort, formats, demographics, publishers, status, genres],
    () => {
      router.replace({
        path: route.path,
        query: {
          p: page.value,
          q: query.value,
          s: sort.value,
          format: formats.value,
          demographic: demographics.value,
          status: status.value,
          publisher: publishers.value,
          genre: genres.value,
        },
      });
    },
  );

  watch(
    [query, formats, demographics, publishers, status, genres],
    () => (page.value = 1),
  );

  return {
    page,
    query,
    sort,
    formats,
    publishers,
    demographics,
    status,
    genres,
    reset,
  };
});
