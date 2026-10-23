import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, Wifi, Bluetooth, QrCode,
  Zap, Truck, Users, Radio, ChevronRight,
  CalendarDays
} from 'lucide-react';

import Toast from '../components/Toast';
import BleModal from '../components/BleModal';
import QrModal from '../components/QrModal';

function DarbyPassHome() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [nfcActive, setNfcActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerNfc = useCallback(() => {
    setNfcActive(true);
    setToastMessage('NFC Signal Active — Hold phone near reader or turnstile');
    setTimeout(() => setNfcActive(false), 3000);
    setTimeout(() => setToastMessage(''), 4000);
  }, []);

  const openModal = useCallback((name) => setActiveModal(name), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const passCards = [
    {
      id: 'express',
      label: 'Express Visitor',
      subtitle: 'One-off guest access',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      route: '/darby-pass/express-visitor',
    },
    {
      id: 'shortterm',
      label: 'Short-Term Guests',
      subtitle: 'Multi-day stays',
      icon: CalendarDays,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      route: '/darby-pass/short-term-guests',
    },
    {
      id: 'delivery',
      label: 'Delivery Driver',
      subtitle: '15-min micro-token',
      icon: Truck,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      route: '/darby-pass/delivery-driver',
    },
    {
      id: 'family',
      label: 'Family Pass',
      subtitle: 'Household members',
      icon: Users,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      route: '/darby-pass/family',
    },
    {
      id: 'nfctag',
      label: 'NFC Tags',
      subtitle: 'Keyfobs & wristbands',
      icon: Radio,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      route: '/darby-pass/nfc-tags',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white"
    >
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} />}
      </AnimatePresence>

      {/* Scrollable Content */}
      <div className="px-5 pt-4 pb-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-darby-dark" />
          </button>
          <h1 className="flex-1 text-center text-xl font-bold text-darby-dark tracking-tight pr-10">
            Darby Pass
          </h1>
        </div>

        {/* NFC Tap Zone */}
        <motion.button
          onClick={triggerNfc}
          whileTap={{ scale: 0.97 }}
          className="w-full flex flex-col items-center mb-5 cursor-pointer group"
        >
          <div className="relative mb-2">
            {/* Pulse rings when active */}
            {nfcActive && (
              <>
                <span className="absolute inset-[-8px] rounded-full bg-amber-400/20 animate-pulse-ring" />
                <span className="absolute inset-[-8px] rounded-full bg-amber-400/15 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
              </>
            )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              nfcActive ? 'bg-amber-100 shadow-lg shadow-amber-200/50' : 'bg-gray-50'
            }`}>
              <Wifi className={`w-6 h-6 rotate-180 transition-colors ${nfcActive ? 'text-amber-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <span className={`text-sm font-medium transition-colors ${nfcActive ? 'text-amber-600' : 'text-gray-400'}`}>
            Tap the reader
          </span>
        </motion.button>

        {/* Main Digital Card */}
        <motion.button
          onClick={triggerNfc}
          whileTap={{ scale: 0.98 }}
          className="w-full mb-7 cursor-pointer text-left"
        >
          <div className={`
            relative rounded-3xl overflow-hidden
            transition-all duration-500
            ${nfcActive ? 'shadow-xl shadow-amber-200/40 scale-[1.01]' : 'shadow-md shadow-black/5'}
          `}>
            {/* Card gradient background */}
            <div className="bg-gradient-to-br from-[#FAEDC4] via-[#F5E6B8] to-[#EDD9A0] p-6 pb-7">
              {/* Shimmer overlay when NFC active */}
              {nfcActive && (
                <div className="absolute inset-0 animate-shimmer pointer-events-none z-[1]" />
              )}

              {/* Card content */}
              <div className="relative z-[2]">
                <p className="italic text-darby-dark/70 text-[15px] font-medium tracking-wide mb-16">
                  Darby Pass
                </p>
                <div className="flex items-end justify-between">
                  {/* Sime Darby Logo Badge */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-1.5 shadow-sm">
                    <div className="bg-darby-red rounded-lg px-2.5 py-1.5">
                      <span className="text-white text-[10px] font-extrabold leading-tight block">Sime</span>
                      <span className="text-white text-[10px] font-extrabold leading-tight block">Darby</span>
                      <span className="text-yellow-300 text-[9px] font-bold leading-tight block">Property</span>
                    </div>
                  </div>
                  <p className="text-darby-dark font-bold text-[17px] tracking-tight">
                    Anish Upadhya
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle bottom border accent */}
            <div className="h-1 bg-gradient-to-r from-darby-red/60 via-amber-400/60 to-darby-red/60" />
          </div>
        </motion.button>

        {/* Quick Action Buttons */}
        <div className="flex gap-3 mb-9">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal('ble')}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4
                       bg-white border border-gray-200 rounded-2xl
                       hover:border-gray-300 hover:shadow-sm
                       transition-all duration-200 shadow-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Bluetooth className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-semibold text-[14px] text-darby-dark">BLE Gate</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal('qr')}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4
                       bg-white border border-gray-200 rounded-2xl
                       hover:border-gray-300 hover:shadow-sm
                       transition-all duration-200 shadow-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-violet-500" />
            </div>
            <span className="font-semibold text-[14px] text-darby-dark">QR Pass</span>
          </motion.button>
        </div>

        {/* Passes Section */}
        <div>
          <h2 className="text-[17px] font-bold text-darby-dark mb-4 tracking-tight">Passes</h2>
          <div className="space-y-3">
            {passCards.map((card, index) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(card.route)}
                className="w-full flex items-center gap-4 p-4
                           bg-white border border-gray-100 rounded-2xl
                           hover:border-gray-200 hover:shadow-md
                           transition-all duration-200 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center flex-shrink-0
                                group-hover:scale-105 transition-transform duration-200`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[15px] font-semibold text-darby-dark">{card.label}</p>
                  <p className="text-[13px] text-gray-400 mt-0.5">{card.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'ble' && <BleModal onClose={closeModal} />}
        {activeModal === 'qr' && <QrModal onClose={closeModal} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default DarbyPassHome;
