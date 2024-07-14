<template>
    <v-app>
      <v-main>
        <the-header />
        <v-sheet>
          <template v-for="(type,index) in posts" :key="index">
            <the-post-item :videoId="index" :type="type"/>
          </template>
        </v-sheet>
        <the-footer />
      </v-main>
    </v-app>
  </template>
  
  
  
  <script setup>
  
  const posts = ref(["1", "2","2","1","0"]);
  
  
  </script>
