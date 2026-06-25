/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles, Calendar, Search, ShieldCheck, Star, MapPin, Heart, ArrowRight, Quote } from 'lucide-react';
import { Vendor, Package } from '../types';

interface LandingPageProps {
  onStartPlanning: () => void;
  onExplorePackages: () => void;
  onSelectVendor: (id: string) => void;
  trendingVendors: Vendor[];
  featuredPackages: Package[];
}

export default function LandingPage({
  onStartPlanning,
  onExplorePackages,
  onSelectVendor,
  trendingVendors,
  featuredPackages
}: LandingPageProps) {
  
  const faqs = [
    { q: "How is VowGlow different from a normal salon booking portal?", a: "VowGlow is a specialized AI Wedding Beauty OS designed specifically for high-end bridal beauty planning. We do not just book slots; we map out a bespoke, month-by-month pre-wedding preparation timeline customized to your skin, style, and wedding theme, recommendation packages from Hyderabad's elite artists, and consolidate communications into a single dashboard." },
    { q: "What premium wedding styles are supported by the AI Planner?", a: "Our system natively supports rich heritage looks including Nizam Traditional Telugu, Hyderabadi Royal Khada Dupatta, Sabyasachi Pastel Heritage, Modern Minimalist Temple styling, and Contemporary Editorial. You can customize accents down to Poola Jada flower braiding or heavy kundan jewelry setting." },
    { q: "Is a trial session included in the premium packages?", a: "Yes! Almost all of our Ultra Premium and Elite bridal packages from partners like Aura Bridal Atelier include a comprehensive trial consultation where both hair styling and airbrush makeup are rehearsed." },
    { q: "Can I manage styling packages for my entire bridesmaids crew?", a: "Absolutely. We offer exclusive 'Bridal Party Glow Lounges' where you can bundle full pre-wedding detox treatments, champagne welcomes, sari draping, and professional grooming for your bridesmaids and mother." }
  ];

  return (
    <div id="landing-page" className="w-full">
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative min-h-[90vh] flex items-center justify-center pt-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200/50 rounded-full text-amber-900 font-mono text-[10px] tracking-widest uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>India's Premier Bridal Beauty OS</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-serif text-slate-900 tracking-tight leading-[1.1] font-medium"
            >
              Your Wedding Deserves More Than <span className="italic font-normal text-amber-800">Random Salon Bookings</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-sans"
            >
              Discover, compare, and book your complete bridal beauty experience. Bespoke pre-wedding preparation blueprints, elite artists, and real-time support, powered by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                id="hero-start-planning"
                onClick={onStartPlanning}
                className="px-8 py-4 bg-gradient-to-r from-amber-800 to-amber-950 text-white font-medium rounded-xl text-xs tracking-widest uppercase hover:shadow-xl hover:shadow-amber-950/10 active:scale-95 transition-all flex items-center gap-2 border border-amber-700/30"
              >
                <span>Start AI Planning</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
              <button
                id="hero-explore-packages"
                onClick={onExplorePackages}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-amber-200/60 hover:border-amber-400 text-slate-800 font-medium rounded-xl text-xs tracking-widest uppercase hover:bg-white active:scale-95 transition-all shadow-sm"
              >
                Explore Luxury Packages
              </button>
            </motion.div>
          </div>

          {/* Luxury Floating Cinematic Imagery & Glass Cards */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[400px] aspect-[4/5]"
            >
              {/* Outer Golden Geometric Frame */}
              <div className="absolute inset-4 border-2 border-amber-300/30 rounded-2xl transform rotate-3 pointer-events-none" />
              <div className="absolute inset-4 border border-amber-400/20 rounded-2xl transform -rotate-2 pointer-events-none" />
              
              {/* Core Hero Image: Editorial Indian Bride styling */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-amber-100/50">
                <img
                  src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80"
                  alt="Elegant Indian Bride"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[4000ms]"
                />
                {/* Velvet Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/10" />
              </div>

              {/* Floating Glassmorphism Cards for Startup Appeal */}
              <motion.div
                initial={{ x: 30, y: 30, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-6 -left-8 right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-amber-200/50 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-200">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
                      alt="Artist" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-serif text-slate-900 font-medium">Aura Bridal Atelier</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] text-slate-500 font-semibold">4.9 (240 Elite Reviews)</span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full text-amber-900 font-medium tracking-wider uppercase">Jubilee Hills</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -top-6 -right-6 p-3 bg-gradient-to-br from-amber-800 to-amber-950 text-white rounded-xl shadow-lg border border-amber-700/30 flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>AI Matching Live</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">The VowGlow Blueprint</h2>
          <h3 className="text-3xl md:text-4xl font-serif text-slate-900 font-medium">Crafting Your Perfect Beauty Journey</h3>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">Four sophisticated stages designed to take the chaos out of pre-wedding beauty preparations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'AI Consultation',
              desc: 'Enter your date, Hyderabad venue, wedding outfits, skin type, and style preferences. Our AI designs your custom beauty planner.',
              icon: Sparkles
            },
            {
              step: '02',
              title: 'Compare Packages',
              desc: 'Filter 50+ elite, hand-curated multi-day bridal packages based on ratings, distance, luxury tier, and explicit inclusions.',
              icon: Search
            },
            {
              step: '03',
              title: 'Secure Booking',
              desc: 'Lock in your dates with a single, secure reservation. We guarantee date availability and handle all artist conflict management.',
              icon: Calendar
            },
            {
              step: '04',
              title: 'Track Timeline',
              desc: 'Use your dashboard to track skin treatments, coordinate trials, chat directly with your stylists, and check off pre-wedding prep.',
              icon: ShieldCheck
            }
          ].map((item, idx) => (
            <motion.div
              id={`how-step-${idx}`}
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-6 bg-white border border-amber-200/30 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300/60 transition-all group"
            >
              <div className="absolute top-4 right-4 text-3xl font-serif font-light text-amber-200 group-hover:text-amber-400 transition-colors">{item.step}</div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-amber-800" />
              </div>
              <h4 className="text-lg font-serif text-slate-900 font-medium mb-2">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING BRIDAL ARTISTS */}
      <section id="trending-artists" className="py-20 bg-amber-50/30 border-y border-amber-200/20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">Featured Artists</span>
              <h3 className="text-3xl font-serif text-slate-900 font-medium">Trending Hyderabad Bridal Artists</h3>
              <p className="text-slate-500 text-sm max-w-lg">Hand-picked salons and elite freelance stylists specialized in Nizami and modern heritage wedding makeovers.</p>
            </div>
            <button
              id="view-all-artists"
              onClick={onExplorePackages}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-white border border-amber-200/50 text-slate-800 font-medium rounded-xl text-xs tracking-wider uppercase hover:border-amber-400 hover:bg-amber-50/30 transition-all inline-flex items-center gap-1.5"
            >
              <span>Browse All Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingVendors.map((vendor, idx) => (
              <motion.div
                id={`trending-artist-card-${vendor.id}`}
                key={vendor.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelectVendor(vendor.id)}
                className="bg-white rounded-2xl border border-amber-200/40 shadow-sm hover:shadow-xl hover:border-amber-300/80 transition-all overflow-hidden cursor-pointer group flex flex-col h-full"
              >
                {/* Image header */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Luxury tag overlay */}
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-700 to-amber-900 border border-amber-600/30 text-[9px] text-amber-100 font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg shadow-md font-semibold">
                    {vendor.luxuryLevel}
                  </span>
                  <button className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm hover:bg-white text-rose-500 rounded-full shadow transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded-full">{vendor.category}</span>
                      <div className="flex items-center gap-1 font-semibold text-xs text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{vendor.rating}</span>
                        <span className="text-slate-400">({vendor.reviewCount})</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-serif text-slate-900 group-hover:text-amber-900 transition-colors font-medium mb-1">{vendor.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>{vendor.location}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{vendor.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Luxury Tier</p>
                      <p className="text-xs text-amber-950 font-bold tracking-widest mt-0.5">{vendor.priceRange} Premium</p>
                    </div>
                    <span className="text-xs text-amber-800 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                      <span>Reserve Spot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREMIUM MOOD & PACKAGES */}
      <section id="featured-packages" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">Exquisite Bundles</span>
          <h3 className="text-3xl md:text-4xl font-serif text-slate-900 font-medium">Bespoke Bridal Packages</h3>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">Curated multiple-day programs delivering elite aesthetic results from pre-wedding glow to reception final set.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPackages.map((pkg, idx) => (
            <motion.div
              id={`featured-pkg-card-${pkg.id}`}
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-amber-200/30 overflow-hidden shadow-sm flex flex-col justify-between group h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-amber-300 mb-0.5">{pkg.vendorName}</p>
                  <h4 className="text-base font-serif font-medium line-clamp-1">{pkg.title}</h4>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                    <span className="bg-slate-100 px-2 py-1 rounded">{pkg.duration}</span>
                    <span className="font-semibold text-slate-700">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">{pkg.description}</p>
                  
                  <div className="space-y-1.5 mb-4">
                    <p className="text-[10px] font-bold text-amber-900 tracking-wider uppercase font-mono">Includes:</p>
                    {pkg.includes.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  id={`pkg-book-${pkg.id}`}
                  onClick={() => onSelectVendor(pkg.vendorId)}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100/60 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all"
                >
                  Configure Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. SUCCESS STORIES (WEDDING CARD STYLE) */}
      <section id="testimonials" className="py-20 bg-[#FAF9F6] border-t border-amber-200/20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">VowGlow Love</span>
            <h3 className="text-3xl font-serif text-slate-900 font-medium">Breathtaking Transformations</h3>
          </div>

          <div className="bg-white border border-amber-200/50 p-8 md:p-12 rounded-3xl shadow-xl relative">
            <div className="absolute top-6 left-6 text-amber-100 pointer-events-none">
              <Quote className="w-16 h-16 transform -scale-x-100 opacity-60" />
            </div>
            
            <div className="text-center space-y-6 relative z-10">
              <p className="text-base sm:text-lg md:text-xl font-serif text-slate-800 italic leading-relaxed">
                "Finding my bridal stylist in Jubilee Hills was so chaotic before VowGlow. The AI planning blueprint plotted my monthly treatments perfectly. When the day came, Aura Bridal Atelier executed the Nizami Telugu look beyond my wildest dreams. The sweat-proof base didn't budge at all. It is literally funded-quality wedding tech!"
              </p>
              
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-200">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Pranathi Reddy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-serif text-slate-900 font-medium text-base">Pranathi Reddy</h5>
                  <p className="text-[10px] text-amber-800 tracking-wider font-mono uppercase">Luxury Hyderabad Bride, Oct 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faqs" className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-mono text-amber-800 uppercase tracking-widest font-semibold">Atelier Knowledge</span>
          <h3 className="text-3xl font-serif text-slate-900 font-medium">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div id={`faq-item-${idx}`} key={idx} className="p-6 bg-white border border-amber-200/20 rounded-2xl shadow-sm space-y-2">
              <h4 className="text-base sm:text-lg font-serif text-slate-900 font-medium">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
