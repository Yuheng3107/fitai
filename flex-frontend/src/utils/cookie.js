import Cookies from 'js-cookie';

export const setCookie = (key, value) => {
  Cookies.set(key, value, {
    expires: 7, // Cookie will expire after 7 days
    path: '/', // Cookie will be available in the entire application
  });
};

export const removeCookie = (key) => {
  Cookies.remove(key, {
    path: '/', // Remove cookie from the entire application
  });
};

export const getCookie = (key) => {
  return Cookies.get(key);
};