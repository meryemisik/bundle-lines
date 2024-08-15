<template>
  <the-post-item
    :data="posts.news"
    :posts="posts"
    :dataIndex="dataIndex"
  />
</template>

<script setup>
const props = defineProps({
  posts: {
    type: Object,
    required: true,
    default: () => ({
      news: {},
    }),
  },
  dataIndex: {
    type: Number,
    required: true,
  },
});
const hasPosts = computed(() => props.posts.news);
</script>
