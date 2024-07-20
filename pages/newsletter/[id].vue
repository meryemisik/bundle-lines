<template>
  <v-app>
    <v-main>
      <the-header :data="posts" />
      <v-sheet>
        <template v-for="(item, index) in posts?.news" :key="index">
          <the-post-item :data="item" :posts="posts" :dataIndex="index" />
        </template>
        <template v-if="isLoading" v-for="i in 3" :key="i">
          <v-skeleton-loader
            type="image,paragraph,actions"
            class="my-3 mx-auto"
            max-width="530"
          />
        </template>
      </v-sheet>
      <the-footer />
    </v-main>
  </v-app>
</template>

<script setup>
const isLoading = ref(true);
const posts = ref(null);

const route = useRoute();
const id = route.params.id;
onMounted(async () => {
  try {
    let data = await $fetch(`/api/caricatures/getById?id=${id}`).then((res) => {
      isLoading.value = false;
      posts.value = res;
    });
    return data;
  } catch (e) {
    alert(e);
  }
});
</script>
