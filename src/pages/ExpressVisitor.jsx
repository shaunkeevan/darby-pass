import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, PersonStanding } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const VALIDITY_OPTIONS = [
  { label: '2 Hours', hours: 2 },
  { label: '4 Hours', hours: 4 },
  { label: 'Today Only', hours: null },
];

function generateCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `EX-${num}`;
}

function getValidityMs(option) {
  if (option.hours) return option.hours * 60 * 60 * 1000;
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return endOfDay - now;
}

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function ExpressVisitor() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [entryType, setEntryType] = useState('vehicle');
  const [licensePlate, setLicensePlate] = useState('');
  const [validityIdx, setValidityIdx] = useState(0);

  // Generated pass state
  const [pass, setPass] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [totalMs, setTotalMs] = useState(0);
  const timerRef = useRef(null);

  // Action feedback
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const handleGenerate = () => {
    const validity = VALIDITY_OPTIONS[validityIdx];
    const ms = getValidityMs(validity);
    const code = generateCode();
    const expiresAt = Date.now() + ms;

    setTotalMs(ms);
    setRemaining(ms);
    setPass({
      code,
      name,
      entryType,
      licensePlate: entryType === 'vehicle' ? licensePlate : null,
      validity: validity.label,
      expiresAt,
    });

    clearTimer();
    timerRef.current = setInterval(() => {
      const left = expiresAt - Date.now();
      setRemaining(left > 0 ? left : 0);
      if (left <= 0) clearTimer();
    }, 1000);
  };

  const handleRevoke = () => {
    clearTimer();
    setPass(null);
    setName('');
    setLicensePlate('');
    setEntryType('vehicle');
    setValidityIdx(0);
    setRemaining(0);
    setCopied(false);
    setShared(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://darbypass.app/visitor/${pass?.code}`);
    } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const progress = totalMs > 0 ? Math.max(0, remaining / totalMs) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-white max-w-[430px] mx-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 active:scale-[0.95] transition cursor-pointer"
          >
            <ArrowLeft size={22} color="#1E293B" />
          </button>
          <h1 className="text-lg font-semibold text-[#1E293B]">Express Visitor Pass</h1>
        </div>
      </div>

      <div className="px-5 pb-10 pt-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!pass ? (
            /* ─── FORM ─── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Visitor Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E293B]">Visitor Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/60 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E293B]/10 focus:border-[#1E293B]/30 transition text-[15px]"
                />
              </div>

              {/* Entry Type Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E293B]">Entry Type</label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                  <button
                    onClick={() => setEntryType('vehicle')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      entryType === 'vehicle'
                        ? 'bg-[#1E293B] text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>🚗</span> Vehicle
                  </button>
                  <button
                    onClick={() => setEntryType('pedestrian')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      entryType === 'pedestrian'
                        ? 'bg-[#1E293B] text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>🚶</span> Pedestrian
                  </button>
                </div>
              </div>

              {/* Vehicle License Plate (conditional) */}
              <AnimatePresence>
                {entryType === 'vehicle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden space-y-2"
                  >
                    <label className="text-sm font-medium text-[#1E293B]">Vehicle License Plate</label>
                    <input
                      type="text"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                      placeholder="e.g. WKL 8832"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/60 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E293B]/10 focus:border-[#1E293B]/30 transition text-[15px] tracking-wider"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Validity Window */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E293B]">Validity Window</label>
                <div className="flex gap-2">
                  {VALIDITY_OPTIONS.map((opt, idx) => (
                    <button
                      key={opt.label}
                      onClick={() => setValidityIdx(idx)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        validityIdx === idx
                          ? 'bg-[#1E293B] text-white shadow-md'
                          : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-150'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={!name.trim()}
                className={`w-full py-4 rounded-2xl text-[15px] font-semibold transition-all duration-200 cursor-pointer mt-4 ${
                  name.trim()
                    ? 'bg-[#1E293B] text-white active:scale-[0.98] shadow-lg shadow-[#1E293B]/20'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Generate Express Pass
              </motion.button>
            </motion.div>
          ) : (
            /* ─── PASS CARD ─── */
            <motion.div
              key="pass"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              {/* Summary Card */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-5">
                {/* Code */}
                <div className="text-center">
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-widest mb-1">Entry Code</p>
                  <p className="text-4xl font-bold text-[#1E293B] tracking-wider">{pass.code}</p>
                </div>

                <div className="h-px bg-amber-200/60" />

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Visitor</p>
                    <p className="font-medium text-[#1E293B]">{pass.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Entry Type</p>
                    <p className="font-medium text-[#1E293B]">
                      {pass.entryType === 'vehicle' ? '🚗' : '🚶'}{' '}
                      {pass.entryType === 'vehicle' ? 'Vehicle' : 'Pedestrian'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Validity</p>
                    <p className="font-medium text-[#1E293B]">{pass.validity}</p>
                  </div>
                  {pass.licensePlate && (
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Plate No.</p>
                      <p className="font-medium text-[#1E293B] tracking-wider">{pass.licensePlate}</p>
                    </div>
                  )}
                </div>

                <div className="h-px bg-amber-200/60" />

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <QRCodeSVG
                      value={`https://darbypass.app/visitor/${pass.code}`}
                      size={160}
                      level="M"
                      bgColor="#FFFFFF"
                      fgColor="#1E293B"
                    />
                  </div>
                </div>

                <div className="h-px bg-amber-200/60" />

                {/* Countdown */}
                <div className="text-center space-y-3">
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-widest">Time Remaining</p>
                  <p className="text-3xl font-mono font-bold text-[#1E293B]">
                    {formatCountdown(remaining)}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress * 100}%`,
                        backgroundColor: progress > 0.25 ? '#1E293B' : '#EF4444',
                      }}
                      transition={{ duration: 0.5, ease: 'linear' }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-[#1E293B] text-sm font-medium hover:bg-gray-200 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {copied ? '✅ Copied!' : '📋 Copy Access Link'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-[#1E293B] text-sm font-medium hover:bg-gray-200 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {shared ? '✅ Share link opened!' : '💬 Share via WhatsApp'}
                </button>
              </div>

              {/* Revoke Button */}
              <button
                onClick={handleRevoke}
                className="w-full py-3.5 rounded-2xl border-2 border-red-400 text-red-500 text-sm font-semibold hover:bg-red-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                Revoke Pass
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
