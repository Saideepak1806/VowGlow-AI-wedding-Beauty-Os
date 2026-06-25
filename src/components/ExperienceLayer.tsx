/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Image as ImageIcon, Camera, Grid, HelpCircle, Eye, Calendar, BookOpen, Star, RefreshCw } from 'lucide-react';

export default function ExperienceLayer() {
  const [activeTab, setActiveTab] = useState<'moodboard' | 'beforeafter' | 'calendar'>('moodboard');

  // Moodboard state
  const [selectedInspirations, setSelectedInspirations] = useState<string[]>([
    'Royal Kundan Choker', 'HD Matte Sweatproof Base', 'Traditional Red Banarasi'
  ]);

  const MOOD_OPTIONS = [
    { title: 'Royal Kundan Choker', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80', tag: 'Jewelry' },
    { title: 'HD Matte Sweatproof Base', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=300&auto=format&fit=crop&q=80', tag: 'Skin' },
    { title: 'Traditional Red Banarasi', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80', tag: 'Drapes' },
    { title: 'Dewy Bollywood Reception GLOW', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&auto=format&fit=crop&q=80', tag: 'Skin' },
    { title: 'Poola Jada Flower Braiding', image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?w=300&auto=format&fit=crop&q=80', tag: 'Hair' },
    { title: 'Khada Dupatta Editorial Set', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&auto=format&fit=crop&q=80', tag: 'Drapes' }
  ];

  const toggleMoodOption = (title: string) => {
    setSelectedInspirations(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // Before After state
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [showBefore, setShowBefore] = useState(false);

  const LOOKS = [
    {
      title: 'Nizami Telugu Muhurtham Transform',
      before: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
      after: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop&q=80',
      desc: 'Deep hydrating base, flawless color corrections for dark circles, gold temple kundan crown setting, matched poola jada.',
      artist: 'Aura Bridal Atelier',
      skinType: 'Combination/Dry'
    },
    {
      title: 'Royal Khada Dupatta Elegance',
      before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      after: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      desc: 'Elegant editorial crimson lip, defined kohl liner, secure layered khada dupatta drapes, radiant HD satin glow finish.',
      artist: 'Sultana Heritage Makeover',
      skinType: 'Normal/Sensitive'
    }
  ];

  // Calendar timeline
  const MONTHS_PREP = [
    {
      month: 'Month 3: Foundation Detox',
      tips: [
        'Dermatologist Consult: Test salicylic/glycolic chemical exfoliants.',
        'Hydration Lock: Establish 4 liters daily mineral water intake.',
        'Hair Health: Book hot oil hair spa deep root repair.'
      ],
      focus: 'Skin and Core Vitality'
    },
    {
      month: 'Month 2: Trial Selection',
      tips: [
        'Secure Artist Trials: Rehearse HD vs Airbrush with selected drapes.',
        'Sari Draping practice: Test sari pleating weight and walk flexibility.',
        'Teeth Whitening: Complete dentist-grade aesthetic polishing.'
      ],
      focus: 'Style Alignment & Rehearsals'
    },
    {
      month: 'Month 1: Active Radiance Lock',
      tips: [
        'Mehendi Hydration: Apply eucalyptus oils post-design to deepen stains.',
        'No New Products: Strictly avoid trying unverified cosmetics.',
        'Rest Pattern: Lock in 8-hour sleep patterns to eliminate under-eye bags.'
      ],
      focus: 'Sealing the Glow'
    }
  ];

  return (
    <div id="experience-layer-container" className="py-8 max-w-7xl mx-auto px-4">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/50 rounded-full text-amber-900 font-mono text-[10px] uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>VowGlow Experience Room</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 font-medium tracking-tight">Interactive Beauty Playground</h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">Explore before/after editorial bridal showcases, build your custom wedding visual moodboard, and browse your multi-month grooming countdown guide.</p>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex justify-center border-b border-slate-100 max-w-md mx-auto mb-10">
        <button
          onClick={() => setActiveTab('moodboard')}
          className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${
            activeTab === 'moodboard' ? 'border-amber-800 text-amber-950' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Visual Moodboard
        </button>
        <button
          onClick={() => setActiveTab('beforeafter')}
          className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${
            activeTab === 'beforeafter' ? 'border-amber-800 text-amber-950' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Before & After
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${
            activeTab === 'calendar' ? 'border-amber-800 text-amber-950' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Grooming Calendar
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: VISUAL MOODBOARD */}
        {activeTab === 'moodboard' && (
          <motion.div
            id="experience-moodboard-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* GRID OF INSPIRATIONS (LEFT 7 COLUMNS) */}
            <div className="lg:col-span-7 bg-white border border-amber-200/40 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-serif text-slate-900 font-semibold border-b pb-2 flex items-center gap-2">
                <Grid className="w-5 h-5 text-amber-800" />
                <span>Build Your Royal Look Inspiration Grid</span>
              </h3>
              <p className="text-xs text-slate-500">Tap options below to add or remove them from your active styling brief card on the right.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {MOOD_OPTIONS.map((opt, i) => {
                  const isSelected = selectedInspirations.includes(opt.title);
                  return (
                    <div
                      id={`mood-opt-card-${i}`}
                      key={i}
                      onClick={() => toggleMoodOption(opt.title)}
                      className={`relative rounded-2xl overflow-hidden border cursor-pointer group transition-all ${
                        isSelected ? 'border-amber-500 ring-2 ring-amber-100 shadow' : 'border-slate-100 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square bg-slate-50">
                        <img src={opt.image} className="w-full h-full object-cover" alt={opt.title} />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 p-2 text-white">
                        <span className="text-[8px] uppercase tracking-wider bg-amber-500/80 px-1 py-0.2 rounded font-mono font-bold">{opt.tag}</span>
                        <p className="text-[10px] font-semibold leading-tight line-clamp-1 mt-0.5">{opt.title}</p>
                      </div>

                      {/* Active indicator badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-900 border border-white text-white flex items-center justify-center shadow-md">
                          <CheckIcon className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VISUAL PREVIEW BRIEF (RIGHT 5 COLUMNS) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-amber-800 to-amber-950 text-white border border-amber-700/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                <ImageIcon className="w-40 h-40" />
              </div>

              <div className="space-y-4 relative z-10">
                <p className="text-[9px] font-mono tracking-widest text-amber-300 uppercase">Interactive Styling Brief</p>
                <h3 className="text-2xl font-serif text-amber-100 font-medium">Your Selected Royal Aesthetics</h3>
                
                {selectedInspirations.length > 0 ? (
                  <div className="space-y-2.5 pt-2">
                    {selectedInspirations.map((title, i) => (
                      <div key={i} className="flex gap-2.5 items-center text-xs bg-white/5 border border-white/10 p-3 rounded-xl">
                        <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
                        <span className="font-semibold text-amber-100">{title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-amber-200/60 text-xs">
                    Please select some look patterns on the left to populate your active styling brief card.
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 text-center">
                  <p className="text-[10px] text-amber-200/80 leading-relaxed font-sans">These choices will automatically be shared with your matched bridal artist to streamline your pre-wedding makeup rehearsal session.</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: BEFORE AFTER PORTRAIT SLIDERS */}
        {activeTab === 'beforeafter' && (
          <motion.div
            id="experience-beforeafter-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Transformation Selector Slider Block (7 Columns) */}
            <div className="lg:col-span-7 bg-white border border-amber-200/40 rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-serif text-slate-900 font-medium">Bridal Artistry Editorial Transforming</h3>
                <span className="text-[10px] font-mono bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">High Fidelity Showroom</span>
              </div>

              {/* Slider image view container */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border shadow-inner flex items-center justify-center">
                <img
                  src={showBefore ? LOOKS[activeLookIndex].before : LOOKS[activeLookIndex].after}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Transformation"
                />

                {/* Left/Right controls */}
                <div className="absolute inset-x-4 bottom-4 flex justify-between items-center">
                  <button
                    onClick={() => setShowBefore(!showBefore)}
                    className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 hover:bg-slate-900 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                    <span>View: {showBefore ? 'After Look' : 'Before Look'}</span>
                  </button>

                  <span className="bg-slate-900/80 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-xl text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                    {showBefore ? '🟢 BASELINE PROFILE' : '🔥 EDITORIAL RESULT'}
                  </span>
                </div>
              </div>

              {/* Look selectors */}
              <div className="flex gap-2">
                {LOOKS.map((look, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveLookIndex(i);
                      setShowBefore(false);
                    }}
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl border transition-all ${
                      activeLookIndex === i 
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {look.title.split(' ')[0]} Look
                  </button>
                ))}
              </div>
            </div>

            {/* Look Details (5 Columns) */}
            <div className="lg:col-span-5 bg-[#FAF9F6] border border-amber-200/40 rounded-3xl p-6 shadow-md space-y-4">
              <span className="text-[10px] font-mono text-amber-800 uppercase tracking-widest font-semibold block">Look Profile Inclusions</span>
              <h4 className="text-xl font-serif text-slate-900 font-bold">{LOOKS[activeLookIndex].title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">"{LOOKS[activeLookIndex].desc}"</p>

              <div className="space-y-3 pt-3 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Certified Stylist Atelier</span>
                  <span className="font-bold text-slate-800">{LOOKS[activeLookIndex].artist}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Skin Types</span>
                  <span className="font-bold text-slate-800">{LOOKS[activeLookIndex].skinType}</span>
                </div>
              </div>

              <div className="p-3 bg-white border rounded-xl text-[11px] text-slate-500 leading-relaxed">
                ✨ <strong>Editorial Design note:</strong> This transformation represents professional HD camera optimization. Real skin texture is respectfully preserved with no artificial airbrush blurring overlays.
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 3: MONTH countdown GROOMING CALENDAR */}
        {activeTab === 'calendar' && (
          <motion.div
            id="experience-calendar-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MONTHS_PREP.map((item, idx) => (
                <div id={`prep-card-${idx}`} key={idx} className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b pb-2">
                      <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-bold">{item.month}</span>
                      <Calendar className="w-4 h-4 text-amber-800" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Focus: {item.focus}</p>
                    
                    <div className="space-y-2">
                      {item.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider text-center mt-6 py-1 rounded bg-amber-50 border border-amber-200/20">
                    Status: Tracked
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  );
}
