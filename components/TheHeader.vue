<template>
  <div>
    <template v-if="!isLoading">
      <v-container fluid class="pa-0">
        <div
          class="mb-0 mb-md-4 mb-lg-8 bg-white pa-0 mt-0 mx-0 align-center d-flex"
        >
          <div class="bg-grey-darken-4 py-6 px-8">
            <v-img :width="28" src="/logo/logo-icon.png" />
          </div>
          <div class="page-container">
            <v-img :width="180" src="/logo/logo-dark.png" />
          </div>
          <div>
            <v-img
              :width="30"
              src="/icons/share-button.png"
              class="cursor-pointer"
              @click="shareWebSite()"
            />
          </div>
        </div>
        <v-row class="mb-0 mb-md-4 mb-lg-8 page-container mx-auto">
          <v-col cols="12" class="pb-0 mx-n2">
            <template v-if="!isLoading">
              <div class="header-title mt-4">
                <span class="font-playfair" v-html="title"></span>
              </div>
              <div class="header-subtitle mt-3">
                <span class="font-playfair">{{ subTitle }}</span>
              </div>
            </template>
            <template v-else>
              <v-skeleton-loader
                class="mx-auto"
                type="heading"
              ></v-skeleton-loader>
            </template>
          </v-col>
          <v-col class="mt-n4 mx-n2" v-show="sponsorship" v-if="!isLoading">
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
        <v-snackbar
          v-model="isSnackbarVisible"
          timeout="3000"
          location="top right"
          :color="snackbarColor"
        >
          {{ snackbarMsg }}
        </v-snackbar>
      </v-container>
    </template>
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
const props = defineProps({
  data: Object,
});

const isLoading = ref(true);
const title = ref(null);
const subTitle = ref(null)
const sponsorship = ref(null);
const sponsorshipLogo = ref(null);
const isSnackbarVisible = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");

const shareWebSite = () => {
  const currentUrl = window.location.origin;
  navigator.clipboard.writeText(currentUrl).then(() => {
    isSnackbarVisible.value = true;
    snackbarColor.value = "success";
    snackbarMsg.value = "URL kopyalandı!";
  });
};
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      isLoading.value = false;
      title.value = newData.title;
      subTitle.value = newData.subTitle
      sponsorship.value = newData.sponsorship;
      sponsorshipLogo.value = newData.sponsorshipLogo;
    }
  },
  { immediate: true }
);
</script>
