<template>
  <v-app>
    <v-main>
      <the-news-container :isLoading="isLoading" :posts="posts" />
    </v-main>
  </v-app>
</template>

<script setup>
const isLoading = ref(true);
const posts = ref({});

const route = useRoute();
const id = route.params.id;
onMounted(async () => {
  try {
    let data = await $fetch(`/api/caricatures/getById?id=${id}`).then((res) => {
      isLoading.value = false;
      posts.value = res;
    });
    return data;
  } catch (e) {
    console.error(e);
  }
});
</script>
