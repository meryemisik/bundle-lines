<template>
    <div>
      <label>Video Description:</label><br />
      <input
        v-model="uploadVideo.description"
        type="text"
        placeholder="Enter video description"
      /><br />
      <input type="file" @change="handleVideoUpload($event)" />
    </div>
  </template>
  
  <script setup lang="ts">

  const caricatureStore = useCaricatureStore();
  
  const uploadVideo = ref({
    description: '',
    content: [],
    type: 1,
  });
  
  const handleVideoUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      uploadVideo.value.content.push({
          url: reader.result as string,
        });

    };
  
    reader.readAsDataURL(file);
  
    caricatureStore.setUploadVideo(uploadVideo.value);
  };
  </script>
  