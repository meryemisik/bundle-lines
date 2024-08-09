<template>
  <v-container class="page-container">
    <v-form ref="form">
      <v-row>
        <v-col>
          <div class="ml-auto mb-4 d-flex align-center justify-end">
            <v-card
              append-icon="mdi-open-in-new"
              class="mx-1"
              max-width="220"
              prepend-icon="mdi-account"
              :subtitle="data?.user?.email"
              title=""
              @click="goListPage"
            >
            </v-card>
            <v-icon
              icon="mdi-logout"
              color="light"
              @click="logout"
              class="mx-1 bg-error rounded pa-5"
              elevation="1"
            />
          </div>

          <v-card class="pa-4" elevation="10">
            <v-card class="mx-auto mb-4" elevation="1">
              <v-card-item>
                <v-card-subtitle>Analytics Id</v-card-subtitle>
              </v-card-item>
              <v-card-text class="form-input-text">
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  v-model="formCaricatures.analyticsId"
                  :rules="analyticsIdRules"
                  disabled
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
                  label="Örn: studio-fairy-temmuz-2024"
                  v-model="formCaricatures.campaignName"
                  :rules="campaignNameRules"
                ></v-text-field>
              </v-card-text>
            </v-card>
            <v-card class="mx-auto mb-4" elevation="1">
              <v-card-item>
                <v-card-subtitle>Karikatürist</v-card-subtitle>
              </v-card-item>
              <v-card-text class="form-input-text">
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  label="Çizer İsmi Ekle"
                  v-model="formCaricatures.caricaturist"
                  :rules="caricaturistRules"
                ></v-text-field>
              </v-card-text>
            </v-card>
            <v-card class="mx-auto my-4" elevation="1">
              <v-card-item>
                <v-card-subtitle>Başlık</v-card-subtitle>
              </v-card-item>
              <v-card-text class="form-input-text">
                <tiptap-editor
                  :editor="editor"
                  v-model="formCaricatures.title"
                  onlyBold
                />
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
                  label="Sponsor metni ekle"
                  v-model="formCaricatures.sponsor"
                ></v-text-field>
                <the-file-upload
                  ref="fileUploadRef"
                  @single-file="
                    fileUploadFunction($event, index, 'sponsorImage')
                  "
                  :index="index"
                  fileKey="sponsorImage"
                />
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
                    <v-card-subtitle>Görsel Yükle</v-card-subtitle>
                  </v-card-item>
                  <v-card-text class="form-input-text">
                    <tiptap-editor
                      :editor="editor"
                      v-model="comp.description"
                    />
                    <the-file-upload
                      @single-file="fileUploadFunction($event, index, 'file')"
                      :index="index"
                      fileKey="file"
                    />
                  </v-card-text>
                </div>
                <div v-else-if="comp.type === '1'" class="video-component">
                  <v-card-item>
                    <v-card-subtitle>Video Yükle</v-card-subtitle>
                  </v-card-item>
                  <v-card-text class="form-input-text">
                    <tiptap-editor
                      :editor="editor"
                      v-model="comp.description"
                    />
                    <the-file-upload
                      @single-file="fileUploadFunction($event, index, 'video')"
                      :index="index"
                      fileKey="video"
                    />
                  </v-card-text>
                </div>
                <div v-else-if="comp.type === '2'" class="multi-file-component">
                  <v-card-item>
                    <v-card-subtitle>Slider Yükle</v-card-subtitle>
                  </v-card-item>
                  <v-card-text class="form-input-text">
                    <tiptap-editor
                      :editor="editor"
                      v-model="comp.description"
                    />
                    <the-multiple-upload
                      @multiple-file="multifileUploadFunction($event, index)"
                      :index="index"
                      fileKey="multiple"
                    />
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
                        >Görsel Yükle</v-label
                      >
                      <v-label class="description font-barlow cursor-pointer"
                        >Tekli görsel ekle</v-label
                      >
                    </div>
                  </div>
                  <div class="item" @click="addComponents(2)">
                    <div class="file-upload">
                      <v-icon icon="mdi-folder-multiple-image"></v-icon>
                      <v-label class="title font-barlow cursor-pointer"
                        >Slider Yükle</v-label
                      >
                      <v-label class="description font-barlow cursor-pointer"
                        >Çoklu görsel ekle</v-label
                      >
                    </div>
                  </div>
                  <div class="item" @click="addComponents(1)">
                    <div class="file-upload">
                      <v-icon icon="mdi-file-video-outline"></v-icon>
                      <v-label class="title font-barlow cursor-pointer"
                        >Video Yükle</v-label
                      >
                      <v-label class="description font-barlow cursor-pointer"
                        >Video Yükle</v-label
                      >
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-btn
              :disabled="isSubmitBtnDisabled"
              @click="createCaricatures(formCaricatures)"
              color="success"
              class="mt-5"
              ><span class="font-barlow">Paylaş</span></v-btn
            >
            <v-btn
              @click="showReview"
              color="primary"
              class="mt-5 mx-2"
              ><span class="font-barlow">Önizleme</span></v-btn
            >
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    <v-snackbar
      v-model="isSnackbarVisible"
      timeout="3000"
      location="top right"
      :color="snackbarColor"
    >
      {{ snackbarMsg }}
    </v-snackbar>
    <v-dialog v-model="reviewDialog" max-width="90%" scrollable>
      <v-card>
        <the-news-container :isLoading="false" :posts="reviewData" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
const reviewData = ref({});
const reviewDialog = ref(false);
const showReview = () => {
  const formData = {
    sponsor: formCaricatures.value.sponsor,
    title: formCaricatures.value.title,
    news: components.value,
    analyticsId: formCaricatures.value.analyticsId,
    campaignName: formCaricatures.value.campaignName,
    sponsorImage: formCaricatures.value.sponsorImage,
    creator: data?.value?.user.email,
    caricaturist: formCaricatures.value.caricaturist
  };
  reviewData.value = formData;
  reviewDialog.value = true
};

