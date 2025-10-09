import { authKey, userDataKey } from "@/constants/storageKey";
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";

export const storeUserInfo = ({
  token,
  userData,
}: {
  token: string;
  userData: string;
}) => {
  setToLocalStorage(userDataKey, userData);
  return setToLocalStorage(authKey, token as string);
  // return setToCookies(authKey, token as string);
};

// export const getUserInfo = () => {
//   const authToken = getFromLocalStorage(authKey);
//   // console.log(authToken);
//   if (authToken) {
//     const decodedData = decodedToken(authToken);
//     return decodedData;
//   } else {
//     return "";
//   }
// };


export const getUserInfo = () => {
  const userData = getFromLocalStorage(userDataKey);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
}

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  return !!authToken;
};

export const removeUserInfo = (key: string) => {
  return localStorage.removeItem(key);
};

export const getNewAccessToken = async () => {
  return await axiosInstance({
    url: `${getBaseUrl()}/auth/refresh-token`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // withCredentials: true,
  });
};


export const logoutUser = async () => {
  removeUserInfo(authKey);
  removeUserInfo(userDataKey);
  // await axiosInstance({
  //   url: `${getBaseUrl()}/auth/logout`,
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   // withCredentials: true,
  // });
  window.location.href = "/login";
}