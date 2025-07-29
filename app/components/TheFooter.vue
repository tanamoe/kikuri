<script setup lang="ts">
const colorMode = useColorMode();
const { t } = useI18n({ useScope: "global" });

const themes = computed(() => [
  {
    id: "dark",
    label: t("general.darkMode"),
    icon: "i-fluent-weather-moon-16-regular",
  },
  {
    id: "light",
    label: t("general.lightMode"),
    icon: "i-fluent-weather-sunny-16-regular",
  },
  {
    id: "system",
    label: t("general.systemColorMode"),
    icon: "i-fluent-desktop-16-regular",
  },
]);

const currentTheme = computed({
  get() {
    return themes.value.find((theme) => colorMode.preference === theme.id);
  },
  set(theme) {
    colorMode.preference = theme!.id;
  },
});
</script>

<template>
  <footer class="bg-muted mt-12">
    <UContainer class="mx-auto p-6">
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div class="flex-1">
          <div class="w-fit">
            <ClientOnly>
              <USelectMenu
                v-model="currentTheme"
                :items="themes"
                :icon="currentTheme?.icon"
                color="neutral"
                variant="subtle"
                trailing-icon="i-fluent-chevron-down-20-filled"
              >
                {{ currentTheme?.label }}
              </USelectMenu>
            </ClientOnly>
          </div>
        </div>
        <div
          class="text-dimmed grid w-full grid-cols-3 gap-6 sm:w-fit sm:gap-12"
        >
          <ul>
            <li>
              <NuxtLink to="https://blog.tana.moe">
                {{ $t("footer.links.blog") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about">
                {{ $t("footer.links.about") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/missing-entries">
                {{ $t("footer.links.missingEntries") }}
              </NuxtLink>
            </li>
          </ul>
          <ul>
            <li>
              <NuxtLink to="/terms-of-service">
                {{ $t("footer.links.tos") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy-policy">
                {{ $t("footer.links.privacy") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact">
                {{ $t("footer.links.contact") }}
              </NuxtLink>
            </li>
          </ul>
          <ul>
            <li>
              <NuxtLink to="https://pb.tana.moe">
                {{ $t("footer.links.api") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="https://status.tana.moe">
                {{ $t("footer.links.status") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/sitemap.xml">
                {{ $t("footer.links.sitemap") }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-muted text-muted mt-6 flex items-center justify-between border-t pt-6"
      >
        <div>Tana.moe</div>
        <AppSocialLinks />
      </div>
    </UContainer>
  </footer>
</template>
