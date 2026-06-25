/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, Calendar, MessageSquare, ShieldCheck, Clock, Check, ChevronRight, X, Heart, Sparkles } from 'lucide-react';
import { Vendor, Package, Review } from '../types';

interface VendorProfileViewProps {
  vendor: Vendor;
  packages: Package[];
  reviews: Review[];
  onInitiateBooking: (pkg: Package, date: string, timeSlot: string) => void;
  onSendMessage: (msg: string) => void;
  onBack: () => void;
}

export default function VendorProfileView({
  vendor,
  packages,
  reviews,
  onInitiateBooking,
  onSendMessage,
  onBack
}: VendorProfileViewProps) {
  const [selectedImage, setSelectedImage] = useState(vendor.image);
  const [activeTab, setActiveTab] = useState<'packages' | 'reviews'>('packages');
  
  // Chat Overlay state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessageText, setChatMessageText] = useState('');
  const [messageSentConfirmation, setMessageSentConfirmation] = useState(false);

  // Booking Modal state
  const [bookingModalPkg, setBookingModalPkg] = useState<Package | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-18');
  const [bookingSlot, setBookingSlot] = useState('10:00 AM - 02:00 PM');

  const TIME_SLOTS = [
    '06:00 AM - 09:00 AM (Early Muhurtham)',
    '10:00 AM - 02:00 PM (Main Wedding)',
    '03:00 PM - 06:00 PM (Sangeet/Reception)',
    '07:00 PM - 10:00 PM (Evening Cocktail)'
  ];

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;
    onSendMessage(chatMessageText);
    setChatMessageText('');
    setMessageSentConfirmation(true);
    setTimeout(() => {
      setMessageSentConfirmation(false);
      setShowChatModal(false);
    }, 2500);
  };

  const triggerOpenBookingModal = (pkg: Package) => {
    setBookingModalPkg(pkg);
  };

  const handleConfirmBookingInModal = () => {
    if (!bookingModalPkg) return;
    onInitiateBooking(bookingModalPkg, bookingDate, bookingSlot);
    setBookingModalPkg(null);
  };

  return (
    <div id="vendor-profile-view" className="py-8 max-w-7xl mx-auto px-4">
      {/* Back navigation */}
      <button
        id="profile-back-btn"
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white border border-amber-200/50 hover:border-amber-400 text-slate-800 text-xs font-semibold rounded-xl tracking-wider uppercase transition-all"
      >
        ← Back to Discovery
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* GALLERY & PROFILE DETAILS (LEFT 7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Card & Gallery */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-5 shadow-lg space-y-4">
            
            {/* Core Image Display */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={selectedImage}
                alt={vendor.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-700 to-amber-900 border border-amber-600/30 text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg shadow font-semibold">
                {vendor.luxuryLevel} Tier
              </span>
            </div>

            {/* Thumbnail Selection */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedImage(vendor.image)}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedImage === vendor.image ? 'border-amber-800' : 'border-transparent'
                }`}
              >
                <img src={vendor.image} className="w-full h-full object-cover" alt="Thumbnail" />
              </button>
              {vendor.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img ? 'border-amber-800' : 'border-transparent'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail-${i}`} />
                </button>
              ))}
            </div>

            {/* Profile Info */}
            <div className="space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-medium tracking-tight">{vendor.name}</h2>
                <div className="flex items-center gap-2">
                  <button
                    id="profile-chat-btn"
                    onClick={() => setShowChatModal(true)}
                    className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 rounded-xl transition-all shadow-sm"
                    title="Send Inquiry Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 rounded-xl transition-all shadow-sm">
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{vendor.category}</span>
                <span>•</span>
                <div className="flex items-center gap-0.5 font-semibold text-slate-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{vendor.rating}</span>
                  <span className="text-slate-400 font-normal">({vendor.reviewCount} Reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{vendor.location}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-2 border-t border-slate-50">{vendor.description}</p>
            </div>

            {/* Highlights bullet badges */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              {vendor.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-amber-800" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

          </div>

          {/* TABBED INTERFACE: PACKAGES VS REVIEWS */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-5 shadow-lg">
            <div className="flex border-b border-slate-100 mb-6">
              <button
                id="tab-packages"
                onClick={() => setActiveTab('packages')}
                className={`flex-1 pb-3 text-xs font-semibold tracking-widest uppercase border-b-2 transition-all ${
                  activeTab === 'packages' 
                    ? 'border-amber-800 text-amber-950 font-bold' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Bridal Packages ({packages.length})
              </button>
              <button
                id="tab-reviews"
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 pb-3 text-xs font-semibold tracking-widest uppercase border-b-2 transition-all ${
                  activeTab === 'reviews' 
                    ? 'border-amber-800 text-amber-950 font-bold' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Bride Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab: Packages */}
            {activeTab === 'packages' && (
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div
                    id={`profile-pkg-${pkg.id}`}
                    key={pkg.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/10 transition-all grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="md:col-span-3 aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 border">
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="md:col-span-6 space-y-1">
                      <h4 className="text-sm sm:text-base font-serif font-semibold text-slate-900">{pkg.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{pkg.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{pkg.duration}</span>
                        <span>•</span>
                        <span>{pkg.includes.length} major features</span>
                      </div>
                    </div>
                    <div className="md:col-span-3 text-right space-y-2">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-mono">All Inclusions</p>
                        <p className="text-sm font-bold text-slate-800 font-mono">₹{pkg.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        id={`profile-book-pkg-${pkg.id}`}
                        onClick={() => triggerOpenBookingModal(pkg)}
                        className="w-full py-2 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div id={`profile-review-${rev.id}`} key={rev.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-200">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-amber-100/60 px-2 py-0.5 rounded-lg text-xs font-semibold text-slate-800 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    {rev.tag && (
                      <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase font-mono">
                        #{rev.tag}
                      </span>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* BOOKING CALENDAR & INQUIRIES (RIGHT 5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Availability Block */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md text-center space-y-4">
            <h3 className="text-lg font-serif text-slate-900 font-medium border-b border-slate-100 pb-3 flex items-center justify-center gap-1.5">
              <Calendar className="w-5 h-5 text-amber-800" />
              <span>Atelier Date Availability</span>
            </h3>
            <p className="text-xs text-slate-500">This artist has guaranteed date-lock schedules via VowGlow for Hyderabad's upcoming wedding seasons.</p>
            
            <div className="grid grid-cols-3 gap-2.5">
              {vendor.availability.slice(0, 9).map((dateStr, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-amber-200/40 bg-amber-50/10 text-center space-y-0.5"
                >
                  <p className="text-[9px] font-bold text-slate-400 font-mono">OCTOBER</p>
                  <p className="text-sm font-bold text-amber-950 font-serif">{15 + i}</p>
                  <span className="text-[8px] bg-emerald-50 text-emerald-800 px-1 py-0.2 rounded font-mono uppercase tracking-wider">Slots Ok</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-left text-[11px] text-slate-500 leading-relaxed">
              👑 <strong>VowGlow Guarantee:</strong> If this vendor is booked or has a date conflict, our team will coordinate equivalent top-tier Hyderabad artists or fully refund your deposit.
            </div>
          </div>

          {/* Luxury Decal Certificate */}
          <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-amber-100 border border-amber-700/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
              <Sparkles className="w-32 h-32" />
            </div>
            
            <div className="space-y-4 relative z-10 text-center">
              <h4 className="text-lg font-serif text-amber-200 font-medium">Verified Ultra Premium Atelier</h4>
              <p className="text-xs text-amber-200/80 leading-relaxed">This business utilizes 100% genuine luxury international cosmetics, provides dedicated fully private VIP bridal trials, and is certified for authentic Nizam and South Indian wedding styling.</p>
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono tracking-widest text-amber-300 font-semibold uppercase">
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>VowGlow Quality Guarantee</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CHAT INQUIRY MODAL OVERLAY */}
      {showChatModal && (
        <div id="chat-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm">
          <div id="chat-modal-card" className="w-full max-w-md bg-[#FAF9F6] border border-amber-200 rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowChatModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-300 mx-auto mb-2">
                <img src={vendor.image} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-base font-serif font-semibold text-slate-900">Direct Message: {vendor.name}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Response typically within 5 mins</p>
            </div>

            {messageSentConfirmation ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Message dispatched to artist!</p>
                <p className="text-xs text-slate-500">The simulated messaging script will auto-respond in your chat inbox in 2 seconds.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                <textarea
                  required
                  rows={4}
                  placeholder={`Hi ${vendor.name}! I am looking for makeup styling for my Telugu wedding on Oct 18. Do you have slots available for trials?`}
                  value={chatMessageText}
                  onChange={(e) => setChatMessageText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-xs bg-white resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-900 text-white rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-amber-950"
                >
                  Dispatch Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* APPOINTMENT BOOKING CONFIGURE MODAL */}
      {bookingModalPkg && (
        <div id="booking-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm">
          <div id="booking-modal-card" className="w-full max-w-lg bg-[#FAF9F6] border border-amber-200 rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setBookingModalPkg(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <h4 className="text-lg font-serif text-slate-950 font-semibold border-b pb-2">Configure Wedding Appointment</h4>
              <p className="text-[10px] font-mono text-amber-800 uppercase mt-1">Package: {bookingModalPkg.title}</p>
              <p className="text-[11px] text-slate-500 mt-1">Rate: ₹{bookingModalPkg.price.toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Select Event Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">Select Preferred Time Slot</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-xs bg-white"
                >
                  {TIME_SLOTS.map((slot, i) => (
                    <option key={i} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-[10px] text-amber-950 leading-relaxed space-y-1">
                <p>📍 <strong>Location Details:</strong> {vendor.name} is situated in {vendor.location}.</p>
                <p>💍 <strong>Booking Notice:</strong> After confirming, you can review the invoice, complete the simulated UPI payment, and chat with your assigned artist.</p>
              </div>

              <button
                id="booking-confirm-submit"
                onClick={handleConfirmBookingInModal}
                className="w-full py-3 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-xl text-xs font-semibold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Proceed to Secure Checkout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
