<template>
    <div>
      <label>Sponsor :</label><br />
      <input
        v-model="sponsor"
        type="text"
        placeholder="Enter image description"
        @change="caricatureStore.setUploadSponsor(sponsor)"
      /><br />
    </div>
  </template>
  
  <script setup lang="ts">
  const caricatureStore = useCaricatureStore();
  const sponsor = ref("");
  
  </script>
  