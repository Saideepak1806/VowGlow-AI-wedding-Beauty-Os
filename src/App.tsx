/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, Calendar, User as UserIcon, MessageSquare, Heart, TrendingUp, LogOut, Bell, ShieldCheck, Grid, Layers, ClipboardList, BookOpen } from 'lucide-react';

import LuxuryBackground from './components/LuxuryBackground';
import LandingPage from './components/LandingPage';
import Marketplace from './components/Marketplace';
import VendorProfileView from './components/VendorProfileView';
import AIPlanner from './components/AIPlanner';
import ExperienceLayer from './components/ExperienceLayer';
import ChatInbox from './components/ChatInbox';
import BeautyDashboard from './components/BeautyDashboard';
import VendorDashboard from './components/VendorDashboard';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';

import { User, Vendor, Package, Booking, AIPlannerOutput, Notification, Review } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'landing' | 'discover' | 'planner' | 'experience' | 'conversations' | 'dashboard' | 'vendor-portal'>('landing');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [aiPlannerOutput, setAiPlannerOutput] = useState<AIPlannerOutput | null>(null);

  // Discovery routing
  const [activeVendorId, setActiveVendorId] = useState<string | null>(null);
  const [activeVendorDetail, setActiveVendorDetail] = useState<{ vendor: Vendor; packages: Package[]; reviews: Review[] } | null>(null);

  // Checkout states
  const [checkoutPackage, setCheckoutPackage] = useState<Package | null>(null);
  const [checkoutVendor, setCheckoutVendor] = useState<Vendor | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-18');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM - 02:00 PM');

  // Modal / overlays
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Pre-seed some home page trending data
  const [trendingVendors, setTrendingVendors] = useState<Vendor[]>([]);
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);

  // Initial Boot loader
  useEffect(() => {
    fetchSession();
    fetchVendors();
    fetchPackages();
  }, []);

  // Sync user-specific collections when user changes
  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchNotifications();
    } else {
      setBookings([]);
      setNotifications([]);
    }
  }, [user]);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        if (data.user.role === 'vendor') {
          setActiveTab('vendor-portal');
        } else {
          setActiveTab('dashboard');
        }
      }
    } catch (err) {
      console.error("Failed to read user session", err);
    }
  };

  const fetchVendors = async (filters: any = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/vendors?${queryParams}`);
      const data = await res.json();
      if (res.ok && data.vendors) {
        setVendors(data.vendors);
        setTrendingVendors(data.vendors.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to load vendors", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      if (res.ok && data.packages) {
        setFeaturedPackages(data.packages.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to load packages", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (res.ok && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (res.ok && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleSelectVendor = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/vendors/${vendorId}`);
      const data = await res.json();
      if (res.ok && data.vendor) {
        setActiveVendorDetail(data);
        setActiveVendorId(vendorId);
        setActiveTab('discover'); // Ensure we are on discover screen
      }
    } catch (err) {
      console.error("Failed to load vendor detail", err);
    }
  };

  // Switch role between Bride (Pranathi) and Vendor (Aura Atelier) for rapid prototype testing
  const handleToggleUserRole = async () => {
    const targetUserId = user?.id === 'u-1' ? 'u-vendor' : 'u-1';
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setActiveVendorId(null);
        setActiveVendorDetail(null);
        setCheckoutPackage(null);

        if (data.user.role === 'vendor') {
          setActiveTab('vendor-portal');
        } else {
          setActiveTab('dashboard');
        }
      }
    } catch (err) {
      console.error("Failed to swap user context", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setActiveTab('landing');
    } catch (err) {
      console.error(err);
    }
  };

  // Booking Flow Triggers
  const handleInitiateCheckout = (pkg: Package, date: string, timeSlot: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const foundVendor = vendors.find(v => v.id === pkg.vendorId) || null;
    setCheckoutPackage(pkg);
    setCheckoutVendor(foundVendor);
    setBookingDate(date);
    setBookingTimeSlot(timeSlot);
  };

  const handleCheckoutSuccess = async (paymentId: string) => {
    if (!checkoutPackage || !checkoutVendor) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: checkoutVendor.id,
          packageId: checkoutPackage.id,
          date: bookingDate,
          timeSlot: bookingTimeSlot,
          paymentMethod: 'UPI Verified'
        })
      });
      const data = await res.json();

      if (res.ok) {
        // Reset checkout
        setCheckoutPackage(null);
        setCheckoutVendor(null);
        setActiveVendorId(null);
        setActiveVendorDetail(null);

        // Fetch latest state
        fetchBookings();
        fetchNotifications();

        // Redirect to active dashboard
        setActiveTab('dashboard');
      } else {
        alert(data.error || "Booking transaction failed. Conflict detected.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) {
        fetchBookings();
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/read', { method: 'PUT' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LuxuryBackground>
      
      {/* 1. BRAND GLOBAL HEADER */}
      <header id="global-header" className="sticky top-1.5 inset-x-0 z-40 bg-white/70 backdrop-blur-md border-b border-amber-200/20 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand title */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-white shadow shadow-amber-950/20 group-hover:rotate-6 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200/30" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-semibold tracking-wider text-slate-900 leading-tight">VowGlow</h1>
              <p className="text-[9px] font-mono tracking-widest text-amber-800 uppercase leading-none font-bold">Bridal Beauty OS</p>
            </div>
          </div>

          {/* MAIN DESKTOP NAVIGATION TABS */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => { setActiveTab('discover'); setActiveVendorId(null); }}
              className={`px-3.5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                activeTab === 'discover' ? 'bg-amber-50 text-amber-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Atelier Discovery
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                activeTab === 'planner' ? 'bg-amber-50 text-amber-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              AI Planner
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3.5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                activeTab === 'experience' ? 'bg-amber-50 text-amber-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Experience Room
            </button>
            {user && user.role !== 'vendor' && (
              <>
                <button
                  onClick={() => setActiveTab('conversations')}
                  className={`px-3.5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                    activeTab === 'conversations' ? 'bg-amber-50 text-amber-950' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                    activeTab === 'dashboard' ? 'bg-amber-50 text-amber-950' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Bride Suite
                </button>
              </>
            )}
            {user && user.role === 'vendor' && (
              <button
                onClick={() => setActiveTab('vendor-portal')}
                className={`px-3.5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                  activeTab === 'vendor-portal' ? 'bg-amber-50 text-amber-950' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Atelier Command
              </button>
            )}
          </nav>

          {/* RIGHT CONTROLS: ROLE TOGGLER, NOTIFICATION BELL, USER PROFILE */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Simulator Tooltip Swapper */}
            <button
              onClick={handleToggleUserRole}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-900 to-slate-900 text-[10px] text-amber-200 rounded-lg font-mono uppercase tracking-wider font-semibold shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
              title="Swaps roles immediately between Bride and Salon Artist to test full-stack flows."
            >
              <span>Switch: {user?.role === 'vendor' ? '👰 Bride View' : '💅 Salon View'}</span>
            </button>

            {/* Notifications panel bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationsDropdown(!showNotificationsDropdown);
                    if (!showNotificationsDropdown) {
                      handleMarkNotificationsRead();
                    }
                  }}
                  className="p-2 text-slate-500 hover:text-amber-950 bg-slate-50 hover:bg-amber-50 border border-slate-100 rounded-xl transition-all relative"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notifications list dropdown */}
                <AnimatePresence>
                  {showNotificationsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-3 z-50 text-xs text-slate-700 divide-y divide-slate-50 space-y-2 max-h-[350px] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between pb-2">
                        <span className="font-serif font-bold text-slate-900">Atelier In-App Logs</span>
                        <span className="text-[9px] font-mono text-slate-400">Live feed</span>
                      </div>
                      
                      <div className="space-y-1.5 pt-2">
                        {notifications.length > 0 ? (
                          notifications.map((notif, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                              <p className="font-semibold text-slate-800 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>{notif.title}</span>
                              </p>
                              <p className="text-[11px] text-slate-500 leading-tight">{notif.message}</p>
                              <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center text-slate-400">No active alerts.</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile Sign-in or Account profile indicator */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-300">
                  <img src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="User" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"
                  title="Sign out of Atelier OS"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-lg text-xs font-semibold tracking-widest uppercase shadow shadow-amber-900/10 hover:brightness-110 active:scale-95 transition-all"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </header>

      {/* 2. DYNAMIC VIEW SWAPPER ROUTER ENGINE */}
      <main id="applet-viewport-main" className="pb-16">
        <AnimatePresence mode="wait">
          
          {/* A. CHECKOUT VIEW COVERS PORTAL REGION */}
          {checkoutPackage && checkoutVendor ? (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <Checkout
                packageData={checkoutPackage}
                vendor={checkoutVendor}
                bookingDate={bookingDate}
                timeSlot={bookingTimeSlot}
                onPaymentSuccess={handleCheckoutSuccess}
                onCancel={() => { setCheckoutPackage(null); setCheckoutVendor(null); }}
              />
            </motion.div>
          ) : (
            <>
              {/* B. LANDING HOME SCREEN */}
              {activeTab === 'landing' && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LandingPage
                    onStartPlanning={() => setActiveTab('planner')}
                    onExplorePackages={() => setActiveTab('discover')}
                    onSelectVendor={handleSelectVendor}
                    trendingVendors={trendingVendors}
                    featuredPackages={featuredPackages}
                  />
                </motion.div>
              )}

              {/* C. MARKETPLACE DISCOVERY AND DETAIL */}
              {activeTab === 'discover' && (
                <motion.div
                  key="discover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {activeVendorId && activeVendorDetail ? (
                    <VendorProfileView
                      vendor={activeVendorDetail.vendor}
                      packages={activeVendorDetail.packages}
                      reviews={activeVendorDetail.reviews}
                      onInitiateBooking={handleInitiateCheckout}
                      onSendMessage={(msg) => {
                        // Automatically push to chat logs
                        fetch(`/api/chats`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ receiverId: activeVendorDetail.vendor.id, message: msg })
                        });
                      }}
                      onBack={() => { setActiveVendorId(null); setActiveVendorDetail(null); }}
                    />
                  ) : (
                    <Marketplace
                      vendors={vendors}
                      onSelectVendor={handleSelectVendor}
                      onFilterChange={fetchVendors}
                    />
                  )}
                </motion.div>
              )}

              {/* D. AI PLANNER SYSTEM */}
              {activeTab === 'planner' && (
                <motion.div
                  key="planner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AIPlanner
                    onPlanComplete={(output) => setAiPlannerOutput(output)}
                    onSelectPackage={(pkgId, vendorId) => {
                      // Lookup package in database
                      const pkg = featuredPackages.find(p => p.id === pkgId);
                      if (pkg) {
                        handleInitiateCheckout(pkg, '2026-10-18', '10:00 AM - 02:00 PM');
                      } else {
                        // Fallback lookup
                        handleSelectVendor(vendorId);
                      }
                    }}
                    savedPlanner={aiPlannerOutput}
                  />
                </motion.div>
              )}

              {/* E. INTERACTIVE STYLE EXPERIENCE ROOM */}
              {activeTab === 'experience' && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ExperienceLayer />
                </motion.div>
              )}

              {/* F. CHAT DISCUSSIONS INBOX */}
              {activeTab === 'conversations' && (
                <motion.div
                  key="conversations"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ChatInbox />
                </motion.div>
              )}

              {/* G. BRIDE USER SUITE DASHBOARD */}
              {activeTab === 'dashboard' && user && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BeautyDashboard
                    user={user}
                    bookings={bookings}
                    aiPlannerOutput={aiPlannerOutput}
                    onNavigateToTab={(tab) => setActiveTab(tab as any)}
                    onCancelBooking={handleCancelBooking}
                  />
                </motion.div>
              )}

              {/* H. VENDOR PORTAL COMMAND CONTROL */}
              {activeTab === 'vendor-portal' && user && (
                <motion.div
                  key="vendor-portal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <VendorDashboard
                    bookings={bookings}
                    onUpdateBookingStatus={handleUpdateBookingStatus}
                  />
                </motion.div>
              )}
            </>
          )}

        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div id="mobile-navigation-bar" className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 py-2.5 px-6 flex justify-between items-center lg:hidden shadow-lg">
        <button
          onClick={() => { setActiveTab('discover'); setActiveVendorId(null); }}
          className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
            activeTab === 'discover' ? 'text-amber-800 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Ateliers</span>
        </button>

        <button
          onClick={() => setActiveTab('planner')}
          className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
            activeTab === 'planner' ? 'text-amber-800 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>AI Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
            activeTab === 'experience' ? 'text-amber-800 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Playground</span>
        </button>

        {user && user.role !== 'vendor' && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
              activeTab === 'dashboard' ? 'text-amber-800 font-extrabold' : 'text-slate-400'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Suite</span>
          </button>
        )}

        {user && user.role === 'vendor' && (
          <button
            onClick={() => setActiveTab('vendor-portal')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
              activeTab === 'vendor-portal' ? 'text-amber-800 font-extrabold' : 'text-slate-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Command</span>
          </button>
        )}
      </div>

      {/* AUTHENTICATION OVERLAY */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          if (u.role === 'vendor') {
            setActiveTab('vendor-portal');
          } else {
            setActiveTab('dashboard');
          }
        }}
      />

    </LuxuryBackground>
  );
}
