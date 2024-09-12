<template>
  <v-form ref="form">
    <v-row>
      <v-col>
        <div class="ml-auto mb-4 d-flex align-center justify-end">
          <v-card
            append-icon="mdi-open-in-new"
            class="mx-1"
            max-width="220"
            subtitle="Liste"
            title=""
            @click="goListPage"
          >
          </v-card>
        </div>
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
        <v-card
          class="mx-auto my-4"
          elevation="1"
          v-if="contentType == 'newsletter'"
        >
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
        <v-card
          class="mx-auto my-4"
          elevation="1"
          v-if="contentType == 'newsletter'"
        >
          <v-card-item>
            <v-card-subtitle>Alt Başlık</v-card-subtitle>
          </v-card-item>
          <v-card-text class="form-input-text">
            <v-text-field
              variant="solo-filled"
              density="compact"
              label="Alt Başlık Ekle"
              v-model="formCaricatures.subTitle"
            ></v-text-field>
          </v-card-text>
        </v-card>
        <v-card
          class="mx-auto my-4"
          elevation="1"
          v-if="contentType == 'newsletter'"
        >
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
                fileUploadFunction(
                  $event,
                  `${contentType}-${index}`,
                  'sponsorImage'
                )
              "
              :index="`${contentType}-${index}`"
              fileKey="sponsorImage"
            />
          </v-card-text>
        </v-card>
        <v-card
          class="mx-auto my-4"
          elevation="1"
          v-if="contentType == 'newsletter'"
        >
          <v-card-item>
            <v-card-subtitle>Sponsora Ait Reklam</v-card-subtitle>
          </v-card-item>
          <v-card-text class="form-input-text">
            <v-text-field
              variant="solo-filled"
              density="compact"
              label="Reklam URL'i ekle"
              v-model="formCaricatures.addSponsorUrl"
            ></v-text-field>
            <the-file-upload
              ref="fileUploadAdd"
              @single-file="
                fileUploadFunction($event, 'addSponsorImage', 'addSponsorImage')
              "
              index="addSponsorImage"
              fileKey="addSponsorImage"
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
              <v-card-item>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  label="Çizer İsmi Ekle"
                  v-model="comp.caricaturist"
                  :rules="caricaturistRules"
                ></v-text-field>
              </v-card-item>
              <v-card-text class="form-input-text">
                <tiptap-editor :editor="editor" v-model="comp.description" />
                <the-file-upload
                  @single-file="
                    fileUploadFunction(
                      $event,
                      `${contentType}-${index}`,
                      'file'
                    )
                  "
                  :index="`${contentType}-${index}`"
                  fileKey="file"
                />
              </v-card-text>
            </div>
            <div v-else-if="comp.type === '1'" class="video-component">
              <v-card-item>
                <v-card-subtitle>Video Yükle</v-card-subtitle>
              </v-card-item>
              <v-card-item>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  label="Çizer İsmi Ekle"
                  v-model="comp.caricaturist"
                  :rules="caricaturistRules"
                ></v-text-field>
              </v-card-item>
              <v-card-text class="form-input-text">
                <tiptap-editor :editor="editor" v-model="comp.description" />
                <the-file-upload
                  @single-file="
                    fileUploadFunction(
                      $event,
                      `${contentType}-${index}`,
                      'video'
                    )
                  "
                  :index="`${contentType}-${index}`"
                  fileKey="video"
                />
              </v-card-text>
            </div>
            <div v-else-if="comp.type === '2'" class="multi-file-component">
              <v-card-item>
                <v-card-subtitle>Slider Yükle</v-card-subtitle>
              </v-card-item>
              <v-card-item>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  label="Çizer İsmi Ekle"
                  v-model="comp.caricaturist"
                  :rules="caricaturistRules"
                ></v-text-field>
              </v-card-item>
              <v-card-text class="form-input-text">
                <tiptap-editor :editor="editor" v-model="comp.description" />
                <the-multiple-upload
                  @multiple-file="
                    multifileUploadFunction($event, `${contentType}-${index}`)
                  "
                  :index="`${contentType}-${index}`"
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
        <v-btn @click="showReview" color="primary" class="mt-5 mx-2"
          ><span class="font-barlow">Önizleme</span></v-btn
        >
      </v-col>
    </v-row>
    <canvas
      id="posterCanvas"
      width="640"
      height="360"
      style="display: none"
    ></canvas>
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
      <div v-for="(caricature, index) in reviewData" :key="index">
        <the-news-container :posts="caricature" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});
