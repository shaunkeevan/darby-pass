import { useState, useEffect, useRef } from 'react';
import { Bluetooth, CheckCircle2, X } from 'lucide-react';
import BottomSheet from './BottomSheet';

const PHASES = [
  { text: 'Searching for Elmina Green Phase 3 Main Gate...', duration: 2500 },
  { text: 'Device found — Connecting...', duration: 1500 },
  { text: 'Connected (2m away) — Barrier Unlocked ✓', duration: null },
];

export default function BleModal({ onClose }) {
  const [active, setActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const timerRef = useRef(null);

  const startScan = () => {
    setActive(true);
    setPhaseIndex(0);
  };

  useEffect(() => {
    if (phaseIndex < 0) return;
    const phase = PHASES[phaseIndex];
    if (phase.duration && phaseIndex < PHASES.length - 1) {
      timerRef.current = setTimeout(() => setPhaseIndex((i) => i + 1), phase.duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [phaseIndex]);

  const isConnected = phaseIndex === PHASES.length - 1;

  return (
    <BottomSheet onClose={onClose} title="BLE Gate">
      <div className="flex flex-col items-center py-6">
        {/* Radar animation */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          {active && !isConnected && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-radar-sweep" />
              <span className="absolute inset-3 rounded-full border-2 border-blue-400/25 animate-radar-sweep" style={{ animationDelay: '0.7s' }} />
              <span className="absolute inset-6 rounded-full border-2 border-blue-400/20 animate-radar-sweep" style={{ animationDelay: '1.4s' }} />
            </>
          )}
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${
            isConnected ? 'bg-green-100 shadow-lg shadow-green-200/50' : active ? 'bg-blue-100 shadow-lg shadow-blue-200/50' : 'bg-gray-100'
          }`}>
            {isConnected ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <Bluetooth className={`w-10 h-10 ${active ? 'text-blue-500 animate-pulse' : 'text-gray-300'}`} />
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-semibold mb-5 ${
          isConnected ? 'bg-green-50 text-green-700 border border-green-200' : active ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-500 border border-gray-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : active ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
          }`} />
          BLE Auto-Trigger Active (Boom Gate Only)
        </div>

        {/* Phase status text */}
        {phaseIndex >= 0 && (
          <p className={`text-[13px] text-center mb-8 leading-relaxed ${isConnected ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
            {PHASES[phaseIndex].text}
          </p>
        )}

        {!active ? (
          <button
            onClick={startScan}
            className="w-full py-4 bg-darby-dark text-white font-semibold rounded-2xl
                       hover:bg-darby-dark/90 active:scale-[0.98] transition-all cursor-pointer text-[15px]"
          >
            Activate BLE Scan
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-4 border border-gray-200 text-darby-dark font-semibold rounded-2xl
                       hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer text-[15px]"
          >
            Close
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
