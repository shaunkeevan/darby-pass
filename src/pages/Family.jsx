import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Trash2 } from 'lucide-react';

const ROLES = ['Spouse', 'Child', 'Senior', 'Domestic Staff'];

const ROLE_COLORS = {
  Spouse: { bg: 'bg-pink-100', text: 'text-pink-700' },
  Child: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Senior: { bg: 'bg-teal-100', text: 'text-teal-700' },
  'Domestic Staff': { bg: 'bg-purple-100', text: 'text-purple-700' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STATUS_DOT = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
};

const initialMembers = [
  {
    id: 1,
    name: 'Liam Upadhya',
    role: 'Child',
    status: 'Active (Wristband Linked)',
    statusColor: 'green',
    avatar: '👦',
    toggles: { vehicleGate: false, pedestrianNFC: true, poolPark: true },
    curfewStart: '07:00',
    curfewEnd: '20:00',
    scheduleDays: [],
    scheduleStart: '08:00',
    scheduleEnd: '13:00',
  },
  {
    id: 2,
    name: 'Maya',
    role: 'Domestic Staff',
    status: 'Schedule Restricted',
    statusColor: 'amber',
    avatar: '👩',
    toggles: { vehicleGate: false, pedestrianNFC: true, poolPark: false },
    curfewStart: '07:00',
    curfewEnd: '20:00',
    scheduleDays: ['Tue', 'Thu'],
    scheduleStart: '08:00',
    scheduleEnd: '13:00',
  },
  {
    id: 3,
    name: 'Grandpa Raj',
    role: 'Senior',
    status: 'Active',
    statusColor: 'green',
    avatar: '👴',
    toggles: { vehicleGate: true, pedestrianNFC: true, poolPark: true },
    curfewStart: '07:00',
    curfewEnd: '20:00',
    scheduleDays: [],
    scheduleStart: '08:00',
    scheduleEnd: '13:00',
  },
];

const AVATARS_BY_ROLE = {
  Spouse: '👫',
  Child: '👦',
  Senior: '👴',
  'Domestic Staff': '👩',
};

function Toggle({ enabled, onToggle, disabled }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${enabled && !disabled ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled && !disabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function Family() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(initialMembers);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Spouse');

  const toggleExpanded = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const updateMember = useCallback((id, updates) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const removeMember = useCallback((id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setExpandedId(null);
  }, []);

  const addMember = useCallback(() => {
    if (!newName.trim()) return;
    const newMember = {
      id: Date.now(),
      name: newName.trim(),
      role: newRole,
      status: 'Active',
      statusColor: 'green',
      avatar: AVATARS_BY_ROLE[newRole] || '👤',
      toggles: { vehicleGate: false, pedestrianNFC: true, poolPark: true },
      curfewStart: '07:00',
      curfewEnd: '20:00',
      scheduleDays: [],
      scheduleStart: '08:00',
      scheduleEnd: '13:00',
    };
    setMembers((prev) => [...prev, newMember]);
    setNewName('');
    setNewRole('Spouse');
    setShowAddForm(false);
  }, [newName, newRole]);

  const toggleDay = useCallback((memberId, day) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const days = m.scheduleDays.includes(day)
          ? m.scheduleDays.filter((d) => d !== day)
          : [...m.scheduleDays, day];
        return { ...m, scheduleDays: days };
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[430px] mx-auto pb-32">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center gap-3 px-5 py-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft size={22} color="#1E293B" />
            </button>
            <h1 className="text-lg font-semibold text-[#1E293B]">
              Family & Household Pass
            </h1>
          </div>
        </div>

        {/* Members List */}
        <div className="px-5 pt-5 space-y-3">
          <AnimatePresence mode="popLayout">
            {members.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
              >
                {/* Member Card Header */}
                <button
                  onClick={() => toggleExpanded(member.id)}
                  className="w-full flex items-center gap-3.5 p-4 cursor-pointer active:scale-[0.98] transition-transform text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1E293B] text-[15px] truncate">
                        {member.name}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[member.role]?.bg} ${ROLE_COLORS[member.role]?.text}`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${STATUS_DOT[member.statusColor]}`}
                      />
                      <span className="text-xs text-gray-500">
                        {member.status}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === member.id ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus size={18} className="text-gray-400" />
                  </motion.div>
                </button>

                {/* Expanded Settings Panel */}
                <AnimatePresence>
                  {expandedId === member.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                        {/* Role Selector */}
                        <div className="mb-5">
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                            Role
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {ROLES.map((role) => (
                              <button
                                key={role}
                                onClick={() =>
                                  updateMember(member.id, {
                                    role,
                                    avatar: AVATARS_BY_ROLE[role] || member.avatar,
                                  })
                                }
                                className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer active:scale-[0.98] transition-all ${
                                  member.role === role
                                    ? `${ROLE_COLORS[role]?.bg} ${ROLE_COLORS[role]?.text} border-transparent`
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Access Toggles */}
                        <div className="mb-5">
                          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                            Access Controls
                          </p>
                          <div className="space-y-3">
                            {/* Vehicle Gate */}
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-3">
                                <p className="text-sm text-[#1E293B] font-medium">
                                  Vehicle Gate Auto-Trigger (BLE)
                                </p>
                                {member.role === 'Child' && (
                                  <p className="text-xs text-amber-600 mt-0.5">
                                    ⚠ Disabled for minors
                                  </p>
                                )}
                              </div>
                              <Toggle
                                enabled={member.toggles.vehicleGate}
                                disabled={member.role === 'Child'}
                                onToggle={() =>
                                  updateMember(member.id, {
                                    toggles: {
                                      ...member.toggles,
                                      vehicleGate: !member.toggles.vehicleGate,
                                    },
                                  })
                                }
                              />
                            </div>

                            {/* Pedestrian NFC */}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-[#1E293B] font-medium">
                                Pedestrian & Facility NFC
                              </p>
                              <Toggle
                                enabled={member.toggles.pedestrianNFC}
                                onToggle={() =>
                                  updateMember(member.id, {
                                    toggles: {
                                      ...member.toggles,
                                      pedestrianNFC: !member.toggles.pedestrianNFC,
                                    },
                                  })
                                }
                              />
                            </div>

                            {/* Pool & Park */}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-[#1E293B] font-medium">
                                Pool & Park Access
                              </p>
                              <Toggle
                                enabled={member.toggles.poolPark}
                                onToggle={() =>
                                  updateMember(member.id, {
                                    toggles: {
                                      ...member.toggles,
                                      poolPark: !member.toggles.poolPark,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Schedule & Curfew */}
                        <div className="mb-5">
                          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                            Schedule & Curfew
                          </p>

                          {member.role === 'Child' && (
                            <div className="bg-blue-50 rounded-xl p-3">
                              <p className="text-sm text-[#1E293B] font-medium mb-2">
                                Curfew
                              </p>
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={member.curfewStart}
                                  onChange={(e) =>
                                    updateMember(member.id, {
                                      curfewStart: e.target.value,
                                    })
                                  }
                                  className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1E293B] w-[120px]"
                                />
                                <span className="text-xs text-gray-400">to</span>
                                <input
                                  type="time"
                                  value={member.curfewEnd}
                                  onChange={(e) =>
                                    updateMember(member.id, {
                                      curfewEnd: e.target.value,
                                    })
                                  }
                                  className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1E293B] w-[120px]"
                                />
                              </div>
                            </div>
                          )}

                          {member.role === 'Domestic Staff' && (
                            <div className="bg-purple-50 rounded-xl p-3">
                              <p className="text-sm text-[#1E293B] font-medium mb-2">
                                Schedule
                              </p>
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {DAYS.map((day) => (
                                  <button
                                    key={day}
                                    onClick={() => toggleDay(member.id, day)}
                                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg cursor-pointer active:scale-[0.98] transition-all ${
                                      member.scheduleDays.includes(day)
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white text-gray-500 border border-gray-200'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={member.scheduleStart}
                                  onChange={(e) =>
                                    updateMember(member.id, {
                                      scheduleStart: e.target.value,
                                    })
                                  }
                                  className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1E293B] w-[120px]"
                                />
                                <span className="text-xs text-gray-400">to</span>
                                <input
                                  type="time"
                                  value={member.scheduleEnd}
                                  onChange={(e) =>
                                    updateMember(member.id, {
                                      scheduleEnd: e.target.value,
                                    })
                                  }
                                  className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1E293B] w-[120px]"
                                />
                              </div>
                            </div>
                          )}

                          {member.role !== 'Child' &&
                            member.role !== 'Domestic Staff' && (
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-sm text-gray-500">
                                  No schedule restrictions
                                </p>
                              </div>
                            )}
                        </div>

                        {/* Remove Member */}
                        <button
                          onClick={() => removeMember(member.id)}
                          className="flex items-center gap-1.5 text-red-500 text-sm font-medium cursor-pointer active:scale-[0.98] hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                          Remove Member
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Member Section */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="border border-gray-200 rounded-2xl bg-white shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#1E293B]">
                    Add Family Member
                  </p>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewName('');
                      setNewRole('Spouse');
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer active:scale-[0.98]"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">
                      Role
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((role) => (
                        <button
                          key={role}
                          onClick={() => setNewRole(role)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer active:scale-[0.98] transition-all ${
                            newRole === role
                              ? `${ROLE_COLORS[role]?.bg} ${ROLE_COLORS[role]?.text} border-transparent`
                              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={addMember}
                    disabled={!newName.trim()}
                    className={`w-full py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                      newName.trim()
                        ? 'bg-[#1E293B] text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Add Member
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Member CTA */}
          {!showAddForm && (
            <motion.button
              layout
              onClick={() => setShowAddForm(true)}
              className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Family Member
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
