<template>
  <div class="flex h-[80vh] items-center justify-center">
    <div class="max-w-sm space-y-3 px-3 text-center">
      <p class="text-9xl">👷 🚧</p>
      <AppH1>{{ $t("general.comingSoon") }}</AppH1>
      <p>{{ $t("general.comingSoonDescription") }}</p>
      <UButton color="black" to="/">
        {{ $t("error.returnHome") }}
      </UButton>
    </div>
  </div>
</template>
