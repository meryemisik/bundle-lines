<template>
  <v-container class="page-container">
    <v-row>
      <v-col>
        <div class="ml-auto mb-4 d-flex align-center justify-end">
          <v-btn
            class="ma-2"
            size="large"
            color="primary"
            append-icon="mdi-plus"
            @click="goDashboard"
          >
            <span class="font-barlow">Yeni Oluştur</span>
          </v-btn>
          <v-icon
            icon="mdi-logout"
            color="light"
            @click="logout"
            class="mx-1 bg-error rounded pa-5"
            elevation="1"
          />
        </div>

        <v-card elevation="10" class="pa-3">
          <template v-if="isLoading">
            <v-skeleton-loader
              class="mx-auto border"
              width="500"
              type="table"
            ></v-skeleton-loader>
          </template>
          <template v-else>
            <v-data-table
              :headers="headers"
              :items="paginatedItems"
              :items-per-page="itemsPerPage"
              hide-default-footer
              v-model:sort-by="sortBy"
            >
              <template v-slot:[`item.title`]="{ item }">
                <span v-html="item.title"></span>
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ formatISODate(item.createdAt) }}
              </template>
              <template v-slot:[`item.btn`]="{ item }">
                <v-icon small @click="goNews(item._id)">
                  mdi-open-in-new
                </v-icon>
                <v-icon small class="ml-2" @click="goDetail(item._id)"
                  >mdi-eye-outline</v-icon
                >
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
        </template>
        <template v-slot:[`item.description`]="{ item }">
          <span v-html="item.description"></span>
        </template>
        <template v-slot:[`item.likeCount`]="{ item }">
          <span class="newsletter-detail-dialog-table-like-count">
            {{ item.likeCount }}</span
          >
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script setup>
useHead({
  title: "Karikatürlerim",
});
const newsletterDetailDialog = ref(false);
const newsletterDetailData = ref([]);
const isLoading = ref(true);
const { status, data, getSession, signIn, signOut } = useAuth();
if (!data?.value?.user) {
  signIn();
}

const logout = () => {
  signOut();
};

const router = useRouter();
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
      newsletterDetailDialog.value = true;
      newsletterDetailData.value = response;
    }
  } catch (e) {
    console.error("Error fetching posts:", e);
  }
};
const page = ref(1);
const itemsPerPage = ref(10);
const headers = ref([
  {
    title: "Başlık",
    align: "start",
    key: "title",
  },
  { title: "Oluşturma Tarihi", align: "end", key: "createdAt" },
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
  {
    title: "Beğeni Sayısı",
    align: "start",
    key: "likeCount",
  },
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

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const nextPage = () => {
  if (page.value < pageCount.value) {
    page.value++;
  }
};

onMounted(async () => {
  try {
    let request = await $fetch(
      `/api/caricatures/getByCreator?creator=${data?.value?.user.email}`
    ).then((res) => {
      res?.caricatures?.forEach((e) => {
        items.value.push({ ...e, btn: "" });
      });
      isLoading.value = false;
    });
    return request;
  } catch (e) {
    console.error(e);
  }
});

const formatISODate = (isoDate) => {
  const date = new Date(isoDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
</script>
<style lang="scss">
.newsletter-detail-dialog {
  .v-card-title {
    p {
      padding: 10px;
    }
  }
  table {
    width: 90% !important;
    border-spacing: 0;
    margin: auto !important;
  }
  &-table {
    &-image {
      width: 150px;
    }
    &-like-count {
      font-size: 20px !important;
    }
  }
}
</style>
