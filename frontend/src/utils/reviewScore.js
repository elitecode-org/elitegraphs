/**
 * Calculates a review score for a problem based on various factors.
 * Higher score means the problem needs review more urgently.
 *
 * @param {Object} problem - The problem object
 * @param {Date} problem.lastAttempted - When the problem was last attempted
 * @param {number} problem.confidence - User's confidence rating (1-5)
 * @param {number} problem.attempts - Number of attempts on the problem
 * @returns {number} Score between 0 and 10, where 10 means urgent review needed
 */
export function calculateReviewScore(problem) {
  if (!problem) return 0;

  // Calculate days since last attempt
  const daysSinceAttempt =
    (new Date() - new Date(problem.lastAttempted)) / (1000 * 60 * 60 * 24);

  // Time decay factor (increases as more time passes)
  // Reaches ~7 after 30 days, ~8.5 after 90 days
  const timeDecay = Math.log10(daysSinceAttempt + 1) * 3;

  // Confidence factor (decreases with higher confidence)
  // 5 stars = 0, 4 stars = 2, 3 stars = 4, 2 stars = 6, 1 star = 8
  const confidenceFactor = (5 - (problem.confidence || 0)) * 2;

  // Attempts factor (slightly increases with more attempts, max +1)
  const attemptsFactor = Math.min(
    problem.attempts ? (problem.attempts - 1) * 0.2 : 0,
    1
  );

  // Combine factors and clamp between 0 and 10
  const score = Math.min(
    Math.max((timeDecay + confidenceFactor + attemptsFactor) / 2, 0),
    10
  );

  return score;
}

/**
 * Gets a descriptive label for a review score
 *
 * @param {number} score -
 */
export function getReviewLabel(score) {
  if (score >= 8) return "Review Urgent";
  if (score >= 6) return "Review Important";
  if (score >= 4) return "Review Moderately Important";
  if (score >= 2) return "Review Less Important";
  return "Review Not Important";
}
