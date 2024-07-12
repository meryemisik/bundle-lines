import { defineStore } from "pinia";

export const useCaricatureStore = defineStore("caricature-store", {
	state: () => ({
		caricatures:'',
	}),
	actions: {
		async getAll() {
			try {
				let data = await $fetch("/api/caricatures");
				this.caricatures = data;
				console.log('data', data)
				return data ;
			} catch (e) {
				alert(e)
			}
		},
		async create(value:any) {
			await $fetch("/api/caricatures/create", {
				method: "POST",
				body: value.value,
			})
				.catch((e) => {
					alert(e)
				})
				.then(async () => {
					await this.getAll();
					alert("Karikatür eklendi")
				});
		}
	},
});
