<template>
  <div class="post-item">
    <v-container class="page-container my-12">
      <v-row>
        <v-col>
            <template v-if="postType == 1">
                <v-img src="/News-1.png" />
            </template>
            <template v-else-if="postType == 2">
          <v-carousel hide-delimiter-background>
            <v-carousel-item
              v-for="(image, index) in images"
              :key="index"
              :src="image"
            ></v-carousel-item>

            <template v-slot:prev="{ props }">
              <v-btn icon variant="plain">
                <v-img
                  src="/icons/arrow-left.svg"
                  class="carousel-icon"
                  @click="props.onClick"
                ></v-img>
              </v-btn>
            </template>

            <template v-slot:next="{ props }">
              <v-btn icon variant="plain">
                <v-img
                  src="/icons/arrow-right.svg"
                  class="carousel-icon"
                  @click="props.onClick"
                ></v-img>
              </v-btn>
            </template>
          </v-carousel>
        </template>
        <template v-else-if="postType == 3">
            <v-col>
            <v-responsive aspect-ratio="16/9">
              <video
                ref="video"
                controls
                class="video-element"
                style="width: 100%; height: 100%;"
                @play="isPlaying = true"
                @pause="isPlaying = false"
              >
                <source src="/video.mp4" type="video/mp4" />
                Tarayıcınız bu videoyu desteklemiyor.
              </video>
              <v-overlay
                v-if="!isPlaying"
                absolute
                :value="true"
                class="d-flex align-center justify-center"
                @click="playVideo"
              >
                <v-img src="/icons/play.svg" class="play-icon"></v-img>
              </v-overlay>
            </v-responsive>
          </v-col>
        </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="px-6">
          <p class="text-subtitle-1 font-weight-bold text-center">
            ABD yeni savunma programını açıkladı: Savaşlarda yapay zeka karar
            alacak
            <a href="#" class="post-by text-decoration-none">@Kubilay Odabaş</a>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center text-caption font-weight-bold">
          <div
            class="cursor-pointer mx-4 d-flex align-center"
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
          <div class="cursor-pointer mx-4 d-flex align-center">
            <v-img :width="24" src="/icons/share.svg" class="mr-2" />
            <span>Paylaş</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const postType = ref(2)
const isLiked = ref(false);
const likeToggle = (id) => {
  isLiked.value = !isLiked.value;
};

const images = ref(["/News-1.png", "/News-2.png"]);

const isPlaying = ref(false);

const playVideo = () => {
  const videoElement = document.querySelector('.video-element');
  if (videoElement) {
    videoElement.play();
  }
};

</script>

<style>
.carousel-icon {
  width: 24px;
  height: 24px;
}
.v-carousel__controls {
  bottom: -20px;
}
.v-carousel__controls__item.v-btn.v-btn--icon {
  background-color: #eeeeee;
  height: 6px;
  width: 6px;
  border-radius: 100%;
}

.v-carousel__controls__item.v-btn.v-btn--icon.v-btn--active {
  background-color: #1f1f1f;
}

.v-carousel__controls__item.v-btn.v-btn--icon:hover {
  background-color: #282828;
}

.v-btn__content .v-icon {
  display: none;
}

.play-icon {
  width: 64px;
  height: 64px;
  cursor: pointer;
}
.video-element {
  object-fit: cover;
}
</style>
