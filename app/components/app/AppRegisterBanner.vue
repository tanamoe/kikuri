<script setup lang="ts">
const { $pb } = useNuxtApp();

const cookie = useCookie<boolean>("tana_register_banner", {
  default: () => true,
  maxAge: 31_536_000, // 1 year
});
</script>

<template>
  <UCard
    v-if="cookie && !$pb.authStore.isAuthRecord"
    variant="subtle"
    class="relative overflow-hidden"
  >
    <UButton
      class="absolute top-3 right-3"
      variant="ghost"
      color="neutral"
      icon="i-fluent-dismiss-20-filled"
      square
      :aria-label="$t('general.close')"
      @click="cookie = false"
    />
    <div class="flex flex-col gap-6 md:flex-row">
      <div class="flex-1 space-y-6">
        <img
          src="/icon.svg"
          class="h-auto w-8"
          width="32"
          height="32"
          alt="Tana.moe logo"
        />
        <div class="prose prose-sm dark:prose-invert">
          <AppH2>{{ $t("general.registerBanner") }}</AppH2>
          <p>
            {{ $t("general.registerBannerDescription") }}
          </p>
        </div>
        <div class="space-x-1.5">
          <UButton to="/register">{{ $t("account.register") }}</UButton>
          <UButton to="/login" variant="ghost">
            {{ $t("account.login") }}
          </UButton>
        </div>
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
  </UCard>
</template>
