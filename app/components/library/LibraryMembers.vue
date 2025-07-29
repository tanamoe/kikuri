<script setup lang="ts">
import type { UserCollectionMembersResponse } from "@/types/api/collections";

defineProps<{
  members: UserCollectionMembersResponse;
}>();
</script>

<template>
  <div>
    <h4>{{ $t("library.member") }}</h4>
    <UAvatarGroup v-if="members" size="sm">
      <UAvatar
        v-for="member in members.items"
        :key="member.userId"
        :src="
          member.user?.avatar
            ? $pb.files.getURL(
                { collectionId: 'users', id: member.userId },
                member.user.avatar,
                { thumb: '32x32' },
              )
            : undefined
        "
        :alt="member.user?.displayName || member.user?.username"
      />
    </UAvatarGroup>
  </div>
</template>
