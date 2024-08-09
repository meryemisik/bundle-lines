<template>
  <div v-if="isClientMounted">
    <the-header v-if="hasPosts" :data="posts" />
    <v-sheet>
      <template v-if="hasPosts">
        <template v-for="(item, index) in posts.news" :key="index">
          <the-post-item
            v-if="isClientMounted"
            :data="item"
            :posts="posts"
            :dataIndex="index"
          />
        </template>
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
    </v-sheet>
    <the-share-instagram />
    <the-footer />
  </div>
  <div v-else>
    <v-skeleton-loader
      v-for="i in 3"
      :key="i"
      type="image,paragraph,actions"
      class="my-3 mx-auto"
      max-width="530"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

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
  () => props.posts.news && props.posts.news.length > 0,
);

onMounted(() => {
  isClientMounted.value = true;
});
</script>
