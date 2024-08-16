<template>
  <div v-if="isClientMounted">
    <the-post-item :data="postsUpdated.news" :posts="postsUpdated" />
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

onMounted(() => {
  isClientMounted.value = true;

  const contentArray = props?.posts?.news?.[0]?.content?.map((item) => {
    if (!item.uuid) {
      return { ...item, uuid: "null" };
    }
    return item;
  });

  const targetObject = contentArray?.find(
    (item) => item.uuid === route.query.newsId
  );

  const selectedNews = [];
  selectedNews.push(targetObject);

  let typeNum = props?.posts?.news?.[0].type;
  if (props?.posts?.news?.[0].type == 2) {
    typeNum = "0";
  }

  const updatedData = {
    ...props?.posts,
    news: [
      {
        ...props?.posts?.news?.[0],
        content: selectedNews,
        type: typeNum,
      },
    ],
    ...props?.posts?.news.slice(1),
  };
  postsUpdated.value = updatedData;
});
</script>
