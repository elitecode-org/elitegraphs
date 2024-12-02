export const getLeetCodeUrl = (problemName) => {
  const urlName = problemName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
  return `https://leetcode.com/problems/${urlName}/description/`;
};

export const getVisibleData = (data, progress) => {
  const dates = data.links.map((link) => new Date(link.timestamp));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  // ... rest of the function
}; 