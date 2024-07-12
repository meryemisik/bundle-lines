<template>
    <div>
      <input v-model="title" @input="updateTitle" placeholder="Enter title" />
      <h1>{{ title }}</h1>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  
  const props = defineProps<{ initialTitle: string }>();
  const emit = defineEmits(['update:title']);
  
  const title = ref(props.initialTitle);
  
  const updateTitle = () => {
    emit('update:title', title.value);
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 2em;
    color: #333;
  }
  input {
    font-size: 1em;
    padding: 0.5em;
    margin-bottom: 1em;
  }
  </style>
  