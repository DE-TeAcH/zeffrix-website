import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, Calendar, Dumbbell, Clock, ArrowRight, Activity, Flame, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { supabase } from '../../lib/supabase';

export interface WorkoutTemplate {
  id: string;
  name: string;
  category?: string;
  duration?: string | null;
  image_url?: string | null;
  muscles: string[];
  overview?: string | null;
}

export interface SplitDay {
  id: string;
  split_id: string;
  day_index: number;
  day_label: string;
  workout_id?: string | null;
  is_rest_day: boolean;
  workout_templates?: WorkoutTemplate | null;
}

export interface SplitTemplate {
  id: string;
  name: string;
  days_per_week: number;
  description?: string | null;
  split_days?: SplitDay[];
}

interface WorkoutSplitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const isBroSplit4d = (name: string): boolean => {
  const n = name.toLowerCase();
  return n.includes('bro') && (n.includes('4d') || n.includes('4 d') || n.includes('4'));
};

const isPPL5d = (name: string): boolean => {
  const n = name.toLowerCase();
  return n.includes('ppl') && (n.includes('5d') || n.includes('5 d') || n.includes('5'));
};

export const WorkoutSplitsModal: React.FC<WorkoutSplitsModalProps> = ({ isOpen, onClose }) => {
  const [splits, setSplits] = useState<SplitTemplate[]>([]);
  const [selectedSplit, setSelectedSplit] = useState<SplitTemplate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data directly from the Supabase database
  const fetchSplitsFromSupabase = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('split_templates')
        .select(`
          id,
          name,
          days_per_week,
          description,
          split_days (
            id,
            split_id,
            day_index,
            day_label,
            workout_id,
            is_rest_day,
            workout_templates (
              id,
              name,
              category,
              duration,
              image_url,
              muscles,
              overview
            )
          )
        `)
        .order('days_per_week', { ascending: true });

      if (queryError) {
        throw new Error(queryError.message);
      }

      if (data) {
        // Sort split_days by calendar day_index (0=Mon .. 6=Sun)
        const formatted: SplitTemplate[] = data.map((s: any) => ({
          ...s,
          split_days: (s.split_days || []).sort((a: any, b: any) => a.day_index - b.day_index)
        }));
        setSplits(formatted);
      } else {
        setSplits([]);
      }
    } catch (err: any) {
      console.error('Failed to query splits from Supabase:', err);
      setError(err?.message || 'Failed to load training splits from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSplitsFromSupabase();
    } else {
      setSelectedSplit(null);
    }
  }, [isOpen]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (selectedSplit) {
          setSelectedSplit(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedSplit, onClose]);

  if (!isOpen) return null;

  // Extract distinct workout templates from selected split
  const distinctTemplates: WorkoutTemplate[] = [];
  if (selectedSplit?.split_days) {
    const seenIds = new Set<string>();
    selectedSplit.split_days.forEach((sd) => {
      if (sd.workout_templates && !seenIds.has(sd.workout_templates.id)) {
        seenIds.add(sd.workout_templates.id);
        distinctTemplates.push(sd.workout_templates);
      }
    });
  }

  // Calculate training and rest days
  const trainingDaysCount = selectedSplit?.split_days?.filter((d) => !d.is_rest_day).length || selectedSplit?.days_per_week || 0;
  const restDaysCount = 7 - trainingDaysCount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            if (selectedSplit) {
              setSelectedSplit(null);
            } else {
              onClose();
            }
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-50 w-full max-w-5xl bg-[#111111] border border-zinc-800 rounded-2xl md:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] flex flex-col overflow-hidden text-white font-sans"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-[#141414]/90 backdrop-blur-md flex-shrink-0">
            <div className="flex items-center gap-3">
              {selectedSplit ? (
                <button
                  onClick={() => setSelectedSplit(null)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>All Splits</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                      Explore Training Splits
                    </h2>
                    <p className="text-xs text-zinc-400 hidden sm:block">
                      Live data queried directly from database
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700">
            {/* LOADING STATE */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-zinc-400">Loading training splits from database...</p>
              </div>
            )}

            {/* ERROR STATE */}
            {!loading && error && (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={24} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Could Not Load Splits</h4>
                <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">{error}</p>
                <button
                  onClick={fetchSplitsFromSupabase}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  <RefreshCw size={16} />
                  <span>Retry Query</span>
                </button>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && splits.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center justify-center mx-auto mb-4">
                  <Dumbbell size={24} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">No Splits Found</h4>
                <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
                  The <code className="text-orange-400 bg-zinc-900 px-1 py-0.5 rounded text-xs">split_templates</code> table returned 0 rows for unauthenticated access. Please ensure the public RLS policy is enabled.
                </p>
                <button
                  onClick={fetchSplitsFromSupabase}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </button>
              </div>
            )}

            {/* SCREEN 1: SPLIT SELECTION (REAL DATA) */}
            {!loading && !error && splits.length > 0 && !selectedSplit && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    CHOOSE YOUR <span className="text-orange-500">TRAINING SPLIT</span>
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-xl">
                    Every workout plan in Zeffrix is calibrated around proven frequency distributions. Click any split below to see its exact weekly breakdown.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {splits.map((split) => (
                    <motion.div
                      key={split.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedSplit(split)}
                      className="group p-5 sm:p-6 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                              {split.name}
                            </h4>
                            {isBroSplit4d(split.name) && (
                              <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 font-bold text-[10px] tracking-wide">
                                ★ Rec. for Fat Loss
                              </span>
                            )}
                            {isPPL5d(split.name) && (
                              <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 font-bold text-[10px] tracking-wide">
                                ★ Rec. for Muscle Gain
                              </span>
                            )}
                          </div>
                          <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold text-xs whitespace-nowrap">
                            {split.days_per_week} Days / Week
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                          {split.description || 'Structured multi-day training program designed for progressive overload.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-semibold text-zinc-400 group-hover:text-orange-400 transition-colors">
                        <span className="flex items-center gap-1.5">
                          <Activity size={14} className="text-orange-500" />
                          View Schedule & Workouts
                        </span>
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: SPLIT DETAILS & TEMPLATES (REAL DATA) */}
            {!loading && !error && selectedSplit && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* SPLIT HEADER */}
                <div className="pb-4 border-b border-zinc-800 space-y-2">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      <Flame size={13} /> Selected Split
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                      {selectedSplit.name}
                    </h3>

                    <Link
                      to="/beta"
                      onClick={onClose}
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] shrink-0 whitespace-nowrap"
                    >
                      <span>Train this split</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* TOP SECTION: DEFAULT SCHEDULE & SPLIT SUMMARY
                    PC/Desktop: side-by-side on the SAME ROW (grid-cols-2)
                    Phone/Mobile: schedule ABOVE summary (flex-col) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {/* CARD 1: DEFAULT WEEKLY SCHEDULE */}
                  <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center gap-2.5 mb-4 text-white">
                        <Calendar size={18} className="text-orange-500" />
                        <h4 className="text-base font-bold uppercase tracking-wide">
                          Default Schedule
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {selectedSplit.split_days && selectedSplit.split_days.length > 0 ? (
                          selectedSplit.split_days.map((day) => {
                            const isRest = day.is_rest_day || !day.workout_templates;
                            return (
                              <div
                                key={day.id || day.day_index}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors ${
                                  isRest
                                    ? 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500'
                                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
                                }`}
                              >
                                <div className="flex items-center gap-3 font-semibold">
                                  <span className={`w-8 ${isRest ? 'text-zinc-600' : 'text-orange-400 font-bold'}`}>
                                    {(day.day_label || `Day ${day.day_index + 1}`).slice(0, 3)}
                                  </span>
                                  <span className="text-zinc-400 text-xs hidden sm:inline">
                                    {day.day_label || `Day ${day.day_index + 1}`}
                                  </span>
                                </div>

                                <div className="text-right">
                                  {isRest ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-800/60 text-zinc-400 text-[11px] font-medium">
                                      Rest & Recovery
                                    </span>
                                  ) : (
                                    <span className="font-semibold text-white truncate max-w-[180px] sm:max-w-[240px] inline-block">
                                      {day.workout_templates?.name || 'Workout Session'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-zinc-500 py-4 text-center">
                            No split schedule days defined for this split template.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                      <span>{trainingDaysCount} Training Days</span>
                      <span>&bull;</span>
                      <span>{restDaysCount} Rest Days</span>
                      <span>&bull;</span>
                      <span>7-Day Cycle</span>
                    </div>
                  </div>

                  {/* CARD 2: SPLIT SUMMARY */}
                  <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center gap-2.5 mb-4 text-white">
                        <Activity size={18} className="text-orange-500" />
                        <h4 className="text-base font-bold uppercase tracking-wide">
                          Split Summary
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {selectedSplit.description || 'Programmatic training split structured for progressive overload and muscle recovery.'}
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-xl">
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                              Weekly Frequency
                            </span>
                            <span className="text-base font-extrabold text-white">
                              {selectedSplit.days_per_week} Days / Week
                            </span>
                          </div>

                          <div className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-xl flex flex-col justify-between">
                            <div>
                              <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                                Goal Focus
                              </span>
                              <span className="text-sm sm:text-base font-extrabold text-orange-400 block leading-tight">
                                Fat Loss &amp; Muscle Gain
                              </span>
                            </div>

                            {isBroSplit4d(selectedSplit.name) ? (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-[10px] sm:text-[11px] font-bold text-orange-300 w-fit">
                                <span>★</span>
                                <span>Recommended for Fat Loss</span>
                              </div>
                            ) : isPPL5d(selectedSplit.name) ? (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-[10px] sm:text-[11px] font-bold text-orange-300 w-fit">
                                <span>★</span>
                                <span>Recommended for Muscle Gain</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-zinc-500 mt-1 block">
                                Suited for all goals
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-3.5 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            <strong className="text-orange-400 font-semibold">Zeffrix AI Engine:</strong> Every workout slot inside this split automatically adapts sets and reps to match your primary goal (Fat Loss or Muscle Gain).
                            {isBroSplit4d(selectedSplit.name) && (
                              <span className="block mt-1 text-orange-300 font-medium">
                                This split is specifically recommended for Fat Loss cut phases.
                              </span>
                            )}
                            {isPPL5d(selectedSplit.name) && (
                              <span className="block mt-1 text-orange-300 font-medium">
                                This split is specifically recommended for maximal Muscle Gain hyper-growth.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs text-zinc-500">
                      Standardized structure compatible with automated weekly logs
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: WORKOUT TEMPLATES ONE BY ONE */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-extrabold tracking-tight text-white uppercase">
                        Workout Templates ({distinctTemplates.length})
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        The distinct sessions executed sequentially across this weekly split
                      </p>
                    </div>
                  </div>

                  {distinctTemplates.length > 0 ? (
                    <div className="space-y-4">
                      {distinctTemplates.map((template, idx) => (
                        <div
                          key={template.id || idx}
                          className="p-5 sm:p-6 bg-[#141414] border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all shadow-md"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <h5 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                {template.name}
                              </h5>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {template.duration && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
                                  <Clock size={12} className="text-orange-500" />
                                  {template.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          {template.overview && (
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4 pl-0 sm:pl-11">
                              {template.overview}
                            </p>
                          )}

                          {template.muscles && template.muscles.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pl-0 sm:pl-11">
                              <span className="text-xs text-zinc-500 font-medium mr-1">
                                Target Muscles:
                              </span>
                              {template.muscles.map((muscle, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium"
                                >
                                  {muscle}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-[#141414] border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                      No distinct workout templates mapped to this split yet.
                    </div>
                  )}
                </div>

                {/* MODAL FOOTER ACTION */}
                <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-zinc-500 text-center sm:text-left">
                    Want to customize or create your own split? Available in the Zeffrix beta app.
                  </p>
                  <Link
                    to="/beta"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] flex items-center justify-center gap-2"
                  >
                    <span>Register for Beta</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
