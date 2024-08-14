<template>
  <div>
    <template v-if="!isLoading">
      <v-container class="page-container">
        <v-row class="align-center">
          <v-col class="d-flex justify-center flex-column m-0 p-0">
            <v-img :width="138" src="/logo/footer-logo.svg" />
          </v-col>
          <v-col
            class="d-flex align-end flex-column m-0 p-0 footer-text font-roboto"
            >Bundle ürünüdür.</v-col
          >
        </v-row>
      </v-container>
    </template>
    <template v-else>
      <div class="page-container my-3 mx-auto">
        <v-skeleton-loader
          class="mx-auto rounded-xl"
          type="heading"
        ></v-skeleton-loader>
      </div>
    </template>
  </div>
</template>
<script setup>
const props = defineProps({
  data: Object,
});
const isLoading = ref(true);
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      isLoading.value = false;
    }
  },
  { immediate: true }
);
</script>

<style>
.footer-text {
  font-size: 10px !important;
  font-weight: 500 !important;
  line-height: 10px;
  letter-spacing: 0.02em;
  text-align: left;
}
</style>
