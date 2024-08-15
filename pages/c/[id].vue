<template>
  <div class="d-flex w-100 h-screen justify-center align-center">
    <template v-if="!isLoading">
      <v-img :src="imgSrc" class="mx-auto" />
      <v-btn
        @click="goToPost"
        class="position-absolute go-to-post"
        color="primary"
        ><span class="font-barlow">Postu Gör</span>
      </v-btn>
    </template>
    <template v-else>
      <v-skeleton-loader
        type="image,paragraph"
        class="my-3 mx-auto"
        width="400"
      />
    </template>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAsyncData, useHead } from "#app";
definePageMeta({
  layout: 'dashboard'
})
const route = useRoute();
const router = useRouter();

const imgSrc = ref(null);
const fullPostId = ref(null);
const isLoading = ref(true);

const { data, pending, error } = await useAsyncData(
  "newsletterDetails",
  async () => {
    const response = await $fetch(
      `/api/newsletter-detail/getById?imageId=${route.params.id}`
    );
    return response;
  }
);

if (!error.value) {
  imgSrc.value = data.value.imgSrc;
  fullPostId.value = data.value.fullPostId;
  isLoading.value = false;
}

useHead(() => ({
  title: !isLoading.value ? "Bundle Lines" : "Loading Bundle Lines",
  meta: [
    { name: "description", content: "Bundle Lines" },
    { property: "og:title", content: "Bundle Lines" },
    { property: "og:description", content: "Bundle Lines" },
    { property: "og:image", content: imgSrc.value },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: "Bundle Lines" },
    {
      property: "og:url",
      content: `https://bundlelines.bundle.app${route.fullPath}`,
    },
    { property: "og:locale", content: "tr_TR" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Bundle Lines" },
    { name: "twitter:description", content: "Bundle Lines" },
    { name: "twitter:image", content: imgSrc.value },
  ],
  link: [
    {
      rel: "canonical",
      href: `https://bundlelines.bundle.app${route.fullPath}`,
    },
  ],
}));

const goToPost = () => {
  router.push(`/newsletter/${fullPostId.value}`);
};
</script>

<style lang="scss">
.shared-image {
  background-color: #292929 !important;
  margin: 0;
  &::before,
  &::after {
    display: none;
  }
}
.go-to-post {
  bottom: 20px;
  right: 20px;
}
</style>
