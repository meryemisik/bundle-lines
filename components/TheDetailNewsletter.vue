<template>
  <div v-if="isClientMounted">
    <pre>{{ posts }}</pre>
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
  () => props.posts.news && props.posts.news.length > 0
);

onMounted(() => {
  isClientMounted.value = true;
});
</script>
