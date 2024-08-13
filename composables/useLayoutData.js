// composables/useLayoutData.js
import { inject, provide } from 'vue';

export const useLayoutData = () => {
  const headerData = inject('headerData', null);
  
  const setHeaderData = (data) => {
    if (headerData) {
      headerData.value = data;
    }
  };

  return setHeaderData;
};

export const provideLayoutData = (headerData) => {
  provide('headerData', headerData);
};
