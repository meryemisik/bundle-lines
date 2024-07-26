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
</template>

<script setup>
useHead({
  title: "Karikatürlerim",
});
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
