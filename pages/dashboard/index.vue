<template>
  <div style="margin: auto;
    width: 50%;">
    <form class="mt-5">
      <the-title-component />
      <the-sponsor-component />

      <the-image-uploader />
      <the-slider-uploader />
      <the-video-uplader />
      <button
        @click="createCaricatures"
        style="border: 1px solid grey; padding: 10px; background: red"
      >
        Create
      </button>
    </form>

    <div class="relative mt-5 border border-gray-100 rounded-lg">
      Liste
      <pre>{{ caricatureStore.caricatures }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const caricatureStore = useCaricatureStore();

useAsyncData(async () => await caricatureStore.getAll(), {});

const formCaricatures = ref({
  sponsor: "",
  title: "",
  news: [
    {
      description: "",
      content: [
        {
          url: "",
        },
      ],
      type: 0,
    },
    {
      description: "",
      content: [
        {
          url: "",
        },
        {
          url: "",
        },
      ],
      type: 1,
    },
    {
      description: "",
      content: [
        {
          url: "",
        },
        {
          url: "",
        },
      ],
      type: 2,
    },
  ],
});

const createCaricatures = async (values: any, ctx: any) => {
  await caricatureStore.create();
};
</script>
