<template>
  <div v-if="isClientMounted">
    <!-- <the-header v-if="hasPosts" :data="posts" /> -->
    <v-col>
      <template v-if="hasPosts">
        <the-post-item
          v-if="isClientMounted"
          :data="posts.news"
          :posts="posts"
          :dataIndex="dataIndex"
        />
      </template>
      <template v-if="isLoading">
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="image,paragraph,actions"
          class="my-3 mx-auto pa-3 bg-light rounded-xl"
          max-width="600"
        />
      </template>
    </v-col>
    <!-- <the-share-instagram />
    <the-footer /> -->
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
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
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

const isClientMounted = ref(false);
const hasPosts = computed(() => props.posts.news);

onMounted(() => {
  isClientMounted.value = true;
});
</script>
