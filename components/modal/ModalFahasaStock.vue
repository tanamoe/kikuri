<script setup lang="ts">
import { withQuery } from "ufo";

const props = defineProps<{ sku: string }>();

const { data, status } = await useLazyFetch("/api/fahasa", {
  params: {
    sku: props.sku,
  },
});
</script>

<template>
  <UModal>
    <USkeleton v-if="status === 'pending'" class="h-screen w-full" />

    <UCard v-else>
      <template #header> FAHASA </template>

      <template v-if="data">
        <div v-for="province in data.data" :key="province.id">
          {{ province.province_name }}
          <div
            v-for="bookstore in province.bookstore_list"
            :key="bookstore.bookstore_id"
          >
            <div>{{ bookstore.bookstore_name }}</div>
            <div>
              {{ bookstore.bookstore_address }}
              <ULink
                :to="
                  withQuery('https://beta.maps.apple.com', {
                    ll: `${bookstore.lat},${bookstore.lon}`,
                    q: bookstore.bookstore_name,
                  })
                "
              >
                Apple Maps
              </ULink>
              <ULink
                :to="
                  withQuery('https://www.google.com/maps/search/', {
                    api: 1,
                    query: `${bookstore.lat},${bookstore.lon}`,
                  })
                "
              >
                Google Maps
              </ULink>
            </div>
            {{ bookstore.quantity }}
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
