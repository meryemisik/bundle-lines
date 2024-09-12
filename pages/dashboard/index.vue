<template>
  <v-container class="page-container">
    <v-tabs v-model="tab" bg-color="blue-grey-darken-1">
      <v-tab value="one">Bülten</v-tab>
      <v-tab value="two">Web</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <the-dashoard-index  contentType = "newsletter"/>
      </v-tabs-window-item>

      <v-tabs-window-item value="two"> <the-web-content /> </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});
const tab = ref(null);
</script>

<style lang="scss">
.v-window__container {
  max-height: 100% !important;
  // background: white;
  // padding: 10px;
}
</style>
