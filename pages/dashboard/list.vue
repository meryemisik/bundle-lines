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
              <template v-slot:[`item.title`]="{ item }">
                <span v-html="truncateText(item.title, 90)"></span>
              </template>

              <template v-slot:[`item.sponsorImage`]="{ item }">
                <v-img
                  :width="100"
                  :src="item.sponsorImage[0]"
                  v-if="!item?.sponsorIsDeleted"
                />
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ $formatDate(item.createdAt) }}
              </template>
              <template v-slot:[`item.btn`]="{ item }">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-icon
                      small
                      color="primary"
                      class="cursor-pointer"
                      v-bind="props"
                    >
                      mdi-dots-vertical
                    </v-icon>
                  </template>
                  <v-list>
                    <v-list-item @click="goNews(item._id)">
                      Bültene git
                    </v-list-item>
                    <v-list-item @click="goDetail(item._id)">
                      Bülten detayı
                    </v-list-item>

                    <v-list-item @click="removeNewsletter(item._id)">
                      Bülteni sil
                    </v-list-item>
                    <v-list-item
                      @click="removeSponsor(item._id)"
                      v-if="!item?.sponsorIsDeleted && item.sponsorImage[0]"
                    >
                      Sponsor sil
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>

            <div>
              <v-btn
                size="x-small"
                @click="prevPage"
                :disabled="page === 1"
                class="mr-1"
                ><span class="font-barlow">Önceki</span></v-btn
              >
              <v-btn size="x-small" @click="nextPage" class="ml-1" :disabled="disabledNewxtBtn"
                ><span class="font-barlow">Sonraki</span></v-btn
              >
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar
    v-model="isSnackbarVisible"
    timeout="3000"
    location="top right"
    :color="snackbarColor"
  >
    {{ snackbarMsg }}
  </v-snackbar>

  <v-dialog
    v-model="newsletterDetailDialog"
    max-width="90%"
    class="newsletter-detail-dialog"
  >
    <v-card>
      <v-card-title>
        <span v-html="newsletterDetailData?.title" class="m-6"></span>
      </v-card-title>
      <v-data-table
        :headers="detailHeaders"
        :items="newsletterDetailData?.news"
        class="newsletter-detail-dialog-table"
        hide-default-footer
      >
        <template v-slot:[`item.image`]="{ item }">
          <v-img
            :src="item.content[0]?.url"
            class="newsletter-detail-dialog-table-image"
          ></v-img>
          <video
            class="post-video"
            controls
            v-if="item.type == 1"
            style="width: 100px"
          >
            <source :src="item.content[0]?.url" type="video/mp4" />
            Tarayıcınız bu videoyu desteklemiyor.
          </video>
        </template>
        <template v-slot:[`item.description`]="{ item }">
          <span v-html="item.description"></span>
        </template>
        <template v-slot:[`item.caricaturist`]="{ item }">
          {{ item.caricaturist }}
        </template>
        <template v-slot:[`item.likeCount`]="{ item }">
          <span class="newsletter-detail-dialog-table-like-count">
            {{ item.likeCount }}</span
          >
        </template>

        <template v-slot:[`item.btn`]="{ item }">
          <v-icon
            icon="mdi-trash-can-outline"
            color="error"
            @click="removeNewsletterItem(item.newsId)"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Onay Gerekiyor</v-card-title>
      <v-card-text>
        Bu bülteni silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="darken-1 bg-error" text @click="dialog = false"
          >Vazgeç</v-btn
        >
        <v-btn color="darken-1 bg-green" text @click="confirmDeleteNewsletter"
          >Sil</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteNewsletterItemDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Onay Gerekiyor</v-card-title>
      <v-card-text>
        Bu karikatürü silmek istediğinizden emin misiniz? Bu işlem geri
        alınamaz.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="darken-1 bg-error"
          text
          @click="deleteNewsletterItemDialog = false"
          >Vazgeç</v-btn
        >
        <v-btn
          color="darken-1 bg-green"
          text
          @click="confirmRemoveNewsletterItem()"
          >Sil</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="removeSponsorDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Onay Gerekiyor</v-card-title>
      <v-card-text>
        Bu bültene ait sponsoru silmek istediğinizden emin misiniz? Bu işlem
        geri alınamaz.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="darken-1 bg-error"
          text
          @click="removeSponsorDialog = false"
          >Vazgeç</v-btn
        >
        <v-btn color="darken-1 bg-green" text @click="confirmDeleteSponsor"
          >Sil</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useGlobalStore } from "~/stores/globalStore";
