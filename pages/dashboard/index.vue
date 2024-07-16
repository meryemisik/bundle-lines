<template>
  <div style="margin: auto; width: 50%">
    <form class="mt-5">
      <label>Analytics Id  :</label><br />
      <input
        v-model="formCaricatures.analyticsId"
        type="text"
        placeholder="Enter image description"
      /><br />
      <label>Analytics Campaign Id  :</label><br />
      <input
        v-model="formCaricatures.campaignName"
        type="text"
        placeholder="Enter image description"
      /><br />

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
        @click="createCaricatures(formCaricatures)"
        style="border: 1px solid grey; padding: 10px; background: red" type="button"
      >
        Create
      </button>
    </form>

    <div class="relative mt-5 border border-gray-100 rounded-lg">
      formCaricatures:
      <pre>{{ formCaricatures }}</pre>
      <!-- uploadImage
      <pre>{{ uploadImage }}</pre>
      uploadSlider:
      <pre>{{ uploadSlider }}</pre>
      uploadVideo :
      <pre>{{ uploadVideo }}</pre> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const formCaricatures = ref({
  sponsor: "",
  title: "",
  news: [],
  analyticsId:"",
  campaignName:"",
  sponsorImage:""
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
    const imageContent = {
      description: uploadImage.value.description,
      content: [{ url: reader.result as string }],
      type: 0,
    };
    formCaricatures.value.news.push(imageContent);
  };

  reader.readAsDataURL(file);
};
const SponsorImageUploadFunction = (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    formCaricatures.value.sponsorImage = reader.result as string;
  };

  reader.readAsDataURL(file);
};

const SliderUploadFunction = (event: any) => {
  const files = event.target.files;
  if (!files) return;
  
  const sliderContent = {
    description: uploadSlider.value.description,
    content: [],
    type: 2,
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = () => {
      sliderContent.content.push({
        url: reader.result as string,
      });

      if (sliderContent.content.length === files.length) {
        formCaricatures.value.news.push(sliderContent);
      }
    };

    reader.readAsDataURL(file);
  }
};

const VideoUploadFunction = (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const videoContent = {
      description: uploadVideo.value.description,
      content: [{ url: reader.result as string }],
      type: 1,
    };
    formCaricatures.value.news.push(videoContent);
  };

  reader.readAsDataURL(file);
};
const getAll = async () => {
  try {
    let data = await $fetch("/api/caricatures");
    return data;
  } catch (e) {
    alert(e);
  }
};

const createCaricatures = async (event:any) => {
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
