<template>
  <v-container class="page-container">
    <v-row>
      <v-col>
        <v-card class="pa-4" elevation="16">
          <v-card class="mx-auto mb-4" elevation="1">
            <v-card-item>
              <v-card-subtitle>Analytics Id</v-card-subtitle>
            </v-card-item>
            <v-card-text class="form-input-text">
              <v-text-field
                variant="solo-filled"
                density="compact"
                label="Ex: G-XXXXXXXXXX"
                v-model="formCaricatures.analyticsId"
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-card class="mx-auto my-4" elevation="1">
            <v-card-item>
              <v-card-subtitle>Analytics Campaign Id</v-card-subtitle>
            </v-card-item>
            <v-card-text class="form-input-text">
              <v-text-field
                variant="solo-filled"
                density="compact"
                label="Ex: studio-fairy-temmuz-2020"
                v-model="formCaricatures.campaignName"
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-card class="mx-auto my-4" elevation="1">
            <v-card-item>
              <v-card-subtitle>Title</v-card-subtitle>
            </v-card-item>
            <v-card-text class="form-input-text">
              <v-text-field
                variant="solo-filled"
                density="compact"
                label="Enter Title"
                v-model="formCaricatures.title"
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-card class="mx-auto my-4" elevation="1">
            <v-card-item>
              <v-card-subtitle>Sponsor</v-card-subtitle>
            </v-card-item>
            <v-card-text class="form-input-text">
              <v-text-field
                variant="solo-filled"
                density="compact"
                label="Enter Sponsor"
                v-model="formCaricatures.sponsor"
              ></v-text-field>
              <the-file-upload @single-file="fileUploadFunction($event, index, 'sponsorImage')" :index="index" fileKey="sponsorImage" />
            </v-card-text>
          </v-card>

          <div v-for="(comp, index) in components" :key="index">
            <v-card class="mx-auto my-4 pa-2 new-component" elevation="1">
              <div class="trash-icon">
                <v-icon
                  icon="mdi-trash-can-outline"
                  @click="removeComponents(index)"
                  v-if="components?.length > 1"
                  color="error"
                />
              </div>

              <div v-if="comp.type === '0'" class="file-component">
                <v-card-item>
                  <v-card-subtitle>File Upload</v-card-subtitle>
                </v-card-item>
                <v-card-text class="form-input-text">
                  <tiptap-editor :editor="editor" v-model="comp.description" />
                  <the-file-upload @single-file="fileUploadFunction($event, index, 'file')" :index="index" fileKey="file" />
                </v-card-text>
              </div>
              <div v-else-if="comp.type === '1'" class="video-component">

                <v-card-item>
                  <v-card-subtitle>Video Upload</v-card-subtitle>
                </v-card-item>
                <v-card-text class="form-input-text">
                  <tiptap-editor :editor="editor" v-model="comp.description" />
                  <the-file-upload @single-file="fileUploadFunction($event, index, 'video')" :index="index" fileKey="video" />
                </v-card-text>
              </div>
              <div v-else-if="comp.type === '2'" class="multi-file-component">
                <v-card-item>
                  <v-card-subtitle>Slider Upload</v-card-subtitle>
                </v-card-item>
                <v-card-text class="form-input-text">
                  <tiptap-editor :editor="editor" v-model="comp.description" />
                  <the-multiple-upload @multiple-file="multifileUploadFunction($event, index)" :index="index" fileKey="multiple" />
                </v-card-text>
              </div>
            </v-card>
          </div>
          <v-row>
            <v-col>
              <div class="new-components-content">
                <div class="item cursor-pointer" @click="addComponents(0)">
                  <div class="file-upload">
                    <v-icon icon="mdi-file-image-outline"></v-icon>
                    <v-label class="title font-barlow cursor-pointer"
                      >File Upload</v-label
                    >
                    <v-label class="description font-barlow cursor-pointer"
                      >Upload single image</v-label
                    >
                  </div>
                </div>
                <div class="item" @click="addComponents(2)">
                  <div class="file-upload">
                    <v-icon icon="mdi-folder-multiple-image"></v-icon>
                    <v-label class="title font-barlow cursor-pointer"
                      >Slider Upload</v-label
                    >
                    <v-label class="description font-barlow cursor-pointer"
                      >Upload multiple image</v-label
                    >
                  </div>
                </div>
                <div class="item" @click="addComponents(1)">
                  <div class="file-upload">
                    <v-icon icon="mdi-file-video-outline"></v-icon>
                    <v-label class="title font-barlow cursor-pointer"
                      >Video Upload</v-label
                    >
                    <v-label class="description font-barlow cursor-pointer"
                      >Upload video</v-label
                    >
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-btn
            @click="createCaricatures(formCaricatures)"
            color="success"
            class="mt-5"
            ><span class="font-barlow">Create</span></v-btn
          >
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="isSnackbarVisible"
      timeout="30000"
      location="top right"
      :color="snackbarColor"
    >
      {{ snackbarMsg }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
const isSnackbarVisible = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");
const files = ref([]);
const multipleFileResult = ref([]);
const formCaricatures = ref({
  sponsor: "",
  title: "",
  news: [],
  analyticsId: "",
  campaignName: "",
  sponsorImage: "",
});

const selectedComponent = ref("2");
const components = ref([
  {
    type: "0",
    content: null,
    description: "",
  },
]);


const addComponents = (type) => {
  if (type === 0) {
    components.value.push({
      type: "0",
      content: null,
      description: "",
    });
  } else if (type === 1) {
    components.value.push({
      type: "1",
      content: null,
      description: "",
    });
  } else if (type === 2) {
    components.value.push({
      type: "2",
      content: [],
      description: "",
    });
  }
};

const removeComponents = (index) => {
  return components.value.splice(index, 1);
};

const fileUploadFunction = async (event, index, fileKey) => {
  if (event) {
    if (fileKey == "sponsorImage") {
      formCaricatures.value.sponsorImage = event;
    } else {
      components.value[index].content = event;
    }
  }
};
const multifileUploadFunction = async (event, index) => {
    components.value[index].content = event
};
const getAll = async () => {
  try {
    let data = await $fetch("/api/caricatures");
    return data;
  } catch (e) {
    alert(e);
  }
};
const createCaricatures = async (event) => {
  const formData = {
    sponsor: formCaricatures.value.sponsor,
    title: formCaricatures.value.title,
    news: components.value,
    analyticsId: formCaricatures.value.analyticsId,
    campaignName: formCaricatures.value.campaignName,
    sponsorImage: formCaricatures.value.sponsorImage,
  };
  try {
    const response = await $fetch("/api/caricatures/create", {
      method: "POST",
      body: formData,
    });
    isSnackbarVisible.value = true;
    snackbarColor.value = "success";
    snackbarMsg.value = "Caricature added successfully!";
    await getAll();
  } catch (e) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "An error occurred while adding the caricature!";
  }
};
</script>

