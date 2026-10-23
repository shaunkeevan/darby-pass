import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserPlus, Calendar, Clock, Phone, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const initialGuests = [
  {
    id: 'g1',
    name: 'Sarah Jenkins',
    phone: '+60 12-888 1234',
    checkIn: '2026-10-24',
    checkInTime: '15:00',
    checkOut: '2026-10-26',
    checkOutTime: '11:00',
    statusLabel: 'Checkout in 2 days',
    statusColor: 'amber',
    permissions: ['Main Precinct Gate', 'Clubhouse & Pool Access'],
    active: true,
  },
  {
    id: 'g2',
    name: 'Raj Kumar',
    phone: '+60 11-222 3456',
    checkIn: '2026-10-22',
    checkInTime: '14:00',
    checkOut: '2026-10-23',
    checkOutTime: '11:00',
    statusLabel: 'Checked Out',
    statusColor: 'gray',
    permissions: ['Main Precinct Gate'],
    active: false,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

const statusColors = {
  amber: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-500',
  green: 'bg-emerald-100 text-emerald-700',
};

export default function ShortTermGuests() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState(initialGuests);
  const [expandedExtend, setExpandedExtend] = useState(null);
  const [extendDate, setExtendDate] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckInTime, setFormCheckInTime] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [formCheckOutTime, setFormCheckOutTime] = useState('');
  const [permissions, setPermissions] = useState({
    gate: true,
    pool: true,
    gym: false,
  });

  const togglePermission = useCallback((key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleCancel = useCallback((id) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleExtendToggle = useCallback((id) => {
    setExpandedExtend((prev) => (prev === id ? null : id));
    setExtendDate('');
  }, []);

  const handleExtendConfirm = useCallback(
    (id) => {
      if (!extendDate) return;
      setGuests((prev) =>
        prev.map((g) =>
          g.id === id
            ? {
                ...g,
                checkOut: extendDate,
                statusLabel: 'Stay Extended',
                statusColor: 'green',
              }
            : g
        )
      );
      setExpandedExtend(null);
      setExtendDate('');
    },
    [extendDate]
  );

  const handleIssuePass = useCallback(() => {
    if (!formName.trim() || !formCheckIn || !formCheckOut) return;

    const permList = [];
    if (permissions.gate) permList.push('Main Precinct Gate');
    if (permissions.pool) permList.push('Clubhouse & Pool Access');
    if (permissions.gym) permList.push('Gym Turnstile Access');

    const newGuest = {
      id: `g-${Date.now()}`,
      name: formName.trim(),
      phone: formPhone,
      checkIn: formCheckIn,
      checkInTime: formCheckInTime || '14:00',
      checkOut: formCheckOut,
      checkOutTime: formCheckOutTime || '11:00',
      statusLabel: 'Active',
      statusColor: 'green',
      permissions: permList,
      active: true,
      isNew: true,
    };

    setGuests((prev) => [newGuest, ...prev]);
    setFormName('');
    setFormPhone('');
    setFormCheckIn('');
    setFormCheckInTime('');
    setFormCheckOut('');
    setFormCheckOutTime('');
    setPermissions({ gate: true, pool: true, gym: false });
  }, [formName, formPhone, formCheckIn, formCheckInTime, formCheckOut, formCheckOutTime, permissions]);

  const activeCount = guests.filter((g) => g.active || g.statusColor === 'green').length;

  return (
    <motion.div
      className="min-h-screen bg-white max-w-[430px] mx-auto pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-gray-100 active:scale-[0.98] cursor-pointer transition-colors"
          >
            <ArrowLeft size={22} className="text-[#1E293B]" />
          </button>
          <h1 className="text-lg font-semibold text-[#1E293B]">Short-Term Guest Pass</h1>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5 overflow-y-auto">
        {/* Active Stays Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-semibold text-[#1E293B]">Active Stays</h2>
            <span className="bg-[#1E293B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {guests.map((guest) => (
                <motion.div
                  key={guest.id}
                  layout
                  initial={guest.isNew ? { opacity: 0, scale: 0.95, y: -20 } : { opacity: 1 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                >
                  {/* Guest card header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E293B] text-sm">{guest.name}</p>
                        {guest.phone && (
                          <p className="text-xs text-gray-400">{guest.phone}</p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[guest.statusColor]}`}
                    >
                      {guest.statusLabel}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 mt-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={13} className="text-gray-400" />
                      <span>
                        In: {formatDate(guest.checkIn)}
                        {guest.checkInTime ? `, ${formatTime(guest.checkInTime)}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={13} className="text-gray-400" />
                      <span>
                        Out: {formatDate(guest.checkOut)}
                        {guest.checkOutTime ? `, ${formatTime(guest.checkOutTime)}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Permission badges for newly issued passes */}
                  {guest.isNew && guest.permissions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {guest.permissions.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* QR Code for new passes */}
                  {guest.isNew && (
                    <div className="flex justify-center py-3 mb-2 bg-gray-50 rounded-xl">
                      <QRCodeSVG
                        value={JSON.stringify({
                          guest: guest.name,
                          checkIn: guest.checkIn,
                          checkOut: guest.checkOut,
                          zones: guest.permissions,
                        })}
                        size={120}
                        level="M"
                        bgColor="transparent"
                      />
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleExtendToggle(guest.id)}
                      className="flex-1 text-xs font-medium py-2 px-3 rounded-xl border border-gray-200 text-[#1E293B] hover:bg-gray-50 active:scale-[0.98] cursor-pointer transition-colors"
                    >
                      Extend Stay
                    </button>
                    <button
                      onClick={() => handleCancel(guest.id)}
                      className="flex-1 text-xs font-medium py-2 px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 active:scale-[0.98] cursor-pointer transition-colors"
                    >
                      Cancel Reservation
                    </button>
                  </div>

                  {/* Extend date picker */}
                  <AnimatePresence>
                    {expandedExtend === guest.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <label className="text-xs text-gray-500 whitespace-nowrap">New checkout:</label>
                          <input
                            type="date"
                            value={extendDate}
                            onChange={(e) => setExtendDate(e.target.value)}
                            className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#1E293B] transition-colors"
                          />
                          <button
                            onClick={() => handleExtendConfirm(guest.id)}
                            className="text-xs font-medium py-2 px-3 rounded-xl bg-[#1E293B] text-white active:scale-[0.98] cursor-pointer transition-colors"
                          >
                            Confirm
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {guests.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No active guest stays
              </div>
            )}
          </div>
        </motion.div>

        {/* Issue New Guest Pass Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <UserPlus size={18} className="text-[#1E293B]" />
            <h2 className="text-base font-semibold text-[#1E293B]">Issue New Guest Pass</h2>
          </div>

          <div className="space-y-4">
            {/* Guest Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Primary Guest Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter guest's full name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#1E293B] transition-colors text-[#1E293B] placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Contact Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+60 12-345 6789"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#1E293B] transition-colors text-[#1E293B] placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Check-In */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Check-In Date & Time</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formCheckIn}
                    onChange={(e) => setFormCheckIn(e.target.value)}
                    className="w-full pl-9 pr-2 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#1E293B] transition-colors text-[#1E293B]"
                  />
                </div>
                <div className="relative flex-[0.7]">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    value={formCheckInTime}
                    onChange={(e) => setFormCheckInTime(e.target.value)}
                    className="w-full pl-9 pr-2 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#1E293B] transition-colors text-[#1E293B]"
                  />
                </div>
              </div>
            </div>

            {/* Check-Out */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Check-Out Date & Time</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formCheckOut}
                    onChange={(e) => setFormCheckOut(e.target.value)}
                    className="w-full pl-9 pr-2 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#1E293B] transition-colors text-[#1E293B]"
                  />
                </div>
                <div className="relative flex-[0.7]">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    value={formCheckOutTime}
                    onChange={(e) => setFormCheckOutTime(e.target.value)}
                    className="w-full pl-9 pr-2 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#1E293B] transition-colors text-[#1E293B]"
                  />
                </div>
              </div>
            </div>

            {/* Facility Permissions */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2.5">Facility Permissions</label>
              <div className="space-y-2">
                {/* Gate */}
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🏠</span>
                    <span className="text-sm text-[#1E293B] font-medium">Main Precinct Gate</span>
                  </div>
                  <button
                    onClick={() => togglePermission('gate')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      permissions.gate ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                      animate={{ left: permissions.gate ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Pool */}
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🏊</span>
                    <span className="text-sm text-[#1E293B] font-medium">Clubhouse & Pool Access</span>
                  </div>
                  <button
                    onClick={() => togglePermission('pool')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      permissions.pool ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                      animate={{ left: permissions.pool ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Gym */}
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">💪</span>
                    <span className="text-sm text-[#1E293B] font-medium">Gym Turnstile Access</span>
                  </div>
                  <button
                    onClick={() => togglePermission('gym')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      permissions.gym ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                      animate={{ left: permissions.gym ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleIssuePass}
              disabled={!formName.trim() || !formCheckIn || !formCheckOut}
              className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                formName.trim() && formCheckIn && formCheckOut
                  ? 'bg-[#1E293B] text-white active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Issue Guest Stay Pass
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
