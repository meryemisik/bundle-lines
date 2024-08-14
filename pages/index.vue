<template>
  <div>
    <div v-for="(caricature, index) in allCaricaturesData" :key="index">
      <the-news-container
        :posts="caricature"
        :isLoading="isLoading"
        :dataIndex="index"
      />
    </div>
    <div class="page-container d-flex justify-center mb-5" v-if="allCaricaturesData.length > 0">
      <v-btn @click="moreLoad">Daha fazla</v-btn>
    </div>
    <div v-if="isLoading">
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        type="image,paragraph,actions"
        class="my-3 mx-auto"
        max-width="530"
      />
    </div>
  </div>
</template>

<script setup>
const isLoading = ref(true);
const headerData = inject("headerData");
const allCaricaturesData = ref([]);
// import { useRouter } from 'vue-router'

// const router = useRouter()

// router.push('/dashboard')
const hasPosts = ref(false);
const pageNum = ref(1);
onMounted(() => {
  getAllCaricatureWithPagination(pageNum.value);
});

const getAllCaricatureWithPagination = async (num) => {
  try {
    const data = await $fetch(`/api/caricatures/getByPageNum?pageNum=${num}`);
    hasPosts.value = true;
    pageNum.value++;
    headerData.value = { sponsorship: "buraya sponsor adı", sponsorshipLogo: "buraya sponsor logosu" };
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
