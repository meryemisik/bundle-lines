<template>
  <v-container class="page-container">
    <v-row class="mb-0 mb-md-4 mb-lg-8 mt-n16">
      <v-col>
        <v-img :width="180" src="/logo/logo.svg" />
      </v-col>
    </v-row>
    <v-row class="mb-0 mb-md-4 mb-lg-8">
      <v-col cols="12">
          <template v-if="!isLoading">
            <h1 class="font-weight-regular header-title" v-html="title"></h1>
          </template>
          <template v-else>
            <v-skeleton-loader
              class="mx-auto"
              type="heading"
            ></v-skeleton-loader>
          </template>
      </v-col>
      <v-col class="mt-n4" v-if="!isLoading">
        <div class="d-inline-flex">
          <v-img :width="64" :src="sponsorshipLogo[0].url" class="mr-2" v-if="sponsorshipLogo?.[0]?.url" />
          <span class="text-sponsorship font-weight-medium font-barlow">{{
            sponsorship
          }}</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

const props = defineProps({
  data: Object,
});

const isLoading = ref(true);
const title = ref(null);
const sponsorship = ref(null);
const sponsorshipLogo = ref(null);

watch(
  () => props.data,
  (newData) => {
    if (newData && newData.title) {
      isLoading.value = false;
      title.value = newData.title;
      sponsorship.value = newData.sponsor;
      sponsorshipLogo.value = newData.sponsorImage;
    }
  },
  { immediate: true }
);
</script>
