<template>
  <div :class="{ 'sticky-header': stickyHeader }">
    <template v-if="!isLoading">
      <v-container fluid class="pa-0 header">
        <div
          class="pa-0 mt-0 mx-0 align-center d-flex header-light-bg"
          style="height: 72px; border-bottom: 0.5px solid #b3b3b3"
        >
          <div
            class="py-6 px-4 cursor-pointer"
            style="height: 100%; display: flex"
            :class="{ 'header-dark-bg px-8': !isSmallScreen }"
            v-if="globalStore.activeDetailPage != 'detail' || !isSmallScreen"
            @click="redirectToBundleApp"
          >
            <v-img :width="28" src="/logo/logo-icon.png" />
          </div>
          <div
            class="ml-5 cursor-pointer"
            v-if="globalStore.activeDetailPage == 'detail'"
            @click="goToHome()"
          >
            <v-img :width="40" src="/icons/arrow-left.png" />
          </div>
          <div class="page-container">
            <v-img
              :width="isSmallScreen ? 110 : 180"
              src="/logo/logo-dark.png"
              :class="{ 'mx-auto ': isSmallScreen }"
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
          class="custom-snackbar"
        >
          <span :class="snackbarTextColor">{{ snackbarMsg }}</span>
          <div class="custom-snackbar-image"><v-img src="/icons/snackbar/success-link.png"/></div>
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
const snackbarTextColor = ref("");
const router = useRouter();
const route = useRoute();
const stickyHeader = ref(false);
const shareWebSite = () => {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    isSnackbarVisible.value = true;
    snackbarColor.value = "#181E25";
    snackbarMsg.value = "URL Kopyalandı";
    snackbarTextColor.value = "snackbar-success-color";
  });
};

const redirectToBundleApp = () => {
  window.open("https://www.bundle.app/");
};
const goToHome = () => {
  const match = route.fullPath.match(/\/detail\/(web|newsletter)\/([a-f0-9]+)/);

  if (match) {
    const type = match[1];
    const id = match[2];

    if (type === "web") {
      router.push(`/`);
    } else if (type === "newsletter") {
      router.push(`/newsletter/${id}`);
    }
  } else {
    router.push(`/`);
  }
};

const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 768;
};

const checkRoute = () => {
  if (route.fullPath == "/") {
    stickyHeader.value = true;
  }
};
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  checkRoute();
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath != "/") {
      stickyHeader.value = false;
    }
  }
);
</script>
