import { API_URL } from "@config/api";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class BaseApiClient {
	protected axiosInstance: AxiosInstance;

	constructor(baseURL: string = API_URL) {
		this.axiosInstance = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});
	}

	// Method to set auth token
	public setAuthToken(token: string | null): void {
		if (token) {
			this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			delete this.axiosInstance.defaults.headers.common["Authorization"];
		}
	}

	protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
		return response.data;
	}

	protected async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
		return response.data;
	}

	protected async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
		return response.data;
	}

	protected async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
		return response.data;
	}

	protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
		return response.data;
	}

	public getAxiosInstance(): AxiosInstance {
		return this.axiosInstance;
	}
}
