<template>
  <the-header :data="posts" />
  <v-sheet>
    <template v-for="(item, index) in posts?.news" :key="index">
      <the-post-item :data="item" :posts="posts" :dataIndex="index" />
    </template>
    <template v-if="isLoading">
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        type="image,paragraph,actions"
        class="my-3 mx-auto"
        max-width="530"
      />
    </template>
   <the-share-instagram/>
  </v-sheet>
  <the-footer />
</template>
<script setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  posts: {
    type: Array,
    required: true,
  },
});
</script>
