// apiService.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/') {
    // constructor(baseURL: string = '') {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async request<T>(method: string, url: string, data?: any): Promise<any> {
    const response: AxiosResponse<T> = await this.axiosInstance.request({
      method,
      url,
      data,
    });
    return response.data;
  }

  public get<T>(path: string): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('GET', url);
  }

  public post<T>(path: string, data: any): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('POST', url, data);
  }

  public put<T>(path: string, data: any): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('PUT', url, data);
  }

  public patch<T>(path: string, data: any): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('PATCH', url, data);
  }

  public delete<T>(path: string): Promise<T> {
    const url = `/${path}`;
    return this.request<T>('DELETE', url);
  }
}

export default new ApiService();
