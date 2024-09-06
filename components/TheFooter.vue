<template>
  <v-container class="page-container">
    <v-row class="align-center pr-2 pl-2 pb-6">
      <v-col class="d-flex justify-center flex-column mx-0 px-0 pb-6">
        <v-img :width="138" src="/logo/footer-logo.png" />
      </v-col>
      <v-col
        class="d-flex align-end flex-column mx-0 px-0 footer-text font-roboto"
        ><div>Bu bir <strong>Bundle</strong> ürünüdür.</div></v-col
      >
    </v-row>
  </v-container>
</template>

<style>
.footer-text {
  color: black;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 10px */
  letter-spacing: 0.2px;
}
</style>
