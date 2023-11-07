<script setup lang="ts">
const { $pb } = useNuxtApp();

const cookie = useCookie<boolean>("tana_register_banner", {
  default: () => true,
  maxAge: 31_536_000, // 1 year
});
</script>

<template>
  <section v-if="cookie && !$pb.authStore.isAuthRecord">
    <AppCard class="p-6">
      <UButton
        class="absolute right-3 top-3"
        variant="ghost"
        color="gray"
        icon="i-fluent-dismiss-20-filled"
        square
        :aria-label="$t('general.close')"
        @click="cookie = false"
      />
      <div class="flex flex-col gap-6 md:flex-row">
        <div class="flex-1 space-y-6">
          <img src="/icon.svg" class="h-auto w-8" width="32" height="32" />
          <div class="prose prose-sm dark:prose-invert">
            <AppH2>{{ $t("general.registerBanner") }}</AppH2>
            <p>
              {{ $t("general.registerBannerDescription") }}
            </p>
          </div>
          <UButton to="/register">{{ $t("account.register") }}</UButton>
        </div>
        <div class="-mb-16 flex flex-1 items-end xl:-mb-48">
          <img
            src="/img/calendar.png"
            width="720"
            height="535"
            :alt="$t('general.registerBanner')"
          />
        </div>
      </div>
    </AppCard>
  </section>
</template>
