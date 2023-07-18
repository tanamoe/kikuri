<template>
  <div>
    <TheNavigation :sticky="false" />
    <main>
      <slot />
    </main>
    <TheSearch />
  </div>
</template>
