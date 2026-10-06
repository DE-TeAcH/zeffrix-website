import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Dumbbell, Activity, Cpu, LineChart, CheckCircle2, Play, ChevronLeft } from 'lucide-react';
import { createBrowserRouter, RouterProvider, Link, useNavigate } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { LegalPage } from './LegalPage';
import { WorkoutSplitsModal } from './components/WorkoutSplitsModal';

import homeImg from '../imports/home.png';
import coach1 from '../imports/coach_1.jpg';
import coach2 from '../imports/coach_2.png';
import custom1 from '../imports/custom_1.jpg';
import custom2 from '../imports/custom_2.jpg';
import custom3 from '../imports/custom_3.jpg';
import custom4 from '../imports/custom_4.jpg';
import customWorkout from '../imports/custom_workout.jpg';
import progress1 from '../imports/progress_1.jpg';
import progress2 from '../imports/proress_2.jpg';
import workoutOverview from '../imports/Workout_Overview.jpg';
import workoutExercises from '../imports/Workout_Exercises.jpg';
import logoImg from '../imports/logo.png';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.2 }
};

import { supabase, BetaUser } from '../lib/supabase';

const BETA_MAX_USERS = 100;

async function fetchBetaCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('beta_users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching beta user count:', error);
      const stored = localStorage.getItem('zeffrix_beta_count');
      return stored ? parseInt(stored, 10) : 0;
    }
    const safeCount = count ?? 0;
    localStorage.setItem('zeffrix_beta_count', safeCount.toString());
    return safeCount;
  } catch (err) {
    console.error('Failed to query supabase count:', err);
    const stored = localStorage.getItem('zeffrix_beta_count');
    return stored ? parseInt(stored, 10) : 0;
  }
}

function BetaCounter({ count, max = BETA_MAX_USERS }: { count: number, max?: number }) {
  const percentage = Math.min(100, Math.max(0, (count / max) * 100));
  const isFull = count >= max;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xl md:text-2xl font-bold tracking-tight text-white">{count} <span className="text-zinc-500 font-medium text-lg">/ {max}</span></span>
        </div>
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Beta Applications</span>
      </div>
      <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-zinc-800/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" as const, delay: 0.2 }}
          className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-orange-500'}`}
        ></motion.div>
      </div>
      {isFull && (
        <div className="mt-2 text-xs font-semibold tracking-wider text-red-400 uppercase text-left">
          Beta Capacity Reached (Closed)
        </div>
      )}
    </div>
  );
}

function Home() {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem('zeffrix_beta_count');
    return stored ? parseInt(stored, 10) : 0;
  });
  
  useEffect(() => {
    fetchBetaCount().then((val) => setCount(val));
  }, []);

  const isClosed = count >= BETA_MAX_USERS;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden flex flex-col items-center justify-center relative p-6">
      
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-5xl w-full mx-auto flex flex-col items-center justify-center text-center z-10 pt-10 pb-20">
        
        {/* Branding */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center mb-4">
            <ImageWithFallback src={logoImg} alt="Zeffrix Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold tracking-widest text-lg md:text-xl uppercase opacity-90">Zeffrix</span>
        </motion.div>

        {/* Main Message */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" as const }}
          className="mb-14"
        >
          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-extrabold tracking-tighter leading-[0.95] mb-6">
            YOUR NEXT REP<br/>
            <span className="text-orange-500">STARTS HERE.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
            {isClosed 
              ? "Private beta registration has reached its 100-tester limit." 
              : "Zeffrix is entering private beta. Be among the first to train with it."}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
          className="flex flex-col items-center w-full max-w-sm mx-auto"
        >
          <BetaCounter count={count} />
          
          {isClosed ? (
            <div className="w-full bg-zinc-800 text-zinc-400 py-4 rounded-full text-base font-bold tracking-wide flex items-center justify-center mb-4 border border-zinc-700 cursor-not-allowed">
              REGISTRATION CLOSED
            </div>
          ) : (
            <Link to="/beta" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-full text-base font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] flex items-center justify-center mb-4">
              REGISTER FOR BETA
            </Link>
          )}
          <Link to="/discover" className="w-full py-4 rounded-full text-base font-bold tracking-wide text-zinc-300 hover:text-white border border-zinc-800 hover:bg-[#1A1A1A] transition-colors flex items-center justify-center mb-6">
            DISCOVER ZEFFRIX
          </Link>
          
          <p className="text-xs font-medium text-zinc-500 tracking-wider uppercase mb-3">
            Android &middot; Private Beta &middot; Limited Access
          </p>

          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <Link to="/terms" className="hover:text-zinc-400 transition-colors">Terms of Use</Link>
            <span>&bull;</span>
            <Link to="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

const formatDateToYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMaxDob = (): string => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
  return formatDateToYMD(maxDate);
};

