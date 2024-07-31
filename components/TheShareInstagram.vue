<template>
    <v-container class="page-container">
      <v-row>
        <v-col class="px-0 px-sm-3 px-md-6">
          <div class="centered-content">
            <span class="follow-instagram" @click="redirectToInstagram">
              <p>Bundle Lines’ı Instagramda takip et</p>
              <v-img
                src="/icons/instagram.svg"
                alt="Instagram Logo"
                class="instagram-icon"
              ></v-img>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
<script setup>
import { ref } from 'vue';

const redirectToInstagram = () => {
  window.open(
    'https://www.instagram.com/bundlelines?igsh=MXF5cHM2aWppYmVhNg==',
    '_blank'
  );
};
</script>
<style>
.centered-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.follow-instagram {
  border: 1px solid black;
  padding: 10px 20px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 24px;
  cursor: pointer;
}

.instagram-icon {
  width: 30px;
}
</style>
  