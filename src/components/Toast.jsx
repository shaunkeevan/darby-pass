import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';

export default function Toast({ message }) {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -80, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className="absolute top-0 left-0 right-0 z-50 px-4 pt-3"
    >
      <div className="bg-darby-dark/95 backdrop-blur-sm text-white text-[13px] font-medium px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <Wifi className="w-3.5 h-3.5 text-green-400 rotate-180" />
        </div>
        <span className="leading-snug">{message}</span>
      </div>
    </motion.div>
  );
}
