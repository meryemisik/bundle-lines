<template>
  <the-post-item :data="posts.news" :posts="posts" :referrer="referrer"/>
</template>

<script setup>
const props = defineProps({
  posts: {
    type: Object,
    required: true,
    default: () => ({
      news: [],
    }),
  },
  referrer: {
    type: String,
    required: true,
  },
});
</script>