const props = defineProps({
  contentType: {
    type: String,
    required: true,
  },
});

const analyticsIdRules = [(v) => !!v || "Analytics Id Zorunludur"];
const campaignNameRules = [(v) => !!v || "Analytics Campaign Id Zorunludur"];
const caricaturistRules = [(v) => !!v || "Karikatürist Bilgisi Zorunludur"];
const fileUploadRef = ref({});
const isSnackbarVisible = ref(false);
const isSubmitBtnDisabled = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");
const reviewData = ref({});
const reviewDialog = ref(false);
const router = useRouter();
const measurementId = ref("G-7PNZ5E4JDZ");
const form = ref(null);
const contentType = ref(props.contentType);
var tempNews = [];
const formCaricatures = ref({
  sponsor: "",
  title: "",
  news: [],
  analyticsId: measurementId.value,
  campaignName: "",
  sponsorImage: "",
  caricaturist: "",
  addSponsorImage: "",
  addSponsorUrl: "",
  subTitle: "",
});

const showReview = () => {
  const newObjectsArray = components.value.map((newsItem) => ({
    _id: "review",
    sponsor: formCaricatures.value.sponsor,
    title: formCaricatures.value.title,
    sponsorImage: formCaricatures.value.sponsorImage,
    addSponsorImage: formCaricatures.value.addSponsorImage,
    addSponsorUrl: formCaricatures.value.addSponsorUrl,
    news: [newsItem],
    analyticsId: formCaricatures.value.analyticsId,
    campaignName: formCaricatures.value.campaignName,
    caricaturist: formCaricatures.value.caricaturist,
    createdAt: new Date(),
    subTitle: formCaricatures.value.subTitle,
  }));

  reviewData.value = newObjectsArray;
  reviewDialog.value = true;
};

useHead({
  title: "Karikatür Oluştur",
});

const getRandomChar = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

const goListPage = () => {
  if (contentType.value == "newsletter") {
    router.push("/dashboard/list");
  } else {
    router.push("/dashboard/web/newsletter-list");
  }
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
    likeCount: null,
    randomLikeCount: Math.floor(Math.random() * 51) + 50,
    newsId: generateUniqueId(),
    caricaturist: formCaricatures.value.caricaturist || null,
    isDeleted: false
  },
]);

const addComponents = (type) => {
  const defaultCaricaturist = formCaricatures.value.caricaturist;
  if (type === 0) {
    components.value.push({
      type: "0",
      content: null,
      description: "",
      likeCount: null,
      randomLikeCount: Math.floor(Math.random() * 51) + 50,
      newsId: generateUniqueId(),
      caricaturist: defaultCaricaturist,
      isDeleted: false
    });
  } else if (type === 1) {
    components.value.push({
      type: "1",
      content: null,
      description: "",
      likeCount: null,
      randomLikeCount: Math.floor(Math.random() * 51) + 50,
      newsId: generateUniqueId(),
      caricaturist: defaultCaricaturist,
      posterUrl: "",
      isDeleted: false
    });
  } else if (type === 2) {
    components.value.push({
      type: "2",
      content: [],
      description: "",
      likeCount: null,
      randomLikeCount: Math.floor(Math.random() * 51) + 50,
      newsId: generateUniqueId(),
      caricaturist: defaultCaricaturist,
      isDeleted: false
    });
  }
};

const removeComponents = (index) => {
  return components.value.splice(index, 1);
};

