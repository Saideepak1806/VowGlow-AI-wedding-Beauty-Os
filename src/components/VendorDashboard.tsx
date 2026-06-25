/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, DollarSign, CalendarCheck, FileText, Check, Settings, Send } from 'lucide-react';
import { Booking } from '../types';

interface VendorDashboardProps {
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
}

interface AIInsight {
  summary: string;
  recommendations: string[];
  trendingSearchKeywords: string[];
}

export default function VendorDashboard({ bookings, onUpdateBookingStatus }: VendorDashboardProps) {
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insights, setInsights] = useState<AIInsight | null>(null);

  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  // Fetch AI Growth Insights
  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revenue: totalRevenue,
          totalBookings: bookings.length,
          pendingCount: activeBookings.length,
          packagesPerformance: {
            eliteTier: bookings.filter(b => b.packageTitle.includes('Elite')).length,
            signatureTier: bookings.filter(b => b.packageTitle.includes('Signature') || b.packageTitle.includes('Classic')).length
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setInsights(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [bookings.length]);

  return (
    <div id="vendor-dashboard" className="py-8 max-w-7xl mx-auto px-4">
      
      {/* HEADER HERO */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">Atelier Command Center</span>
          <h2 className="text-3xl font-serif text-slate-900 font-medium">Aura Bridal Atelier OS 👑</h2>
          <p className="text-xs text-slate-500">Manage bridal bookings, track premium revenue, and generate deep client styling insights.</p>
        </div>
        <button
          id="refresh-insights-btn"
          onClick={fetchInsights}
          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold rounded-xl tracking-wider uppercase transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Regenerate AI Analytics</span>
        </button>
      </div>

      {/* THREE VALUE METRICS CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/30 flex items-center justify-center text-amber-900">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Gross Premium Revenue</span>
            <span className="text-2xl font-serif text-slate-900 font-bold mt-1">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/30 flex items-center justify-center text-amber-900">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Total Brides Serviced</span>
            <span className="text-2xl font-serif text-slate-900 font-bold mt-1">{bookings.length} Brides</span>
          </div>
        </div>

        <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Pending Consultations</span>
            <span className="text-2xl font-serif text-slate-900 font-bold mt-1">{activeBookings.length} Inquiries</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: BOOKINGS LIST (7 COLUMNS) */}
        <div className="lg:col-span-7 bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md">
          <h3 className="text-lg font-serif text-slate-900 font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-amber-800" />
            <span>Active Bridal Registry</span>
          </h3>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div id={`vendor-booking-row-${booking.id}`} key={booking.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-serif">{booking.userName}</span>
                      <span className="text-[9px] bg-amber-50 text-amber-800 px-2 py-0.2 rounded font-mono uppercase border border-amber-200/30">Bride</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 leading-tight">{booking.packageTitle}</p>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono pt-1">
                      <div>🗓️ {booking.date}</div>
                      <div>⏰ {booking.timeSlot}</div>
                      <div>💳 ₹{booking.price.toLocaleString('en-IN')}</div>
                      <div>📧 {booking.userEmail}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-col items-stretch sm:min-w-[120px]">
                    {booking.status === 'confirmed' ? (
                      <>
                        <button
                          id={`vendor-complete-booking-${booking.id}`}
                          onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all hover:brightness-110 flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                        <button
                          id={`vendor-cancel-booking-${booking.id}`}
                          onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                          className="px-3 py-1.5 border border-rose-100 hover:border-rose-300 text-rose-600 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-center py-1 rounded bg-slate-200 text-slate-600 border border-slate-300">
                        {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div id="vendor-no-bookings" className="text-center py-12 text-slate-400">
              No active bookings found in your registry.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI MARKET INSIGHTS (5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Advisor Panel */}
          <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-[#FAF9F6] border border-amber-700/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl pointer-events-none" />
            
            <h3 className="text-lg font-serif text-amber-200 font-medium mb-4 flex items-center gap-1.5 border-b border-white/10 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>AI Business Consultant</span>
            </h3>

            {loadingInsights ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-amber-300 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-amber-200/70">Crunching wedding trends in Hyderabad...</p>
              </div>
            ) : insights ? (
              <div className="space-y-5">
                <p className="text-xs leading-relaxed text-amber-100/90 italic">"{insights.summary}"</p>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-mono">Actionable Growth items</p>
                  <div className="space-y-2">
                    {insights.recommendations.map((rec, i) => (
                      <div id={`vendor-insight-rec-${i}`} key={i} className="flex gap-2.5 items-start text-xs bg-white/5 border border-white/10 p-3 rounded-xl">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 font-bold font-mono text-[10px]">
                          {i + 1}
                        </span>
                        <p className="text-amber-100/90 leading-relaxed pt-0.5">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-mono">Trending Hyderabad Searches</p>
                  <div className="flex flex-wrap gap-1.5">
                    {insights.trendingSearchKeywords.map((keyword, i) => (
                      <span key={i} className="bg-white/10 border border-white/5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-amber-200">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <button
                  onClick={fetchInsights}
                  className="px-4 py-2 bg-white text-amber-950 font-bold text-xs rounded-lg uppercase tracking-wider"
                >
                  Load Growth insights
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
