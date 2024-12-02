import { createApiClient } from "./axiosPreset";

class UserService {
  constructor(api) {
    this.api = api;
    this.baseUrl = "";
  }

  async getScrapedProblems(dashboardKey) {
    try {
      const response = await this.api.get(
        `${this.baseUrl}/problems/scraped/${dashboardKey}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error("No problems found for this user");
      }
      if (error.response?.status === 403) {
        throw new Error("Unauthorized access");
      }
      throw new Error("Failed to fetch problems");
    }
  }

  async validateDashboardKey(dashboardKey) {
    try {
      await this.getScrapedProblems(dashboardKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to calculate statistics from problems
  calculateStats(problems) {
    const stats = {
      easy: 0,
      medium: 0,
      hard: 0,
      totalSolved: 0,
      acceptanceRate: "0%",
    };

    const accepted = problems.filter((p) => p.status === "accepted");
    const attempted = problems.filter((p) => p.status === "attempted");

    accepted.forEach((problem) => {
      switch (problem.difficultyLevel) {
        case "Easy":
          stats.easy++;
          break;
        case "Medium":
          stats.medium++;
          break;
        case "Hard":
          stats.hard++;
          break;
      }
    });

    stats.totalSolved = accepted.length;
    stats.acceptanceRate =
      attempted.length > 0
        ? `${((accepted.length / attempted.length) * 100).toFixed(1)}%`
        : "0%";

    return stats;
  }
}

const createUserService = ({ getToken, isSignedIn }) => {
  const api = createApiClient({ getToken, isSignedIn });
  return new UserService(api);
};

export default createUserService;
