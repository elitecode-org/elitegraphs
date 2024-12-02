export const getLeetCodeUrl = (title) => {
  return `https://leetcode.com/problems/${title
    ?.toLowerCase()
    .replace(/\s+/g, "-")}/`;
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "hard":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "easy":
      return "text-green-500";
    default:
      return "text-gray-400";
  }
};
