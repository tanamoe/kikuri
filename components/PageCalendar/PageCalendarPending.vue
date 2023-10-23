<template>
  <UContainer>
    <div
      v-for="i in 4"
      :key="i"
      ref="monthRefs"
      class="mb-24 flex scroll-mt-16 gap-6"
    >
      <div class="sticky top-16 self-start">
        <div class="space-y-3">
          <USkeleton class="h-4 w-12 rounded md:w-20" />
          <USkeleton class="h-12 w-12 rounded md:w-20" />
          <USkeleton class="h-12 w-12 rounded md:w-20" />
        </div>
      </div>
      <div class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        <div v-for="y in 12" :key="y" class="space-y-3">
          <USkeleton class="aspect-[2/3] h-auto w-full rounded-md" />
          <USkeleton class="h-6 w-full rounded-md" />
          <USkeleton class="h-3 w-1/3 rounded-md" />
        </div>
      </div>
    </div>
  </UContainer>
</template>
