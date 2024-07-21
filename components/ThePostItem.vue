<template>
  <div class="post-item">
    <v-container class="page-container my-2 my-md-6 my-lg-12">
      <v-row>
        <v-col>
          <template v-if="postType == 0">
            <v-img :src="postImages[0].url" :id="`image-${dataIndex}`" />
          </template>
          <template v-else-if="postType == 1">
            <v-col>
              <v-responsive>
                <div :id="`video-${dataIndex}`">
                  <video
                    ref="video"
                    :controls="isPlaying"
                    @play="isPlaying = true"
                    controlsList="nodownload"
                    class="post-video"
                  >
                    <source :src="postImages[0].url" type="video/mp4" />
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
            <div class="position-relative">
              <v-carousel
                height="auto"
                v-model="currentSlide"
                hide-delimiter-background
                :show-arrows="false"
                :id="`slider-${dataIndex}`"
              >
                <v-carousel-item
                  v-for="(image, index) in postImages"
                  :key="index"
                  :src="image.url"
                  :value="index"
                  :id="`slider-item-${index}`"
                ></v-carousel-item>
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
      <v-row>
        <v-col class="px-0 px-sm-3 px-md-6">
          <div
            class="text-subtitle-2 text-md-subtitle-1 font-weight-medium text-center post-description"
            :id="`description-${dataIndex}`"
            v-html="postDescription"
          ></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center text-caption font-weight-medium">
          <div
            class="cursor-pointer mx-1 mx-sm-2 mx-md-4 d-flex align-center"
            @click="likeToggle(i)"
          >
            <v-img
              :width="24"
              :src="
                isLiked ? '/icons/favorite.svg' : '/icons/favorite-outline.svg'
              "
              :class="`mr-2 like-button ${isLiked && 'liked'} `"
            />
            <span>Beğen</span>
          </div>
          <div
            class="cursor-pointer position-relative mx-1 mx-md-2 mx-lg-4 d-flex align-center"
            @click="shareTooltip = !shareTooltip"
          >
            <v-img :width="24" src="/icons/share.svg" class="mr-2" />
            <span>Paylaş</span>
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
        timeout="30000"
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
const props = defineProps(["data", "dataIndex", "posts"]);
const isSnackbarVisible = ref(false);
const snackbarMsg = ref("");
const postType = ref(props?.data?.type);
const postDescription = ref(props?.data?.description);
const postImages = ref(props?.data?.content);

const stripHTMLTags = (input) => {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
};

watchEffect(() => {
  if (props?.posts) {
    let getFirstImage = props?.posts.news.find(
      (obj) => obj.type == 0 || obj.type == 2
    );
    getFirstImage = getFirstImage.content[0].url;
    let getFirstDescription = props?.posts.news[0].description;
    getFirstDescription = stripHTMLTags(getFirstDescription);
    useSeoMeta({
      title: props.posts.title,
      ogTitle: props.posts.title,
      description: getFirstDescription,
      ogDescription: getFirstDescription,
      ogImage: getFirstImage,
      twitterCard: "summary_large_image",
      ogType: "article", // veya uygun tür
      ogSiteName: "Bundle Lines",
      ogUrl: window.location.href,
      ogLocale: "tr_TR",
      twitterTitle: props.posts.title,
      twitterDescription: getFirstDescription,
      twitterImage: getFirstImage,
    });
  }
});

const measurementId = ref(props?.posts?.analyticsId);
const campaign = ref(props?.posts?.campaignName);

const { sendItemImpression, sendItemClick } = sendGA4Events({
  campaign: campaign.value,
  measurementId: measurementId.value, // Your GA4 Measurement ID
  apiSecretKey: "RU0cCzDxRbCbpV6xOZ7xQA", // Your GA4 API Secret Key
});

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
];
const shareTooltip = ref(false);

