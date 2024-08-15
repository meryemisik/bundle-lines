<template>
  <v-container class="page-container border-b border-t mb-4 py-6">
        <v-row>
          <v-col class="px-0 px-sm-3 px-md-6">
            <div class="centered-content">
              <span class="follow-instagram" @click="redirectToInstagram">
                <p>Bundle Lines’ı</p>
                <v-img
                  src="/icons/instagram-1.png"
                  alt="Instagram Logo"
                  class="instagram-icon"
                ></v-img>
                <p>Instagramda <span>takip et</span></p>
              </span>
            </div>
          </v-col>
        </v-row>
      </v-container>
</template>
<script setup>
import { ref } from "vue";
const redirectToInstagram = () => {
  window.open(
    "https://www.instagram.com/bundlelines?igsh=MXF5cHM2aWppYmVhNg==",
    "_blank"
  );
};
</script>
<style lang="scss">
.centered-content {
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-family: Playfair Display;
    font-size: 16px;
    font-weight: 500;
    line-height: 20.96px;
    letter-spacing: 0.01em;
    text-align: left;
    span {
      font-family: Playfair Display;
      font-size: 16px;
      font-weight: 500;
      line-height: 20.96px;
      letter-spacing: 0.01em;
      text-align: left;
      color: rgba(230, 44, 51, 1);
      text-decoration: underline;
    }
  }
}

.follow-instagram {
  padding: 10px 20px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.instagram-icon {
  width: 20px;
}
</style>
