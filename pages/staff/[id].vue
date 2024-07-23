<script setup lang="ts">
import {
  Collections,
  type FormatsResponse,
  type StaffsResponse,
  type TitlesResponse,
  type WorksResponse,
} from "@/types/pb";
import type { MetadataCommon } from "~/types/common";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: staff } = await useAsyncData(() =>
  $pb.collection(Collections.Staffs).getOne<
    StaffsResponse<{
      works_via_staff: WorksResponse<{
        title: TitlesResponse<
          MetadataCommon,
          {
            format: FormatsResponse;
          }
        >;
      }>[];
    }>
  >(route.params.id as string, {
    expand: "works_via_staff.title.format",
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
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
        >
          <template #before>
            <UBadge
              v-if="work.expand?.title.expand?.format"
              color="gray"
              class="mb-1 mr-1"
            >
              {{ work.expand?.title.expand.format.name }}
            </UBadge>
          </template>
          <template #after>
            {{ work.name }}
          </template>
        </AppTitle>
      </template>
    </AppGrid>
  </div>
</template>
