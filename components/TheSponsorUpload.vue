<template>
    <div class="main-container">
      <div
        class="dropzone-container"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
      >
        <input
          type="file"
          name="file"
          id="fileSponsorInput"
          class="hidden-input"
          @change="onChangeSponsorFile"
          ref="fileSponsor"
          accept="image/*"
        />
  
        <label
          for="fileSponsorInput"
          class="file-label h-100 d-flex align-center justify-center"
          v-if="!internalFiles.length"
        >
          <div v-if="isDragging">Release to drop files here.</div>
          <div v-else class="d-flex flex-column align-center">
            <div class="text-grey">Drag and drop here to add more</div>
            <span class="my-4 d-block text-grey">or</span>
            <div
              class="d-flex rounded-pill bg-grey-lighten-4 text-grey-darken-3 text-center px-8 py-2 text-body-2"
            >
              <v-icon icon="mdi-folder-open" class="mr-4" />
              <span>Browse a file</span>
            </div>
            <div class="font-weight-thin text-body-2 text-grey mt-3">
              Please read our Data & Privacy Policy for any concerns.
            </div>
          </div>
        </label>
        <div
          class="preview-container justify-center mt-4"
          v-if="internalFiles.length"
        >
          <div
            v-for="(file, index) in internalFiles"
            :key="file.name"
            class="preview-card"
            :title="file.name"
          >
            <img :src="file.url" alt="Preview" class="preview-image" />
            <p class="text-truncate w-100 text-caption text-grey-darken-1 mt-2">
              {{ file.name }}<br />
            </p>
  
            <button type="button" @click="remove(index)" title="Remove file">
              <b>×</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from "vue";
  
  export default {
    props: {
      models: {
        type: Array,
        default: () => [],
      },
    },
    setup(props, { emit }) {
      const fileSponsor = ref(null);
      const isDragging = ref(false);
      const internalFiles = ref([...props.models]);
  
      watch(internalFiles, (newFiles) => {
        emit("update:models", newFiles);
      });
  
      const onChangeSponsorFile = (event) => {
        const selectedFiles = Array.from(event.target.files);
        selectedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            internalFiles.value.push({ url: e.target.result });
          };
          reader.readAsDataURL(file);
        });
        emit("sponsor-file", internalFiles.value);
      };
  
      const dragover = (e) => {
        e.preventDefault();
        isDragging.value = true;
      };
  
      const drop = (e) => {
        e.preventDefault();
        if (fileSponsor.value) {
          fileSponsor.value.files = e.dataTransfer.files;
          onChangeSponsorFile({ target: fileSponsor.value });
          isDragging.value = false;
        }
      };
  
      const dragleave = () => {
        isDragging.value = false;
      };
  
      const remove = (index) => {
        internalFiles.value.splice(index, 1);
      };
  
      return {
        fileSponsor,
        isDragging,
        internalFiles,
        onChangeSponsorFile,
        dragover,
        dragleave,
        remove,
        drop,
      };
    },
  };
  </script>
  
