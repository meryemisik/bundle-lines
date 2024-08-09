<template>
  <v-app>
    <v-main>
      <the-news-container :isLoading="isLoading" :posts="posts" />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAsyncData, useHead } from '#app';

const route = useRoute();
const imgSrc = ref("");
const isLoading = ref(true);
const posts = ref({
  news: [], // Initialize with a safe default structure
});
const pageTitle = ref('Loading Bundle Lines');

const fetchPosts = async () => {
  try {
    const response = await $fetch(`/api/caricatures/getById?id=${route.params.id}`);
    if (response && response.news) {
      posts.value = response;
      imgSrc.value = response.news[0]?.content[0]?.url || '/default-image.jpg';
      pageTitle.value = response.news[0]?.title || 'Bundle Lines';
    } else {
      posts.value = { news: [] };  // Ensure the structure if the response is malformed
      console.warn('Response has no news array!');
    }
    isLoading.value = false;
  } catch (e) {
    // Handle error appropriately
    console.error('Error fetching posts:', e);
  }
};

await fetchPosts();

useHead({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") || 'Bundle Lines' },
    { property: 'og:title', content: posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") || 'Bundle Lines' },
    { property: 'og:description', content: posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") || 'Bundle Lines' },
    { property: 'og:image', content: imgSrc.value },
    { property: 'og:image:width', content: 256 },
    { property: 'og:image:height', content: 256 },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'Bundle Lines' },
    { property: 'og:url', content: `https://bundlelines.bundle.app${route.fullPath}` },
    { property: 'og:locale', content: 'tr_TR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") || 'Bundle Lines' },
    { name: 'twitter:description', content: posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") || 'Bundle Lines' },
    { name: 'twitter:image', content: imgSrc.value },
  ],
  link: [
    { rel: 'canonical', href: `https://bundlelines.bundle.app${route.fullPath}` },
  ],
});
</script>
