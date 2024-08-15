<template>
  <div>
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
    <div v-for="(caricature, index) in allCaricaturesData" :key="index">
      <the-news-container
        :posts="caricature"
        :isLoading="isLoading"
        :dataIndex="index"
      />
    </div>
    <div
      class="page-container d-flex justify-center mb-5"
      @click="moreLoad"
      v-if="allCaricaturesData.length > 0"
    >
      <span class="cursor-pointer font-playfair more-load"
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
import { useGlobalStore } from '~/stores/globalStore';

const globalStore = useGlobalStore();
const isLoading = ref(true);
const allCaricaturesData = ref([]);
const hasPosts = ref(false);
const pageNum = ref(1);
const title = ref("Türkiye’nin gündem bazlı ilk çizim mecrası ");
const subTitle = ref("Bundle Lines, Türkiye ve dünya gündeminin en konuşulan konularını, sevilen karikatüristlerin çizgileriyle buluşturuyor.")
const sponsorship = ref(null);
const sponsorshipLogo = ref(null);
onMounted(() => {
  getAllCaricatureWithPagination(pageNum.value);
});

const getAllCaricatureWithPagination = async (num) => {
  try {
    const data = await $fetch(`/api/caricatures/getByPageNum?pageNum=${num}`);
    hasPosts.value = true;
    pageNum.value++;
    globalStore.setLoading(true);
    globalStore.setActiveDetailPage(true);
    allCaricaturesData.value = [...allCaricaturesData.value, ...data];
    isLoading.value = false;
    return allCaricaturesData.value;
  } catch (e) {
    console.error(e);
  }
};

const moreLoad = () => {
  getAllCaricatureWithPagination(pageNum.value);
};
</script>
<style>
.more-load {
  padding: 14px 26px;
  gap: 0px;
  border-radius: 40px;
  opacity: 0px;
  border: 1px solid black;
}
</style>
