import { createApiClient } from "./axiosPreset";

class UserService {
  constructor(api) {
    this.api = api;
    this.baseUrl = "";
  }

  async createUser(user) {
    try {
      console.log(user);
      await this.api.post(`${this.baseUrl}/users`, user);
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async syncScrapedProblems(dashboardKey) {
    try {
      await this.api.post(`${this.baseUrl}/users/sync-scraped/`, {
        dashboard_key: dashboardKey,
      });
    } catch (error) {
      throw new Error("Failed to sync scraped problems");
    }
  }

  async getUser() {
    try {
      const response = await this.api.get(`${this.baseUrl}/users`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get user");
    }
  }

  async validateDashboardKey() {
    try {
      await this.getUser(localStorage.getItem("clerkId"));
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
