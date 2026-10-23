import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield } from 'lucide-react';
import BottomSheet from './BottomSheet';

function generatePayload() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'DARBYPASS-TOTP-';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '-' + Date.now().toString(36);
}

export default function QrModal({ onClose }) {
  const [payload, setPayload] = useState(generatePayload);
  const [timeLeft, setTimeLeft] = useState(30);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPayload(generatePayload());
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const progress = (timeLeft / 30) * 100;

  return (
    <BottomSheet onClose={onClose} title="QR Pass — Dynamic TOTP">
      <div className="flex flex-col items-center py-3">
        {/* QR Code */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
          <QRCodeSVG
            value={payload}
            size={200}
            level="H"
            includeMargin={false}
            bgColor="#FFFFFF"
            fgColor="#1E293B"
          />
        </div>

        {/* Timer */}
        <div className="w-full mb-3">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[13px] text-gray-400 font-medium">Auto-refresh in</span>
            <span className={`text-[15px] font-bold font-mono ${timeLeft <= 5 ? 'text-red-500' : timeLeft <= 10 ? 'text-amber-500' : 'text-darby-dark'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                timeLeft <= 5 ? 'bg-red-400' : timeLeft <= 10 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-3.5 h-3.5 text-gray-300" />
          <p className="text-[12px] text-gray-300">
            QR regenerates every 30s to prevent screenshot sharing
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-darby-dark text-white font-semibold rounded-2xl
                     hover:bg-darby-dark/90 active:scale-[0.98] transition-all cursor-pointer text-[15px]"
        >
          Close Pass
        </button>
      </div>
    </BottomSheet>
  );
}
