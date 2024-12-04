import { createApiClient } from "./axiosPreset";

class FeedbackService {
  constructor(api) {
    this.api = api;
    this.baseUrl = "";
  }

  async getFeedback(problemTitle, code, dashboardKey) {
    try {
      console.log(code, problemTitle);
      const response = await this.api.post(
        `${this.baseUrl}/genai/structured-feedback`,
        {
          problemTitle,
          code,
        },
        {
          headers: {
            "x-dashboard-key": dashboardKey,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get feedback");
    }
  }
}

const createFeedbackService = ({ getToken, isSignedIn }) => {
  const api = createApiClient({ getToken, isSignedIn });
  return new FeedbackService(api);
};

export default createFeedbackService;
