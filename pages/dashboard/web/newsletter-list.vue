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
              :items="paginatedItems"
              :items-per-page="itemsPerPage"
              hide-default-footer
              v-model:sort-by="sortBy"
              class="newsletter-list"
            >
              <template v-slot:[`item.img`]="{ item }">
                <v-img :src="item.news[0].content[0].url" :width="100" />
              </template>
              <template v-slot:[`item.desc`]="{ item }">
                <span
                  v-html="truncateText(item.news[0].description, 90)"
                ></span>
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ $formatDate(item.createdAt) }}
              </template>

              <template v-slot:[`item.btn`]="{ item }">
                <div class="trash-icon">
                  <v-icon
                    icon="mdi-trash-can-outline"
                    @click="removeCaricature(item._id)"
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
        Karikatürü silmek istediğinizden emin misiniz? Bu işlem
        geri alınamaz.
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
</template>

<script setup>
const removeCaricatureDialog = ref(false);
const deletedNewsletterId = ref(null);
const { $formatDate } = useNuxtApp();

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
  },
  { title: "Description", align: "start", key: "desc" },
  { title: "Oluşturma Tarihi", align: "start", key: "createdAt" },
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

const getAllWebCaricatures = async () => {
  try {
    let request = await $fetch(`/api/web-content/getAllWebCaricatures`).then(
      (res) => {
        items.value = res;
        isLoading.value = false;
      }
    );
    return request;
  } catch (e) {
    console.error(e);
  }
};

const removeCaricature = (item) => {
    console.log('itemss', item)
  removeCaricatureDialog.value = true;
  deletedNewsletterId.value = item;
};


const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const confirmRemoveCaricature = async () =>{
    try {
    const response = await $fetch(
      `/api/web-content/deleteWebCaricature?id=${deletedNewsletterId.value}`
    );
    if (response) {
      isSnackbarVisible.value = true;
      snackbarColor.value = "success";
      snackbarMsg.value = "Karikatür başarılı bir şekilde silindi!";
      removeCaricatureDialog.value = false;
      getAllWebCaricatures()
    }
  } catch (error) {
    isSnackbarVisible.value = true;
    snackbarColor.value = "error";
    snackbarMsg.value = "Karikatür silinemedi lütfen tekrar deneyin!";
  }
}

onMounted(async () => {
  await getAllWebCaricatures();
});
</script>
