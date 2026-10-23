import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const providers = [
  {
    id: 'grab',
    label: 'Grab / Foodpanda',
    emoji: '🟢',
    bg: 'bg-green-50',
    border: 'border-green-300',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    hoverBorder: 'hover:border-green-400',
  },
  {
    id: 'shopee',
    label: 'Shopee / Lazada',
    emoji: '🟠',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    hoverBorder: 'hover:border-orange-400',
  },
  {
    id: 'courier',
    label: 'Courier / Freight',
    emoji: '📦',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    hoverBorder: 'hover:border-blue-400',
  },
  {
    id: 'home',
    label: 'Home Service',
    emoji: '🏠',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    hoverBorder: 'hover:border-purple-400',
  },
];

const TOTAL_SECONDS = 15 * 60;

export default function DeliveryDriver() {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [riderPhase, setRiderPhase] = useState(0);
  const intervalRef = useRef(null);
  const riderTimeoutRefs = useRef([]);

  const startCountdown = useCallback(() => {
    setSecondsLeft(TOTAL_SECONDS);
    setRiderPhase(0);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const t1 = setTimeout(() => setRiderPhase(1), 5000);
    const t2 = setTimeout(() => setRiderPhase(2), 10000);
    riderTimeoutRefs.current = [t1, t2];
  }, []);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    riderTimeoutRefs.current.forEach(clearTimeout);
    riderTimeoutRefs.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleSelectProvider = useCallback(
    (provider) => {
      cleanup();
      setSelectedProvider(provider);
      startCountdown();
    },
    [cleanup, startCountdown]
  );

  const handleEndDelivery = useCallback(() => {
    cleanup();
    setSelectedProvider(null);
    setSecondsLeft(TOTAL_SECONDS);
    setRiderPhase(0);
  }, [cleanup]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progressPercent = (secondsLeft / TOTAL_SECONDS) * 100;

  const timerColor =
    secondsLeft > 5 * 60
      ? 'text-green-500'
      : secondsLeft > 2 * 60
        ? 'text-amber-500'
        : 'text-red-500';

  const progressBarColor =
    secondsLeft > 5 * 60
      ? 'bg-green-500'
      : secondsLeft > 2 * 60
        ? 'bg-amber-500'
        : 'bg-red-500';

  const riderMessages = [
    {
      text: 'Driver En Route — Expected Gate Entry in 3 mins',
      bg: 'bg-blue-50',
      dotColor: 'bg-blue-500',
      textColor: 'text-blue-700',
    },
    {
      text: 'Driver Approaching Gate 2...',
      bg: 'bg-amber-50',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-700',
    },
    {
      text: 'Driver at Gate — Barrier Lifted ✓',
      bg: 'bg-green-50',
      dotColor: 'bg-green-500',
      textColor: 'text-green-700',
    },
  ];

  const currentRider = riderMessages[riderPhase];

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center gap-3 px-5 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft size={20} className="text-[#1E293B]" />
        </button>
        <h1 className="text-lg font-semibold text-[#1E293B]">Delivery Driver Pass</h1>
      </motion.div>

      <div className="px-5 pb-8">
        <AnimatePresence mode="wait">
          {!selectedProvider ? (
            /* Provider Grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-3 mt-2">
                {providers.map((provider, index) => (
                  <motion.button
                    key={provider.id}
                    onClick={() => handleSelectProvider(provider)}
                    className={`${provider.bg} border-2 border-transparent ${provider.hoverBorder} rounded-2xl p-4 h-[120px] flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all duration-200`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + index * 0.07, duration: 0.3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl">{provider.emoji}</span>
                    <span className="text-sm font-medium text-[#1E293B] text-center leading-tight">
                      {provider.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <motion.p
                className="text-xs text-gray-400 text-center mt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Token automatically expires upon exit or after 15 minutes
              </motion.p>
            </motion.div>
          ) : (
            /* Active Token View */
            <motion.div
              key="token"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-5 mt-2"
            >
              {/* Selected Provider Badge */}
              <motion.div
                className={`${selectedProvider.badgeBg} ${selectedProvider.badgeText} px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span>{selectedProvider.emoji}</span>
                {selectedProvider.label}
              </motion.div>

              {/* Giant Countdown Timer */}
              <motion.div
                className="flex flex-col items-center gap-1 py-4"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <span className={`text-6xl font-mono font-bold ${timerColor} transition-colors duration-500`}>
                  {minutes}:{seconds}
                </span>
                <span className="text-xs text-gray-400 mt-1">remaining</span>
              </motion.div>

              {/* Status Badge */}
              <motion.div
                className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Gate 2 Pre-Cleared ✓
              </motion.div>

              {/* Rider Status Banner */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={riderPhase}
                  className={`${currentRider.bg} w-full rounded-2xl p-4 flex items-center gap-3`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentRider.dotColor} opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${currentRider.dotColor}`}
                    ></span>
                  </span>
                  <span className={`text-sm font-medium ${currentRider.textColor}`}>
                    {currentRider.text}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Progress Bar */}
              <motion.div
                className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <motion.div
                  className={`h-full rounded-full ${progressBarColor} transition-colors duration-500`}
                  style={{ width: `${progressPercent}%` }}
                  initial={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="w-full flex flex-col gap-3 mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  className="w-full bg-[#1E293B] text-white py-4 rounded-2xl font-semibold text-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  Share Token with Rider
                </button>
                <button
                  onClick={handleEndDelivery}
                  className="w-full border-2 border-red-400 text-red-500 py-4 rounded-2xl font-semibold text-sm cursor-pointer active:scale-[0.98] transition-transform hover:bg-red-50"
                >
                  End Delivery Early
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
