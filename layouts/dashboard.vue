<template>
  <v-row class="bg-white">
    <v-col class="ml-auto d-flex align-center justify-end">
      <v-icon
        icon="mdi-logout"
        color="light"
        @click="logout"
        class="bg-error rounded pa-5 ma-3"
        elevation="1"
      />
    </v-col>
  </v-row>
  <v-app>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
const { status, data, getSession, signIn, signOut } = useAuth();

const logout = () => {
  signOut();
};
if (!data?.value?.user) {
  signIn();
}
</script>

<style lang="scss">
.v-window__container {
  max-height: 100% !important;
  background: white;
  padding: 10px;
}
</style>
