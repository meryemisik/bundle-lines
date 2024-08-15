<template>
  <div v-if="isClientMounted">
    <the-post-item
      :data="posts.news[route.query.newsId]"
      :posts="postsUpdated"
      :dataIndex="route.query.newsId"
    />
  </div>
  <div v-else>
    <v-skeleton-loader
      type="image,paragraph,actions"
      class="my-3 mx-auto pa-3 bg-light rounded-xl"
      max-width="600"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  posts: {
    type: Object,
    required: true,
    default: () => ({
      news: [],
    }),
  },
});
const postsUpdated = ref(null);
const isClientMounted = ref(false);
const hasPosts = computed(
  () => props.posts.news && props.posts.news.length > 0
);

onMounted(() => {
  isClientMounted.value = true;

  const selectedNews = props?.posts.news[route.query.newsId];

  const updatedData = {
    ...props?.posts,
    news: selectedNews,
  };
  postsUpdated.value = updatedData;
});
</script>
