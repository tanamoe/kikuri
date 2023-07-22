import GhostContentAPI from "@tryghost/content-api";

export default defineEventHandler(async (event) => {
  if (!event.context.params)
    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });

  const runtimeConfig = useRuntimeConfig();

  const ghost = new GhostContentAPI({
    url: runtimeConfig.ghost.url,
    key: runtimeConfig.ghost.key,
    version: "v5.0",
  });

  const posts = await ghost.posts.browse({
    include: ["authors"],
    fields: [
      "id",
      "title",
      "slug",
      "feature_image",
      "excerpt",
      "primary_author",
      "created_at",
    ],
    limit: "3",
  });

  return posts;
});
