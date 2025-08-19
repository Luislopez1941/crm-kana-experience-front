// apiService.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

class ApiService {
  private axiosInstance: AxiosInstance;

  // constructor(baseURL: string = 'https://crm-kana-experience-jet92.ondigitalocean.app/') {
  constructor(baseURL: string = 'http://localhost:3000/') {
    // constructor(baseURL: string = '') {
    this.axiosInstance = axios.create({
      baseURL,  
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('tokenKana');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // TEMPORARILY DISABLED - Don't clear localStorage on 401 errors
        // if (error.response?.status === 401) {
        //   // Token expired or invalid, clear storage and redirect to login
        //   localStorage.removeItem('tokenKana');
        //   localStorage.removeItem('userKana');
          
        //   // Only redirect if not already on login page
        //   if (window.location.pathname !== '/login') {
        //     window.location.href = '/login';
        //   }
        // }
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(method: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    const response: AxiosResponse<T> = await this.axiosInstance.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  }

  public get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('GET', url, undefined, config);
  }

  public post<T>(path: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('POST', url, data, config);
  }

  public put<T>(path: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('PUT', url, data, config);
  }

  public patch<T>(path: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('PATCH', url, data, config);
  }

  public delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('DELETE', url, undefined, config);
  }
}

export default new ApiService();
