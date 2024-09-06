<template>
  <div>
    <the-header v-if="globalStore.isLoading" />
    <template v-else>
      <div class="page-container my-3 mx-auto">
        <v-skeleton-loader
          class="mx-auto rounded-xl"
          type="heading"
        ></v-skeleton-loader>
      </div>
    </template>
    <v-app>
      <v-main>
        <slot />
      </v-main>
    </v-app>

    <the-share-instagram v-if="globalStore.isLoading" />
    <template v-else>
      <div class="page-container my-3 mx-auto">
        <v-skeleton-loader
          class="mx-auto rounded-xl"
          type="heading"
        ></v-skeleton-loader>
      </div>
    </template>
    <the-footer v-if="globalStore.isLoading" />
    <template v-else>
      <div class="page-container my-3 mx-auto">
        <v-skeleton-loader
          class="mx-auto rounded-xl"
          type="heading"
        ></v-skeleton-loader>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useGlobalStore } from "~/stores/globalStore";
const globalStore = useGlobalStore();
</script>