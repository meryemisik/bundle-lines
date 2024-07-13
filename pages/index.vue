<template>
  <v-app>
    <v-main>
      <the-header />
      <v-sheet>
        <template v-for="i in 4">
          <the-post-item />
        </template>
      </v-sheet>
      <the-footer />
    </v-main>
  </v-app>
</template>
