import { type PostsOrPages } from "@tryghost/content-api";

export default defineEventHandler(async (event) => {
  if (!event.context.params)
    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });

  const runtimeConfig = useRuntimeConfig();

  const posts = await $fetch<PostsOrPages>(
    `${runtimeConfig.public.blog_url}/api/home`
  );

  return posts.splice(0, 3);
});
