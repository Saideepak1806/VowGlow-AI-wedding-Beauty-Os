/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User as UserIcon, Calendar, Wallet, MapPin, Eye, Lock } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'bride' | 'vendor'>('bride');
  const [weddingDate, setWeddingDate] = useState('2026-10-18');
  const [budget, setBudget] = useState('150000');
  const [location, setLocation] = useState('Jubilee Hills, Hyderabad');
  const [stylePreference, setStylePreference] = useState('Nizam Traditional Telugu Bride');
  const [skinType, setSkinType] = useState('Combination');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please provide an email');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          onAuthSuccess(data.user);
          onClose();
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        // Register
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            role,
            weddingDate: role === 'bride' ? weddingDate : undefined,
            budget: role === 'bride' ? Number(budget) : undefined,
            location,
            stylePreference: role === 'bride' ? stylePreference : undefined,
            skinType: role === 'bride' ? skinType : undefined
          })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          onAuthSuccess(data.user);
          onClose();
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Connection to backend failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            id="auth-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl overflow-hidden bg-[#FAF9F6] rounded-2xl border border-amber-200/50 shadow-2xl p-6 md:p-8"
          >
            {/* Elegant Corner Decorative Ornaments */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-300/30 rounded-tl-lg pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-300/30 rounded-br-lg pointer-events-none" />

            {/* Close Button */}
            <button
              id="auth-modal-close"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-serif text-slate-900 tracking-wide font-medium">
                {isLogin ? 'Welcome Back to VowGlow' : 'Begin Your Luxury Grooming Journey'}
              </h2>
              <p className="text-xs text-amber-700 tracking-wider font-mono mt-1 uppercase">
                AI Wedding Beauty OS
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs border border-rose-200 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            {/* Quick Demo Credentials Panel */}
            <div className="mb-6 p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-center">
              <p className="text-xs text-amber-800 font-medium mb-2 font-mono">⚡ QUICK START DEMO CREDENTIALS</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('bride@vowglow.com')}
                  className="px-3 py-1.5 bg-white border border-amber-200/60 hover:border-amber-400 text-xs rounded-lg text-amber-900 transition-all font-medium shadow-sm hover:shadow"
                >
                  Enter as Bride 💍
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('vendor@vowglow.com')}
                  className="px-3 py-1.5 bg-white border border-amber-200/60 hover:border-amber-400 text-xs rounded-lg text-amber-900 transition-all font-medium shadow-sm hover:shadow"
                >
                  Enter as Vendor Atelier 💼
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Pranathi Reddy"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-300 focus:ring-2 focus:ring-amber-100 bg-white/70 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Role Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('bride')}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          role === 'bride'
                            ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        I am a Bride 💍
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('vendor')}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          role === 'vendor'
                            ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        I am an Artist / Salon 💼
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="bride@vowglow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-300 focus:ring-2 focus:ring-amber-100 bg-white/70 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {!isLogin && role === 'bride' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-amber-50/20 border border-amber-100/50 rounded-xl">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 tracking-wider uppercase">Wedding Date</label>
                    <input
                      type="date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 tracking-wider uppercase">Estimated Beauty Budget (INR)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 tracking-wider uppercase">Bridal Style</label>
                    <select
                      value={stylePreference}
                      onChange={(e) => setStylePreference(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-amber-300"
                    >
                      <option value="Nizam Traditional Telugu Bride">Nizam Traditional Telugu</option>
                      <option value="Hyderabadi Muslim Royal Khada Dupatta">Royal Khada Dupatta</option>
                      <option value="Sabyasachi Pastel Heritage Look">Pastel Heritage</option>
                      <option value="Modern South Indian Minimalist Temple Bride">Modern Minimalist Temple</option>
                      <option value="Christian Editorial Pearl Elegance">Christian Editorial Pearl</option>
                      <option value="Dewy Glass-Skin Bollywood Reception">Dewy Glass-Skin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 tracking-wider uppercase">Skin Type</label>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-amber-300"
                    >
                      <option value="Combination">Combination</option>
                      <option value="Dry">Dry</option>
                      <option value="Oily">Oily</option>
                      <option value="Sensitive">Sensitive</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl text-xs font-semibold tracking-widest uppercase hover:brightness-110 active:scale-[0.98] shadow-lg shadow-amber-900/10 transition-all"
              >
                {loading ? 'Processing...' : (isLogin ? 'Enter Atelier' : 'Create Elegant Account')}
              </button>
            </form>

            {/* Toggle footer */}
            <div className="mt-6 text-center text-xs text-slate-500">
              {isLogin ? "New to VowGlow? " : "Already have an account? "}
              <button
                id="auth-toggle-mode"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-800 font-semibold hover:underline"
              >
                {isLogin ? "Register your wedding" : "Atelier Access"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
