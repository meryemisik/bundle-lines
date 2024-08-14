<template>
  <div v-if="isClientMounted">
    <pre>{{ posts.news[route.query.newsId].content[0].url }}</pre>
  </div>
  <div v-else>
    <v-skeleton-loader
      v-for="i in 3"
      :key="i"
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

const isClientMounted = ref(false);
const hasPosts = computed(
  () => props.posts.news && props.posts.news.length > 0
);

onMounted(() => {
  isClientMounted.value = true;
});
</script>
