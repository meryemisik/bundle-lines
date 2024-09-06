<template>
  <v-tabs v-model="tab" bg-color="blue-grey-lighten-2">
    <v-tab value="web1">Başlık ve Sponsor</v-tab>
    <v-tab value="web2">Görsel Yükle</v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="web1">
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
                <v-card-subtitle>Web Başlık</v-card-subtitle>
              </v-card-item>
              <v-card-text class="form-input-text">
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  v-model="web.title"
                ></v-text-field>
              </v-card-text>
            </v-card>
            <v-card class="mx-auto mb-4" elevation="1">
              <v-card-item>
                <v-card-subtitle>Web Alt Başlık</v-card-subtitle>
              </v-card-item>
              <v-card-text class="form-input-text">
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  v-model="web.subtitle"
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
                  label="Sponsor metni ekle"
                  v-model="web.sponsor"
                ></v-text-field>
                <the-file-upload
                  ref="fileUploadRef"
                  @single-file="
                    fileUploadFunction($event, 'sponsorImage', 'sponsorImage')
                  "
                  :index="'sponsorImage'"
                  fileKey="sponsorImage"
                />
              </v-card-text>
            </v-card>

            <v-btn
              :disabled="isSubmitBtnDisabled"
              @click="createWebContent(web)"
              color="success"
              class="mt-5"
              ><span class="font-barlow">Paylaş</span></v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-tabs-window-item>

    <v-tabs-window-item value="web2">
      <div class="ml-auto mb-4 d-flex align-center justify-end">
        <v-card
          append-icon="mdi-open-in-new"
          class="mx-1"
          max-width="220"
          subtitle="Liste"
          title=""
          @click="goWebNewsletterListPage"
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
            v-model="webCaricatures.analyticsId"
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
            v-model="webCaricatures.campaignName"
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
            v-model="webCaricatures.news[0].caricaturist"
            label="Çizer İsmi Ekle"
          ></v-text-field>
        </v-card-text>
      </v-card>

      <v-card class="mx-auto my-4" elevation="1">
        <v-card-item>
          <v-card-subtitle>Görsel Yükle</v-card-subtitle>
        </v-card-item>
        <v-card-text class="form-input-text">
          <tiptap-editor
            :editor="editor"
            v-model="webCaricatures.news[0].description"
          />
          <the-file-upload
            ref="fileUploadRefx"
            @single-file="fileUploadFunction($event, 'file', 'file')"
            :index="'file'"
            fileKey="file"
          />
        </v-card-text>
      </v-card>
      <v-btn @click="createWebCaricatures()" color="success" class="mt-5"
        ><span class="font-barlow">Paylaş</span></v-btn
      >
    </v-tabs-window-item>
  </v-tabs-window>

  <v-snackbar
    v-model="isSnackbarVisible"
    timeout="3000"
    location="top right"
    :color="snackbarColor"
  >
    {{ snackbarMsg }}
  </v-snackbar>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});
const tab = ref(null);
const router = useRouter();
const form = ref(null);
const fileUploadRef = ref({});

const isSnackbarVisible = ref(false);
const isSubmitBtnDisabled = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");

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

const web = ref({
  title: "",
  subtitle: "",
  sponsor: "",
  sponsorImage: null,
});

const webCaricatures = ref({
  news: [
    {
      type: "0",
      content: null,
      description: "",
      likeCount: null,
      randomLikeCount: Math.floor(Math.random() * 51) + 50,
      newsId: generateUniqueId(),
      caricaturist: "",
    },
  ],
  analyticsId: "G-7PNZ5E4JDZ",
  campaignName: "",
});

const fileUploadFunction = async (event, index, fileKey) => {
  if (event) {
    if (fileKey === "sponsorImage") {
      web.value.sponsorImage = event;
    } else {
      webCaricatures.value.news[0].content = event;
    }
  }
};

const goListPage = () => {
  router.push("/dashboard/web/list");
};

const createWebContent = async (event) => {
  const sponsorImageUrl = web?.value?.sponsorImage?.[0]?.url || null;

  let imgSrc = null;
  if (sponsorImageUrl) {
    imgSrc = await sendFilesS3(sponsorImageUrl);
  }

  const webData = {
    title: web.value.title || "",
    subtitle: web.value.subtitle || "",
    sponsor: web.value.sponsor || "",
    sponsorImage: imgSrc || null,
  };

  try {
    await $fetch("/api/web-content/create", {
      method: "POST",
      body: webData,
    }).then(() => {
      router.push("/dashboard/web/list");
    });
  } catch (e) {
    console.error("Error creating web content:", e);
  }
};

const sendFilesS3 = async (base64Data) => {
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

const createWebCaricatures = async () => {
  try {
    const response = await $fetch("/api/web-content/createCaricatures", {
      method: "POST",
      body: webCaricatures.value,
    });
    isSnackbarVisible.value = true;
    snackbarColor.value = "success";
    snackbarMsg.value = "Web içeriği başarılı bir şekilde eklendi!";
    if (response) {
      goWebNewsletterListPage();
    }
  } catch (e) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Bir hata oluştu. Tekrar deneyin!";
  }
};

const goWebNewsletterListPage = () => {
  router.push("/dashboard/web/newsletter-list");
};
</script>

<style lang="scss">
.form-input-text {
  padding: 0 1rem !important;
}
</style>
