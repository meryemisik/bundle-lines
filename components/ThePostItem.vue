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
                <video
                  ref="video"
                  :controls="isPlaying"
                  :id="`video-${dataIndex}`"
                  @play="isPlaying = true"
                  @pause="isPlaying = false"
                  controlsList="nodownload"
                  class="post-video"
                >
                  <source :src="postImages[0].url" type="video/mp4" />
                  Tarayıcınız bu videoyu desteklemiyor.
                </video>

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
            <!-- currentSlide: {{ currentSlide }} -->
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
          <p
            class="text-subtitle-2 text-md-subtitle-1 font-weight-medium text-center post-description"
            :id="`description-${dataIndex}`"
          >
            {{ postDescription }}
          </p>
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
              class="position-absolute share-tooltip py-3"
            >
              <div class="d-flex justify-space-between">
                <a
                  @click="createImage"
                  v-for="icon in socialIcons"
                  :key="icon.name"
                  rel="noopener noreferrer"
                >
                  <v-img
                    :width="24"
                    :src="`/icons/${icon.name}.svg`"
                    :alt="icon.name"
                  />
                </a>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <div v-show="resultSrc" style="background-color: rgb(219, 219, 219)">
        canvas:
        <canvas
          id="canvas"
          width="1080"
          height="1350"
          ref="canvas"
          class="w-100"
        ></canvas>
        <br />
        img
        <img
          id="result"
          alt="Merged Image"
          :src="resultSrc"
          v-if="resultSrc"
          class="w-100"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { sendGA4Events } from "~/services/ga4";

const { sendItemImpression, sendItemClick } = sendGA4Events({
  campaign: "bundle-lines-bunaltan-sicaklar-20240713",
  measurementId: "G-7PNZ5E4JDZ", // Your GA4 Measurement ID
  apiSecretKey: "RU0cCzDxRbCbpV6xOZ7xQA", // Your GA4 API Secret Key
});

const props = defineProps(["data", "dataIndex"]);

const postType = ref(props?.data?.type);
const postDescription = ref(props?.data?.description);
const postImages = ref(props?.data?.content);


const socialIcons = [
  {
    name: "facebook",
    url:
      "https://www.facebook.com/sharer.php?u=" +
      encodeURIComponent("window?.location.href"),
  },
  {
    name: "x",
    url:
      "https://x.com/intent/tweet?url=" +
      encodeURIComponent("window?.location.href") +
      "&text=" +
      encodeURIComponent("Bu karikatürü gördünüz mü?"),
  },
  {
    name: "instagram",
    url:
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      encodeURIComponent("window?.location.href") +
      "&title=" +
      encodeURIComponent("document.title") +
      "&summary=" +
      encodeURIComponent("Check this out!") +
      "&source=" +
      encodeURIComponent("window?.location.hostname"),
  },
  {
    name: "linkedin",
    url:
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      encodeURIComponent("window?.location.href") +
      "&title=" +
      encodeURIComponent("document.title") +
      "&summary=" +
      encodeURIComponent("Check this out!") +
      "&source=" +
      encodeURIComponent("window?.location.hostname"),
  },
  {
    name: "whatsapp",
    url:
      "https://api.whatsapp.com/send?text=" +
      encodeURIComponent("Bu karikatürü gördün mü? " + "window?.location.href"),
  },
  {
    name: "link",
    url:
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      encodeURIComponent("window?.location.href") +
      "&title=" +
      encodeURIComponent("document.title") +
      "&summary=" +
      encodeURIComponent("Check this out!") +
      "&source=" +
      encodeURIComponent("window?.location.hostname"),
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
const resultSrc = ref("");
const createImage = () => {
  const sourceImage = ref("")
  console.log("postType : ", postType)
  if(postType.value == 0){
     sourceImage.value = document.querySelector(`#image-${props.dataIndex} img`);
  }
  else if(postType.value == 1){
     sourceImage.value = document.querySelector(`#video-${props.dataIndex}`);
     console.log("videoooo : ", sourceImage.value);
  }
  else if(postType.value == 2){
     sourceImage.value = document.querySelector(`#slider-${props.dataIndex} #slider-item-${currentSlide.value} img`);
  }

  const sourceText = document.querySelector(`#description-${props.dataIndex}`);

  const context = canvas.value.getContext("2d");
  const imageElement = sourceImage.value;
  const text = sourceText.innerHTML;

  const firstImage = new Image();
  firstImage.src = "/canvas-frame.png";
  firstImage.onload = () => {
    context.clearRect(0, 0, 1080, 1350);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.value.width, canvas.value.height);

    context.drawImage(firstImage, 0, 0, canvas.value.width, canvas.value.width);

    const img = new Image();
    img.onload = function () {
      // Clear the canvas

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

      // Draw the image on the canvas
      context.drawImage(img, imgX, imgY, imgWidth, imgHeight);

      // Calculate the position for the text
      const textX = canvas.value.width / 2;
      const textY = canvas.value.width;

      document.fonts.load('30px "MetaSerifPro"').then(() => {
        // Set text properties
        context.font = "30px MetaSerifPro";
        context.fillStyle = "#E62C33";
        context.textAlign = "center";

        // Draw the text on the canvas
        const lineHeight = 40;
        wrapText(context, text, textX, textY, canvasContentWidth, lineHeight);

        // Set the result image src to the canvas data URL
        resultSrc.value = canvas.value.toDataURL("image/png");
      });
    };

    img.src = imageElement.src;
  };
};

const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(/(<a[^>]*>|<\/a>)/).filter(Boolean);
  let line = "";
  let isLink = false;

  words.forEach((word) => {
    if (word.startsWith("<a")) {
      isLink = true;
      return;
    }
    if (word === "</a>") {
      isLink = false;
      return;
    }

    const wordParts = word.split(" ");
    wordParts.forEach((part, index) => {
      const testLine = line + part + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && index > 0) {
        context.fillStyle = isLink ? "#E62C33" : "black";
        context.fillText(line, x, y);
        line = part + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    });

    if (line.trim()) {
      context.fillStyle = isLink ? "#E62C33" : "black";
      context.fillText(line, x, y);
      line = "";
      y += lineHeight;
    }
  });

  if (line) {
    context.fillStyle = isLink ? "#E62C33" : "black";
    context.fillText(line, x, y);
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
const likeToggle = (id) => {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    sendItemClick("visit_ad");
  }
};

const isPlaying = ref(false);

const playVideo = () => {
  const videoElement = document.getElementById(`video-${props.dataIndex}`);
  if (videoElement) {
    videoElement.play();
  }
};
</script>
