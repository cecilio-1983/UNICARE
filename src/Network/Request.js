import axios from "axios";
import { baseUrl } from "../config/Config";

export async function post(
  url = "",
  body = {},
  onSuccess = (response) => {},
  onError = (error) => {}
) {
  try {
    const response = await axios.post(url, body, {
      baseURL: baseUrl,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    console.log("Post success:", response.data);
    onSuccess(response.data);
  } catch (error) {
    console.log("Post error:", error);

    if (error.code === "ERR_NETWORK") {
      onError({
        status: "error",
        message: "Please check your internet connection and try again.",
      });
    } else if (error.code === "ETIMEDOUT") {
      onError({
        status: "error",
        message: "Request timeout, try again.",
      });
    } else if (error.response && error.response.data) {
      onError({
        status: error.response.data.status,
        message: error.response.data.message,
      });
    } else {
      onError({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
}

export async function fetch(
  url = "",
  params = {},
  onSuccess = (response) => {},
  onError = (error) => {}
) {
  try {
    const response = await axios.get(url, {
      baseURL: baseUrl,
      params: params,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    console.log("Fetch success:", response.data);
    onSuccess(response.data);
  } catch (error) {
    console.log("Fetch error:", error);

    if (error.code === "ERR_NETWORK") {
      onError({
        status: "error",
        message: "Please check your internet connection and try again.",
      });
    } else if (error.code === "ETIMEDOUT") {
      onError({
        status: "error",
        message: "Request timeout, try again.",
      });
    } else if (error.response && error.response.data) {
      onError({
        status: error.response.data.status,
        message: error.response.data.message,
      });
    } else {
      onError({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
}

export async function put(
  url = "",
  body = {},
  onSuccess = (response) => {},
  onError = (error) => {}
) {
  try {
    const response = await axios.put(url, body, {
      baseURL: baseUrl,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    console.log("Put success:", response.data);
    onSuccess(response.data);
  } catch (error) {
    console.log("Put error:", error);

    if (error.code === "ERR_NETWORK") {
      onError({
        status: "error",
        message: "Please check your internet connection and try again.",
      });
    } else if (error.code === "ETIMEDOUT") {
      onError({
        status: "error",
        message: "Request timeout, try again.",
      });
    } else if (error.response && error.response.data) {
      onError({
        status: error.response.data.status,
        message: error.response.data.message,
      });
    } else {
      onError({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
}

export async function remove(
  url = "",
  params = {},
  onSuccess = (response) => {},
  onError = (error) => {}
) {
  try {
    const response = await axios.delete(url, {
      params: params,
      baseURL: baseUrl,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    console.log("Delete success:", response.data);
    onSuccess(response.data);
  } catch (error) {
    console.log("Delete error:", error);

    if (error.code === "ERR_NETWORK") {
      onError({
        status: "error",
        message: "Please check your internet connection and try again.",
      });
    } else if (error.code === "ETIMEDOUT") {
      onError({
        status: "error",
        message: "Request timeout, try again.",
      });
    } else if (error.response && error.response.data) {
      onError({
        status: error.response.data.status,
        message: error.response.data.message,
      });
    } else {
      onError({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
}

export async function uploadFile(
  url = "",
  file = { key: null, value: null },
  data = {},
  onProgress = (uploadedSize, totalSize, percentage) => {},
  onSuccess = (response) => {},
  onError = (error) => {}
) {
  const formData = new FormData();
  formData.append(file.key, file.value);

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const response = await axios.post(url, formData, {
      baseURL: baseUrl,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: localStorage.getItem("token"),
      },
      onUploadProgress: (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log("File upload percentage:", percentage);
        onProgress(progressEvent.loaded, progressEvent.total, percentage);
      },
    });

    console.log("File upload success:", response.data);
    onSuccess(response.data);
  } catch (error) {
    console.error("File upload error:", error);

    if (error.code === "ERR_NETWORK") {
      onError({
        status: "error",
        message: "Please check your internet connection and try again.",
      });
    } else if (error.code === "ETIMEDOUT") {
      onError({
        status: "error",
        message: "Request timeout, try again.",
      });
    } else if (error.response && error.response.data) {
      onError({
        status: error.response.data.status,
        message: error.response.data.message,
      });
    } else {
      onError({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
}
