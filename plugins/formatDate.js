export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatDate: (isoDate) => {
        const date = new Date(isoDate);

        const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC', 
        };

        return date.toLocaleDateString('tr-TR', options);
      }
    }
  }
});
