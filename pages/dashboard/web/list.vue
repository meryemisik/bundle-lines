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
              <template v-slot:[`item.title`]="{ item }">
                <span v-html="item.title"></span>
              </template>
              <template v-slot:[`item.sponsor`]="{ item }">
                {{ item.sponsor }}
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ $formatDate(item.createdAt) }}
              </template>

              <template v-slot:[`item.btn`]="{ item }" >
                <v-menu>
                  <template v-slot:activator="{ props }" v-if="!item.sponsorIsDeleted">
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
                    <v-list-item @click="removeSponsor(item._id)" >
                      Sponsor sil
                    </v-list-item>
                  </v-list>
                </v-menu>
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
  <v-dialog v-model="removeSponsorDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Onay Gerekiyor</v-card-title>
      <v-card-text>
       Bu bültene ait sponsoru silmek istediğinizden emin misiniz? Bu işlem geri alınamaz. 
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="darken-1 bg-error" text @click="removeSponsorDialog = false"
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
const removeSponsorDialog = ref(false)
const deletedNewsletterId = ref(null)
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
    title: "Başlık",
    align: "start",
    key: "title",
  },
  { title: "Sponsor", align: "start", key: "sponsor" },
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

const getAllWebContent = async () => {
  try {
    let request = await $fetch(`/api/web-content/getAllWebContent`).then(
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

const removeSponsor = (item) => {
  removeSponsorDialog.value = true;
  deletedNewsletterId.value = item;
}

const confirmDeleteSponsor = async () =>{
  try {
    const response = await $fetch(
      `/api/web-content/deleteSponsor?id=${deletedNewsletterId.value}`
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
}

onMounted(async () => {
  await getAllWebContent();
});
</script>
