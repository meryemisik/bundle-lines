<template>
  <div>
    <v-row class="mb-4 page-container mx-auto">
      <v-col cols="12" class="px-4" v-if="posts[0].title">
        <template v-if="!isLoading">
          <h1 class="font-weight-regular header-title">
            <span v-html="posts[0].title"></span>
          </h1>
        </template>
      </v-col>
      <v-col
        class="mt-n4"
        v-if="posts[0].sponsor || posts[0]?.sponsorImage[0]?.url"
      >
        <div class="d-inline-flex">
          <v-img
            :width="64"
            :src="posts[0]?.sponsorImage[0]?.url"
            class="mr-2"
            v-if="posts[0]?.sponsorImage[0]?.url"
          />
          <span class="text-sponsorship font-weight-medium font-barlow">{{
            posts[0].sponsor
          }}</span>
        </div>
      </v-col>
    </v-row>
    <div v-for="(caricature, index) in posts" :key="index" v-if="!isLoading">
      <the-news-container :posts="caricature" />
    </div>
    <v-skeleton-loader
        v-if="isLoading"
        v-for="i in 3"
        :key="i"
        type="image,paragraph,actions"
        class="my-3 mx-auto pa-3 bg-light rounded-xl"
        max-width="600"
      />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAsyncData, useHead } from "#app";
import { useGlobalStore } from "~/stores/globalStore";
const globalStore = useGlobalStore();
const route = useRoute();
const imgSrc = ref("");
const isLoading = ref(true);
const posts = ref({
  news: [],
});
const pageTitle = ref("Loading Bundle Lines");

const fetchPosts = async () => {
  try {
    const response = await $fetch(
      `/api/caricatures/getById?id=${route.params.id}`
    );
    if (response && response.news) {
      imgSrc.value = response.news[0]?.content[0]?.url || "/default-image.jpg";
      pageTitle.value = response.news[0]?.title || "Bundle Lines";

      const newObjectsArray = response.news.map((newsItem) => ({
        _id: response._id,
        title: response.title,
        sponsor: response.sponsor,
        sponsorImage: response.sponsorImage,
        news: [newsItem],
        analyticsId: response.analyticsId,
        campaignName: response.campaignName,
        creator: response.creator,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        __v: response.__v,
      }));

      posts.value = newObjectsArray;

      setTimeout(() => {
        globalStore.setLoading(true);
        isLoading.value = false;
      }, 2000);
    } else {
      console.warn("Response has no news array!");
    }
  } catch (e) {
    isLoading.value = true;
    console.error("Error fetching posts:", e);
  }
};

await fetchPosts();

useHead({
  title: pageTitle.value,
  meta: [
    {
      name: "description",
      content:
        posts.value[0].news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    {
      property: "og:title",
      content:
        posts.value[0].news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    {
      property: "og:description",
      content:
        posts.value[0].news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
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
        posts.value[0].news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
        "Bundle Lines",
    },
    {
      name: "twitter:description",
      content:
        posts.value[0].news[0]?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
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
