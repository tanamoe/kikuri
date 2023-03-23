<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/vue";
import { useSearchStore } from "@/stores/search";

const search = useSearchStore();

const searchQuery = ref(search.query);
const searchQueryDebounced = refDebounced(searchQuery, 500);

const { data, pending, error } = useSearch(searchQueryDebounced);

watch(searchQueryDebounced, () =>
  search.changeQuery(searchQueryDebounced.value)
);

// on cmd+k || ctrl+k key press
window.addEventListener("keydown", (event) => {
  if (window.navigator.platform === "MacIntel") {
    if (event.metaKey && event.key === "k") {
      search.open();
      event.preventDefault();
    }
  } else if (event.ctrlKey && event.key === "k") {
    search.open();
    event.preventDefault();
  }
});
</script>

<template>
  <TransitionRoot :show="search.isActive" as="template">
    <Dialog @close="search.close()">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 z-50 bg-black/30 backdrop-blur"
          aria-hidden="true"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-50 h-screen overflow-y-auto">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <div class="flex min-h-full items-center justify-center p-6">
            <DialogPanel as="template">
              <div class="relative w-full max-w-[640px] overflow-hidden">
                <!-- Search box -->
                <div
                  class="rounded-2xl bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50"
                >
                  <div class="flex h-12 items-center gap-4 px-4">
                    <span class="flex items-center justify-center py-4">
                      <Icon name="bi:search" />
                    </span>

                    <input
                      v-model="searchQuery"
                      class="h-full w-full flex-1 bg-transparent focus:outline-none"
                      placeholder="Tìm một bộ truyện..."
                    />

                    <button
                      v-if="searchQuery !== ''"
                      class="flex items-center justify-center py-4"
                      @click="searchQuery = ''"
                    >
                      <Icon name="bi:x-lg" />
                    </button>
                  </div>
                </div>

                <div
                  v-if="pending || error"
                  class="mt-6 overflow-hidden rounded-2xl bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50"
                >
                  <!-- Case "pending" -->
                  <ul v-if="pending">
                    <li v-for="(_, index) in [...Array(5)]" :key="index">
                      <div class="flex animate-pulse items-center gap-3 p-3">
                        <div
                          class="aspect-[2/3] h-full w-full min-w-[4rem] max-w-[4rem] rounded-lg bg-neutral-200 dark:bg-neutral-700"
                        />

                        <div class="w-full space-y-1">
                          <div
                            class="h-6 w-16 rounded-2xl bg-neutral-200 dark:bg-neutral-700"
                          />
                          <div
                            class="h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700"
                          />
                          <div
                            class="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700"
                          />
                        </div>
                      </div>
                    </li>
                  </ul>

                  <!-- Case "error" -->
                  <span
                    v-else-if="error"
                    class="flex items-center justify-center py-6"
                  >
                    Đã có lỗi xảy ra, vui lòng thử lại sau.
                  </span>
                </div>

                <!-- Result box -->
                <div
                  v-else-if="data"
                  class="mt-6 overflow-hidden rounded-2xl bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50"
                >
                  <!-- Case no result -->
                  <div v-if="data.hits.length == 0" class="py-6 text-center">
                    <p class="mb-3 text-2xl">(╥﹏╥)</p>
                    <p>Không có kết quả...</p>
                  </div>

                  <!-- TODO: data handling -->
                  <ul v-else-if="data.hits.length > 0">
                    <li v-for="result in data.hits" :key="result.id">
                      <a
                        href="#"
                        class="flex items-center gap-3 p-3 transition-colors hover:bg-neutral-500/20"
                      >
                        <nuxt-img
                          v-if="result.image_url"
                          provider="imagor"
                          :src="result.image_url"
                          class="w-16 rounded-lg"
                          :alt="result.name"
                        />
                        <div
                          v-else
                          class="font-kanit flex aspect-[2/3] h-full w-full min-w-[4rem] max-w-[4rem] items-center justify-center rounded-lg bg-neutral-200 p-3 text-center text-sm font-bold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                        >
                          Chưa có ảnh
                        </div>

                        <div class="space-y-1">
                          <div class="flex items-center gap-2">
                            <AppBadge
                              :style="{ backgroundColor: result.type.color }"
                            >
                              {{ result.type.name }}
                            </AppBadge>
                          </div>
                          <h5 class="font-bold">
                            {{ result.name }}
                          </h5>
                          <span class="text-neutral-500 dark:text-neutral-400">
                            {{ result.status }} &middot;
                            {{ result.publisher.name }}
                          </span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
