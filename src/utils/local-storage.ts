export const setToLocalStorage = (key: string, token: string) => {
  if (!key || typeof window === "undefined") {
    return ""
  }
  return localStorage.setItem(key, token)
}

export const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return ""
  }
  return localStorage.getItem(key)
}


export const setToCookies = (key: string, value: string, days: number = 356) => {
  if (!key || typeof window === "undefined") {
    return ""
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`;
}
