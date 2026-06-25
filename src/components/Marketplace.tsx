/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, MapPin, Star, Sparkles, Filter, ChevronDown } from 'lucide-react';
import { Vendor } from '../types';

interface MarketplaceProps {
  vendors: Vendor[];
  onSelectVendor: (id: string) => void;
  onFilterChange: (filters: any) => void;
}

export default function Marketplace({ vendors, onSelectVendor, onFilterChange }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('All');
  const [luxuryLevel, setLuxuryLevel] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const CATEGORIES = [
    'All', 'Bridal Makeup', 'Hair Styling', 'Skincare', 'Spa', 'Nail Studio', 'Luxury Salon', 'Home Service'
  ];

  const LUXURY_LEVELS = ['All', 'Elite', 'Ultra Premium', 'Signature', 'Classic'];
  const PRICE_RANGES = ['All', '₹', '₹₹', '₹₹₹', '₹₹₹₹'];

  const handleApplyFilters = () => {
    onFilterChange({
      category: selectedCategory,
      search,
      rating: minRating === 'All' ? '' : minRating,
      luxuryLevel: luxuryLevel === 'All' ? '' : luxuryLevel,
      priceRange: priceRange === 'All' ? '' : priceRange
    });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({
      category,
      search,
      rating: minRating === 'All' ? '' : minRating,
      luxuryLevel: luxuryLevel === 'All' ? '' : luxuryLevel,
      priceRange: priceRange === 'All' ? '' : priceRange
    });
  };

  return (
    <div id="marketplace-container" className="py-8 max-w-7xl mx-auto px-4">
      
      {/* HEADER HERO */}
      <div className="mb-10 text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 font-medium">Discover Premium Wedding Artists</h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">Browse Hyderabad's most distinguished beauty sanctuaries, salons, and mobile styling ateliers offering elite wedding services.</p>
      </div>

      {/* SEARCH AND FILTERS PANEL */}
      <div className="bg-white border border-amber-200/40 rounded-3xl p-5 shadow-lg mb-8 space-y-4">
        
        {/* Row 1: Search & Major Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by artist, venue styling, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-400 outline-none rounded-xl text-xs transition-all"
            />
          </div>

          {/* Rating */}
          <div className="md:col-span-2">
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-amber-400 text-slate-700 font-medium"
            >
              <option value="All">⭐ Any Rating</option>
              <option value="4.8">⭐ 4.8+ Exclusive</option>
              <option value="4.5">⭐ 4.5+ Premium</option>
            </select>
          </div>

          {/* Luxury Level */}
          <div className="md:col-span-2">
            <select
              value={luxuryLevel}
              onChange={(e) => setLuxuryLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-amber-400 text-slate-700 font-medium"
            >
              <option value="All">💎 Any Luxury Level</option>
              {LUXURY_LEVELS.filter(l => l !== 'All').map(l => (
                <option key={l} value={l}>{l} Tier</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="md:col-span-2">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-amber-400 text-slate-700 font-medium"
            >
              <option value="All">💳 Any Price Range</option>
              <option value="₹">₹ (Classic)</option>
              <option value="₹₹">₹₹ (Signature)</option>
              <option value="₹₹₹">₹₹₹ (Ultra Premium)</option>
              <option value="₹₹₹₹">₹₹₹₹ (Elite)</option>
            </select>
          </div>

          {/* Apply Button */}
          <div className="md:col-span-2">
            <button
              id="apply-marketplace-filters"
              onClick={handleApplyFilters}
              className="w-full py-2.5 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-xl text-xs font-semibold tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-sm"
            >
              Apply Filters
            </button>
          </div>

        </div>

        {/* Row 2: Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3.5">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>CATEGORIES:</span>
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  id={`chip-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all border ${
                    active
                      ? 'bg-amber-950 border-amber-950 text-[#FAF9F6] font-semibold'
                      : 'bg-[#FAF9F6] border-slate-200 text-slate-600 hover:border-amber-300'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* RESULTS COUNT & META */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-slate-500 font-mono">SHOWING <span className="text-amber-950 font-bold">{vendors.length}</span> ELITE WEDDING VENDORS</p>
        <span className="text-xs text-amber-800 font-mono flex items-center gap-1 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Fully Bookable OS integration</span>
        </span>
      </div>

      {/* ARTISTS GRID */}
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor, idx) => (
            <div
              id={`vendor-item-card-${vendor.id}`}
              key={vendor.id}
              onClick={() => onSelectVendor(vendor.id)}
              className="bg-white rounded-3xl border border-amber-200/40 shadow-sm hover:shadow-xl hover:border-amber-300/80 transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              
              {/* Card visual header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Decals */}
                <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg shadow font-semibold border border-amber-600/20">
                  {vendor.luxuryLevel}
                </span>

                <span className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-slate-800 text-[10px] font-semibold font-mono px-2.5 py-1 rounded-lg">
                  {vendor.experience} EXP
                </span>
              </div>

              {/* Information body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded-full">{vendor.category}</span>
                    <div className="flex items-center gap-0.5 text-xs text-slate-800 font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{vendor.rating}</span>
                      <span className="text-slate-400">({vendor.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-serif text-slate-900 group-hover:text-amber-900 transition-colors font-medium mb-1">{vendor.name}</h3>
                  
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{vendor.location}</span>
                    <span className="text-slate-300">•</span>
                    <span>{vendor.distance}</span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{vendor.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Atelier pricing</span>
                    <span className="text-xs text-amber-950 font-bold tracking-widest uppercase">{vendor.priceRange} Premium</span>
                  </div>
                  <span className="px-4 py-2 bg-slate-50 border border-slate-200 group-hover:bg-amber-950 group-hover:border-amber-950 group-hover:text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all">
                    View Packages
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div id="marketplace-empty-card" className="bg-white border border-amber-200/20 rounded-3xl p-16 text-center shadow-md max-w-md mx-auto space-y-4">
          <Filter className="w-10 h-10 text-amber-200 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-lg font-serif text-slate-950 font-medium">No Artists Found</h4>
            <p className="text-xs text-slate-500">We couldn't find any artists fitting those exact filters. Try broadening your location, rating limit, or luxury level parameters.</p>
          </div>
          <button
            id="clear-filters"
            onClick={() => {
              setSelectedCategory('All');
              setSearch('');
              setMinRating('All');
              setLuxuryLevel('All');
              setPriceRange('All');
              onFilterChange({ category: 'All', search: '', rating: '', luxuryLevel: '', priceRange: '' });
            }}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold rounded-lg"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}
