import axios from "axios";

export const createApiClient = ({ getToken, isSignedIn }) => {
  const axiosPreset = axios.create({
    baseURL: "http://localhost:4200/api",
  });

  axiosPreset.interceptors.request.use(
    async (config) => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (!token) {
            throw new Error("No token found");
          }
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Error retrieving token:", error);
          throw error;
        }
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
