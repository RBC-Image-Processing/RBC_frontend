import axios from "axios";
import { getToken } from "./token";
import { baseURL } from "../helper/Urls";

// import toast from "react-hot-toast";
const controller = new AbortController();

const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(async (config) => {
  try {
    let token = (await getToken("token")) || "";
    let username = (await getToken("username")) || "";

    config.headers["Authorization"] = `Bearer ${token}`;
    if (config.data) {
      config.data.sessionid = token;
      config.data.callerid = username;
    }
    config.signal = controller.signal;
    return config;
  } catch (err) {
    // toast.error(err);
  }
});

// Add a response interceptor to handle responses with non-2xx status codes
instance.interceptors.response.use(
  (response) => {
    // If the response is in the 2xx range, just return it
    return response;
  },
  (error) => {
    // If the response is outside the 2xx range, return the response data
    if (error.response) {
      return Promise.resolve(error.response);
    }
    // If the error doesn't have a response (like network errors), reject it
    return Promise.reject(error);
  }
);

// Get method
export const AXIOS_GET = async (Url, options = {}) => {
  return await instance({
    url: Url,
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken("token")}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    ...options, // Spread the options object to include query parameters
  });
};

// Post method
export const AXIOS_POST = async (Url, data, isreset = false) => {
  const headers = {
    Accept:
      "application/json, application/x-www-form-urlencoded, multipart/form-data",
  };

  // Conditionally add Authorization header if isreset is true
  if (!isreset) {
    headers.Authorization = `Bearer ${getToken("token")}`;
  }

  return await instance({
    url: Url,
    data,
    method: "POST",
    headers,
  });
};

// Put method
export const AXIOS_PUT = async (Url, data) => {
  return await instance({
    url: Url,
    data: data,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken("token")}`,
      Accept:
        "application/json, application/x-www-form-urlencoded, multipart/form-data ",
    },
  });
};

// Delete method

export const AXIOS_DELETE = async (Url) => {
  return await instance({
    url: Url,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken("token")}`,
      Accept:
        "application/json, application/x-www-form-urlencoded, multipart/form-data ",
    },
  });
};

export default instance;
