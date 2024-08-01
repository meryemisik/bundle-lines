<template>
  <div v-for="caricatures in allCaricatures">
    <div v-for="item in caricatures.news">
      <div v-for="content in item.content">
        <v-card class="mx-auto my-8" elevation="16" max-width="344">
          <v-card-item>
            <v-card-title>{{ caricatures?.title }}</v-card-title>
          </v-card-item>
          <v-img :src="content?.url"/>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const allCaricatures = ref([]);
// import { useRouter } from 'vue-router'

// const router = useRouter()

// router.push('/dashboard')
const getAll = async () => {
  try {
    let data = await $fetch("/api/caricatures");
    allCaricatures.value = data;
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching caricatures data");
  }
};
onMounted(async () => {
  await getAll();
});
</script>