const getMinDob = (): string => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  return formatDateToYMD(minDate);
};

const validateDob = (dobString: string): { isValid: boolean; error?: string } => {
  if (!dobString) {
    return { isValid: false, error: 'Date of birth is required.' };
  }

  const parts = dobString.split('-');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  const dob = new Date(year, month, day);
  if (dob.getFullYear() !== year || dob.getMonth() !== month || dob.getDate() !== day) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (dob > todayDateOnly) {
    return { isValid: false, error: 'Date of birth cannot be in the future.' };
  }

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 16) {
    return { isValid: false, error: 'You must be at least 16 years old to register.' };
  }

  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  return { isValid: true };
};

function Beta() {
  const [status, setStatus] = useState<'idle' | 'focused' | 'submitting' | 'success' | 'error' | 'invalid' | 'underage' | 'exists' | 'full'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [dobError, setDobError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', dob: '', country: '', consent: false });
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem('zeffrix_beta_count');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const maxDob = useMemo(() => getMaxDob(), []);
  const minDob = useMemo(() => getMinDob(), []);

  useEffect(() => {
    fetchBetaCount().then((val) => {
      setCount(val);
      setIsLoadingCount(false);
      if (val >= BETA_MAX_USERS) {
        setStatus('full');
      }
    });
  }, []);

  const isClosed = count >= BETA_MAX_USERS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) {
      setStatus('full');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.dob || !formData.country || !formData.consent) {
      setStatus('invalid');
      return;
    }

    const dobValidation = validateDob(formData.dob);
    if (!dobValidation.isValid) {
      setDobError(dobValidation.error || 'You must be at least 16 years old to register.');
      setStatus('underage');
      return;
    }

    const emailTrimmed = formData.email.trim().toLowerCase();

    setStatus('submitting');
    setErrorMessage('');

    try {
      // 1. Re-check latest user count to ensure not exceeding 100
      const currentCount = await fetchBetaCount();
      setCount(currentCount);

      if (currentCount >= BETA_MAX_USERS) {
        setStatus('full');
        return;
      }

      // 2. Check if email already registered
      const { data: existingUser, error: checkError } = await supabase
        .from('beta_users')
        .select('email')
        .eq('email', emailTrimmed)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking duplicate user:', checkError);
      }

      if (existingUser) {
        setStatus('exists');
        return;
      }

      // 3. Insert record into beta_users table
      const newRecord: BetaUser = {
        full_name: formData.name.trim(),
        email: emailTrimmed,
        date_of_birth: formData.dob,
        country: formData.country,
      };

      const { error: insertError } = await supabase
        .from('beta_users')
        .insert([newRecord]);

      if (insertError) {
        // If Postgres unique constraint violation
        if (insertError.code === '23505') {
          setStatus('exists');
          return;
        }
        console.error('Insert error:', insertError);
        setErrorMessage(insertError.message || 'An error occurred while submitting. Please try again.');
        setStatus('error');
        return;
      }

      // 4. Update count and set success
      const updatedCount = await fetchBetaCount();
      setCount(updatedCount);
      setStatus('success');
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err?.message || 'Network error. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden flex flex-col items-center justify-center relative p-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-md mx-auto z-10 py-12 md:py-20">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <ImageWithFallback src={logoImg} alt="Zeffrix Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold tracking-widest text-sm uppercase">Zeffrix</span>
          </Link>
          
          <Link to="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> Back
          </Link>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141414] border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
               <CheckCircle2 className="text-orange-500 w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[0.9] mb-4">
              YOU'RE ON<br/>THE LIST.
            </h1>
            <p className="text-zinc-400 leading-relaxed mb-10">
              We'll contact you at <strong className="text-white">{formData.email}</strong> when your access is ready.
            </p>
            
            <div className="space-y-4">
              <Link to="/discover" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] flex items-center justify-center">
                DISCOVER ZEFFRIX
              </Link>
              <Link to="/" className="w-full py-4 rounded-xl text-sm font-bold tracking-wide text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center justify-center">
                BACK HOME
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[0.9] mb-4">
              JOIN THE<br/>
              <span className="text-orange-500">ZEFFRIX BETA.</span>
            </h1>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Zeffrix is currently preparing its first private Android beta. Register your interest and we'll contact selected testers when access is ready.
            </p>

            <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-5 mb-8 flex items-center justify-between">
               <div>
                 <div className="text-2xl font-bold tracking-tight text-white">{count} <span className="text-zinc-500 font-medium text-lg">/ {BETA_MAX_USERS}</span></div>
                 <div className="text-xs text-zinc-400 mt-1">
                   {isClosed ? 'Beta capacity reached. Registration is now closed.' : 'people have applied for the first beta.'}
                 </div>
               </div>
               <div className="w-16 h-1.5 bg-[#0D0D0D] rounded-full overflow-hidden border border-zinc-800/50">
                 <div 
                   className={`h-full rounded-full ${isClosed ? 'bg-red-500' : 'bg-orange-500'}`} 
                   style={{ width: `${Math.min(100, (count / BETA_MAX_USERS) * 100)}%` }}
                 ></div>
               </div>
            </div>

            {isClosed ? (
              <div className="bg-[#141414] border border-zinc-800 rounded-3xl p-8 text-center shadow-xl">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  !
                </div>
                <h3 className="text-2xl font-bold mb-2">Registration Closed</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  The private beta has reached the limit of {BETA_MAX_USERS} applicants. Follow our updates or check back for future beta rounds.
                </p>
                <Link to="/" className="w-full inline-flex justify-center bg-zinc-800 hover:bg-zinc-700 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all">
                  BACK HOME
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#141414] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl">
                
                {status === 'invalid' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                    Please fill out all required fields to continue.
                  </div>
                )}

                {status === 'underage' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                    {dobError || 'You must be at least 16 years old to register for the beta.'}
                  </div>
                )}

                {status === 'exists' && (
                  <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                    This email is already registered for the beta waitlist!
                  </div>
                )}

                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                    {errorMessage || 'Failed to submit registration. Please try again.'}
                  </div>
                )}
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      onFocus={() => { if (status !== 'submitting') setStatus('focused'); }}
                      className="w-full bg-[#1A1A1A] border border-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 rounded-xl px-4 py-3.5 text-white outline-none transition-all placeholder:text-zinc-600"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      onFocus={() => { if (status !== 'submitting') setStatus('focused'); }}
                      className="w-full bg-[#1A1A1A] border border-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 rounded-xl px-4 py-3.5 text-white outline-none transition-all placeholder:text-zinc-600"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">Date of Birth *</label>
                      <input 
                        type="date" 
                        required
                        max={maxDob}
                        min={minDob}
                        value={formData.dob}
                        onChange={e => {
                          const newDob = e.target.value;
                          setFormData({...formData, dob: newDob});
                          if (status !== 'submitting') setStatus('focused');
                          if (newDob) {
                            const check = validateDob(newDob);
                            setDobError(check.isValid ? '' : (check.error || ''));
                          } else {
                            setDobError('');
                          }
                        }}
                        onBlur={() => {
                          if (formData.dob) {
                            const check = validateDob(formData.dob);
                            setDobError(check.isValid ? '' : (check.error || ''));
                          }
                        }}
                        className={`w-full bg-[#1A1A1A] border ${
                          dobError 
                            ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/50' 
                            : 'border-zinc-800 focus:border-orange-500 focus:ring-orange-500/50'
                        } focus:ring-1 rounded-xl px-4 py-3.5 text-white outline-none transition-all text-sm [color-scheme:dark]`}
                      />
                      {dobError ? (
                        <p className="text-[11px] text-red-400 mt-1.5 font-medium leading-tight">{dobError}</p>
                      ) : (
                        <p className="text-[11px] text-zinc-500 mt-1.5 leading-tight">Must be at least 16 years old</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">Country *</label>
                      <select 
                        required
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                        onFocus={() => { if (status !== 'submitting') setStatus('focused'); }}
                        className="w-full bg-[#1A1A1A] border border-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 rounded-xl px-4 py-3.5 text-white outline-none transition-all text-sm appearance-none"
                      >
                        <option value="" disabled>Select...</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={formData.consent}
                          onChange={e => setFormData({...formData, consent: e.target.checked})}
                          className="peer appearance-none w-5 h-5 border-2 border-zinc-700 rounded bg-[#1A1A1A] checked:bg-orange-500 checked:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                        />
                        <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                      </div>
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        I agree to receive emails about the Zeffrix beta.
                      </span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting' || isLoadingCount}
                  className="w-full mt-8 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800/60 disabled:text-white/50 text-white py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] disabled:shadow-none flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'REGISTERING...' : 'REGISTER FOR BETA'}
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-zinc-600 mt-8">
              <Link to="/terms" className="hover:text-zinc-400 transition-colors">Terms of Use</Link>
              <span>&bull;</span>
              <Link to="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Terms() {
  const navigate = useNavigate();
  return (
    <LegalPage
      type="terms"
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }}
    />
  );
}

