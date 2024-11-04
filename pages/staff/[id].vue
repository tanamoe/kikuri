<script setup lang="ts">
import {
  Collections,
  type AssetsResponse,
  type FormatsResponse,
  type ReleasesResponse,
  type StaffsResponse,
  type TitlesResponse,
  type WorksResponse,
} from "@/types/pb";
import type { MetadataImages } from "@/types/common";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: staff } = await useAsyncData(() =>
  $pb.collection(Collections.Staffs).getOne<
    StaffsResponse<{
      works_via_staff: WorksResponse<{
        title: TitlesResponse<
          unknown,
          {
            format: FormatsResponse;
            defaultRelease: ReleasesResponse<{
              front: AssetsResponse<MetadataImages>;
            }>;
          }
        >;
      }>[];
    }>
  >(route.params.id as string, {
    expand:
      "works_via_staff.title.format, works_via_staff.title.defaultRelease.front",
  }),
);

if (!staff.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

useSeoMeta({
  title: staff.value.name,
  ogTitle: staff.value.name,
});
</script>

<template>
  <div v-if="staff">
    <AppH1 class="mb-6">{{ staff.name }}</AppH1>

    <AppGrid v-if="staff.expand?.works_via_staff">
      <template v-for="work in staff.expand.works_via_staff" :key="work.id">
        <AppTitle
          v-if="work.expand?.title"
          :title="work.expand.title"
          :format="work.expand.title.expand?.format"
          :image="work.expand.title.expand?.defaultRelease.expand?.front"
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, (max-width: 1280px) 15vw, 10vw"
        >
          <template #after>
            {{ work.name }}
          </template>
        </AppTitle>
      </template>
    </AppGrid>
  </div>
</template>
