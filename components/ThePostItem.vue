<template>
  <div class="post-item">
    <v-container class="page-container my-2 my-md-6 my-lg-12">
      <v-row>
        <v-col>
          <template v-if="postType == 0">
            <v-img :src="postImages[0].url"  :id="`image-${dataIndex}`"/>
          </template>
          <template v-else-if="postType == 2">
            <div class="position-relative">
              <v-carousel
                height="auto"
                v-model="currentSlide"
                hide-delimiter-background
                :show-arrows="false"
              >
                <v-carousel-item
                  v-for="(image, index) in postImages"
                  :key="index"
                  :src="image.url"
                  :value="index"
                ></v-carousel-item>
              </v-carousel>
              <div class="position-absolute slider-control">
                <v-btn @click="prev" variant="plain" rounded="xl">
                  <v-img
                    src="/icons/arrow-left.svg"
                    class="carousel-icon"
                  ></v-img
                ></v-btn>
                <v-btn @click="next" variant="plain" rounded="xl">
                  <v-img
                    src="/icons/arrow-right.svg"
                    class="carousel-icon"
                  ></v-img
                ></v-btn>
              </div>
            </div>
          </template>
          <template v-else-if="postType == 1">
            <v-col>
              <v-responsive>
                <video
                  ref="video"
                  :controls="isPlaying"
                  :id="`video-${dataIndex}`"
                  style="width: 100%; height: 100%"
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
        </v-col>
      </v-row>
      <v-row>
        <v-col class="px-0 px-sm-3 px-md-6">
          <p class="text-subtitle-2 text-md-subtitle-1 font-weight-medium text-center" id="description">
           {{postDescription}}
            <a href="#" class="post-by text-decoration-none">@Kubilay Odabaş</a>
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
              class="mr-2"
            />
            <span>Beğen</span>
          </div>
          <div
            class="cursor-pointer position-relative mx-1 mx-md-2 mx-lg-4 d-flex align-center" @click="shareTooltip = !shareTooltip"
          >
            <v-img :width="24" src="/icons/share.svg" class="mr-2" />
            <span>Paylaş</span>
            <div
              v-if="shareTooltip"
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
                <!-- <a
                  v-for="icon in socialIcons"
                  :key="icon.name"
                  :href="icon.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <v-img
                    :width="24"
                    :src="/icons/${icon.name}.svg"
                    :alt="icon.name"
                  />
                </a> -->
              </div>
            </div>

          </div>
        </v-col>
      </v-row>

      <canvas id="canvas" width="1080" height="1350" ref="canvas" class="w-100"></canvas>
    <br>
    <img id="result" alt="Merged Image" :src="resultSrc" v-if="resultSrc"  class="w-100"/>

    </v-container>
  </div>
</template>

<script setup>
const socialIcons = [
  {
    name: "facebook",
    url:
      "https://www.facebook.com/sharer.php?u=" +
      encodeURIComponent('window?.location.href'),
  },
  {
    name: "x",
    url:
      "https://x.com/intent/tweet?url=" +
      encodeURIComponent('window?.location.href') +
      "&text=" +
      encodeURIComponent("Bu karikatürü gördünüz mü?"),
  },
  {
    name: "instagram",
    url:
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      encodeURIComponent('window?.location.href') +
      "&title=" +
      encodeURIComponent('document.title') +
      "&summary=" +
      encodeURIComponent("Check this out!") +
      "&source=" +
      encodeURIComponent('window?.location.hostname'),
  },
  {
    name: "linkedin",
    url:
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      encodeURIComponent('window?.location.href') +
      "&title=" +
      encodeURIComponent('document.title') +
      "&summary=" +
      encodeURIComponent("Check this out!") +
      "&source=" +
      encodeURIComponent('window?.location.hostname'),
  },
  {
    name: "whatsapp",
    url:
      "https://api.whatsapp.com/send?text=" +
      encodeURIComponent("Bu karikatürü gördün mü? " + 'window?.location.href'),
  },
  {
    name: "link",
    url:
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      encodeURIComponent('window?.location.href') +
      "&title=" +
      encodeURIComponent('document.title') +
      "&summary=" +
      encodeURIComponent("Check this out!") +
      "&source=" +
      encodeURIComponent('window?.location.hostname'),
  },
];
const shareTooltip = ref(false);

const scrollY = ref(0);
const handleScroll = () => {
  shareTooltip.value = false;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});


const canvas = ref(null);
const resultSrc = ref('');
const createImage=()=> {
    const sourceImage = document.querySelector(`#image-${props.videoId} img`);
    const sourceText = document.getElementById('description');

    console.log("sourceImage : ", sourceImage)

    const context = canvas.value.getContext('2d');
  const imageElement = sourceImage;
  const text = sourceText.innerText;


  const img = new Image();
  img.onload = function() {
    // Clear the canvas
    context.clearRect(0, 0, 1080, 1350);


    const padding = 10;
    const availableWidth = canvas.value.width - padding * 2;
    const imgHeight = (img.height / img.width) * availableWidth;
    const imgX = padding;
    const imgY = (canvas.value.height - imgHeight) / 2;
   

    // Draw the image on the canvas
    context.drawImage(img, imgX, imgY, availableWidth, imgHeight);

    

    // Calculate the position for the text
    const textX = canvas.value.width / 2;
    const textY = imgHeight + padding * 20;


    document.fonts.load('30px "MetaSerifPro"').then(() => {

        // Set text properties
    context.font = '30px MetaSerifPro';
    context.fillStyle = 'red';
    context.textAlign = 'center';
  
    // Draw the text on the canvas
    const lineHeight = 40;
    wrapText(context, text, textX, textY, availableWidth, lineHeight);

    // Set the result image src to the canvas data URL
    resultSrc.value = canvas.value.toDataURL('image/png');
    });
  };

  img.src = imageElement.src;
}



const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
};


const props = defineProps(["data", "dataIndex"]);

const currentSlide = ref(0);
const prev = () => {
  if (currentSlide.value != 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = postImages.value.length - 1;
  }
};
const next = () => {
  if (postImages.value.length - 1 != currentSlide.value) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
};


const postType = ref(props?.data?.type);
const postDescription = ref(props?.data?.description)
const postImages = ref(props?.data?.content);

const isLiked = ref(false);
const likeToggle = (id) => {
  isLiked.value = !isLiked.value;
};

const isPlaying = ref(false);

const playVideo = () => {
  const videoElement = document.getElementById(`video-${props.dataIndex}`);
  if (videoElement) {
    videoElement.play();
  }
};
</script>

<style>
.v-window__container{
  max-height: 500px !important;
}
.v-img__img--contain {
    max-height: 500px !important;
}
</style>