const fileUploadFunction = async (event, index, fileKey) => {
  const indexNumber = index.substring(index.indexOf('-') + 1); 
  if (event) {
    if (fileKey === "sponsorImage") {
      formCaricatures.value.sponsorImage = event;
    } else if (fileKey === "addSponsorImage") {
      formCaricatures.value.addSponsorImage = event;
    } else {
      components.value[Number(indexNumber)].content = event;
    }
  }

  const posterCanvas = document.getElementById("posterCanvas");
  components.value.map(async (comp) => {
    if (comp.type == 1) {
      await createPosterFromVideo(comp?.content[0]?.url, posterCanvas)
        .then(async (res) => {
          let posterUrls = await sendSingleFileS3(res);
          comp.posterUrl = posterUrls;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
};
const multifileUploadFunction = async (event, index) => {
  const indexNumber = index.substring(index.indexOf('-') + 1);
  components.value[Number(indexNumber)].content = event;
};


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

const createPosterFromVideo = async (videoUrl, canvas) => {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error("Canvas element is null"));
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.addEventListener("loadedmetadata", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.currentTime = 1;

      video.addEventListener("seeked", () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      });
    });

    video.addEventListener("error", (e) => {
      reject(new Error("Video failed to load"));
    });
  });
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

  if (contentType.value == "newsletter") {
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

    let sponsorImage = "";
    if (formCaricatures.value.sponsorImage) {
      sponsorImage = await sendSingleFileS3(
        formCaricatures.value.sponsorImage[0]?.url
      );
    }
    let addSponsorImage = "";
    if (formCaricatures.value.addSponsorImage) {
      addSponsorImage = await sendSingleFileS3(
        formCaricatures.value.addSponsorImage[0]?.url
      );
    }

    const results = await Promise.all(allRequests);

    const formNewsletterData = {
      sponsor: formCaricatures.value.sponsor,
      title: formCaricatures.value.title,
      news: tempNews,
      analyticsId: formCaricatures.value.analyticsId,
      campaignName: formCaricatures.value.campaignName,
      sponsorImage: sponsorImage,
      caricaturist: formCaricatures.value.caricaturist,
      addSponsorImage: addSponsorImage,
      addSponsorUrl: formCaricatures.value.addSponsorUrl,
      subTitle: formCaricatures.value.subTitle,
    };

    const formWebData = {
      news: tempNews,
      analyticsId: formCaricatures.value.analyticsId,
      campaignName: formCaricatures.value.campaignName,
      caricaturist: formCaricatures.value.caricaturist,
      subTitle: formCaricatures.value.subTitle,
    };

    try {
      let apiUrl;
      let dataToSend;

      if (contentType.value === "newsletter") {
        apiUrl = "/api/caricatures/create";
        dataToSend = formNewsletterData;
      } else if (contentType.value === "web") {
        apiUrl = "/api/web-content/createCaricatures";
        dataToSend = formWebData;
      } else {
        throw new Error("Invalid apiType");
      }

      await $fetch(apiUrl, {
        method: "POST",
        body: dataToSend,
      });

      isSnackbarVisible.value = true;
      snackbarColor.value = "success";
      snackbarMsg.value = "İçerik başarılı bir şekilde oluşturuldu"

      setTimeout(() => {
        if (contentType.value == "newsletter") {
          router.push("/dashboard/list");
        } else {
          router.push("/dashboard/web/newsletter-list");
        }
      }, 1500);
    } catch (e) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "error";
      snackbarMsg.value = "Bir hata oluştu. Tekrar deneyin!";
    }
  } else {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Zorunlu alanlar boş geçilemez!";
  }
};

const sendSingleFileS3 = async (base64Data) => {
  try {
    const byteString = atob(base64Data.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data) {
        return data.url;
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error during upload:`, error);
    return null;
  }
};

watch(
  () => formCaricatures.value.caricaturist,
  (newCaricaturist) => {
    components.value.forEach((comp) => {
      comp.caricaturist = newCaricaturist;
    });
  }
);
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
