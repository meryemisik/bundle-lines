<template>
  <div>
    <label>Title :</label><br />
    <input
      v-model="title"
      type="text"
      placeholder="Enter image description"
      @change="caricatureStore.setUploadTitle(title)"
    /><br />
  </div>
</template>

<script setup lang="ts">
const caricatureStore = useCaricatureStore();
const title = ref("");

</script>
