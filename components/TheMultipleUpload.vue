<template>
  <div class="main-container">
    <div
      class="dropzone-container"
      @dragover.prevent="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <input
        :id="'multipleFile' + index"
        type="file"
        name="file"
        class="hidden-input"
        @change="onChange"
        ref="files"
        accept="image/*"
        multiple
      />
      <label
        :for="'multipleFile' + index"
        class="file-label h-100 d-flex align-center justify-center"
        v-if="!internalFiles.length"
      >
        <div v-if="isDragging">Dosyaları buraya bırakın.</div>
        <div v-else class="d-flex flex-column align-center">
          <div class="text-grey">Sürükle bırak</div>
          <span class="my-4 d-block text-grey">veya</span>
          <div
            class="d-flex rounded-pill bg-grey-lighten-4 text-grey-darken-3 text-center px-8 py-2 text-body-2"
          >
            <v-icon icon="mdi-folder-open" class="mr-4" />
            <span>Dosya seç</span>
          </div>
        </div>
      </label>
      <div
        class="preview-container justify-center mt-4"
        v-if="internalFiles.length"
      >
        <div
          v-for="(file, idx) in internalFiles"
          :key="file.name"
          class="preview-card"
          :title="file.name"
        >
          <img :src="file.url" alt="Preview" class="preview-image" />
          <p class="text-truncate w-100 text-caption text-grey-darken-1 mt-2">
            {{ file.name }}<br />
          </p>

          <button type="button" @click="remove(idx)" title="Sil">
            <b>×</b>
          </button>
        </div>
        <div class="d-flex justify-center w-100 pt-3">
          <label
            class="d-flex rounded-pill bg-grey-lighten-4 text-grey-darken-3 text-center px-8 py-2 text-body-2"
            :for="'multipleFile' + index"
          >
            <v-icon icon="mdi-folder-open" class="mr-4" />
            <span>Add file</span>
          </label>
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
    index: {
      type: Number,
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const files = ref(null);
    const isDragging = ref(false);
    const internalFiles = ref([...props.models]);

    watch(internalFiles, (newFiles) => {
      emit('update:updateModel', newFiles);
    });

    const getRandomChar = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      return chars.charAt(Math.floor(Math.random() * chars.length));
    };
    const generateUniqueId = () => {
      const timestamp = new Date().getTime();
      let uniqueId = "";
      for (let i = 0; i < 5; i++) {
        uniqueId += getRandomChar();
      }
      return `${uniqueId}${timestamp}`;
    };

    const onChange = (event) => {
      const selectedFiles = Array.from(event.target.files);
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          internalFiles.value.push({ url: e.target.result, file:file, uuid: generateUniqueId(), });
          emit("multiple-file", internalFiles.value, props.index, props.fileKey);
        };
        reader.readAsDataURL(file);
      });
    };

    const dragover = (e) => {
      e.preventDefault();
      isDragging.value = true;
    };

    const drop = (e) => {
      e.preventDefault();
      if (files.value) {
        files.value.files = e.dataTransfer.files;
        onChange({ target: files.value });
        isDragging.value = false;
      }
    };

    const dragleave = () => {
      isDragging.value = false;
    };

    const remove = (idx) => {
      internalFiles.value.splice(idx, 1);
    };

    return {
      files,
      isDragging,
      internalFiles,
      onChange,
      dragover,
      dragleave,
      remove,
      drop,
      getRandomChar,
      generateUniqueId,
    };
  }
};
</script>
