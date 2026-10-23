import { motion } from 'framer-motion';

export default function BottomSheet({ children, onClose, title }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      >
        <div className="w-full max-w-[430px] bg-white rounded-t-[28px] shadow-2xl max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-[5px] bg-gray-200 rounded-full" />
          </div>
          {/* Header */}
          {title && (
            <div className="px-6 pt-2 pb-4 border-b border-gray-100">
              <h3 className="text-[17px] font-bold text-darby-dark tracking-tight">{title}</h3>
            </div>
          )}
          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
}
