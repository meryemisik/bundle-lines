<template>
  <v-container class="page-container">
    <v-row class="mb-0 mb-md-4 mb-lg-8 mt-n16">
      <v-col>
        <v-img :width="180" src="/logo/logo.svg" />
      </v-col>
    </v-row>
    <v-row class="mb-0 mb-md-4 mb-lg-8">
      <v-col cols="12">
        <h1 class="font-weight-regular header-title">
          <template v-if="!isLoading">
            {{ title }}
          </template>
          <template v-else>
            <v-skeleton-loader
              class="mx-auto"
              type="heading"
            ></v-skeleton-loader>
          </template>
        </h1>
      </v-col>
      <v-col class="mt-n4" v-if="!isLoading">
        <div class="d-inline-flex">
          <v-img :width="64" :src="sponsorshipLogo" class="mr-2" />
          <v-img :width="10" src="/icons/bracket.svg" class="mr-2" />
          <span class="text-sponsorship font-weight-medium font-barlow"
            >SPONSORLUĞUNDA</span
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  data: Object
});

const isLoading = ref(true);
const title = ref(null);
const sponsorshipLogo = ref("/logo/akbank-logo.svg");

watch(
  () => props.data,
  (newData) => {
    if (newData && newData.title) {
      isLoading.value = false;
      title.value = newData.title;
    }
  },
  { immediate: true }
);
</script>