const handleScroll = () => {
  shareTooltip.value = false;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  sendItemImpression("homepage");
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const canvas = ref(null);
const createImage = async (socialIconName) => {
  const sourceImage = ref("");

  const postDescriptionElement = ref(
    document.querySelector(`#description-${props.dataIndex}`)
  );

  if (postType.value == 0) {
    sourceImage.value = document.querySelector(`#image-${props.dataIndex} img`);
  } else if (postType.value == 1) {
    var captureDivElement = document.querySelector(`#video-${props.dataIndex}`);
    var createCanvas = await html2canvas(captureDivElement);
    var createImgFromCanvas = createCanvas.toDataURL("image/png");
    sourceImage.value = document.createElement("img");
    sourceImage.value.src = createImgFromCanvas;
  } else if (postType.value == 2) {
    sourceImage.value = document.querySelector(
      `#slider-${props.dataIndex} #slider-item-${currentSlide.value} img`
    );
  }

  const context = canvas.value.getContext("2d", { willReadFrequently: true });
  const imageElement = sourceImage.value;

  const firstImage = new Image();
  firstImage.src = "/canvas-frame.png";
  firstImage.onload = async () => {
    context.clearRect(0, 0, 1080, 1350);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.value.width, canvas.value.height);

    context.drawImage(firstImage, 0, 0, canvas.value.width, canvas.value.width);

    const img = new Image();
    img.onload = async () => {
      const canvasContentWidth = (canvas.value.width / 38) * 30;
      var imgWidth = 0;
      var imgHeight = 0;
      var imgX = (canvas.value.width / 38) * 4;
      var imgY = (canvas.value.width / 38) * 2.5;

      if (img.height > img.width) {
        imgWidth = (img.width / img.height) * canvasContentWidth;
        imgHeight = canvasContentWidth;
        imgX = imgX + (canvasContentWidth - imgWidth) / 2;
      } else {
        imgWidth = canvasContentWidth;
        imgHeight = (img.height / img.width) * canvasContentWidth;
        imgY = imgY + (canvasContentWidth - imgHeight) / 2;
      }

      context.drawImage(img, imgX, imgY, imgWidth, imgHeight);

      const textY = canvas.value.width;

      var createCanvasDescription = await html2canvas(
        postDescriptionElement.value
      );
      var createImgFromDescriptionCanvas =
        createCanvasDescription.toDataURL("image/png");
      var sourceDescriptionImage = document.createElement("img");
      sourceDescriptionImage.src = createImgFromDescriptionCanvas;

      sourceDescriptionImage.onload = () => {
        context.drawImage(
          sourceDescriptionImage,
          0,
          textY,
          canvas.value.width,
          (canvas.value.width / postDescriptionElement.value.offsetWidth) *
            postDescriptionElement.value.offsetHeight
        );
        sharePost(socialIconName, canvas.value.toDataURL("image/png"));
      };
    };

    img.src = imageElement.src;
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

const createSharedNewsletter = async (image, imageId) => {
  const route = useRoute();
  const id = route.params.id;
  const formData = {
    imgSrc: image,
    fullPostId: id,
    imageId: imageId,
  };
  try {
    const response = await $fetch("/api/newsletter-detail/create", {
      method: "POST",
      body: formData,
    });
    console.log("response", response);
  } catch (e) {
    console.log("error", e);
  }
};

const sharePost = async (socialIconName, image) => {
  let imageId = generateUniqueId();
  let postTitle = props.posts.title;
  let postUrl = `${location.origin}/${imageId}`;

  createSharedNewsletter(image, imageId);
  var socialUrl = null;
  if (socialIconName == "x") {
    socialUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      postTitle
    )}&url=${encodeURIComponent(postUrl)}`;
  } else if (socialIconName == "whatsapp") {
    const text = encodeURIComponent(`${postTitle}: ${postUrl}`);
    socialUrl = `https://wa.me/?text=${text}`;
  } else if (socialIconName == "facebook") {
    socialUrl = `https://www.facebook.com/dialog/share?app_id=584568938807562&display=popup&href=${encodeURIComponent(
      postUrl
    )}&redirect_uri=${encodeURIComponent(postUrl)}`;
  } else if (socialIconName == "linkedin") {
    socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  } else if (socialIconName == "link") {
    socialUrl = postUrl;
    isSnackbarVisible.value = "true";
    snackbarMsg.value = "Copied!";
    await navigator.clipboard.writeText(socialUrl);
  }
  window.open(socialUrl, "_blank");
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
const likeToggle = (id) => {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    sendItemClick("visit_ad");
  }
};

const isPlaying = ref(false);

const playVideo = () => {
  const videoElement = document.querySelector(
    `#video-${props.dataIndex} video`
  );
  if (videoElement && isPlaying) {
    videoElement.play();
  }
};
</script>
