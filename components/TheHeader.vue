<template>
  <v-container fluid class="pb-0">
    <v-row class="mb-0 mb-md-4 mb-lg-8 bg-white pa-0">
      <v-col cols="auto" class="pa-0">
        <div class="bg-grey-darken-4 py-2 px-4">
          <v-img :width="28" src="/logo/logo-icon.png" />
        </div>
      </v-col>
      <v-col class="page-container">
        <v-img :width="180" src="/logo/logo-dark.png" />
      </v-col>
      <v-col cols="auto"> paylaş </v-col>
    </v-row>
    <v-row class="mb-0 mb-md-4 mb-lg-8 page-container mx-auto">
      <v-col cols="12" class="pb-0">
        <template v-if="!isLoading">
          <h1
            style="
              font-family: 'MetaSerifPro' !important;
              font-weight: 350 !important;
            "
            class="font-weight-regular header-title"
          >
            <span v-html="title"></span>
          </h1>
        </template>
        <template v-else>
          <v-skeleton-loader class="mx-auto" type="heading"></v-skeleton-loader>
        </template>
      </v-col>
      <v-col class="mt-n4" v-show="sponsorship" v-if="!isLoading">
        <div class="d-inline-flex">
          <v-img
            :width="64"
            :src="sponsorshipLogo[0].url"
            class="mr-2"
            v-if="sponsorshipLogo?.[0]?.url"
          />
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