const globalStore = useGlobalStore();
definePageMeta({
  layout: "dashboard",
});
const { $formatDate } = useNuxtApp();
useHead({
  title: "Karikatürlerim",
});
const newsletterDetailDialog = ref(false);
const deleteNewsletterItemDialog = ref(false);
const deletedNewsId = ref(null);
const newsletterDetailData = ref([]);
const removeSponsorDialog = ref(false)
const isLoading = ref(true);
const dialog = ref(false);
const deletedNewsletterId = ref(null);
const isSnackbarVisible = ref(false);
const snackbarMsg = ref("");
const snackbarColor = ref("");
const disabledNewxtBtn = ref(false)
const router = useRouter();
const page = ref(1);
const itemsPerPage = ref(10);
const headers = ref([
  {
    title: "Başlık",
    align: "start",
    key: "title",
  },
  {
    title: "Sponsor",
    align: "start",
    key: "sponsorImage",
  },
  { title: "Oluşturma Tarihi", align: "start", key: "createdAt" },
  { align: "end", key: "btn" },
]);

const detailHeaders = ref([
  {
    title: "Görsel",
    align: "start",
    key: "image",
  },
  {
    title: "Açıklama",
    align: "start",
    key: "description",
  },
  { title: "Karikatürist", align: "start", key: "caricaturist" },

  {
    title: "Beğeni Sayısı",
    align: "start",
    key: "likeCount",
  },
  { align: "end", key: "btn" },
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

const goNews = (id) => {
  window.open(`/newsletter/${id}`, "_blank");
};

const goDetail = async (id) => {
  try {
    const response = await $fetch(`/api/caricatures/getById?id=${id}`);
    if (response && response.news) {
      globalStore.setLoading(true);
      newsletterDetailDialog.value = true;
      newsletterDetailData.value = response;
    }
  } catch (e) {
    console.error("Error fetching posts:", e);
  }
};

const prevPage = async () => {
  
  page.value -= 1
   await getAllNewsletter(page.value);
};

const nextPage = async () => {
  page.value += 1
   await getAllNewsletter(page.value);
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const removeNewsletter = (item) => {
  dialog.value = true;
  deletedNewsletterId.value = item;
};
const removeSponsor = (item) => {
  removeSponsorDialog.value = true;
  deletedNewsletterId.value = item;
}

const confirmDeleteSponsor = async () =>{
  try {
    const response = await $fetch(
      `/api/caricatures/deleteSponsor?id=${deletedNewsletterId.value}`
    );
    if (response) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "success";
      snackbarMsg.value = "Bülten başarılı bir şekilde silindi!";
      dialog.value = false;
      items.value = [];
      await getAllNewsletter(page.value);
    }
  } catch (error) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Bülten silinemedi lütfen tekrar deneyin!";
    dialog.value = false;
  }
}
const confirmDeleteNewsletter = async () => {
  try {
    const response = await $fetch(
      `/api/caricatures/delete?id=${deletedNewsletterId.value}`
    );
    if (response) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "success";
      snackbarMsg.value = "Bülten başarılı bir şekilde silindi!";
      dialog.value = false;
      items.value = [];
      await getAllNewsletter();
    }
  } catch (error) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Bülten silinemedi lütfen tekrar deneyin!";
    dialog.value = false;
  }
};

const removeNewsletterItem = async (newsId) => {
  deleteNewsletterItemDialog.value = true;
  deletedNewsId.value = newsId;
};

const confirmRemoveNewsletterItem = async () => {
  try {
    const response = await $fetch(
      `/api/caricatures/deleteByNewsUuid?newsId=${deletedNewsId.value}`
    );
    if (response) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "success";
      snackbarMsg.value = "Karikatür başarılı bir şekilde silindi";
      deleteNewsletterItemDialog.value = false;
      newsletterDetailDialog.value = false;
      items.value = [];
      await getAllNewsletter(page.value);
    }
  } catch (error) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Karikatür silinemedi lütfen tekrar deneyin!";
    deleteNewsletterItemDialog.value = false;
    newsletterDetailDialog.value = false;
  }
};

const getAllNewsletter = async (num) => {
  try {
    let request = await $fetch(
      `/api/caricatures/getByPageNum?pageNum=${num}`
    ).then((res) => {
      items.value = res
      res?.forEach((e) => {
        if (e?.news[0]?.content?.length == 0) {
          $fetch(`/api/caricatures/delete?id=${e._id}`);
        }
      });
      if(res.length == 0){
        disabledNewxtBtn.value = true
      }
      globalStore.setLoading(true);
      isLoading.value = false;
      return items;
    });
    return request;
  } catch (e) {
    console.error(e);
  }
};
onMounted(async () => {
  await getAllNewsletter(page.value);
});
</script>
