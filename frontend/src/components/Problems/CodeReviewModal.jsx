import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import createFeedbackService from "../../services/feedbackService";
import { useAuth } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";

function CodeReviewModal({
  isOpen,
  onClose,
  code,
  title,
  problemTitle,
  language = "python",
}) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn } = useAuth();
  const feedbackService = createFeedbackService({ getToken, isSignedIn });

  // Syntax highlighting from Prism
  useEffect(() => {
    if (isOpen) {
      Prism.highlightAll();
    }
  }, [isOpen, code]);

  const handleGetReview = async () => {
    try {
      setLoading(true);
      const response = await feedbackService.getFeedback(problemTitle, code);
      const cleanFeedback = response.feedback
        .replace(/^```[\s\S]*?```$/gm, "")
        .replace(/^#+\s*/gm, "")
        .trim();
      setFeedback(cleanFeedback);
    } catch (error) {
      console.error("Failed to get review:", error);
      setFeedback("Error getting review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={handleGetReview}
              disabled={loading}
              className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
                bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#1D4ED8_50%,#3B82F6_100%)]"
              />
              <span
                className="inline-flex h-full w-full cursor-pointer items-center 
                justify-center rounded-full bg-gray-900 px-4 py-1 text-sm font-medium 
                text-blue-400 backdrop-blur-3xl hover:text-blue-300 transition-colors"
              >
                {loading ? "Getting Review..." : "Get AI Review"}
              </span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
          <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto">
            <code className={`language-${language}`}>{code}</code>
          </pre>

          {feedback && (
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Code Review Feedback
              </h3>
              <div className="text-gray-300 prose prose-invert max-w-none">
                <ReactMarkdown>{feedback}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CodeReviewModal;