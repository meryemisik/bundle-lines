<template>
  <div>
    <v-row class="page-container mx-auto px-4 header" v-if="!isLoading">
      <v-col cols="12" class="py-0">
        <template v-if="!isLoading">
          <div class="header-title text-black">
            <span class="font-playfair" v-html="webContent[0]?.title"></span>
          </div>
        </template>
      </v-col>
      <v-col cols="12" class="py-0">
        <template v-if="!isLoading">
          <div class="header-subtitle text-black">
            <span class="font-playfair">{{ webContent[0]?.subtitle }}</span>
          </div>
        </template>
      </v-col>
      <v-col
        cols="12"
        class="header-sponsor-image py-0"
        v-show="webContent[0]?.sponsor || webContent[0]?.sponsorImage"
        v-if="!isLoading"
      >
        <div class="d-inline-flex align-center">
          <v-img
            :width="80"
            :src="webContent[0].sponsorImage"
            class="mr-4 sponsor-image"
            v-if="webContent[0].sponsorImage"
          />

          <v-divider
            vertical
            v-if="webContent[0].sponsorImage && webContent[0].sponsor"
            class="ma-auto divider"
          />

          <span class="text-sponsorship font-weight-medium font-roboto ml-4">
            {{ webContent[0]?.sponsor }}
          </span>
        </div>
      </v-col>
    </v-row>
    <div v-for="(caricature, index) in allCaricaturesData" :key="index">
      <the-news-container :posts="caricature" :sourcePage="'web'" />
      <div v-if="(index + 1) % 3 === 0">
        <the-adds />
      </div>
    </div>
    <div
      class="page-container d-flex justify-center mb-8"
      @click="moreLoad"
      v-if="allCaricaturesData.length > 0 && isVisibleMoreLoadBtn"
    >
      <span class="cursor-pointer font-playfair more-load text-black"
        >Daha Fazlasını Gör</span
      >
    </div>
    <div v-if="isLoading">
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        type="image,paragraph,actions"
        class="my-3 mx-auto pa-3 bg-light rounded-xl"
        max-width="600"
      />
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from "~/stores/globalStore";

const globalStore = useGlobalStore();
const isLoading = ref(true);
const allCaricaturesData = ref([]);
const hasPosts = ref(false);
const pageNum = ref(1);
const webContent = ref([]);
const isVisibleMoreLoadBtn = ref(true)
onMounted(async () => {
  await getWebContent();
  await getAllCaricatureWithPagination(pageNum.value);
  globalStore.setActiveDetailPage("web");
  localStorage.setItem("locationType", "web");
});

const getAllCaricatureWithPagination = async (num) => {
  try {
    const data = await $fetch(`/api/web-content/getByPageNum?pageNum=${num}`);
    if(data.length == 0){
      isVisibleMoreLoadBtn.value = false
    }
    hasPosts.value = true;
    pageNum.value++;
    globalStore.setLoading(true);

    const updatedDataArray = data.map((item) => {
      return {
        ...item,
        news: [item.news],
      };
    });
    allCaricaturesData.value = [
      ...allCaricaturesData.value,
      ...updatedDataArray,
    ];
    isLoading.value = false;
    return allCaricaturesData.value;
  } catch (e) {
    console.error(e);
  }
};

const moreLoad = () => {
  getAllCaricatureWithPagination(pageNum.value);
};

const getWebContent = async () => {
  try {
    const data = await $fetch(`/api/web-content`);
    webContent.value = data;

    globalStore.setLoading(true);
  } catch (e) {
    console.error(e);
  }
};
</script>
