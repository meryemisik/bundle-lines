<template>
  <div class="main-container">
    <div
      class="dropzone-container"
      @dragover.prevent="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <input
        :id="'fileInput' + index"
        type="file"
        name="file"
        class="hidden-input"
        @change="onChange"
        ref="fileInput"
        :accept="acceptType"
      />
      <label
        :for="'fileInput' + index"
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
          :key="file.uuid"
          class="preview-card"
          :title="file.name"
        >
          <template v-if="shouldShowImagePreview">
            <img v-if="file.file.type.startsWith('image/')" :src="file.url" alt="Preview" class="preview-image" />
            <video v-else class="post-video" controls>
              <source :src="file.url" type="video/mp4" />
              Tarayıcınız bu videoyu desteklemiyor.
            </video>
          </template>
          <p class="text-truncate w-100 text-caption text-grey-darken-1 mt-2">
            {{ file.name }}<br />
          </p>

          <button type="button" @click="remove(idx)" title="Sil">
            <b>×</b>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

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
    const fileInput = ref(null);
    const isDragging = ref(false);
    const internalFiles = ref([...props.models]);

    watch(internalFiles, (newFiles) => {
      emit("update:models", newFiles);
    });

    const onChange = () => {
      const selectedFiles = Array.from(fileInput.value.files);
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          internalFiles.value.push({
            url: e.target.result,
            file: file,
            uuid: generateUniqueId(),
          });
          emit("single-file", internalFiles.value, props.index, props.fileKey);
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
      if (fileInput.value) {
        fileInput.value.files = e.dataTransfer.files;
        onChange();
        isDragging.value = false;
      }
    };

    const dragleave = () => {
      isDragging.value = false;
    };

    const remove = (idx) => {
      internalFiles.value.splice(idx, 1);
    };

    const reset = () => {
      if (fileInput.value) {
        fileInput.value.value = "";
        internalFiles.value = [];
      }
    };

    const acceptType = computed(() => {
      if (props.fileKey === "video") {
        return "video/*";
      } else if (props.fileKey === "addSponsorImage") {
        return "image/*,video/*,.gif";
      } else {
        return "image/*";
      }
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
    const shouldShowImagePreview = computed(() => {
      return (
        props.fileKey === "file" ||
        props.fileKey === "sponsorImage" ||
        props.fileKey === "video" ||
        props.fileKey == "addSponsorImage"
      );
    });

    return {
      fileInput,
      isDragging,
      internalFiles,
      onChange,
      dragover,
      dragleave,
      remove,
      drop,
      reset,
      acceptType,
      props,
      getRandomChar,
      generateUniqueId,
      shouldShowImagePreview,
    };
  },
};
</script>
