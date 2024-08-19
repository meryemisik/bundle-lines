<template>
  <div>
    <template v-if="!isLoading">
      <v-container fluid class="pa-0" >
        <div
          class="mb-8 bg-white pa-0 mt-0 mx-0 align-center d-flex" style="height:72px"
        >
          <div class="bg-grey-darken-4 py-6 px-8" v-if="!isSmallScreen">
            <v-img :width="28" src="/logo/logo-icon.png" />
          </div>
          <div class="ml-4 cursor-pointer" v-if="globalStore.activeDetailPage && isSmallScreen" @click="redirectToBundle">
            <v-img :width="40" src="/icons/arrow-left.png" />
          </div>
          <div
            class="ml-4 cursor-pointer"
            v-if="!globalStore.activeDetailPage"
            @click="goToHomePage()"
          >
            <v-img :width="40" src="/icons/arrow-left.png" />
          </div>
          <div class="page-container">
            <v-img
              :width="180"
              src="/logo/logo-dark.png"
              :class="{ 'mx-auto': isSmallScreen }"
            />
          </div>
          <div>
            <v-img
              :width="40"
              src="/icons/share-button.png"
              class="cursor-pointer mr-4"
              @click="shareWebSite()"
            />
          </div>
        </div>
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
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});
import { useGlobalStore } from "~/stores/globalStore";
const isSmallScreen = ref(false);
const globalStore = useGlobalStore();
const isLoading = ref(!globalStore.isLoading);
const isSnackbarVisible = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");

const shareWebSite = () => {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    isSnackbarVisible.value = true;
    snackbarColor.value = "success";
    snackbarMsg.value = "URL kopyalandı!";
  });
};
const goToHomePage = () => {
  const router = useRouter();
  router.push("/");
  globalStore.setActiveDetailPage(false);
};
const redirectToBundle = () => {
  window.location.href = "https://www.bundle.app/bundle-lines";
};
const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  globalStore.setActiveDetailPage(false);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>
