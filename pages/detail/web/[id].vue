<template>
  <v-app>
    <v-main>
      <the-detail-newsletter
        :posts="posts"
        :isLoading="globalStore.isLoading"
        :referrer="'web-content'"
      />
    </v-main>
  </v-app>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAsyncData, useHead } from "#app";
import { useGlobalStore } from "~/stores/globalStore";
const globalStore = useGlobalStore();
const route = useRoute();
const imgSrc = ref("");
const posts = ref({
  news: [],
});
const pageTitle = ref("Loading Bundle Lines");

const newsUuid = route.query.newsId || "";

const getAllData = async () => {
  try {
    const response = await $fetch(
      `/api/web-content/getByNewsId?newsUuid=${newsUuid}`
    );

    if (response && response.news) {
      globalStore.setLoading(true);
      posts.value = response;
      imgSrc.value = response.news[0]?.content[0]?.url || "/default-image.jpg";
      pageTitle.value = response.news[0]?.title || "Bundle Lines";
    } else {
      posts.value = { news: [] };
      console.warn("Response has no news array!");
    }
  } catch (e) {
    console.error("Error fetching posts:", e);
  }
};

globalStore.setActiveDetailPage("detail");
await getAllData();

useHead({
  title: pageTitle.value,
  meta: [
    {
      name: "description",
      content:
        posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    {
      property: "og:title",
      content:
        posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    {
      property: "og:description",
      content:
        posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    { property: "og:image", content: imgSrc.value },
    { property: "og:image:width", content: 256 },
    { property: "og:image:height", content: 256 },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: "Bundle Lines" },
    {
      property: "og:url",
      content: `https://bundlelines.bundle.app${route.fullPath}`,
    },
    { property: "og:locale", content: "tr_TR" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content:
        posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    {
      name: "twitter:description",
      content:
        posts.value.news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    { name: "twitter:image", content: imgSrc.value },
  ],
  link: [
    {
      rel: "canonical",
      href: `https://bundlelines.bundle.app${route.fullPath}`,
    },
  ],
});
</script>
