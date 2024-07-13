import { defineStore } from "pinia";

export const useCaricatureStore = defineStore("caricature-store", {
  state: () => ({
    caricatures: [],
    uploadedImage: [],
    uploadedSlider: [],
    uploadedVideo: [],
    title: "",
    sponsor: ""
  }),
  actions: {
    async getAll() {
      try {
        let data = await $fetch("/api/caricatures");
        this.caricatures = data;
        console.log("data", data);
        return data;
      } catch (e) {
        alert(e);
      }
    },
    async create() {
      const formData = {
        title: this.title,
        sponsor: this.sponsor,
      };

      try {
        await $fetch("/api/caricatures/create", {
          method: "POST",
          body: formData,
        });

        await this.getAll();
        alert("Karikatür eklendi");
      } catch (e) {
        alert(e);
      }
    },

    setUploadImage(image: any) {
      this.uploadedImage.push(image);
      console.log("uploadedImage", this.uploadedImage);
    },
    setUploadSlider(slider: any) {
      this.uploadedSlider.push(slider);
      console.log("uploadedSlider", this.uploadedSlider);
    },
    setUploadVideo(video: any) {
      this.uploadedVideo.push(video);
      console.log("uploadedVideo", this.uploadedVideo);
    },
    setUploadTitle(title: string) {
      this.title = title;
      console.log("title", this.title);
    },
    setUploadSponsor(sponsor: string) {
      this.sponsor = sponsor;
      console.log("sponsor", this.sponsor);
    },
  },
});
