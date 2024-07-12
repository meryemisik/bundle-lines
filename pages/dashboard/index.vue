<template>
  <div class="min-h-screen">
    <main class="max-w-5xl px-5 mx-auto pt-7 lg:px-0">
      <form @submit="createCaricatures" class="mt-5">
        <div>
          <label>Title:</label><br />
          <input
            v-model="formCaricatures.title"
            rules="required"
            type="text"
            name="title"
            id="title"
            style="width: 50%"
          />
        </div>

        <div class="mt-5">
          <label>Sponsor:</label><br />
          <input
            v-model="formCaricatures.sponsor"
            rules="required"
            type="text"
            name="sponsor"
            id="sponsor"
            style="width: 50%"
          />
        </div>
       
        <div v-for="(newsItem, index) in formCaricatures.news" :key="index" class="mt-5">
            
          <div
          class="mt-5"
            v-if="newsItem.type == 0"
            style="border: 1px solid grey; padding: 10px"
          >
            <label class="mt-5">Image Description</label><br />
            <input
              :id="'description-' + index"
              v-model="newsItem.description"
              type="text"
              style="width: 50%"
             
            /><br />
            <input type="file" @change="imageUpload($event, newsItem)"  class="mt-5"/>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-3 mt-7">
          <button type="submit">Create</button>
        </div>
      </form>

      <div class="relative mt-5 border border-gray-100 rounded-lg">
        Liste
        <pre>{{ caricatureStore.caricatures }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const caricatureStore = useCaricatureStore();

useAsyncData(async () => await caricatureStore.getAll(), {});


//"video = 1, img = 0, slider = 2"
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

const imageUpload = (event: any, newsItem: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    newsItem.content[0].url = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

const createCaricatures = async (values: any, ctx: any) => {
  if (!formCaricatures.value._id) {
    await caricatureStore.create(formCaricatures);
  } else {
    caricatureStore.update(formCaricatures.value._id, values.name);
  }
};
</script>
