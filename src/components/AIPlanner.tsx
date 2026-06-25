/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, DollarSign, Heart, CheckSquare, Clock, MapPin, Tag, ArrowRight, UserCheck } from 'lucide-react';
import { AIPlannerInput, AIPlannerOutput, Package } from '../types';

interface AIPlannerProps {
  onPlanComplete: (output: AIPlannerOutput) => void;
  onSelectPackage: (pkgId: string, vendorId: string) => void;
  savedPlanner: AIPlannerOutput | null;
}

export default function AIPlanner({ onPlanComplete, onSelectPackage, savedPlanner }: AIPlannerProps) {
  const [loading, setLoading] = useState(false);
  const [plannerOutput, setPlannerOutput] = useState<AIPlannerOutput | null>(savedPlanner);
  
  // Form State
  const [weddingDate, setWeddingDate] = useState('2026-10-18');
  const [budget, setBudget] = useState(150000);
  const [brideStyle, setBrideStyle] = useState('Nizam Traditional Telugu Bride');
  const [skinType, setSkinType] = useState('Combination');
  const [location, setLocation] = useState('Jubilee Hills, Hyderabad');
  const [venueType, setVenueType] = useState('Palace Hotel');
  const [guestCount, setGuestCount] = useState(600);
  const [beautyPreferences, setBeautyPreferences] = useState<string[]>(['HD Makeup', 'Sari Draping', 'Poola Jada (Hair Braid)']);

  const PREF_OPTIONS = [
    'HD Makeup', 'Airbrush Makeup', 'Sari Draping', 'Poola Jada (Hair Braid)', 'Khada Dupatta Setting', 'HydraFacial Prep', 'Mehendi Design', 'Gel Nail Art Extensions', 'Spa Body Detox'
  ];

  const togglePreference = (pref: string) => {
    setBeautyPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingDate,
          budget,
          brideStyle,
          skinType,
          location,
          venueType,
          guestCount,
          beautyPreferences
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPlannerOutput(data);
        onPlanComplete(data);
      } else {
        alert(data.error || 'Failed to generate wedding beauty blueprint');
      }
    } catch (err) {
      alert('Network error. Failed to generate wedding beauty blueprint');
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = (id: string) => {
    if (!plannerOutput) return;
    const updatedChecklist = plannerOutput.checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    const updated = { ...plannerOutput, checklist: updatedChecklist };
    setPlannerOutput(updated);
    onPlanComplete(updated);
  };

  return (
    <div id="ai-bridal-planner-container" className="py-8 max-w-7xl mx-auto px-4">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/50 rounded-full text-amber-900 font-mono text-[10px] uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Atelier AI Stylist v1.2</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 font-medium tracking-tight">AI Bridal Beauty Planner</h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">Input your wedding specifics. Our neural stylist curates a multi-month countdown calendar, allocates your budgets, recommends packages, and designs a customized checklist.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT PANEL (LEFT 5 COLUMNS) */}
        <div className="lg:col-span-5 bg-white border border-amber-200/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          {/* Subtle design decals */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-tr-3xl" />
          
          <h3 className="text-xl font-serif text-slate-900 font-medium mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>Styling Parameters</span>
            <span className="text-xs font-mono font-normal text-amber-800">Configure</span>
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Wedding Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-50 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Total Beauty Budget</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    min={10000}
                    step={5000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-50 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Guest Count</label>
                <input
                  type="number"
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-50 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Bride Style preference</label>
              <select
                value={brideStyle}
                onChange={(e) => setBrideStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 bg-white"
              >
                <option value="Nizam Traditional Telugu Bride">Nizam Traditional Telugu Bride 💍</option>
                <option value="Hyderabadi Muslim Royal Khada Dupatta">Hyderabadi Muslim Royal Khada Dupatta 👑</option>
                <option value="Sabyasachi Pastel Heritage Look">Sabyasachi Pastel Heritage Look 🌸</option>
                <option value="Modern South Indian Minimalist Temple Bride">Modern South Indian Minimalist Temple Bride ✨</option>
                <option value="Christian Editorial Pearl Elegance">Christian Editorial Pearl Elegance 🦪</option>
                <option value="Dewy Glass-Skin Bollywood Reception">Dewy Glass-Skin Bollywood Reception 🌟</option>
                <option value="North-Indian Royal Crimson Lehenga Look">North-Indian Royal Crimson Lehenga Look 🌹</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Skin Type</label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 bg-white"
                >
                  <option value="Combination">Combination</option>
                  <option value="Oily">Oily</option>
                  <option value="Dry">Dry</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Venue Type</label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 bg-white"
                >
                  <option value="Palace Hotel">Palace Hotel</option>
                  <option value="Outdoor Garden">Outdoor Garden</option>
                  <option value="Lakeside Resort">Lakeside Resort</option>
                  <option value="Royal Convention Center">Royal Convention</option>
                  <option value="Boutique Indoor Hall">Boutique Indoor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Target District</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-400 bg-white"
              >
                <option value="Jubilee Hills, Hyderabad">Jubilee Hills, Hyderabad</option>
                <option value="Banjara Hills, Hyderabad">Banjara Hills, Hyderabad</option>
                <option value="Gachibowli, Hyderabad">Gachibowli, Hyderabad</option>
                <option value="Madhapur, Hyderabad">Madhapur, Hyderabad</option>
                <option value="Secunderabad, Hyderabad">Secunderabad, Hyderabad</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wider uppercase">Beauty & Hair Preferences</label>
              <div className="flex flex-wrap gap-2">
                {PREF_OPTIONS.map((pref, i) => {
                  const active = beautyPreferences.includes(pref);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => togglePreference(pref)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                        active 
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-semibold' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              id="generate-planner-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-amber-800 to-amber-950 text-white font-semibold rounded-xl text-xs tracking-widest uppercase hover:shadow-lg hover:shadow-amber-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{loading ? 'Synthesizing Blueprint...' : 'Generate Beauty Blueprint'}</span>
            </button>
          </form>
        </div>

        {/* OUTPUT PANEL (RIGHT 7 COLUMNS) */}
        <div className="lg:col-span-7">
          {loading ? (
            <div id="ai-planner-loading-card" className="bg-white border border-amber-200/30 rounded-3xl p-12 text-center shadow-xl min-h-[500px] flex flex-col items-center justify-center space-y-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200"
              >
                <Sparkles className="w-8 h-8 text-amber-700" />
              </motion.div>
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-slate-900 font-medium">Assembling Nizam-tier Beauty OS...</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Our AI Agent is querying skin algorithms, mapping local Hyderabad artists, calculating budget distributions, and formatting your bespoke countdown checklists.</p>
              </div>
              {/* Elegant fake progress tracker steps */}
              <div className="w-full max-w-xs space-y-2 text-left font-mono text-[10px] text-amber-800 bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl">
                <div className="flex items-center gap-2">🟢 [OK] Initialized Gemini Neural Stylist</div>
                <div className="flex items-center gap-2">🟢 [OK] Matched drapes to venue lights ({venueType})</div>
                <div className="flex items-center gap-2">🟡 [CALC] Distributing budget matrix (₹{budget.toLocaleString()})</div>
              </div>
            </div>
          ) : plannerOutput ? (
            <motion.div
              id="ai-planner-results-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              
              {/* 1. TIMELINE */}
              <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
                <h3 className="text-xl font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span>Custom Pre-Wedding Beauty Timeline</span>
                </h3>
                <div className="relative border-l border-amber-200 pl-4 ml-2 space-y-6">
                  {plannerOutput.beautyTimeline.map((time, i) => (
                    <div id={`timeline-node-${i}`} key={i} className="relative">
                      {/* Node point */}
                      <span className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-amber-600 border border-white shadow-sm" />
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">{time.timeline}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                            time.importance === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                          }`}>{time.importance} Priority</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">{time.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{time.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. SUGGESTED MARKETPLACE PACKAGES */}
              <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
                <h3 className="text-xl font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Heart className="w-5 h-5 text-amber-700" />
                  <span>AI Recommended Packages</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plannerOutput.suggestedPackages.map((rec, i) => (
                    <div id={`planner-rec-pkg-${i}`} key={i} className="p-4 rounded-2xl bg-amber-50/20 border border-amber-200/30 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-amber-800 font-mono uppercase tracking-wider">{rec.vendorName}</span>
                          <span className="text-xs font-bold text-slate-800">₹{rec.price.toLocaleString('en-IN')}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-950 font-serif leading-tight mb-2">{rec.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-3 italic">"{rec.reason}"</p>
                      </div>
                      <button
                        id={`planner-pkg-book-${rec.packageId}`}
                        onClick={() => onSelectPackage(rec.packageId, rec.vendorId)}
                        className="w-full py-2 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all"
                      >
                        Book This Package
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. BUDGET ALLOCATION */}
              <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
                <h3 className="text-xl font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <DollarSign className="w-5 h-5 text-amber-700" />
                  <span>Strategic Budget Allocation</span>
                </h3>
                <div className="space-y-4">
                  {plannerOutput.budgetPlan.map((b, i) => (
                    <div id={`budget-slice-${i}`} key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{b.category}</span>
                        <span className="text-slate-950 font-mono">₹{b.allocatedAmount.toLocaleString('en-IN')} ({b.percentage}%)</span>
                      </div>
                      {/* Bar */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                          style={{ width: `${b.percentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{b.tips}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. DYNAMIC INTERACTIVE CHECKLIST */}
              <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
                <h3 className="text-xl font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CheckSquare className="w-5 h-5 text-amber-700" />
                  <span>Active Preparation Checklist</span>
                </h3>
                <div className="space-y-2">
                  {plannerOutput.checklist.map((item, i) => (
                    <div
                      id={`planner-check-item-${item.id}`}
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        item.completed 
                          ? 'bg-slate-50/50 border-slate-100 opacity-60 line-through' 
                          : 'bg-white border-amber-200/20 hover:border-amber-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        className="mt-0.5 accent-amber-700"
                      />
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-800">{item.task}</p>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono mt-0.5">
                          <span className="uppercase">{item.timeframe}</span>
                          <span>•</span>
                          <span className="bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded uppercase">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
            <div id="ai-planner-empty-card" className="bg-white border border-amber-200/30 rounded-3xl p-12 text-center shadow-xl min-h-[500px] flex flex-col items-center justify-center space-y-4">
              <Sparkles className="w-12 h-12 text-amber-200" />
              <div className="space-y-1">
                <h4 className="text-xl font-serif text-slate-950 font-medium">Your Bespoke Wedding Plan Awaits</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Fill out your wedding parameters on the left and submit to let our luxury AI compile your tailor-made Wedding Beauty OS.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
