import { defineStore } from "pinia";

export const useGlobalStore = defineStore("counter", {
  state: () => ({
    isLoading: false,
    activeDetailPage : true
  }),
  actions: {
    setLoading(status: any) {
      this.isLoading = status;
    },
    setActiveDetailPage(status:any){
      this.activeDetailPage = status
    }
  },
});