function Privacy() {
  const navigate = useNavigate();
  return (
    <LegalPage
      type="privacy"
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }}
    />
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/discover",
    Component: Discover,
  },
  {
    path: "/beta",
    Component: Beta,
  },
  {
    path: "/terms",
    Component: Terms,
  },
  {
    path: "/privacy",
    Component: Privacy,
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}


export function Discover() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBuildScreen, setActiveBuildScreen] = useState<1 | 2>(2);
  const [activeVerifyScreen, setActiveVerifyScreen] = useState<1 | 2>(2);
  const [activeCoachScreen, setActiveCoachScreen] = useState<1 | 2>(2);
  const [activeWorkoutScreen, setActiveWorkoutScreen] = useState<1 | 2>(2);
  const [activeProgressScreen, setActiveProgressScreen] = useState<1 | 2>(2);
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem('zeffrix_beta_count');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [isSplitsModalOpen, setIsSplitsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBetaCount().then((val) => setCount(val));
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isClosed = count >= BETA_MAX_USERS;

  const scrollToSection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-zinc-800/50 py-4' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative z-50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex items-center justify-center">
              <ImageWithFallback src={logoImg} alt="Zeffrix Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold tracking-widest text-base md:text-lg uppercase">Zeffrix</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-zinc-400">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition-colors">Features</a>
            <a href="#ai-coach" onClick={(e) => scrollToSection(e, 'ai-coach')} className="hover:text-white transition-colors">AI Coach</a>
            <a href="#workouts" onClick={(e) => scrollToSection(e, 'workouts')} className="hover:text-white transition-colors">Workouts</a>
            <a href="#progress" onClick={(e) => scrollToSection(e, 'progress')} className="hover:text-white transition-colors">Progress</a>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {isClosed ? (
              <span className="bg-zinc-800 text-zinc-400 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide border border-zinc-700 cursor-not-allowed">
                REGISTRATION CLOSED
              </span>
            ) : (
              <Link to="/beta" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)]">
                REGISTER FOR BETA
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-zinc-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-[60px] h-screen bg-black/60 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Dropdown Panel */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" as const }}
                className="absolute top-full left-0 right-0 bg-[#0D0D0D] border-b border-zinc-800 shadow-2xl z-50 md:hidden"
              >
                <div className="px-6 py-6 flex flex-col">
                  <div className="flex flex-col gap-2 mb-6">
                    {[
                      { id: 'features', label: 'Features' },
                      { id: 'ai-coach', label: 'AI Coach' },
                      { id: 'workouts', label: 'Workouts' },
                      { id: 'progress', label: 'Progress' }
                    ].map((item) => (
                      <a 
                        key={item.id}
                        href={`#${item.id}`} 
                        onClick={(e) => scrollToSection(e, item.id)} 
                        className="text-lg font-bold text-white hover:text-orange-500 transition-colors py-3 border-b border-zinc-900/80 tracking-wide"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                  {isClosed ? (
                    <div className="w-full text-center bg-zinc-800 text-zinc-400 py-3.5 rounded-xl font-bold tracking-wide border border-zinc-700">
                      REGISTRATION CLOSED
                    </div>
                  ) : (
                    <Link to="/beta" className="w-full text-center bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                      REGISTER FOR BETA
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left z-10 w-full"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95] mb-6 md:mb-8">
            TRAIN SMARTER.<br/>
            <span className="text-orange-500">GET STRONGER.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
            Build workouts, train with AI guidance, and track the progress that actually matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {isClosed ? (
              <div className="w-full sm:w-auto bg-zinc-800 text-zinc-400 px-8 py-4 rounded-full font-bold tracking-wide border border-zinc-700 cursor-not-allowed">
                REGISTRATION CLOSED
              </div>
            ) : (
              <Link to="/beta" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] flex items-center justify-center gap-2">
                REGISTER FOR BETA <ArrowRight size={20} />
              </Link>
            )}
            <button onClick={(e) => scrollToSection(e, 'features')} className="w-full sm:w-auto px-8 py-4 rounded-full font-bold tracking-wide text-zinc-300 hover:text-white border border-zinc-800 hover:bg-zinc-900 transition-colors">
              Explore Features
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative w-[80%] max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto mt-8 lg:mt-0"
        >
          <div className="absolute inset-0 bg-orange-500/20 blur-[80px] md:blur-[100px] rounded-full"></div>
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-[4px] md:border-[6px] border-zinc-800 bg-[#1A1A1A] shadow-2xl z-10 transform lg:rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
            <ImageWithFallback src={homeImg} alt="Zeffrix Home Dashboard" className="w-full h-auto object-cover" />
          </div>

        </motion.div>
      </section>

      {/* 2. Value Proposition */}
      <section id="features" className="py-20 md:py-24 bg-[#111111] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeIn} className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              EVERYTHING YOUR<br/>TRAINING NEEDS.
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { icon: Dumbbell, title: "SMART WORKOUTS", desc: "Train with structured workout plans." },
              { icon: Cpu, title: "AI COACH", desc: "Get fitness guidance when you need it." },
              { icon: Activity, title: "CUSTOM TRAINING", desc: "Build workouts around how YOU want to train." },
              { icon: LineChart, title: "REAL PROGRESS", desc: "Track strength, performance and consistency." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-zinc-900/50 border border-zinc-800/50 p-6 md:p-8 rounded-2xl hover:bg-zinc-900 transition-colors">
                <feature.icon className="text-orange-500 mb-5 md:mb-6" size={28} />
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. AI Coach Section */}
      <section id="ai-coach" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-16">
          <motion.div {...fadeIn} className="flex-1 lg:order-2 w-full text-center lg:text-left">
            <div className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-3">Zeffrix AI</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              YOUR COACH.<br/>ALWAYS WITH YOU.
            </h2>
            <p className="text-base md:text-lg text-zinc-400 mb-8 max-w-lg mx-auto lg:mx-0">
              Zeffrix AI Coach gives you accessible fitness guidance anytime. Get real-time advice on your workouts, recovery, goals, and training questions.
            </p>
            <ul className="space-y-4 mb-10 max-w-sm mx-auto lg:mx-0 text-left">
              {['Workout advice', 'Recovery strategies', 'Goal setting', 'Training questions'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-zinc-300">
                  <CheckCircle2 className="text-orange-500 flex-shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full lg:order-1 mt-4 lg:mt-0"
          >
            <div className="relative w-full max-w-[340px] md:max-w-full h-[400px] md:h-[600px] mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-orange-500/10 blur-[60px] md:blur-[80px] rounded-full"></div>
              
              {/* Background Phone */}
              <div 
                className={`absolute left-0 md:left-10 w-[55%] md:w-64 rounded-2xl md:rounded-[2rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 cursor-pointer transition-all duration-500 ease-out origin-center ${
                  activeCoachScreen === 1
                    ? 'z-20 scale-100 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                    : 'z-0 scale-90 -rotate-6 opacity-60 brightness-50 shadow-lg'
                }`}
                onMouseEnter={() => setActiveCoachScreen(1)}
                onClick={() => setActiveCoachScreen(1)}
              >
                <ImageWithFallback src={coach1} alt="AI Coach Landing" className="w-full h-auto object-cover block" />
              </div>
              
              {/* Foreground Phone */}
              <div 
                className={`absolute right-0 md:right-20 w-[65%] md:w-72 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-[4px] md:border-[6px] border-zinc-800 cursor-pointer transition-all duration-500 ease-out origin-center ${
                  activeCoachScreen === 2
                    ? 'z-20 scale-100 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                    : 'z-0 scale-90 rotate-3 opacity-60 brightness-50 shadow-lg'
                }`}
                onMouseEnter={() => setActiveCoachScreen(2)}
                onClick={() => setActiveCoachScreen(2)}
              >
                <div className="absolute inset-0 ring-1 ring-inset ring-orange-500/30 rounded-[1.5rem] md:rounded-[2.5rem] z-20 pointer-events-none"></div>
                <ImageWithFallback src={coach2} alt="AI Coach Chat" className="w-full h-auto object-cover block relative z-10" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Custom Workout Section */}
      <section id="workouts" className="py-24 md:py-32 bg-[#141414] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div {...fadeIn} className="max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              BUILD IT YOUR WAY.<br/>
              <span className="text-orange-500">LET ZEFFRIX CHECK IT.</span>
            </h2>
            <p className="text-base md:text-lg text-zinc-400">
              Create your own workout, choose your exercises, configure your training, and let Zeffrix AI help verify the structure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10"></div>
            
            {/* Step 01 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.0 }}
              className="flex flex-col items-center"
            >
              <div className="order-1 md:order-2 flex flex-col items-center mt-0 md:mt-10 mb-8 md:mb-0 w-full text-center">
                <h3 className="text-xl font-bold mb-2 md:mb-3 tracking-wide text-white">01 — Build</h3>
                <p className="text-base md:text-sm text-zinc-400 max-w-[260px] md:max-w-[220px]">Choose your exercises and make the workout yours.</p>
              </div>

              <div className="order-2 md:order-1 relative w-[80%] max-w-[260px] mx-auto transform transition-transform hover:-translate-y-2 flex-shrink-0">
                {/* Invisible placeholder ensures column height matches exactly with Step 02 and 03 */}
                <ImageWithFallback src={custom1} alt="" className="w-full h-auto opacity-0 pointer-events-none block" />
                
                <div 
                  className={`absolute top-0 left-[-5%] w-[85%] rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 bg-[#0D0D0D] cursor-pointer transition-all duration-500 ease-out origin-center ${
                    activeBuildScreen === 1 
                      ? 'z-20 scale-105 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' 
                      : 'z-0 scale-95 -rotate-3 opacity-60 brightness-50 shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveBuildScreen(1)}
                  onClick={() => setActiveBuildScreen(1)}
                >
                  <ImageWithFallback src={custom1} alt="Build Workout Part 1" className="w-full h-auto object-cover block" />
                </div>
                
                <div 
                  className={`absolute bottom-0 right-[-5%] w-[85%] rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 bg-[#0D0D0D] cursor-pointer transition-all duration-500 ease-out origin-center ${
                    activeBuildScreen === 2 
                      ? 'z-20 scale-105 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' 
                      : 'z-0 scale-95 rotate-3 opacity-60 brightness-50 shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveBuildScreen(2)}
                  onClick={() => setActiveBuildScreen(2)}
                >
                  <ImageWithFallback src={custom2} alt="Build Workout Part 2" className="w-full h-auto object-cover block" />
                </div>
              </div>
            </motion.div>

            {/* Step 02 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="order-1 md:order-2 flex flex-col items-center mt-0 md:mt-10 mb-8 md:mb-0 w-full text-center">
                <h3 className="text-xl font-bold mb-2 md:mb-3 tracking-wide text-white">02 — Verify</h3>
                <p className="text-base md:text-sm text-zinc-400 max-w-[260px] md:max-w-[220px]">Let Zeffrix AI review your workout before you train.</p>
              </div>

              <div className="order-2 md:order-1 relative w-[80%] max-w-[260px] mx-auto transform transition-transform hover:-translate-y-2 flex-shrink-0">
                {/* Invisible placeholder ensures column height matches exactly with Step 01 and 03 */}
                <ImageWithFallback src={custom3} alt="" className="w-full h-auto opacity-0 pointer-events-none block" />
                
                <div 
                  className={`absolute top-0 left-[-5%] w-[85%] rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 bg-[#0D0D0D] cursor-pointer transition-all duration-500 ease-out origin-center ${
                    activeVerifyScreen === 1 
                      ? 'z-20 scale-105 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' 
                      : 'z-0 scale-95 -rotate-3 opacity-60 brightness-50 shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveVerifyScreen(1)}
                  onClick={() => setActiveVerifyScreen(1)}
                >
                  <ImageWithFallback src={custom3} alt="Verify Workout Part 1" className="w-full h-auto object-cover block" />
                </div>
                
                <div 
                  className={`absolute bottom-0 right-[-5%] w-[85%] rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 bg-[#0D0D0D] cursor-pointer transition-all duration-500 ease-out origin-center ${
                    activeVerifyScreen === 2 
                      ? 'z-20 scale-105 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' 
                      : 'z-0 scale-95 rotate-3 opacity-60 brightness-50 shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveVerifyScreen(2)}
                  onClick={() => setActiveVerifyScreen(2)}
                >
                  <ImageWithFallback src={custom4} alt="Verify Workout Part 2" className="w-full h-auto object-cover block" />
                </div>
              </div>
            </motion.div>

            {/* Step 03 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="order-1 md:order-2 flex flex-col items-center mt-0 md:mt-10 mb-8 md:mb-0 w-full text-center">
                <h3 className="text-xl font-bold mb-2 md:mb-3 tracking-wide text-white">03 — Manage</h3>
                <p className="text-base md:text-sm text-zinc-400 max-w-[260px] md:max-w-[220px]">Keep your custom workouts organized and ready to train.</p>
              </div>

              <div className="order-2 md:order-1 w-[80%] max-w-[260px] rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 bg-[#0D0D0D] shadow-xl transform transition-transform hover:-translate-y-2 flex-shrink-0 mx-auto">
                <ImageWithFallback src={customWorkout} alt="Manage Workouts" className="w-full h-auto object-cover block" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Workout Experience */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div {...fadeIn} className="mb-12 md:mb-16 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            FROM PLAN<br/>TO PERFORMANCE.
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-8 sm:p-10 md:p-16 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-1/2 md:h-full bg-orange-500/5 blur-[80px] md:blur-[120px]"></div>
          
          <div className="flex-1 space-y-4 md:space-y-6 z-10 text-center md:text-left order-1 md:order-1 w-full">
            <h3 className="text-2xl md:text-3xl font-bold">Everything you need to execute.</h3>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Access structured training programs while keeping your own custom workouts easily available. See exercise counts, durations, and overview details before you even start sweating.
            </p>
            <button 
              onClick={() => setIsSplitsModalOpen(true)}
              className="text-orange-500 font-bold flex items-center justify-center md:justify-start gap-2 hover:gap-4 transition-all w-full md:w-auto pt-4 md:pt-0 cursor-pointer group"
            >
              EXPLORE WORKOUTS <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex-1 relative w-[90%] max-w-[320px] md:max-w-md z-10 order-2 md:order-2 mt-8 md:mt-0 mx-auto flex-shrink-0">
            {/* Invisible placeholder for maintaining container height */}
            <ImageWithFallback src={workoutExercises} alt="" className="w-full h-auto opacity-0 pointer-events-none block" />
            
            <div 
              className={`absolute top-0 left-0 w-[75%] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 bg-[#0D0D0D] cursor-pointer transition-all duration-500 ease-out origin-center ${
                activeWorkoutScreen === 1
                  ? 'z-20 scale-105 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                  : 'z-0 scale-95 -rotate-3 opacity-80 brightness-50 shadow-lg'
              }`}
              onMouseEnter={() => setActiveWorkoutScreen(1)}
              onClick={() => setActiveWorkoutScreen(1)}
            >
              <ImageWithFallback src={workoutOverview} alt="Workout Overview" className="w-full h-auto object-cover block" />
            </div>
            
            <div 
              className={`absolute bottom-0 right-0 w-[85%] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-[3px] md:border-[5px] border-zinc-800 bg-[#0D0D0D] cursor-pointer transition-all duration-500 ease-out origin-center ${
                activeWorkoutScreen === 2
                  ? 'z-20 scale-105 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                  : 'z-0 scale-95 rotate-2 opacity-80 brightness-50 shadow-lg'
              }`}
              onMouseEnter={() => setActiveWorkoutScreen(2)}
              onClick={() => setActiveWorkoutScreen(2)}
            >
              <ImageWithFallback src={workoutExercises} alt="Workout Exercises" className="w-full h-auto object-cover block" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. Progress Section */}
      <section id="progress" className="py-24 md:py-32 bg-[#111111] border-y border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Section (Above on mobile, Right on desktop) */}
          <motion.div {...fadeIn} className="flex-1 w-full lg:pl-10 order-1 lg:order-2 text-center lg:text-left">
            <div className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-3">Metrics</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-8">
              PROGRESS<br/>YOU CAN SEE.
            </h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-zinc-400 mb-8 max-w-sm mx-auto lg:mx-0 text-left">
              <p className="font-medium text-white border-l-2 border-orange-500 pl-4">Track performance.</p>
              <p className="font-medium text-white border-l-2 border-orange-500 pl-4">See changes over time.</p>
              <p className="font-medium text-white border-l-2 border-orange-500 pl-4">Know whether your training is moving forward.</p>
            </div>
            <p className="text-sm md:text-base text-zinc-500 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Monitor your 1RM for main lifts like Bench Press, Squat, and Deadlift. Map out your body-performance tracking seamlessly within one dashboard.
            </p>
          </motion.div>

          {/* Image Section (Below on mobile, Left on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full order-2 lg:order-1 mt-4 lg:mt-0"
          >
            <div className="relative w-full max-w-[340px] md:max-w-full h-[400px] md:h-[600px] mx-auto flex items-center justify-center">
              {/* Background Image */}
              <div 
                className={`absolute left-0 top-0 md:top-20 md:left-0 w-[55%] md:w-72 rounded-2xl md:rounded-[2rem] overflow-hidden border-[3px] md:border-[4px] border-zinc-800 cursor-pointer transition-all duration-500 ease-out origin-center ${
                  activeProgressScreen === 1
                    ? 'z-20 scale-100 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                    : 'z-0 scale-90 -rotate-3 opacity-70 brightness-50 shadow-lg'
                }`}
                onMouseEnter={() => setActiveProgressScreen(1)}
                onClick={() => setActiveProgressScreen(1)}
              >
                <ImageWithFallback src={progress1} alt="Progress Dashboard" className="w-full h-auto object-cover block" />
              </div>
              
              {/* Foreground Image */}
              <div 
                className={`absolute right-0 bottom-0 md:bottom-20 md:right-10 w-[65%] md:w-72 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-[4px] border-zinc-800 cursor-pointer transition-all duration-500 ease-out origin-center ${
                  activeProgressScreen === 2
                    ? 'z-20 scale-100 rotate-0 opacity-100 brightness-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                    : 'z-0 scale-90 rotate-6 opacity-70 brightness-50 shadow-lg'
                }`}
                onMouseEnter={() => setActiveProgressScreen(2)}
                onClick={() => setActiveProgressScreen(2)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none"></div>
                <ImageWithFallback src={progress2} alt="Strength Tracking" className="w-full h-auto object-cover relative z-10 block" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="relative py-32 md:py-48 px-6 text-center overflow-hidden flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh]">
        {/* Huge faint logo background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <ImageWithFallback src={logoImg} alt="" className="w-[150%] md:w-full max-w-[800px] h-auto object-contain blur-sm" />
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-orange-600/10 blur-[100px] md:blur-[150px] rounded-full z-0"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tighter leading-[0.9] md:leading-[0.85] mb-10 md:mb-12">
            YOUR TRAINING.<br/>
            YOUR PROGRESS.<br/>
            <span className="text-orange-500">ONE APP.</span>
          </h2>
          
          {isClosed ? (
            <div className="bg-zinc-800 text-zinc-400 px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-bold tracking-wider border border-zinc-700 cursor-not-allowed inline-flex items-center justify-center gap-3 w-full sm:w-auto">
              REGISTRATION CLOSED
            </div>
          ) : (
            <Link to="/beta" className="bg-orange-600 hover:bg-orange-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-bold tracking-wider transition-all shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_50px_rgba(234,88,12,0.7)] hover:scale-105 inline-flex items-center justify-center gap-3 w-full sm:w-auto">
              REGISTER FOR BETA
            </Link>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-zinc-900 py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
          
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <ImageWithFallback src={logoImg} alt="Zeffrix Logo" className="w-full h-full object-contain grayscale opacity-80" />
              </div>
              <span className="font-bold tracking-widest uppercase">Zeffrix</span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-[200px] text-center md:text-left">
              Train smarter. Track progress. Stay consistent.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 md:gap-8 text-sm font-medium text-zinc-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ai-coach" className="hover:text-white transition-colors">AI Coach</a>
            <a href="#workouts" className="hover:text-white transition-colors">Workouts</a>
            <a href="#progress" className="hover:text-white transition-colors">Progress</a>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>

        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>&copy; {new Date().getFullYear()} Zeffrix Fitness. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Use</Link>
            <span>&bull;</span>
            <Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      <WorkoutSplitsModal
        isOpen={isSplitsModalOpen}
        onClose={() => setIsSplitsModalOpen(false)}
      />
    </div>
  );
}

