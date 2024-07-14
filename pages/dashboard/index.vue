<template>
  <div style="margin: auto; width: 50%">
    <form class="mt-5">
      <label>Title :</label><br />
      <input
        v-model="formCaricatures.title"
        type="text"
        placeholder="Enter image description"
      /><br />

      <label>Sponsor :</label><br />
      <input
        v-model="formCaricatures.sponsor"
        type="text"
        placeholder="Enter image description"
      /><br />

      <div>
        <label>Image Description:</label><br />
        <input
          v-model="uploadImage.description"
          type="text"
          placeholder="Enter image description"
        /><br />
        <input type="file" @change="ImageUploadFunction($event)" />
      </div>

      <div>
        <label>Slider Description:</label><br />
        <input
          v-model="uploadSlider.description"
          type="text"
          placeholder="Enter slider description"
        /><br />
        <input type="file" @change="SliderUploadFunction($event)" multiple />
      </div>

      <div>
        <label>Video Description:</label><br />
        <input
          v-model="uploadVideo.description"
          type="text"
          placeholder="Enter video description"
        /><br />
        <input type="file" @change="VideoUploadFunction($event)" />
      </div>
      <button
        @click="createCaricatures"
        style="border: 1px solid grey; padding: 10px; background: red"
      >
        Create
      </button>
    </form>

    <div class="relative mt-5 border border-gray-100 rounded-lg">
      formCaricatures:
      <pre>{{ formCaricatures }}</pre>
      uploadImage
      <pre>{{ uploadImage }}</pre>
      uploadSlider:
      <pre>{{ uploadSlider }}</pre>
      uploadVideo :
      <pre>{{ uploadVideo }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const caricatureStore = useCaricatureStore();

useAsyncData(async () => await caricatureStore.getAll(), {});

const formCaricatures = ref({
  sponsor: "",
  title: "",
  news: [],
});

const uploadImage = ref({
  description: "",
  content: [],
  type: 0,
});

const uploadVideo = ref({
  description: "",
  content: [],
  type: 1,
});

const uploadSlider = ref({
  description: "",
  content: [],
  type: 2,
});

const ImageUploadFunction = (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    uploadImage.value.content.push({
      url: reader.result as string,
    });
  };

  reader.readAsDataURL(file);
  formCaricatures.news.push(uploadImage.value);
};

const SliderUploadFunction = (event: any) => {
  const files = event.target.files;
  if (!files) return;
  uploadSlider.value.content = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = () => {
      uploadSlider.value.content.push({
        url: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
    formCaricatures.news.push(uploadSlider.value);
  }
};

const VideoUploadFunction = (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    uploadVideo.value.content.push({
      url: reader.result as string,
    });
  };

  reader.readAsDataURL(file);
  formCaricatures.news.push(uploadVideo.value);
};
const getAll = async () => {
  try {
    let data = await $fetch("/api/caricatures");
    return data;
  } catch (e) {
    alert(e);
  }
};
const createCaricatures = async (values: any, ctx: any) => {
  console.log(formCaricatures.value);
  try {
    const response = await $fetch("/api/caricatures/create", {
      method: "POST",
      body: formCaricatures.value,
    });

    await getAll();
    alert("Karikatür eklendi");
  } catch (e) {
    alert(e);
  }
};
</script>
