<template>
    <v-row v-if="isAdVisible">
      <v-col class="align-center mx-auto d-flex my-8">
        <div :id="bannerSlotId" class="mx-auto" style="min-width: 300px; min-height: 250px"></div>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  
  const adUnitCode = '/21766134743/standart_banner_bundle_lines'
  const bannerSlotId = ref(`div-gpt-ad-${Math.random().toString(36).substr(2, 16)}`)  // Dinamik ID oluşturma
  const isAdVisible = ref(true)
  
  onMounted(() => {
    if (window.googletag && window.googletag.cmd) {
      window.googletag.cmd.push(function () {
        if (!window.googletag.pubads().getSlots().some(slot => slot.getSlotElementId() === bannerSlotId.value)) {
          const slot = window.googletag.defineSlot(adUnitCode, [300, 250], bannerSlotId.value)
            .addService(googletag.companionAds())
            .addService(googletag.pubads());
          googletag.pubads().enableSingleRequest();
          googletag.pubads().enableVideoAds();
          googletag.companionAds().setRefreshUnfilledSlots(true);
          googletag.enableServices();
 
          window.googletag.pubads().addEventListener('slotRenderEnded', function(event) {
            if (event.slot === slot && event.isEmpty) {
              isAdVisible.value = false;
            }
          });
        }
        googletag.display(bannerSlotId.value);
      });
    } else {
      console.error('googletag is not defined');
      isAdVisible.value = false;
    }
  });
  </script>
  