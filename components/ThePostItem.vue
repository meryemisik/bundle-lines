<template>
  <div class="post-item" :id="`post-item-${dataIndex}`">
    <v-container
      class="page-container my-0 my-md-6"
      v-if="postImages?.length > 0 || postImages?.[0]?.url"
    >
      <v-row class="bg-white rounded-xl">
        <v-col :id="`imagecover-${dataIndex}`">
          <template v-if="postType == 0">
            <v-img
              @click="goToDetailNews(props?.data, postImages?.[0]?.uuid)"
              :src="postImages?.[0]?.url"
              v-if="postImages?.[0]?.url"
              class="cursor-pointer"
            />
          </template>
          <template v-else-if="postType == 1">
            <v-col
              v-if="postImages?.[0]?.url"
              @click="goToDetailNews(props?.data, postImages?.[0]?.uuid)"
            >
              <v-responsive>
                <div :id="`video-${dataIndex}`">
                  <video
                    ref="video"
                    :controls="isPlaying"
                    @play="isPlaying = true"
                    controlsList="nodownload"
                    class="post-video rounded-lg"
                  >
                    <source :src="postImages?.[0]?.url" type="video/mp4" />
                    Tarayıcınız bu videoyu desteklemiyor.
                  </video>
                </div>
                <v-img
                  src="/icons/play.svg"
                  class="play-icon"
                  @click="playVideo"
                  v-if="!isPlaying"
                ></v-img>
              </v-responsive>
            </v-col>
          </template>
          <template v-else-if="postType == 2">
            <div class="position-relative" v-if="postImages?.length > 0">
              <v-carousel
                height="auto"
                v-model="currentSlide"
                hide-delimiter-background
                :show-arrows="false"
              >
                <v-carousel-item
                  v-for="(image, index) in postImages"
                  :key="index"
                  @click="
                    goToDetailNews(props?.data, postImages?.[index]?.uuid)
                  "
                  class="cursor-pointer"
                >
                  <v-img :src="image.url" :value="index" />
                </v-carousel-item>
              </v-carousel>
              <div class="position-absolute slider-control">
                <v-btn @click="prevImg" variant="plain" rounded="xl">
                  <v-img
                    src="/icons/arrow-left.svg"
                    class="carousel-icon"
                  ></v-img
                ></v-btn>
                <v-btn @click="nextImg" variant="plain" rounded="xl">
                  <v-img
                    src="/icons/arrow-right.svg"
                    class="carousel-icon"
                  ></v-img
                ></v-btn>
              </div>
            </div>
          </template>
        </v-col>
      </v-row>
      <v-row v-if="postCaricaturist">
        <v-col class="px-0 px-sm-3 px-md-6 mt-4 mb-n4">
          <div class="font-playfair post-caricaturist text-black">
            Çizer: {{ postCaricaturist }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="px-0 px-sm-3 px-md-6">
          <div
            class="font-weight-medium post-description font-playfair"
            :id="`description-${dataIndex}`"
            v-html="postDescription"
          ></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          class="d-flex justify-center align-center text-caption font-weight-medium px-0 px-sm-3 px-md-6"
          v-if="postDescription || postImages?.[0]?.url"
        >
          <div class="post-date font-roboto">{{ postCreatedAt }}</div>
          <div class="d-flex justify-center align-center flex-fill">
            <div
              class="cursor-pointer mx-1 mx-sm-2 mx-md-4 d-flex align-center"
              @click="likeToggle(data?.[0].newsId)"
            >
              <span class="mr-2 font-roboto like-count text-black">
                {{ likeCount }}
              </span>
              <v-img
                :width="24"
                :src="
                  checkPostIsLiked(dataPostId, data?.[0].newsId)
                    ? '/icons/favorite.svg'
                    : '/icons/favorite-outline.svg'
                "
                :class="`mr-2 like-button ${
                  checkPostIsLiked(dataPostId, data?.[0].newsId) && 'liked'
                } `"
              />
            </div>
            <div
              class="cursor-pointer position-relative mx-1 mx-md-2 mx-lg-4 d-flex align-center"
              @click="shareFunction(props?.posts)"
            >
              <span class="mr-2 font-roboto share-text text-black">Paylaş</span>
              <v-img :width="24" src="/icons/share.svg" />
              <div
                v-show="shareTooltip"
                class="position-absolute share-tooltip py-3 cursor-default"
              >
                <div class="d-flex justify-space-between">
                  <div
                    v-for="icon in socialIcons"
                    :key="icon.name"
                    rel="noopener noreferrer"
                  >
                    <v-img
                      :width="24"
                      :src="`/icons/${icon.name}.svg`"
                      :alt="icon.name"
                      class="cursor-pointer"
                      @click="createImage(icon.name)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <canvas
        id="canvas"
        width="1080"
        height="1350"
        ref="canvas"
        class="d-none"
      ></canvas>
      <v-snackbar
        v-model="isSnackbarVisible"
        timeout="3000"
        location="top right"
        color="success"
      >
        {{ snackbarMsg }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script setup>
import { sendGA4Events } from "~/services/ga4";
import html2canvas from "html2canvas";
import { useGlobalStore } from "~/stores/globalStore";

const globalStore = useGlobalStore();
const runtimeConfig = useRuntimeConfig();
const props = defineProps(["data", "posts"]);
const { $formatDate } = useNuxtApp();
const postCaricaturist = ref(props?.posts?.caricaturist || "");
const postCreatedAt = ref($formatDate(props?.posts?.createdAt) || "");
const isSnackbarVisible = ref(false);
const snackbarMsg = ref("");
const postType = ref(props?.data?.[0].type || 0);
const postDescription = ref(props?.data?.[0].description || "");
const postImages = ref(props?.data?.[0].content || null);
const likeCount = ref(props?.data?.[0].likeCount);
const randomLikeCount = ref(props?.data?.[0].randomLikeCount);
const dataIndex = ref(props?.posts?.news?.[0]?.newsId);
const dataPostId = ref(props?.posts?._id);
const stripHTMLTags = (input) => {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
};
const goToDetailNews = (content, uuid) => {
  globalStore.setActiveDetailPage(false);
  const router = useRouter();
  router.push(`/detail/${dataPostId.value}?newsId=${uuid || "null"}`);
};
const isWebView = computed(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Android WebView detection
  if (/android/i.test(userAgent) && /wv/.test(userAgent)) {
    return true;
  }
  // iOS WebView detection
  if (/iPhone|iPod|iPad/i.test(userAgent) && !window.MSStream) {
    if (
      (navigator.standalone && !window.navigator.standalone) ||
      !/safari/i.test(userAgent)
    ) {
      return true;
    }
  }
  return false;
});

const isIOSWebView = computed(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // iOS WebView detection
  if (/iPhone|iPod|iPad/i.test(userAgent) && !window.MSStream) {
    if (
      (navigator.standalone && !window.navigator.standalone) ||
      !/safari/i.test(userAgent)
    ) {
      return true;
    }
  }
  return false;
});

const isIOS = computed(() => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
});

const shareFunction = async (data) => {
  if (isIOS.value) {
    const shareData = {
      title: data.title.replace(/<\/?[^>]+(>|$)/g, ""),
      text: data.title.replace(/<\/?[^>]+(>|$)/g, ""),
      url: `${window.location.origin}/newsletter/${data._id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  } else {
    shareTooltip.value = !shareTooltip.value;
  }
};

