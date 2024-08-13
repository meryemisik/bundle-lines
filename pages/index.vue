<template>
  <div>
    <div v-for="(caricature, index) in allCaricaturesData" :key="index">
      <the-news-container :posts="caricature" :isLoading="isLoading" :dataIndex="index" />
    </div>
    <v-btn @click="moreLoad">Daha fazla</v-btn>
  </div>
</template>

<script setup>
const isLoading = ref(true)
const headerData = inject('headerData');
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
    headerData.value = {"asd":"123", "sdcsdc":"3232342"};
    isLoading.value = false
    allCaricaturesData.value = [...allCaricaturesData.value, ...data];
    return allCaricaturesData.value;
  } catch (e) {
    console.error(e);
  }
};

const moreLoad = () => {
  getAllCaricatureWithPagination(pageNum.value);
};
</script>
