// utils/fetchWithRetry.ts
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export async function fetchWithRetry<T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  retries = 3,
  delay = 1000
): Promise<AxiosResponse<T>> {
  try {
    return await axios({ method, url, data, ...config });
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(res => setTimeout(res, delay));
    return fetchWithRetry<T>(method, url, data, config, retries - 1, delay);
  }
}
