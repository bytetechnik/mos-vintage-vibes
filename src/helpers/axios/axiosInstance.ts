import { authKey, userDataKey } from "@/constants/storageKey";
import { getNewAccessToken, logoutUser } from "@/services/auth.service";

import { IGenericErrorResponse, ResponseSuccessType } from "@/types";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
import axios from "axios";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = getFromLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  function (response) {
    //!if need meta data then return whole response in future
    const responseObject: ResponseSuccessType = {
      ...response?.data || {},
      meta: response?.data?.meta || null,
    };

    // console.log(response);
    return responseObject
  },
  async function (error) {
    if (error?.response?.status === 401) {
      console.log(error.response?.data?.message || "Forbidden");

      const data = await getNewAccessToken()
      console.log(data);
      if (data?.data?.token) {
        setToLocalStorage(authKey, data.data.token);
        setToLocalStorage(userDataKey, data.data.user ? JSON.stringify(data.data.user) : "");
      } else {
        await logoutUser();
        window.location.href = "/login";
        return Promise.reject(error);
      }

    } else {
      const responseObject: IGenericErrorResponse = {
        statusCode: error?.response?.status || error?.response?.data?.statusCode || 500,
        message: error.response?.data?.error?.message || error?.response?.data?.message || "Something went wrong",
        errorMessages: error?.response?.data?.message,
      };
      return responseObject;
    }

    // return Promise.reject(error);
  }
);

export { instance };
