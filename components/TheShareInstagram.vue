<template>
  <v-container
    class="page-container border-b border-t mb-4 py-6 instagram-component"
  >
    <v-row>
      <v-col class="px-0 px-sm-3 px-md-6">
        <div class="d-flex align-center justify-center">
          <span
            class="follow-instagram font-playfair"
            @click="redirectToInstagram"
          >
            <p class="font-playfair">Bundle Lines’ı</p>
            <v-img
              src="/icons/instagram-1.png"
              alt="Instagram Logo"
              class="instagram-icon"
            ></v-img>
            <p class="font-playfair">Instagramda <span>takip et</span></p>
          </span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const redirectToInstagram = () => {
  window.open(
    "https://www.instagram.com/bundlelines?igsh=MXF5cHM2aWppYmVhNg==",
    "_blank"
  );
};
</script>
