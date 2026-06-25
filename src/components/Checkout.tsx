/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CreditCard, Landmark, QrCode, CheckCircle, Sparkles, Receipt, X } from 'lucide-react';
import { Package, Vendor } from '../types';

interface CheckoutProps {
  packageData: Package;
  vendor: Vendor;
  bookingDate: string;
  timeSlot: string;
  onPaymentSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export default function Checkout({
  packageData,
  vendor,
  bookingDate,
  timeSlot,
  onPaymentSuccess,
  onCancel
}: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [loading, setLoading] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');

  // Pricing math
  const basePrice = packageData.price;
  const platformFee = Math.round(basePrice * 0.015); // 1.5% VowGlow premium fee
  const luxuryTax = Math.round(basePrice * 0.12); // 12% luxury styling tax
  const totalAmount = basePrice + platformFee + luxuryTax;

  // Mock Card fields
  const [cardNumber, setCardNumber] = useState('4532 7182 9901 2451');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('883');
  const [cardName, setCardName] = useState('Pranathi Reddy');

  const handlePayNow = () => {
    setShowRazorpayModal(true);
    setStep('processing');
    
    // Simulate Razorpay secure modal popup and webhook processing
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const handleFinalizeBooking = () => {
    setShowRazorpayModal(false);
    // Generate a beautiful mock payment ID
    const randomPayId = 'pay_VG_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    onPaymentSuccess(randomPayId);
  };

  return (
    <div id="checkout-container" className="py-8 max-w-5xl mx-auto px-4">
      
      {/* HEADER NAVIGATION & SUMMARY */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">Atelier Secure Gateway</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-medium">Luxury Checkout Atelier</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold tracking-wider uppercase border-b border-transparent hover:border-slate-800 transition-all"
        >
          ← Cancel & Reconfigure
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ORDER SUMMARY & PAYMENT CHOICES (7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order Details Confirmation */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-serif text-slate-900 font-medium flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Receipt className="w-5 h-5 text-amber-800" />
              <span>Confirm Appointment Package</span>
            </h3>

            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                <img src={packageData.image} className="w-full h-full object-cover" alt="Package" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-amber-800 font-mono tracking-wider uppercase">{vendor.name}</p>
                <h4 className="text-base font-serif font-bold text-slate-900">{packageData.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{packageData.description}</p>
                <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{packageData.duration}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
              <div>
                <p className="text-slate-400 font-mono text-[10px] uppercase">Wedding Event Date</p>
                <p className="font-bold text-slate-800 mt-0.5 font-serif">{bookingDate}</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono text-[10px] uppercase">Assigned Time Slot</p>
                <p className="font-bold text-slate-800 mt-0.5">{timeSlot}</p>
              </div>
            </div>
          </div>

          {/* Secure Payment Selection */}
          <div className="bg-white border border-amber-200/40 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-lg font-serif text-slate-900 font-medium border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Select Secure Payment Method</span>
            </h3>

            {/* Method options row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-50/50 border-amber-400 text-amber-950 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-800" />
                <span className="text-[10px] font-mono tracking-widest uppercase">UPI / QR Scan</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-amber-50/50 border-amber-400 text-amber-950 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-800" />
                <span className="text-[10px] font-mono tracking-widest uppercase">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-amber-50/50 border-amber-400 text-amber-950 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Landmark className="w-5 h-5 text-amber-800" />
                <span className="text-[10px] font-mono tracking-widest uppercase">Net Banking</span>
              </button>
            </div>

            {/* Method Inputs dynamically */}
            {paymentMethod === 'upi' && (
              <div id="payment-choice-upi" className="p-4 bg-slate-50 border rounded-2xl space-y-4 text-center">
                <div className="max-w-[120px] aspect-square bg-white border border-slate-200 p-2 rounded-xl mx-auto flex items-center justify-center shadow-inner">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=vowglow-payments" className="w-full h-full object-contain" alt="Mock QR" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800">Scan QR Code or enter VPA</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">Use BHIM, GPay, PhonePe, or Paytm. VowGlow runs fully verified instant checkout escrow systems.</p>
                </div>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    defaultValue="reddy.pranathi@okhdfcbank"
                    className="flex-1 px-3 py-2 border rounded-xl bg-white text-xs text-slate-700 font-mono font-semibold"
                  />
                  <button className="px-4 bg-[#1a1a1a] text-white text-[10px] font-bold tracking-widest uppercase rounded-xl">Verify</button>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div id="payment-choice-card" className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Card Holder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-mono font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Expiration</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-mono font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div id="payment-choice-netbanking" className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Bank Atelier</p>
                <select className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                  <option>HDFC Bank Private Banking</option>
                  <option>ICICI Bank Royal Crest</option>
                  <option>State Bank of India (HNW)</option>
                  <option>Axis Bank Prestige</option>
                </select>
                <p className="text-[10px] text-slate-400">You will be redirected securely to your bank portal after checking out.</p>
              </div>
            )}

            <button
              id="checkout-pay-submit"
              onClick={handlePayNow}
              className="w-full py-3.5 bg-gradient-to-r from-amber-800 to-amber-950 hover:brightness-110 active:scale-[0.98] transition-all text-white rounded-xl text-xs font-semibold tracking-widest uppercase shadow-lg shadow-amber-950/10 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-amber-300" />
              <span>Verify & Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: TAXES & INVOICE BREAKDOWN (5 COLUMNS) */}
        <div className="lg:col-span-5 bg-white border border-amber-300 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
          
          {/* Subtle Gilded background elements to make the invoice look incredibly realistic */}
          <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-amber-500/5 border border-amber-500/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-amber-500/5 border border-dashed border-amber-500/15 pointer-events-none" />

          <div className="border-b border-amber-200 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-serif text-slate-900 font-medium flex items-center gap-1.5">
              <Receipt className="w-5 h-5 text-amber-800" />
              <span>Royal Atelier Statement</span>
            </h3>
            <span className="text-[9px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Itemized Quote
            </span>
          </div>

          {/* Realistic Itemized Cost Breakdown */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Services Breakup</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Core High-Definition Artistry</span>
                <span className="font-mono text-slate-800 font-semibold">₹{Math.round(basePrice * 0.65).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-slate-600">
                <span>Pre-Wedding Trial Consultation</span>
                <span className="font-mono text-slate-800 font-semibold">₹{Math.round(basePrice * 0.15).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Sari Draping Expert (Helper Fee)</span>
                <span className="font-mono text-slate-800 font-semibold">₹{Math.round(basePrice * 0.12).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                <span>Travel, Kit Sanitization & Logistics</span>
                <span className="font-mono text-slate-800 font-semibold">₹{Math.round(basePrice * 0.08).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-800 font-bold bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>Combined Base Tariff</span>
                <span className="font-mono text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Taxes & Escrow Fees */}
          <div className="space-y-3.5 pt-1 text-xs">
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Government Cess & Platform Levies</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>VowGlow Escrow Clearance Fee (1.5%)</span>
                <span className="font-mono text-slate-800 font-semibold">₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-slate-500">
                <span>Central GST (CGST @ 6%)</span>
                <span className="font-mono text-slate-800 font-semibold">₹{Math.round(luxuryTax / 2).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-500 border-b border-dashed border-slate-200 pb-3">
                <span>State GST (SGST @ 6%)</span>
                <span className="font-mono text-slate-800 font-semibold">₹{Math.round(luxuryTax / 2).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline text-slate-900">
                <div className="space-y-0.5">
                  <span className="text-sm font-serif font-bold block">Total Amount</span>
                  <span className="text-[10px] text-slate-400 font-mono">All-inclusive final quote</span>
                </div>
                <span className="text-xl font-serif font-bold text-amber-950 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Authentic Wax Seal Emblem / Signature stamp */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
            {/* Elegant Signature lines */}
            <div className="space-y-1">
              <div className="font-serif italic text-amber-900 text-sm opacity-80 select-none">
                {vendor.name.split(' ')[0]} Artistry
              </div>
              <div className="w-24 h-[1px] bg-slate-300" />
              <span className="block text-[8px] font-mono text-slate-400 uppercase">Director Signature</span>
            </div>

            {/* Custom SVG luxury wax seal stamps */}
            <div className="relative flex-shrink-0 group">
              <div className="absolute inset-0 bg-red-800/10 rounded-full blur-sm scale-110" />
              <svg className="w-14 h-14 text-red-800 drop-shadow-md select-none transform hover:rotate-6 transition-transform" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="42" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2 2" className="opacity-70" />
                <path d="M35,50 C35,38 65,38 65,50 C65,62 35,62 35,50 Z" fill="none" stroke="#FBBF24" strokeWidth="2" />
                <path d="M42,42 L58,58 M58,42 L42,58" stroke="#FBBF24" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="8" fill="#991B1B" stroke="#FBBF24" strokeWidth="1" />
                <text x="50" y="22" fill="#FBBF24" fontSize="6.5" textAnchor="middle" fontWeight="bold" fontFamily="serif" letterSpacing="1">VOWGLOW</text>
                <text x="50" y="85" fill="#FBBF24" fontSize="6.5" textAnchor="middle" fontWeight="bold" fontFamily="serif" letterSpacing="1">SECURE ESCROW</text>
              </svg>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2 text-xs text-emerald-800 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold font-serif uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Escrow Protected Payment</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Your payment will be secured in the VowGlow wedding escrow vault. Funds are only cleared for transfer to <strong className="text-amber-950">{vendor.name}</strong> after your wedding/trial services are successfully performed and rated.
            </p>
          </div>
        </div>


      </div>

      {/* RAZORPAY MODAL POPUP DIALOG */}
      <AnimatePresence>
        {showRazorpayModal && (
          <div id="razorpay-popup-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md">
            <motion.div
              id="razorpay-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#FAF9F6] border border-amber-300 rounded-2xl overflow-hidden p-6 md:p-8 shadow-2xl"
            >
              
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                  <img src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=50&auto=format&fit=crop&q=80" className="w-5 h-5 object-contain" alt="Razorpay" />
                  <span>Razorpay Verified API</span>
                </div>
                <h4 className="text-xl font-serif text-slate-900 font-semibold">VowGlow Escrow Settlement</h4>
                <p className="text-xs text-slate-400 mt-1">Transaction Ref: VG-RZP-9021</p>
              </div>

              {step === 'processing' ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-12 h-12 rounded-full border-4 border-amber-700 border-t-transparent animate-spin mx-auto" />
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-slate-800">Processing secure UPI checkout...</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">Please do not refresh or close the browser tab. Communicating with bank servers.</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-lg font-serif font-bold text-slate-900">Escrow Authorized Successfully!</h5>
                    <p className="text-xs text-slate-500">₹{totalAmount.toLocaleString('en-IN')} has been authorized. The artist's slots are locked.</p>
                  </div>

                  <button
                    id="razorpay-finalize-btn"
                    onClick={handleFinalizeBooking}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl text-xs font-semibold tracking-widest uppercase hover:brightness-110 shadow-md"
                  >
                    Enter Atelier Dashboard
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
