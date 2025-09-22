import { IMeta } from "@/types";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { instance as axiosInstance } from "./axiosInstance";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      meta?: IMeta;
      contentType?: string;
    },
    unknown,
    unknown
  > =>
    async ({ url, method, data, params, contentType }) => {
      try {
        const result = await axiosInstance({
          url: baseUrl + url,
          method,
          data,
          params,
          headers: {
            "Content-Type": contentType || "application/json",
          },
          // withCredentials: true,
        });

        // Ensure we return the expected format for RTK Query
        return {
          data: result, // This should contain your transformed response from the interceptor
        };
      } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };