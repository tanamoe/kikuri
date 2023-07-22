<template>
  <div>
    <TheNavigation :sticky="false" />
    <main class="pb-6">
      <slot />
    </main>
    <TheFooter />
    <TheSearch />
  </div>
</template>
