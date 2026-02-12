import axios, { AxiosRequestHeaders } from 'axios';

import { STORAGE_KEYS } from '../consts';

const evaApiUrl = typeof window !== 'undefined' ? window.EVA_API_URL : '';

export const axiosInstance = axios.create({
  withCredentials: true,
  ...(evaApiUrl ? { baseURL: evaApiUrl } : {}),
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    if (localStorage.getItem(STORAGE_KEYS.AUTH_USER)) {
      config.headers['X-Username'] = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    const redirectUrl = response?.data?.redirectUrl;

    if (response.status === 200 && redirectUrl) {
      const isElectron = Boolean(window.IS_STANDALONE);

      if (isElectron) {
        // window.eva?.ipcSend?.("open-auth-window", redirectUrl);
      } else {
        window.localStorage.setItem('eva:open', 'true');
        window.location.href = redirectUrl;
      }

      throw new axios.Cancel('IAM_REDIRECT');
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
