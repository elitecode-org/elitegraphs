import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "@clerk/clerk-react";

const features = [
  {
    title: "track",
    description:
      "We track your progress and provide personalized recommendations.",
  },
  {
    title: "discover",
    description: "We use AI and embeddings to find the best problems for you.",
  },
  {
    title: "learn",
    description: "We provide catered editorials and code reviews.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen p-0 m-0 bg-gray-950 overflow-x-hidden">
      <main className="flex flex-col gap-12 items-center justify-center text-center min-h-screen m-0">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-6xl sm:text-8xl font-bold bg-clip-text pb-1
              text-transparent bg-gradient-to-r from-blue-500 to-purple-500
              drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]
              [text-shadow:_0_0_30px_rgb(147,51,234,0.5)]
              animate-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            elitecode
          </motion.h1>
          <motion.p
            className="text-xl text-white font-mono font-bold light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Leetcode is hard. Elitecode is easy.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="space-y-3 max-w-[300px] mx-auto w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <h2
                className="text-2xl font-semibold 
                text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500
                drop-shadow-[0_0_8px_rgba(219,39,119,0.5)]  
                [text-shadow:_0_0_15px_rgb(168,85,247,0.5)]
                break-words"
              >
                {feature.title}
              </h2>
              <p className="text-white font-mono font-medium text-md break-words">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <SignInButton mode="modal">
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Get Started
              </span>
            </button>
          </SignInButton>
        </motion.div>
      </main>

      <motion.footer
        className="py-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© 2024 Lighthouse. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}
