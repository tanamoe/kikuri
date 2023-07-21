export const useRecentPosts = () => {
  return useFetch("/api/ghost");
};
