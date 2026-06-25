/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, DollarSign, Clock, Sparkles, ClipboardList, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { User, Booking, AIPlannerOutput } from '../types';

interface BeautyDashboardProps {
  user: User;
  bookings: Booking[];
  aiPlannerOutput: AIPlannerOutput | null;
  onNavigateToTab: (tab: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function BeautyDashboard({
  user,
  bookings,
  aiPlannerOutput,
  onNavigateToTab,
  onCancelBooking
}: BeautyDashboardProps) {
  const [daysLeft, setDaysLeft] = useState(0);

  // Compute Wedding Countdown
  useEffect(() => {
    const targetDate = user.weddingDate ? new Date(user.weddingDate) : new Date('2026-10-18');
    const difference = targetDate.getTime() - new Date().getTime();
    if (difference > 0) {
      setDaysLeft(Math.ceil(difference / (1000 * 3600 * 24)));
    } else {
      setDaysLeft(0);
    }
  }, [user.weddingDate]);

  // Compute spent amount from bookings
  const totalSpent = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  // Suggested pre-wedding beauty tips based on skin type
  const getSkinTips = (skinType?: string) => {
    const defaultTips = [
      "Hydrate: Drink at least 3 liters of water daily to maintain a dewy base.",
      "Never Skip Sunscreen: Protect against UV hyperpigmentation before Sangeet drapes.",
      "Trial Prep: Cleanse and lightly moisturize before attending artist trials."
    ];
    if (!skinType) return defaultTips;
    switch (skinType.toLowerCase()) {
      case 'dry':
        return [
          "Hyaluronic Layering: Apply moisturizer on damp skin to trap glow.",
          "Gentle Exfoliation: Avoid abrasive apricot scrubs; use lactic acid peels.",
          "Creamy Textures: Highlight your makeup trials with dewy liquid bases."
        ];
      case 'oily':
        return [
          "Niacinamide Serum: Regulate sebum leading up to the wedding night.",
          "Clay Mask Detox: Use a mild Kaolin clay treatment 1 week before Muhurtham.",
          "Matte Airbrush: Select oil-control primer bases for hot venue environments."
        ];
      case 'combination':
        return [
          "Double Cleansing: Balance the oily T-zone and dry cheeks.",
          "Zone Moisturizing: Gel moisturizer for forehead, light cream for jawline.",
          "Prep Blotting: Keep matte translucent powder handy for mid-ceremony retouches."
        ];
      default:
        return defaultTips;
    }
  };

  const skinTips = getSkinTips(user.skinType);

  return (
    <div id="beauty-dashboard" className="py-8 max-w-7xl mx-auto px-4">
      
      {/* HEADER COUNTDOWN CARD (LUXURY INVITATION BLOCK) */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-[#FAF9F6] border border-amber-700/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <p className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">The Beautiful Countdown</p>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-amber-100">{user.name}'s Grand Wedding OS</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-amber-200/80">
            <span>Style: <strong>{user.stylePreference || 'Nizam Traditional'}</strong></span>
            <span>•</span>
            <span>Skin: <strong>{user.skinType || 'Combination'}</strong></span>
            <span>•</span>
            <span>Location: <strong>{user.location || 'Hyderabad'}</strong></span>
          </div>
        </div>

        {/* Big Countdown Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10 flex flex-col items-center justify-center min-w-[140px] shadow-inner">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-amber-300">{daysLeft}</span>
          <span className="text-[9px] font-mono tracking-widest uppercase text-amber-200 mt-1">Days to Muhurtham</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ROW 1: APPOINTMENTS & BUDGET (LEFT 7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section: Upcoming appointments */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
            <h3 className="text-lg font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-amber-800" />
              <span>Upcoming Beauty Schedule</span>
            </h3>

            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div id={`dash-booking-${b.id}`} key={b.id} className="p-4 rounded-2xl bg-amber-50/10 border border-amber-200/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/10 pb-2">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-amber-800 uppercase">Artist: {b.vendorName}</h4>
                        <h5 className="text-sm font-bold text-slate-900 font-serif mt-0.5">{b.packageTitle}</h5>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>🗓️ Date: <strong className="text-slate-800 font-serif">{b.date}</strong></div>
                      <div>⏰ Slot: <strong className="text-slate-800">{b.timeSlot}</strong></div>
                      <div>💳 Paid: <strong className="text-slate-800 font-mono">₹{b.price.toLocaleString('en-IN')} ({b.paymentStatus})</strong></div>
                      <div>📍 City: <strong className="text-slate-800">Hyderabad Hub</strong></div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        id={`chat-artist-${b.vendorId}`}
                        onClick={() => onNavigateToTab('chat')}
                        className="flex-1 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Artist</span>
                      </button>
                      <button
                        id={`cancel-booking-${b.id}`}
                        onClick={() => {
                          if (confirm('Are you sure you want to request appointment cancellation?')) {
                            onCancelBooking(b.id);
                          }
                        }}
                        className="px-3 py-2 border border-rose-100 hover:border-rose-300 text-rose-600 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div id="dashboard-no-bookings" className="text-center py-10 space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">You have no active salon or beauty artist bookings scheduled. Let's find your perfect Hyderabad stylist!</p>
                <button
                  onClick={() => onNavigateToTab('marketplace')}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold rounded-lg"
                >
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>

          {/* Section: Budget Tracking & Invoicing */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
            <h3 className="text-lg font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="w-5 h-5 text-amber-800" />
              <span>Wedding Beauty Budget Tracker</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div className="bg-slate-50 border rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Estimated Limit</span>
                <span className="text-xl sm:text-2xl font-serif text-slate-800 font-semibold mt-1">₹{(user.budget || 150000).toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block font-mono">Booked Amount</span>
                <span className="text-xl sm:text-2xl font-serif text-amber-950 font-semibold mt-1">₹{totalSpent.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Progress calculation */}
            {user.budget && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Slashed budget utilization</span>
                  <span>{Math.round((totalSpent / user.budget) * 100)}% Used</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-900 transition-all duration-1000"
                    style={{ width: `${Math.min((totalSpent / user.budget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ROW 2: AI ADVICE & CHECKLIST STATUS (RIGHT 5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Skincare Tips / AI Guidelines */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
            <h3 className="text-lg font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-amber-800" />
              <span>AI Bridal Skincare Routine</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Curated custom suggestions aligned with your <strong>{user.skinType || 'Combination'}</strong> dermis.</p>
            
            <div className="space-y-3">
              {skinTips.map((tip, i) => (
                <div id={`skin-tip-${i}`} key={i} className="flex gap-2.5 items-start text-xs">
                  <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center flex-shrink-0 font-bold font-mono">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-0.5">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Planner Checklist shortcut status */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md text-center">
            <h3 className="text-lg font-serif text-slate-900 font-medium mb-4 flex items-center justify-center gap-1.5 border-b border-slate-100 pb-3">
              <ClipboardList className="w-5 h-5 text-amber-800" />
              <span>Wedding Prep Checklist</span>
            </h3>

            {aiPlannerOutput ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                  <span>TOTAL STRATEGIC TASKS</span>
                  <span className="font-bold text-amber-950">
                    {aiPlannerOutput.checklist.filter(c => c.completed).length} / {aiPlannerOutput.checklist.length} DONE
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  {aiPlannerOutput.checklist.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 p-2.5 rounded-lg bg-slate-50 border border-slate-100/50">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${item.completed ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span className={`line-clamp-1 ${item.completed ? 'line-through opacity-50' : ''}`}>{item.task}</span>
                    </div>
                  ))}
                </div>
                <button
                  id="dashboard-goto-planner"
                  onClick={() => onNavigateToTab('planner')}
                  className="w-full mt-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all"
                >
                  Manage Full Checklist
                </button>
              </div>
            ) : (
              <div className="py-6 space-y-4 text-center">
                <p className="text-xs text-slate-500 max-w-xs mx-auto">No checklist compiled yet. Launch our AI planner to receive a bespoke wedding beauty timeline.</p>
                <button
                  onClick={() => onNavigateToTab('planner')}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:brightness-110"
                >
                  Launch AI Planner
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
