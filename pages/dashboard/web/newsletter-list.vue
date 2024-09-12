<template>
  <v-container>
    <v-row>
      <v-col class="px-0">
        <div class="ml-auto mb-4 d-flex align-center justify-end">
          <v-btn
            class="my-2"
            size="large"
            color="primary"
            append-icon="mdi-plus"
            @click="goDashboard"
          >
            <span class="font-barlow">Yeni Oluştur</span>
          </v-btn>
        </div>

        <v-card elevation="10" class="pa-3">
          <template v-if="isLoading">
            <v-skeleton-loader
              class="mx-auto border"
              type="table"
            ></v-skeleton-loader>
          </template>
          <template v-else>
            <v-data-table
              :headers="headers"
              :items="items"
              :items-per-page="itemsPerPage"
              hide-default-footer
              v-model:sort-by="sortBy"
              class="newsletter-list"
            >
              <template v-slot:[`item.img`]="{ item }">
                <v-img :src="item?.news.content[0].url" :width="100" />
                <video
                  v-if="item?.news.type == 1"
                  ref="video"
                  :controls="isPlaying"
                  @play="isPlaying = true"
                  controlsList="nodownload"
                  class="post-video cursor-pointer post-image"
                >
                  <source :src="item?.news.content[0].url" type="video/mp4" />
                  Tarayıcınız bu videoyu desteklemiyor.
                </video>
              </template>

              <template v-slot:[`item.desc`]="{ item }">
                <span v-html="truncateText(item?.news?.description, 90)"></span>
              </template>

              <template v-slot:[`item.type`]="{ item }">
                <span v-html="imageType(item?.news?.type)"></span>
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ $formatDate(item.createdAt) }}
              </template>

              <template v-slot:[`item.btn`]="{ item }">
                <div class="trash-icon">
                  <v-icon
                    icon="mdi-trash-can-outline"
                    @click="removeCaricature(item.news.newsId)"
                    color="error"
                  />
                </div>
              </template>
            </v-data-table>

            <div v-if="items.length > 10">
              <v-btn
                size="x-small"
                @click="prevPage"
                :disabled="page === 1"
                class="mr-1"
                ><span class="font-barlow">Önceki</span></v-btn
              >
              <v-btn
                size="x-small"
                @click="nextPage"
                :disabled="page === pageCount"
                class="ml-1"
                ><span class="font-barlow">Sonraki</span></v-btn
              >
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="removeCaricatureDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Onay Gerekiyor</v-card-title>
      <v-card-text>
        Karikatürü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="darken-1 bg-error"
          text
          @click="removeCaricatureDialog = false"
          >Vazgeç</v-btn
        >
        <v-btn color="darken-1 bg-green" text @click="confirmRemoveCaricature()"
          >Sil</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
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
const removeCaricatureDialog = ref(false);
const deletedNewsletterId = ref(null);
const { $formatDate } = useNuxtApp();
const isSnackbarVisible = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");
definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Başlıklar",
});

const isLoading = ref(true);
const router = useRouter();
const page = ref(1);
const itemsPerPage = ref(10);
const headers = ref([
  {
    title: "Görsel",
    align: "start",
    key: "img",
    width: "150px",
  },
  { title: "Description", align: "start", key: "desc" },
  {
    title: "Tip",
    align: "start",
    key: "type",
    width: "200px",
  },
  {
    title: "Oluşturma Tarihi",
    align: "start",
    key: "createdAt",
    width: "200px",
  },
  { title: "", align: "end", key: "btn" },
]);

const items = ref([]);

const sortBy = ref([{ key: "createdAt", order: "desc" }]);

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return items.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(items.value.length / itemsPerPage.value);
});

const goDashboard = () => {
  router.push("/dashboard");
};

const prevPage = async () => {
  page.value -= 1;
  await getAllNewsletter(page.value);
};

const nextPage = async () => {
  page.value += 1;
  await getAllNewsletter(page.value);
};

const imageType = (type) => {
  if (type == 0) {
    return "Tekli Görsel";
  } else if (type == 1) {
    return "Video";
  } else if (type == 2) {
    return "Çoklu Görsel";
  }
};
const getAllWebCaricatures = async (num) => {
  try {
    let request = await $fetch(
      `/api/web-content/getByPageNum?pageNum=${num}`
    ).then((res) => {
      items.value = res;
      isLoading.value = false;
    });
    return request;
  } catch (e) {
    console.error(e);
  }
};

const removeCaricature = (item) => {
  removeCaricatureDialog.value = true;
  deletedNewsletterId.value = item;
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const confirmRemoveCaricature = async () => {
  try {
    const response = await $fetch(
      `/api/web-content/deleteWebCaricature?newsId=${deletedNewsletterId.value}`
    );
    if (response) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "success";
      snackbarMsg.value = "İçerik başarılı bir şekilde silindi!";
      removeCaricatureDialog.value = false;
      getAllWebCaricatures(page.value);
    }
  } catch (error) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "İçerik silinemedi lütfen tekrar deneyin!";
  }
};

onMounted(async () => {
  await getAllWebCaricatures(page.value);
});
</script>
