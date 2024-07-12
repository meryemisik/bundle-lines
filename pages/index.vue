<template>
  <div class="min-h-screen">
    <main class="max-w-5xl px-5 mx-auto pt-7 lg:px-0">
      <div class="relative mt-5 border border-gray-100 rounded-lg">
        Liste
        <pre>{{ caricatureStore.caricatures }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const caricatureStore = useCaricatureStore();

useAsyncData(async () => await caricatureStore.getAll(), {});

</script>
