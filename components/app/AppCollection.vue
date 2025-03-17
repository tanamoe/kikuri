<script setup lang="ts">
import { joinURL } from "ufo";
import type { BaseAPIFields } from "@/types/api";
import type { CollectionsRecord } from "@/types/pb";
import type { CardProps } from "@nuxt/ui";

const props = defineProps<{
  collection: CollectionsRecord & BaseAPIFields;
}>();

const ui: CardProps["ui"] = {
  body: "relative p-0 sm:p-0",
};

const description = props.collection.description
  ?.replace(/<[^>]*>/g, "")
  .substring(0, 200);
</script>

<template>
  <ULink :to="joinURL('/library', collection.id)" class="group block">
    <UCard :ui>
      <div class="space-y-4 p-4">
        <div class="prose prose-sm dark:prose-invert">
          <h4
            class="decoration-primary-400 decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
          >
            {{ collection.name }}
          </h4>
          <p v-if="description">
            {{ description }}
          </p>
        </div>
      </div>
    </UCard>
  </ULink>
</template>
