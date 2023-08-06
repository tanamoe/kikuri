import type { PostsOrPages } from "@tryghost/content-api";

export const getRecentGhostPosts = async () => {
  const runtimeConfig = useRuntimeConfig();

  const posts = await $fetch<PostsOrPages>(
    `${runtimeConfig.public.blog_url}/api/home`
  );

  return posts.splice(0, 3);
};