useHead({
  title: "Karikatür Oluştur",
});

const { status, data, getSession, signIn, signOut } = useAuth();
if (!data?.value?.user) {
  signIn();
}

const logout = () => {
  signOut();
};
const router = useRouter();
const goListPage = () => {
  router.push("/dashboard/list");
};
const measurementId = ref("G-7PNZ5E4JDZ");
const form = ref(null);
const analyticsIdRules = [(v) => !!v || "Analytics Id Zorunludur"];
const campaignNameRules = [(v) => !!v || "Analytics Campaign Id Zorunludur"];
const caricaturistRules = [(v) => !!v || "Karikatürist Bilgisi Zorunludur"];
const fileUploadRef = ref({});

const isSnackbarVisible = ref(false);
const isSubmitBtnDisabled = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");
const formCaricatures = ref({
  sponsor: "",
  title: "",
  news: [],
  analyticsId: measurementId.value,
  campaignName: "",
  sponsorImage: "",
  caricaturist:""
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


const components = ref([
  {
    type: "0",
    content: null,
    description: "",
    likeCount : null,
    randomLikeCount : Math.floor(Math.random() * 51) + 50,
    newsId:generateUniqueId()
  },
]);

const addComponents = (type) => {
  if (type === 0) {
    components.value.push({
      type: "0",
      content: null,
      description: "",
      likeCount : null,
      randomLikeCount : Math.floor(Math.random() * 51) + 50,
      newsId:generateUniqueId()
    });
  } else if (type === 1) {
    components.value.push({
      type: "1",
      content: null,
      description: "",
      likeCount : null,
      randomLikeCount : Math.floor(Math.random() * 51) + 50,
      newsId:generateUniqueId()
    });
  } else if (type === 2) {
    components.value.push({
      type: "2",
      content: [],
      description: "",
      likeCount : null,
      randomLikeCount : Math.floor(Math.random() * 51) + 50,
      newsId:generateUniqueId()
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
  components.value[index].content = event;
};
const getAll = async () => {
  try {
    let data = await $fetch("/api/caricatures");
    return data;
  } catch (e) {
    console.error(e);
  }
};

var tempNews = [];

const updateUrls = (newUrls, oldUrls) => {
  const updatedData = tempNews.map((item) => ({
    ...item,
    content: item.content.map((contentItem) => ({
      ...contentItem,
      url: contentItem.url === oldUrls ? newUrls : contentItem.url,
    })),
  }));
  tempNews = updatedData;
};

const sendFilesS3 = async (urls) => {
  return Promise.all(
    urls.map(async (urlObj) => {
      try {
        const formData = new FormData();
        formData.append("file", urlObj.file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            updateUrls(data.url, urlObj.url);
          }
        }

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return { url: urlObj.url, status: response.status };
      } catch (error) {
        console.error(`Error fetching ${urlObj.url}:`, error);
        return { url: urlObj.url, error: error.message };
      }
    })
  );
};

const createCaricatures = async (event) => {
  isSubmitBtnDisabled.value = true;
  setTimeout(() => {
    isSubmitBtnDisabled.value = false;
  }, 5000);
  const { valid } = await form.value.validate();

  const sliderComponentLengthControl = components.value.filter(
    (item) => item.type === "2"
  );
  const checkResult = sliderComponentLengthControl.filter(
    (item) => !item.content || item.content.length < 2
  );

  if (formCaricatures.value.title.replace(/<\/?[^>]+>/gi, "").length == 0) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Başlık zorunludur!";
    return false;
  }

  if (checkResult.length > 0) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Slider için minimum 2 görsel seçilmelidir!";
    return false;
  }

  const newsAreAllFieldsFilled = components.value.every(
    (item) =>
      item.content != null &&
      item.description != null &&
      item.description.trim() !== ""
  );

  if (valid) {
    if (!newsAreAllFieldsFilled) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "error";
      snackbarMsg.value = "Dosya yükleme ve açıklama alanlarını boş geçmeyin!";
      return false;
    }

    tempNews = components.value;

    const allRequests = components.value.flatMap((item) =>
      item.content ? sendFilesS3(item.content) : []
    );

    const results = await Promise.all(allRequests);

    const formData = {
      sponsor: formCaricatures.value.sponsor,
      title: formCaricatures.value.title,
      news: tempNews,
      analyticsId: formCaricatures.value.analyticsId,
      campaignName: formCaricatures.value.campaignName,
      sponsorImage: formCaricatures.value.sponsorImage,
      creator: data?.value?.user.email,
      caricaturist : formCaricatures.value.caricaturist
    };

    try {
      const response = await $fetch("/api/caricatures/create", {
        method: "POST",
        body: formData,
      });
      isSnackbarVisible.value = true;
      snackbarColor.value = "success";
      snackbarMsg.value = "Karikatür başarıyla paylaşıldı!";

      setTimeout(() => {
        router.push("/dashboard/list");
      }, 1500);

      if (response) {
        formCaricatures.value = {
          sponsor: "",
          title: "",
          news: [],
          analyticsId: "",
          campaignName: "",
          sponsorImage: "",
        };

        components.value = [];
        fileUploadRef.value.reset();
        formCaricatures.value.analyticsId = measurementId.value;
      }
      await getAll();
    } catch (e) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "error";
      snackbarMsg.value = "Karikatür eklerken bir hata oluştu. Tekrar deneyin!";
    }
  } else {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Zorunlu alanlar boş geçilemez!";
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
