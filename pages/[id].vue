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
const route = useRoute();
const id = route.params.id;
const imgSrc = ref(null);
const fullPostId = ref(null);
const isLoading = ref(true);

const router = useRouter();

const goToPost = () => {
  router.push(`/newsletter/${fullPostId.value}`);
};

// useSeoMeta({
//   title: "Bundle Lines",
//   ogTitle: "Bundle Lines",
//   description: "Bundle Lines",
//   ogDescription: "Bundle Lines",
//   ogImage: imgSrc.value,
//   twitterCard: "summary_large_image",
//   ogType: "article",
//   ogSiteName: "Bundle Lines",
//   ogUrl: window.location.href,
//   ogLocale: "tr_TR",
//   twitterTitle: "Bundle Lines",
//   twitterDescription: "Bundle Lines",
//   twitterImage: imgSrc.value,
// });

onMounted(async () => {
  try {
    let data = await $fetch(`/api/newsletter-detail/getById?imageId=${id}`).then((res) => {
      imgSrc.value = res.imgSrc
      fullPostId.value = res.fullPostId
      isLoading.value = false
    });
    return data;
  } catch (e) {
    alert(e);
  }
});

useHead({
  bodyAttrs: {
    class: "shared-image",
  },
});
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
