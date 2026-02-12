import { axiosInstance } from '@/shared/api';
import { MessageTitleRequest } from '../message';
import { AxiosRequestConfig } from 'axios';

export const fetchImage = async (request: MessageTitleRequest) => {
  const { urlParams, method, url } = request;

  const params = Object.fromEntries(urlParams.map(({ name, value }) => [name, value]));

  const { data } = await axiosInstance({
    method,
    url,
    params,
  } as AxiosRequestConfig);

  return data;
};