const scrollToContent = () => {
  const route = useRoute();
  const newsId = route.query.newsId;
  if (parseInt(newsId) === dataIndex.value) {
    const element = document.getElementById(`post-item-${dataIndex.value}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
};

watchEffect(() => {
  if (props?.posts) {
    // let getFirstImage = props?.posts.news.find(
    //   (obj) => obj.type == 0 || obj.type == 2
    // );
    // getFirstImage = getFirstImage?.content?.[0]?.url;
    //let getFirstDescription = props?.posts?.news?.description;
    let getFirstDescription = props?.posts?.news?.[0]?.description;
    getFirstDescription = stripHTMLTags(getFirstDescription);
    useSeoMeta({
      title: props.posts.title.replace(/<\/?[^>]+>/gi, ""),
      ogTitle: props.posts.title.replace(/<\/?[^>]+>/gi, ""),
      description: getFirstDescription,
      ogDescription: getFirstDescription,
      //ogImage: getFirstImage,
      twitterCard: "summary_large_image",
      ogType: "article", // veya uygun tür
      ogSiteName: "Bundle Lines",
      //ogUrl: window.location.href,
      ogLocale: "tr_TR",
      twitterTitle: props.posts.title.replace(/<\/?[^>]+>/gi, ""),
      twitterDescription: getFirstDescription,
      //twitterImage: getFirstImage,
    });
  }
});

const measurementId = ref(props?.posts?.analyticsId);
const campaign = ref(props?.posts?.campaignName);

const { sendItemImpression, sendItemClick } = sendGA4Events({
  campaign: campaign.value,
  measurementId: measurementId.value,
  apiSecretKey: runtimeConfig.apiSecretKey,
});

const socialIconsForWebView = [
  {
    name: "link",
  },
];
const socialIcons = [
  {
    name: "facebook",
  },
  {
    name: "x",
  },
  {
    name: "linkedin",
  },
  {
    name: "whatsapp",
  },
  {
    name: "link",
  },
  {
    name: "download",
  },
];
const shareTooltip = ref(false);

const handleScroll = () => {
  shareTooltip.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  sendItemImpression("homepage");
  scrollToContent();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const canvas = ref(null);
const createImage = async (socialIconName) => {
  const sourceImage = ref(
    document.querySelector(`#imagecover-${dataIndex.value}`)
  );
  const postDescriptionElement = ref(
    document.querySelector(`#description-${dataIndex.value}`)
  );

  // if (postType.value == 0) {
  //   sourceImage.value = document.querySelector(`#image-${dataIndex.value} img`);
  // } else if (postType.value == 1) {
  //   var captureDivElement = document.querySelector(`#video-${dataIndex.value}`);
  //   var createCanvas = await html2canvas(captureDivElement, { useCORS: true });
  //   var createImgFromCanvas = createCanvas.toDataURL("image/png");
  //   sourceImage.value = document.createElement("img");
  //   sourceImage.value.src = createImgFromCanvas;
  // } else if (postType.value == 2) {
  //   sourceImage.value = document.querySelector(
  //     `#slider-${dataIndex.value} #slider-item-${currentSlide.value} img`
  //   );
  //   console.log("sourceImage.value : ", sourceImage.value)
  // }

  const frameImg = new Image();

  frameImg.src = "/canvas-frame.png";
  sourceImage.value.crossOrigin = "anonymous";
  frameImg.crossOrigin = "anonymous";
  //img.crossOrigin = "anonymous";
  frameImg.onload = () => {
    const ctx = canvas.value.getContext("2d");
    ctx.clearRect(0, 0, 1080, 1350);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

    const canvasContentWidth = (canvas.value.width / 38) * 30;
    var imgWidth = 0;
    var imgHeight = 0;
    var imgX = (canvas.value.width / 38) * 4;
    var imgY = (canvas.value.width / 38) * 2.5;
    if (sourceImage.value.offsetHeight > sourceImage.value.offsetWidth) {
      imgWidth =
        (sourceImage.value.offsetWidth / sourceImage.value.offsetHeight) *
        canvasContentWidth;
      imgHeight = canvasContentWidth;
      imgX = imgX + (canvasContentWidth - imgWidth) / 2;
    } else {
      imgWidth = canvasContentWidth;
      imgHeight =
        (sourceImage.value.offsetHeight / sourceImage.value.offsetWidth) *
        canvasContentWidth;
      imgY = imgY + (canvasContentWidth - imgHeight) / 2;
    }

    ctx.drawImage(frameImg, 0, 0, canvas.value.width, canvas.value.width);

    html2canvas(sourceImage.value, { useCORS: true }).then((imageElement) => {
      ctx.drawImage(imageElement, imgX, imgY, imgWidth, imgHeight);

      html2canvas(postDescriptionElement.value, { useCORS: true }).then(
        (descriptionElement) => {
          const textY = canvas.value.width;
          ctx.drawImage(
            descriptionElement,
            0,
            textY,
            canvas.value.width,
            (canvas.value.width / postDescriptionElement.value.offsetWidth) *
              postDescriptionElement.value.offsetHeight
          );

          sharePost(socialIconName, canvas.value.toDataURL("image/png"));
        }
      );
    });
  };
};

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

const createSharedNewsletter = async (imageBase64, imageId) => {
  try {
    const imgSrc = await sendFilesS3(imageBase64);

    if (imgSrc) {
      const route = useRoute();
      const formData = {
        imgSrc: imgSrc,
        fullPostId: dataPostId.value,
        imageId: imageId,
      };

      const response = await $fetch("/api/newsletter-detail/create", {
        method: "POST",
        body: formData,
      });
    } else {
      console.error("Failed to get image URL from S3");
    }
  } catch (e) {
    console.log("Error creating newsletter:", e);
  }
};

const sharePost = async (socialIconName, image) => {
  let imageId = generateUniqueId();
  let postTitle = props.posts.title.replace(/<\/?[^>]+>/gi, "");
  let postUrl = `${location.origin}/c/${imageId}`;

  await createSharedNewsletter(image, imageId);
  var socialUrl = null;
  if (socialIconName == "x") {
    socialUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      postTitle
    )}&url=${encodeURIComponent(postUrl)}`;
    setTimeout(() => {
      window.open(socialUrl, "_top");
    });
    sendItemClick(`X`);
  } else if (socialIconName == "whatsapp") {
    const text = encodeURIComponent(`${postTitle}: ${postUrl}`);
    socialUrl = `https://wa.me/?text=${text}`;
    setTimeout(() => {
      window.open(socialUrl, "_top");
    });
    sendItemClick(`whatsapp`);
  } else if (socialIconName == "facebook") {
    socialUrl = `https://www.facebook.com/dialog/share?app_id=584568938807562&display=popup&href=${encodeURIComponent(
      postUrl
    )}&redirect_uri=${encodeURIComponent(postUrl)}`;
    setTimeout(() => {
      window.open(socialUrl, "_top");
    });
    sendItemClick(`facebook`);
  } else if (socialIconName == "linkedin") {
    socialUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      postUrl
    )}`;
    setTimeout(() => {
      window.open(socialUrl, "_top");
    });
    sendItemClick(`linkedin`);
  } else if (socialIconName == "link") {
    socialUrl = `${location.origin}/c/${imageId}`;
    isSnackbarVisible.value = "true";
    snackbarMsg.value = "Kopyalandı!";
    const textArea = document.createElement("textarea");
    textArea.value = socialUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    await navigator.clipboard.writeText(socialUrl);
    sendItemClick(`link`);
  } else if (socialIconName == "download") {
    socialUrl = `${location.origin}/c/${imageId}`;
    isSnackbarVisible.value = "true";
    snackbarMsg.value = "Oluşturuldu!";
    setTimeout(() => {
      window.open(socialUrl, "_top");
      sendItemClick(`download`);
    });
  }
};

const currentSlide = ref(0);
const prevImg = () => {
  if (currentSlide.value != 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = postImages.value.length - 1;
  }
};
const nextImg = () => {
  if (postImages.value.length - 1 != currentSlide.value) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
};

const isLiked = ref(false);
const likeToggle = (newsId) => {
  toggleNewsInPost(dataPostId.value, newsId);
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    sendItemClick(`caricature-${dataIndex.value + 1}`);
  }
  likeCount.value = isLiked.value ? likeCount.value + 1 : likeCount.value - 1;
  updateLikeCount(dataPostId.value, newsId, likeCount.value);
};

const checkPostIsLiked = (postId, newsId) => {
  if (
    typeof localStorage === "undefined" ||
    localStorage.getItem("likedBundlePosts") == null
  ) {
    console.warn("localStorage is not available.");
    return false;
  }
  let likedPosts = JSON.parse(localStorage.getItem("likedBundlePosts")) || [];
  let posts = likedPosts[0];
  if (posts[postId] && posts[postId].includes(newsId)) {
    isLiked.value = true;
    return true;
  }
  isLiked.value = false;
  return false;
};
const toggleNewsInPost = (postId, newsId) => {
  if (
    typeof localStorage === "undefined" ||
    localStorage.getItem("likedBundlePosts") == null
  ) {
    let initialPosts = {};
    initialPosts[postId] = [];
    localStorage.setItem("likedBundlePosts", JSON.stringify([initialPosts]));
  }
  let likedPosts = JSON.parse(localStorage?.getItem("likedBundlePosts")) || [];
  let posts = likedPosts[0];
  if (posts[postId]) {
    let newsIndex = posts[postId].indexOf(newsId);
    if (newsIndex !== -1) {
      posts[postId].splice(newsIndex, 1);
      if (posts[postId].length === 0) {
        delete posts[postId];
      }
    } else {
      posts[postId].push(newsId);
    }
  } else {
    posts[postId] = [newsId];
  }
  localStorage.setItem("likedBundlePosts", JSON.stringify(likedPosts));
};

const isPlaying = ref(false);
const playVideo = () => {
  const videoElement = document.querySelector(
    `#video-${dataIndex.value} video`
  );
  if (videoElement && isPlaying) {
    videoElement.play();
  }
};

const updateLikeCount = async (id, likeCountIndex, likeCount) => {
  try {
    const response = await $fetch(`/api/caricatures/updateLikeCount`, {
      method: "PATCH",
      body: { newsId: likeCountIndex, likeCount: likeCount, id: id },
    });
  } catch (e) {
    console.error("Error updating like count:", e);
  }
};
</script>
