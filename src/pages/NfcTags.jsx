import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, CheckCircle2, X, Loader2 } from 'lucide-react';

const initialTags = [
  {
    id: 1,
    label: "Kid's Pool Wristband #01",
    emoji: '⌚',
    assignedTo: 'Liam',
    active: true,
  },
  {
    id: 2,
    label: 'Main Gate Keyfob #04',
    emoji: '🔑',
    assignedTo: 'Car 2 / Spare',
    active: true,
  },
  {
    id: 3,
    label: 'Emergency Spare Card',
    emoji: '💳',
    assignedTo: 'Unassigned',
    active: false,
  },
];

const permissionOptions = [
  { key: 'mainGate', label: 'Main Gate' },
  { key: 'pool', label: 'Pool & Facilities' },
  { key: 'vehicle', label: 'Vehicle Gate' },
];

const assignOptions = ['Liam', 'Maya', 'Unassigned'];

function StepDots({ current, total = 3 }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i <= current ? 'bg-[#1E293B]' : 'bg-gray-300'
          }`}
          animate={{ scale: i === current ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      ))}
    </div>
  );
}

function PulseRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-24 h-24 rounded-full border-2 border-[#1E293B]/20"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: [0.8, 2.2], opacity: [0.5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export default function NfcTags() {
  const navigate = useNavigate();
  const [tags, setTags] = useState(initialTags);
  const [pairing, setPairing] = useState(false);
  const [pairStep, setPairStep] = useState(0);

  // Step 3 form state
  const [tagLabel, setTagLabel] = useState('');
  const [permissions, setPermissions] = useState({
    mainGate: true,
    pool: false,
    vehicle: false,
  });
  const [assignTo, setAssignTo] = useState('Unassigned');

  // Auto-advance steps
  useEffect(() => {
    if (!pairing) return;
    if (pairStep === 0) {
      const timer = setTimeout(() => setPairStep(1), 3000);
      return () => clearTimeout(timer);
    }
    if (pairStep === 1) {
      const timer = setTimeout(() => setPairStep(2), 2000);
      return () => clearTimeout(timer);
    }
  }, [pairing, pairStep]);

  const startPairing = useCallback(() => {
    setPairing(true);
    setPairStep(0);
    setTagLabel('');
    setPermissions({ mainGate: true, pool: false, vehicle: false });
    setAssignTo('Unassigned');
  }, []);

  const cancelPairing = useCallback(() => {
    setPairing(false);
    setPairStep(0);
  }, []);

  const saveNewTag = useCallback(() => {
    const newTag = {
      id: Date.now(),
      label: tagLabel || 'New NFC Tag',
      emoji: '🏷️',
      assignedTo: assignTo,
      active: true,
    };
    setTags((prev) => [...prev, newTag]);
    setPairing(false);
    setPairStep(0);
  }, [tagLabel, assignTo]);

  const toggleTag = useCallback((id) => {
    setTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  }, []);

  const unlinkTag = useCallback((id) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const togglePermission = useCallback((key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[430px] mx-auto pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-14 pb-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 cursor-pointer active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={22} className="text-[#1E293B]" />
          </button>
          <h1 className="text-xl font-semibold text-[#1E293B]">
            NFC Tags & Wearables
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {pairing ? (
            <motion.div
              key="pairing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-5"
            >
              {/* Cancel button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={cancelPairing}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 cursor-pointer active:scale-[0.98] transition-all px-3 py-1.5 rounded-xl hover:bg-gray-100"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 0 — Scanning */}
                {pairStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                      <PulseRings />
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative z-10 w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm"
                      >
                        <Smartphone size={36} className="text-[#1E293B]" />
                      </motion.div>
                    </div>
                    <p className="text-center text-[#1E293B] font-medium text-base px-6 leading-relaxed">
                      Hold physical NFC tag or wristband against the back of
                      your phone...
                    </p>
                    <StepDots current={0} />
                  </motion.div>
                )}

                {/* Step 1 — Writing */}
                {pairStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="mb-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <Loader2 size={48} className="text-[#1E293B]" />
                      </motion.div>
                    </div>
                    <div className="w-full max-w-[260px] h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                      <motion.div
                        className="h-full bg-[#1E293B] rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.8, ease: 'easeInOut' }}
                      />
                    </div>
                    <p className="text-center text-[#1E293B] font-medium text-base">
                      Writing Darby Pass credentials to tag...
                    </p>
                    <StepDots current={1} />
                  </motion.div>
                )}

                {/* Step 2 — Success + Assignment */}
                {pairStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center py-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 18,
                        delay: 0.1,
                      }}
                      className="mb-4"
                    >
                      <CheckCircle2
                        size={56}
                        className="text-emerald-500"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-6">
                      Tag Paired Successfully!
                    </h2>

                    {/* Tag Label Input */}
                    <div className="w-full mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Tag Label
                      </label>
                      <input
                        type="text"
                        value={tagLabel}
                        onChange={(e) => setTagLabel(e.target.value)}
                        placeholder="e.g. Dad's Spare Fob"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#1E293B] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B]/40 transition-all"
                      />
                    </div>

                    {/* Permission Selector */}
                    <div className="w-full mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Permissions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {permissionOptions.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => togglePermission(opt.key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer active:scale-[0.98] transition-all border ${
                              permissions[opt.key]
                                ? 'bg-[#1E293B] text-white border-[#1E293B]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Assign To */}
                    <div className="w-full mb-6">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Assign To
                      </label>
                      <div className="flex gap-2">
                        {assignOptions.map((name) => (
                          <button
                            key={name}
                            onClick={() => setAssignTo(name)}
                            className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer active:scale-[0.98] transition-all border ${
                              assignTo === name
                                ? 'bg-[#1E293B] text-white border-[#1E293B]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={saveNewTag}
                      className="w-full py-3.5 bg-[#1E293B] text-white font-semibold rounded-2xl cursor-pointer active:scale-[0.98] transition-all shadow-sm text-sm"
                    >
                      Save & Finish
                    </button>

                    <StepDots current={2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-5"
            >
              {/* Tag Cards */}
              <div className="space-y-3 mb-6">
                <AnimatePresence>
                  {tags.map((tag) => (
                    <motion.div
                      key={tag.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: -80,
                        height: 0,
                        marginBottom: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        overflow: 'hidden',
                      }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                          {tag.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold text-[#1E293B] truncate">
                              {tag.label}
                            </h3>
                            <motion.span
                              layout
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                                tag.active
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {tag.active ? 'Active' : 'Inactive'}
                            </motion.span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Assigned to:{' '}
                            <span className="text-gray-700 font-medium">
                              {tag.assignedTo}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => toggleTag(tag.id)}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all ${
                            tag.active
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-[#1E293B] text-white'
                          }`}
                        >
                          {tag.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => unlinkTag(tag.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 cursor-pointer active:scale-[0.98] transition-all px-3 py-2"
                        >
                          Unlink
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {tags.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No NFC tags paired yet
                  </motion.div>
                )}
              </div>

              {/* Primary CTA */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startPairing}
                className="w-full py-3.5 bg-[#1E293B] text-white font-semibold rounded-2xl cursor-pointer active:scale-[0.98] transition-all shadow-sm text-sm"
              >
                + Pair New NFC Tag / Wristband
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
