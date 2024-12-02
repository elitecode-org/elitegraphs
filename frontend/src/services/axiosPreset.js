import axios from "axios";

export const createApiClient = ({ getToken, isSignedIn }) => {
  const axiosPreset = axios.create({
    baseURL: "http://localhost:4200/api",
  });

  axiosPreset.interceptors.request.use(
    async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosPreset;
};

export default createApiClient;
