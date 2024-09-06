<template>
  <div v-if="isClientMounted">
    <v-row class="page-container mx-auto" >
      <v-col
       
        class="pa-0 text-center "
      >
        <div class="d-inline-flex">
          <v-img
            :width="80"
            :src="postsUpdated?.sponsorImage[0]"
            class="mr-2"
          />
          <span class="text-sponsorship font-weight-medium font-roboto">{{
            postsUpdated?.sponsor
          }}</span>
        </div>
      </v-col>
    </v-row>
    <the-post-item :data="postsUpdated.news" :posts="postsUpdated" :sourcePage = "'detail'" class="mt-4"/>
  </div>
  <div v-else>
    <v-skeleton-loader
      type="image,paragraph,actions"
      class="my-3 mx-auto pa-3 bg-light rounded-xl"
      max-width="600"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  posts: {
    type: Object,
    required: true,
    default: () => ({
      news: [],
    }),
  },
});
const postsUpdated = ref(null);
const isClientMounted = ref(false);
const selectedNews = ref([]);

const findContentByUuid = async(data, targetUuid) => {
    for (const item of data) {
        for (const content of item.content) {
            if (content.uuid === targetUuid) {
                return item.content; 
            }
        }
    }
    return null; 
}

const getSliderDetail = async (id) => {
  try {
    const response = await $fetch(`/api/caricatures/getById?id=${id}`);
    if (response && response.news) {
      selectedNews.value = [...(response?.news?.[0]?.content || [])]

      if(response?.news.length > 1){
        const contentList = await findContentByUuid(response?.news, route.query.newsId)
        selectedNews.value = [...(contentList || [])]
      }
    }
  } catch (e) {
    console.error("Error fetching posts:", e);
  }
};

onMounted( async() => {
  isClientMounted.value = true;

  const contentArray = props?.posts?.news?.[0]?.content?.map((item) => {
    if (!item.uuid) {
      return { ...item, uuid: "null" };
    }
    return item;
  });

  const targetObject = contentArray?.find(
    (item) => item.uuid === route.query.newsId
  );

  selectedNews.value.push(targetObject);

  let typeNum = props?.posts?.news?.[0].type;

  if (props?.posts?.news?.[0].type == 2) {
     await getSliderDetail(route.params.id)
  }

  const updatedData = {
    ...props?.posts,
    news: [
      {
        ...props?.posts?.news?.[0],
        content: selectedNews.value,
        type: typeNum,
      },
    ],
    ...props?.posts?.news.slice(1),
  };
  postsUpdated.value = updatedData;
});
</script>
