<template>
  <the-post-item :data="posts.news" :posts="posts" />
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
});
</script>
