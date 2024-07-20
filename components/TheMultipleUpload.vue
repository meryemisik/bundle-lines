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
        name="file1"
        id="multipleFile"
        class="hidden-input"
        @change="onChange1"
        ref="files"
        accept="image/*"
        multiple
      />

      <label
        for="multipleFile"
        class="file-label h-100 d-flex align-center justify-center"
        v-if="!internalFiles1.length"
      >
        <div v-if="isDragging1">Release to drop files here.</div>
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
      <div class="preview-container justify-center mt-4" v-if="internalFiles1.length">
        <div
          v-for="(file, index) in internalFiles1"
          :key="file.name"
          class="preview-card"
          :title="file.name"
        >
          <img :src="file.url" alt="Preview" class="preview-image" />
          <p class="text-truncate w-100 text-caption text-grey-darken-1 mt-2">
            {{ file.name }}<br />
          </p>

          <button
            type="button"
            @click="remove(index)"
            title="Remove file"
          >
            <b>×</b>
          </button>
        </div>
        <div class="d-flex justify-center w-100 pt-3">
          <label
            class="d-flex rounded-pill bg-grey-lighten-4 text-grey-darken-3 text-center px-8 py-2 text-body-2"
            for="multipleFile"
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
import { ref, watch } from 'vue';

export default {
  props: {
    updateModel: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const files = ref(null);
    const isDragging1 = ref(false);
    const internalFiles1 = ref([...props.updateModel]);

    watch(internalFiles1, (newFiles) => {
      emit('update:updateModel', newFiles);
    });

    const onChange1 = (event) => {
      const selectedFiles = Array.from(event.target.files);
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          internalFiles1.value.push({url: e.target.result });
        };
        reader.readAsDataURL(file);
      });
      emit("multiple-file", internalFiles1.value);
    };

    const dragover = (e) => {
      e.preventDefault();
      isDragging1.value = true;
    };

    const drop = (e) => {
      e.preventDefault();
      if (files.value) {
        files.value.files = e.dataTransfer.files;
        onChange1({ target: files.value });
        isDragging1.value = false;
      }
    };

    const dragleave = () => {
      isDragging1.value = false;
    };

    const remove = (index) => {
      internalFiles1.value.splice(index, 1);
    };

    return {
      files,
      isDragging1,
      internalFiles1,
      onChange1,
      dragover,
      dragleave,
      drop,
      remove
    };
  }
};
</script>
