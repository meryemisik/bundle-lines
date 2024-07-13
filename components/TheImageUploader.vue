<template>
    <div>
      <label>Image Description:</label><br />
      <input
        v-model="uploadImage.description"
        type="text"
        placeholder="Enter image description"
      /><br />
      <input type="file" @change="handleFileUpload($event)" />
    </div>
  </template>
  
  <script setup lang="ts">
  const caricatureStore = useCaricatureStore();

  const uploadImage = ref({
    description: "",
    content: [],
    type: 0,
  });
  
  const handleFileUpload = (event: any) => {
    const file = event.target.files[0]; 
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      uploadImage.value.content.push({
        url: reader.result as string,
      });
    };
  
    reader.readAsDataURL(file);

    caricatureStore.setUploadImage(uploadImage)
    
  };
  </script>
  