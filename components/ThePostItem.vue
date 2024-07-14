<template>
  <div class="post-item">
    <v-container class="page-container my-2 my-md-6 my-lg-12">
      <v-row>
        <v-col>
          <template v-if="postType == 0">
            <v-img src="/News-1.png" />
          </template>
          <template v-else-if="postType == 1">
            <div class="position-relative">
              <v-carousel
                height="auto"
                v-model="currentSlide"
                hide-delimiter-background
                :show-arrows="false"
              >
                <v-carousel-item
                  v-for="(image, index) in images"
                  :key="index"
                  :src="image"
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
          <template v-else-if="postType == 2">
            <v-col>
              <v-responsive aspect-ratio="16/9">
                <video
                  ref="video"
                  :controls="isPlaying"
                  :id="`video-${videoId}`"
                  style="width: 100%; height: 100%"
                  @play="isPlaying = true"
                  @pause="isPlaying = false"
                  controlsList="nodownload"
                >
                  <source src="/video.mp4" type="video/mp4" />
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
          <p class="text-subtitle-2 text-md-subtitle-1 font-weight-medium text-center">
            ABD yeni savunma programını açıkladı: Savaşlarda yapay zeka karar
            alacak
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
            class="cursor-pointer mx-1 mx-md-2 mx-lg-4 d-flex align-center"
            @click="dialog = true"
          >
            <v-img :width="24" src="/icons/share.svg" class="mr-2" />
            <span>Paylaş</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const images = ref([
  "/News-1.png",
  "/News-2.png",
  "/News-1.png",
  "/News-2.png",
]);

const currentSlide = ref(0);
const prev = () => {
  if (currentSlide.value != 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = images.value.length - 1;
  }
};
const next = () => {
  if (images.value.length - 1 != currentSlide.value) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
};

const show = ref(false);

const props = defineProps(["videoId", "type"]);
const postType = ref(props.type);
const isLiked = ref(false);
const likeToggle = (id) => {
  isLiked.value = !isLiked.value;
};

const isPlaying = ref(false);

const playVideo = () => {
  const videoElement = document.getElementById(`video-${props.videoId}`);
  if (videoElement) {
    videoElement.play();
  }
};
</script>

<style lang="scss">
.carousel-icon {
  width: 24px;
  height: 24px;
}
.v-carousel__controls {
  bottom: -20px;

  &__item {
    &.v-btn.v-btn--icon {
      background-color: #eeeeee;
      height: 6px;
      width: 6px;
      border-radius: 100%;
      &.v-btn--active {
        background-color: #1f1f1f;
      }
      &:hover {
        background-color: #282828;
      }
    }
  }
}

.v-btn__content .v-icon {
  display: none;
}

.play-icon {
  width: 100%;
  height: 100%;
  z-index: 999999;
  position: absolute;
  top: 0;
  cursor: pointer;

  img {
    width: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.slider-control {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
  width: 150%;

  @media screen and (max-width: 870px) {
    width: 100%;
  }
}
</style>
