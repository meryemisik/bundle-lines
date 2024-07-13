<template>
    <div>
      <label>Slider Description:</label><br />
      <input
        v-model="uploadSlider.description"
        type="text"
        placeholder="Enter slider description"
      /><br />
      <input type="file" @change="handleFileUpload($event)" multiple />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';

  const caricatureStore = useCaricatureStore();
  
  const uploadSlider = ref({
    description: '',
    content: [],
    type: 2,
  });
  
  const handleFileUpload = (event: any) => {
    const files = event.target.files;
    if (!files) return;
  
    // Tüm önceki içeriği temizle
    uploadSlider.value.content = [];
  
    // Her bir dosyayı işle
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = () => {
        uploadSlider.value.content.push({
          url: reader.result as string,
        });
      };
  
      reader.readAsDataURL(file);
    }
  
    // Store'a yükleme işlemini bildir
    caricatureStore.setUploadSlider(uploadSlider.value);
  };
  </script>
  