<style lang="scss">
.new-components-content {
  display: flex;
  justify-content: center;
  gap: 10px;

  i {
    font-size: 40px;
  }
  .item {
    padding: 8px;
    border-radius: 16px;
    color: #fff;
    flex: 1;
    cursor: pointer;
    transition: all 0.2s 0s linear;

    .file-upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border-radius: 8px;
      gap: 8px;
      .title {
        opacity: 1 !important;
        font-weight: bold !important;
        font-size: 14px;
      }
      .description {
        white-space: normal !important;
        font-size: 12px;
      }
    }
    &:nth-child(1) {
      background-color: rgb(241, 241, 242);
      color: black;

      &:hover {
        background-color: rgb(223, 223, 223);
      }

      .file-upload {
        background-color: rgb(250, 250, 251);
      }
    }
    &:nth-child(2) {
      background-color: rgb(23, 25, 35);

      &:hover {
        background-color: rgb(42, 42, 43);
      }

      .file-upload {
        background: rgb(40, 41, 51);
        color: #f2f2f2;
      }
    }
    &:nth-child(3) {
      background-color: rgb(36, 172, 255);

      &:hover {
        background-color: rgb(93, 193, 255);
      }

      .file-upload {
        background: rgb(107, 198, 255);
        color: #f2f2f2;
      }
    }
  }
}
.trash-icon {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.new-component {
  animation: animasyon 0.75s 0s linear;
}

@keyframes animasyon {
  from {
    background: rgb(209, 255, 209);
  }
  to {
    background: white;
  }
}
.form-input-text {
  padding: 0 1rem !important;
}
</style>
