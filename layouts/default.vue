<template>
  <div>
    <the-header :data="headerData"/>
    <main>
      <slot />
    </main>
    <the-share-instagram />
    <the-footer />
  </div>
</template>

<script setup>
const provideLayoutData  = useLayoutData()

const headerData = ref(null);
provide('headerData', headerData);
</script>