<template>
  <div>
    <v-row class="page-container mx-auto px-4 header">
      <v-col cols="12" v-if="posts[0].title" class="py-0">
        <template v-if="!isLoading">
          <h1 class="font-weight-regular header-title header-title">
            <span v-html="posts[0].title"></span>
          </h1>
        </template>
      </v-col>
      <v-col cols="12" class="py-0" v-if="posts[0]?.subTitle">
        <template v-if="!isLoading">
          <div class="header-subtitle text-black">
            <span class="font-playfair">{{ posts[0]?.subTitle }}</span>
          </div>
        </template>
      </v-col>

      <v-col
        class="mt-n4 pb-0 header-sponsor-image"
        v-if="!posts[0]?.sponsorIsDeleted && posts[0]?.sponsorImage[0]"
      >
        <div class="d-inline-flex align-center" v-if="!isLoading">
          <v-img
            :width="80"
            :src="posts[0].sponsorImage[0]"
            class="mr-4 sponsor-image"
          />
          <v-divider
            vertical
            class="ma-auto divider"
            v-if="posts[0].sponsor && posts[0].sponsorImage[0]"
          />
          <span class="text-sponsorship font-weight-medium font-roboto ml-4">{{
            posts[0].sponsor
          }}</span>
        </div>
      </v-col>
    </v-row>
    <div v-for="(caricature, index) in posts" :key="index" v-if="!isLoading">
      <the-news-container :posts="caricature" :sourcePage="'newsletter'" />
    </div>
    <v-row
      class="page-container mx-auto justify-center px-5 mb-20 newsletter-sponsor-adds cursor-pointer"
    >
      <template v-if="!isLoading">
        <div>
          <img
            :src="posts[0].addSponsorImage[0]"
            v-if="posts[0].addSponsorImage[0]"
            style="border-radius: 20px"
            @click="redirectToUrl(posts[0]?.addSponsorUrl)"
          />
        </div>
      </template>
    </v-row>
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
globalStore.setActiveDetailPage("newsletter");
onMounted(() =>{
  localStorage.setItem("locationType", "newsletter");
})
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
        subTitle: response.subTitle,
        sponsor: response.sponsor,
        sponsorImage: response.sponsorImage,
        addSponsorImage: response.addSponsorImage,
        addSponsorUrl: response.addSponsorUrl,
        sponsorIsDeleted: response.sponsorIsDeleted,
        news: [newsItem],
        analyticsId: response.analyticsId,
        campaignName: response.campaignName,
        // creator: response.creator,
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

const redirectToUrl = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};

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

<style lang="scss">
.newsletter-sponsor-adds {
  margin-top: 8px;
  img {
    width: 600px !important;
    margin-bottom: 84px;
  }
  @media screen and (max-width: 573px) {
    img {
      width: 325px !important;
      margin: auto;
      margin-bottom: 70px;
    }
  }
}
</style>
