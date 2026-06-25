/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'bride' | 'vendor' | 'admin';
  avatar?: string;
  phone?: string;
  weddingDate?: string;
  budget?: number;
  location?: string;
  stylePreference?: string;
  skinType?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Bridal Makeup' | 'Hair Styling' | 'Skincare' | 'Spa' | 'Nail Studio' | 'Luxury Salon' | 'Home Service';
  rating: number;
  reviewCount: number;
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  location: string;
  distance: string; // e.g. "2.4 km"
  luxuryLevel: 'Elite' | 'Ultra Premium' | 'Signature' | 'Classic';
  image: string;
  gallery: string[];
  description: string;
  experience: string; // e.g. "8+ Years"
  features: string[]; // e.g. ["Airbrush Makeup", "HD Makeup", "Trial Available"]
  availability: string[]; // e.g. ["2026-06-25", "2026-06-26"]
}

export interface Package {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  price: number;
  duration: string; // e.g. "4 Hours"
  includes: string[];
  image: string;
}

export interface Review {
  id: string;
  vendorId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  tag?: string; // e.g. "South Indian Bride"
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  vendorId: string;
  vendorName: string;
  packageId: string;
  packageTitle: string;
  price: number;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'bride' | 'vendor';
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface AIPlannerInput {
  weddingDate: string;
  budget: number;
  brideStyle: string; // e.g. "Traditional South Indian", "Modern Bollywood Minimalist", "Christian Editorial"
  skinType: string;
  location: string;
  venueType: string; // e.g. "Palace Hotel", "Outdoor Garden", "Lakeside Resort"
  guestCount: number;
  beautyPreferences: string[]; // e.g. ["HD Makeup", "Organic Skincare", "Airbrush"]
}

export interface AIPlannerOutput {
  beautyTimeline: {
    phase: string;
    timeline: string; // e.g. "3 Months Before"
    title: string;
    details: string;
    importance: string; // "High" | "Medium" | "Low"
  }[];
  suggestedPackages: {
    packageId: string;
    vendorId: string;
    vendorName: string;
    title: string;
    price: number;
    reason: string;
  }[];
  budgetPlan: {
    category: string;
    allocatedAmount: number;
    percentage: number;
    tips: string;
  }[];
  checklist: {
    id: string;
    task: string;
    timeframe: string;
    category: string;
    completed: boolean;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'chat' | 'planner' | 'system';
  createdAt: string;
  isRead: boolean;
}

export interface MoodItem {
  id: string;
  type: 'image' | 'color' | 'text';
  content: string; // URL for image, hex code for color, text for text
  x: number;
  y: number;
  rotation?: number;
}
