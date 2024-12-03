import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function generateToken() {
  return (
    "lt_" + Math.random().toString(36).substring(2) + Date.now().toString(36)
  );
}

export default function DashboardKeyModal({
  isOpen,
  onClose,
  dashboardKey,
  onGenerateNewKey,
}) {
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNewKey = async () => {
    setIsGenerating(true);
    try {
      const newKey = generateToken();
      onGenerateNewKey(newKey); // This will update the parent's state
      setIsKeyVisible(true);
    } catch (error) {
      console.error("Error generating new key:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-950 border border-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  Dashboard Key
                </Dialog.Title>

                <div className="mt-6">
                  <div className="flex items-center justify-between bg-gray-900/50 border border-gray-800 p-3 rounded-lg">
                    <span className="text-gray-200 font-mono text-sm">
                      {isKeyVisible ? dashboardKey : "••••••••••••••••"}
                    </span>
                    <button
                      onClick={() => setIsKeyVisible(!isKeyVisible)}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {isKeyVisible ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={handleGenerateNewKey}
                    disabled={isGenerating}
                    className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                      text-gray-200 hover:bg-gray-800/50 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Generate New Key"
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                      text-gray-200 hover:bg-gray-800/50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
