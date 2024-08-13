<template>
  <div>
    <div v-for="(caricature, index) in allCaricaturesData" :key="index">
      <the-news-container :posts="caricature" :isLoading="false"/>
    </div>
  </div>
</template>

<script setup>
const allCaricaturesData = ref([]);
// import { useRouter } from 'vue-router'

// const router = useRouter()

// router.push('/dashboard')
const hasPosts = ref(false)
onMounted(() => {
  getAll();
});
const getAll = async () => {
  try {
    allCaricaturesData.value = await $fetch("/api/caricatures")
    hasPosts.value= true
    return allCaricaturesData.value;
  } catch (e) {
    console.error(e);
  }
};
</script>
