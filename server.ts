/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load seed data
import { VENDORS, PACKAGES, REVIEWS } from './src/data/seedData';
import { User, Booking, ChatMessage, Notification, AIPlannerInput } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database (Durable State while server is running)
let users: User[] = [
  {
    id: 'u-1',
    name: 'Pranathi Reddy',
    email: 'bride@vowglow.com',
    role: 'bride',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98480 22338',
    weddingDate: '2026-10-18',
    budget: 150000,
    location: 'Jubilee Hills, Hyderabad',
    stylePreference: 'Nizam Traditional Telugu Bride',
    skinType: 'Combination'
  },
  {
    id: 'u-vendor',
    name: 'Aura Bridal Atelier',
    email: 'vendor@vowglow.com',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 90000 12345'
  }
];

let bookings: Booking[] = [
  {
    id: 'b-1',
    userId: 'u-1',
    userName: 'Pranathi Reddy',
    userEmail: 'bride@vowglow.com',
    vendorId: 'v-1',
    vendorName: 'Aura Bridal Atelier',
    packageId: 'pkg-1',
    packageTitle: 'The Nizam Royal Empress Ritual 💍 Elite',
    price: 65000,
    date: '2026-10-18',
    timeSlot: '10:00 AM - 02:00 PM',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    paymentStatus: 'paid',
    paymentMethod: 'UPI'
  }
];

let chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'v-1',
    senderName: 'Aura Bridal Atelier',
    senderRole: 'vendor',
    receiverId: 'u-1',
    message: 'Hello Pranathi! Thank you for choosing Aura Bridal Atelier. We have confirmed your spot for October 18th. Would you like to schedule a trial consultation next month?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false
  },
  {
    id: 'msg-2',
    senderId: 'u-1',
    senderName: 'Pranathi Reddy',
    senderRole: 'bride',
    receiverId: 'v-1',
    message: 'Hello! Yes, absolutely. I would love to schedule a trial around September 15th if possible.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isRead: true
  }
];

let notifications: Notification[] = [
  {
    id: 'n-1',
    userId: 'u-1',
    title: 'Booking Confirmed 💍',
    message: 'Your booking with Aura Bridal Atelier is confirmed for Oct 18, 2026.',
    type: 'booking',
    createdAt: new Date().toISOString(),
    isRead: false
  }
];

// Active Session Tracking (Simplified Cookie-less auth)
let currentSessionUser: User | null = users[0]; // Pre-auth as Pranathi Reddy for instant demo experience

// Helper to check for Gemini API key
const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY is not configured or uses placeholder. Using smart response fallback.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/* =========================================
   API ENDPOINTS
   ========================================= */

// AUTHENTICATION API
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, weddingDate, budget, location, stylePreference, skinType } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    name,
    email,
    role: role || 'bride',
    avatar: role === 'vendor' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    weddingDate,
    budget: budget ? Number(budget) : undefined,
    location,
    stylePreference,
    skinType
  };

  users.push(newUser);
  currentSessionUser = newUser;

  // Add welcome notification
  notifications.unshift({
    id: `n-${Date.now()}`,
    userId: newUser.id,
    title: 'Welcome to VowGlow! 💍✨',
    message: 'Start planning your dream wedding beauty timeline with our AI planner.',
    type: 'system',
    createdAt: new Date().toISOString(),
    isRead: false
  });

  res.json({ user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found. Try bride@vowglow.com or register a new one.' });
  }

  currentSessionUser = user;
  res.json({ user });
});

app.post('/api/auth/logout', (req, res) => {
  currentSessionUser = null;
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: currentSessionUser });
});

app.post('/api/auth/switch-user', (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (user) {
    currentSessionUser = user;
    res.json({ user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// VENDOR MARKETPLACE API
app.get('/api/vendors', (req, res) => {
  const { category, search, rating, luxuryLevel, priceRange } = req.query;
  
  let filtered = [...VENDORS];

  if (category && category !== 'All') {
    filtered = filtered.filter(v => v.category === category);
  }

  if (search) {
    const searchStr = String(search).toLowerCase();
    filtered = filtered.filter(v => 
      v.name.toLowerCase().includes(searchStr) || 
      v.location.toLowerCase().includes(searchStr) || 
      v.description.toLowerCase().includes(searchStr)
    );
  }

  if (rating) {
    const minRating = Number(rating);
    filtered = filtered.filter(v => v.rating >= minRating);
  }

  if (luxuryLevel) {
    const level = String(luxuryLevel);
    filtered = filtered.filter(v => v.luxuryLevel === level);
  }

  if (priceRange) {
    const pr = String(priceRange);
    filtered = filtered.filter(v => v.priceRange === pr);
  }

  res.json({ vendors: filtered });
});

app.get('/api/vendors/:id', (req, res) => {
  const { id } = req.params;
  const vendor = VENDORS.find(v => v.id === id);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }

  const vendorPackages = PACKAGES.filter(p => p.vendorId === id);
  const vendorReviews = REVIEWS.filter(r => r.vendorId === id);

  res.json({
    vendor,
    packages: vendorPackages,
    reviews: vendorReviews
  });
});

app.get('/api/packages', (req, res) => {
  res.json({ packages: PACKAGES });
});

// BOOKING MANAGEMENT API
app.get('/api/bookings', (req, res) => {
  if (!currentSessionUser) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  if (currentSessionUser.role === 'vendor') {
    // For our pre-seeded vendor Aura Bridal Atelier, map to its vendorId "v-1"
    const vendorBookings = bookings.filter(b => b.vendorId === 'v-1');
    return res.json({ bookings: vendorBookings });
  }

  const userBookings = bookings.filter(b => b.userId === currentSessionUser!.id);
  res.json({ bookings: userBookings });
});

app.post('/api/bookings', (req, res) => {
  if (!currentSessionUser) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const { vendorId, packageId, date, timeSlot, paymentMethod } = req.body;
  if (!vendorId || !packageId || !date || !timeSlot) {
    return res.status(400).json({ error: 'Missing booking details' });
  }

  const vendor = VENDORS.find(v => v.id === vendorId);
  const pkg = PACKAGES.find(p => p.id === packageId);

  if (!vendor || !pkg) {
    return res.status(404).json({ error: 'Vendor or package not found' });
  }

  // Conflict Check
  const conflict = bookings.find(b => b.vendorId === vendorId && b.date === date && b.timeSlot === timeSlot && b.status === 'confirmed');
  if (conflict) {
    return res.status(400).json({ error: 'This appointment slot is already booked for this bridal artist' });
  }

  const newBooking: Booking = {
    id: `b-${Date.now()}`,
    userId: currentSessionUser.id,
    userName: currentSessionUser.name,
    userEmail: currentSessionUser.email,
    vendorId,
    vendorName: vendor.name,
    packageId,
    packageTitle: pkg.title,
    price: pkg.price,
    date,
    timeSlot,
    status: 'confirmed', // Instantly confirm for rich UX
    createdAt: new Date().toISOString(),
    paymentStatus: paymentMethod ? 'paid' : 'unpaid',
    paymentMethod: paymentMethod || undefined
  };

  bookings.push(newBooking);

  // Send notifications
  notifications.unshift({
    id: `n-${Date.now()}`,
    userId: currentSessionUser.id,
    title: 'Booking Confirmed! 🎉💍',
    message: `Your booking for "${pkg.title}" with ${vendor.name} is scheduled on ${date} at ${timeSlot}.`,
    type: 'booking',
    createdAt: new Date().toISOString(),
    isRead: false
  });

  // Notify simulated vendor
  notifications.unshift({
    id: `n-v-${Date.now()}`,
    userId: 'u-vendor',
    title: 'New Bridal Booking 👑',
    message: `${currentSessionUser.name} booked "${pkg.title}" for ${date}.`,
    type: 'booking',
    createdAt: new Date().toISOString(),
    isRead: false
  });

  // Auto-respond in chat from the artist
  chatMessages.push({
    id: `msg-${Date.now()}`,
    senderId: vendor.id,
    senderName: vendor.name,
    senderRole: 'vendor',
    receiverId: currentSessionUser.id,
    message: `Hi ${currentSessionUser.name}! I received your booking for "${pkg.title}" on ${date}. I am absolutely thrilled to work with you on your wedding day! Feel free to send over any makeup style photos or moodboards you have.`,
    timestamp: new Date().toISOString(),
    isRead: false
  });

  res.json({ booking: newBooking });
});

app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  res.json({ booking });
});

// REALTIME CHAT SYSTEM API
app.get('/api/chats', (req, res) => {
  if (!currentSessionUser) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const { partnerId } = req.query;
  if (partnerId) {
    const messages = chatMessages.filter(m => 
      (m.senderId === currentSessionUser!.id && m.receiverId === partnerId) ||
      (m.senderId === partnerId && m.receiverId === currentSessionUser!.id)
    );
    return res.json({ messages });
  }

  // Get active chat partners
  const activeChatPartnerIds = new Set<string>();
  chatMessages.forEach(m => {
    if (m.senderId === currentSessionUser!.id) activeChatPartnerIds.add(m.receiverId);
    if (m.receiverId === currentSessionUser!.id) activeChatPartnerIds.add(m.senderId);
  });

  const activeChats = Array.from(activeChatPartnerIds).map(pid => {
    const partnerVendor = VENDORS.find(v => v.id === pid);
    const partnerUser = users.find(u => u.id === pid);
    const partnerName = partnerVendor ? partnerVendor.name : (partnerUser ? partnerUser.name : 'Unknown Artist');
    const partnerAvatar = partnerVendor ? partnerVendor.image : (partnerUser ? partnerUser.avatar : undefined);
    
    const lastMsg = [...chatMessages]
      .filter(m => (m.senderId === currentSessionUser!.id && m.receiverId === pid) || (m.senderId === pid && m.receiverId === currentSessionUser!.id))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .pop();

    return {
      partnerId: pid,
      partnerName,
      partnerAvatar,
      lastMessage: lastMsg?.message || '',
      timestamp: lastMsg?.timestamp || new Date().toISOString()
    };
  });

  res.json({ chats: activeChats });
});

app.post('/api/chats', (req, res) => {
  if (!currentSessionUser) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const { receiverId, message } = req.body;
  if (!receiverId || !message) {
    return res.status(400).json({ error: 'Missing receiver or message content' });
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId: currentSessionUser.id,
    senderName: currentSessionUser.name,
    senderRole: currentSessionUser.role === 'vendor' ? 'vendor' : 'bride',
    receiverId,
    message,
    timestamp: new Date().toISOString(),
    isRead: false
  };

  chatMessages.push(newMsg);

  // Trigger automated vendor response for premium interactive simulator feel
  if (currentSessionUser.role === 'bride') {
    const targetVendor = VENDORS.find(v => v.id === receiverId);
    if (targetVendor) {
      setTimeout(() => {
        const autoReplies = [
          "That sounds absolutely lovely! We love working with traditional Telugu silk drapes and adding that modern dewy finish.",
          "I have noted your preferences! We only use high-end international cosmetics like Chanel, Dior, and Estée Lauder to guarantee long-wear.",
          "Could you share a photo of your wedding lehenga/sari and your jewelry? It helps me customize the color palette for your look.",
          "Absolutely! A trial session is highly recommended. It typically takes 2 hours where we test both hair and makeup. Shall we slot you in for next Saturday?",
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        
        chatMessages.push({
          id: `msg-${Date.now() + 1}`,
          senderId: targetVendor.id,
          senderName: targetVendor.name,
          senderRole: 'vendor',
          receiverId: currentSessionUser!.id,
          message: randomReply,
          timestamp: new Date().toISOString(),
          isRead: false
        });
        
        // Notify user of new chat message
        notifications.unshift({
          id: `n-${Date.now() + 2}`,
          userId: currentSessionUser!.id,
          title: `New Message from ${targetVendor.name} 💍`,
          message: randomReply.substring(0, 50) + "...",
          type: 'chat',
          createdAt: new Date().toISOString(),
          isRead: false
        });
      }, 2000);
    }
  }

  res.json({ message: newMsg });
});

// NOTIFICATION API
app.get('/api/notifications', (req, res) => {
  if (!currentSessionUser) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const userNotifs = notifications.filter(n => n.userId === currentSessionUser!.id);
  res.json({ notifications: userNotifs });
});

app.put('/api/notifications/read', (req, res) => {
  if (!currentSessionUser) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  notifications.forEach(n => {
    if (n.userId === currentSessionUser!.id) n.isRead = true;
  });
  res.json({ success: true });
});


// AI BRIDAL PLANNER (GEMINI API DRIVEN)
app.post('/api/planner', async (req, res) => {
  const input: AIPlannerInput = req.body;
  const { weddingDate, budget, brideStyle, skinType, location, venueType, guestCount, beautyPreferences } = input;

  const ai = getGeminiClient();

  const getFallbackPlannerData = () => {
    const fallbackBudgetPlan = [
      { category: 'Bridal Makeup & Hair Styling', allocatedAmount: Math.round(budget * 0.45), percentage: 45, tips: 'Reserve for elite artists. Includes trial and main wedding day drapes.' },
      { category: 'Skincare Prep & Radiance Peels', allocatedAmount: Math.round(budget * 0.25), percentage: 25, tips: 'HydraFacials and chemical peels must begin 3 months prior.' },
      { category: 'Luxury Hair Updos & Extensions', allocatedAmount: Math.round(budget * 0.15), percentage: 15, tips: 'Essential for traditional Telugu hairstyles or heavy bun attachments.' },
      { category: 'Spa Detox & Nail Art Lounge', allocatedAmount: Math.round(budget * 0.15), percentage: 15, tips: 'Schedule 3 days before Sangeet. Great de-stress therapy.' }
    ];

    const fallbackChecklist = [
      { id: 'c1', task: 'Schedule customized skin analysis & begin daily hydration therapy', timeframe: '3 Months Before', category: 'Skincare', completed: false },
      { id: 'c2', task: 'Book your elite VowGlow bridal artist & confirm trial session date', timeframe: '3 Months Before', category: 'Booking', completed: false },
      { id: 'c3', task: 'Trial session for wedding day makeup, sari draping, and hair styling', timeframe: '1 Month Before', category: 'Consultation', completed: false },
      { id: 'c4', task: 'Final HydraFacial glow session & body jasmine scrub spa', timeframe: '1 Week Before', category: 'Spa', completed: false },
      { id: 'c5', task: 'Gel nail art application and luxury pedicure/manicure session', timeframe: '3 Days Before', category: 'Nails', completed: false },
      { id: 'c6', task: 'Get plenty of beauty sleep and stay hydrated prior to Muhurtham', timeframe: '1 Day Before', category: 'Wellness', completed: false }
    ];

    const fallbackTimeline = [
      {
        phase: 'Phase 1: Skin & Booking Blueprint',
        timeline: '3 Months Before',
        title: 'Dermatological Analysis & Premium Sourcing',
        details: `Based on your ${skinType} skin and ${brideStyle} preference, schedule high-intensity HydraFacials. Secure your main bridal artist from VowGlow to avoid peak-season fully-booked scenarios in Hyderabad.`,
        importance: 'High'
      },
      {
        phase: 'Phase 2: Wardrobe & Trial Setting',
        timeline: '1 Month Before',
        title: 'Comprehensive Hair, Saree & Makeup Trials',
        details: `Attend trials wearing similar-colored outfits. Test how the airbrush and HD bases hold against venue lighting at ${venueType}. Coordinate the floral jasmine placements.`,
        importance: 'High'
      },
      {
        phase: 'Phase 3: The Golden Countdown',
        timeline: '1 Week Before',
        title: 'Deep Radiance Hydration & Luxury Spa Scrub',
        details: 'Undergo gentle sandwood scrubs and moisturizing skin wraps. Strictly avoid trying new chemical products this week. Book your gel extensions nail session.',
        importance: 'High'
      },
      {
        phase: 'Phase 4: Sangeet & Saree Glow',
        timeline: '3 Days Before',
        title: 'Glamour Rehearsals & Final Outlining',
        details: 'Review checklist with artist. Stay hydrated. The bridal party should finalize their styling drapes.',
        importance: 'Medium'
      },
      {
        phase: 'Phase 5: The Wedding Day',
        timeline: 'Wedding Day',
        title: 'Muhurtham Grandeur Ceremony Prep',
        details: 'Allow exactly 4.5 hours for the look, sari draping, and flower setting. Arrive with fully dry hair and clear moisturized skin.',
        importance: 'High'
      }
    ];

    // Pick top 2 matches from Hyderabad VENDORS for recommendation
    const recommendedVendors = VENDORS.filter(v => v.category === 'Bridal Makeup' || v.category === 'Luxury Salon').slice(0, 2);
    const recommendedPackages = recommendedVendors.map((v, idx) => {
      const pkg = PACKAGES.find(p => p.vendorId === v.id) || PACKAGES[idx];
      return {
        packageId: pkg.id,
        vendorId: v.id,
        vendorName: v.name,
        title: pkg.title,
        price: pkg.price,
        reason: `Perfectly fits your luxury wedding style "${brideStyle}" with premium ${v.category} expertise located in ${v.location}.`
      };
    });

    return {
      beautyTimeline: fallbackTimeline,
      suggestedPackages: recommendedPackages,
      budgetPlan: fallbackBudgetPlan,
      checklist: fallbackChecklist
    };
  };

  if (!ai) {
    return res.json(getFallbackPlannerData());
  }

  try {
    // Dynamic Prompt with strict context
    const prompt = `Generate a comprehensive, premium wedding beauty OS blueprint plan for a luxury bride launching in Hyderabad, India.
    User Details:
    - Wedding Date: ${weddingDate}
    - Budget: ₹${budget} INR
    - Desired Bride Style: ${brideStyle}
    - Skin Type: ${skinType}
    - Location: ${location}
    - Venue Type: ${venueType}
    - Guest Count: ${guestCount}
    - Specific Beauty Preferences: ${beautyPreferences ? beautyPreferences.join(', ') : 'None'}

    Make sure the response is completely customized, sophisticated, referencing high-end South Indian / Hyderabad styling (like Kanchipuram silk draping, Poola Jada, Hyderabadi pearls, etc.).`;

    const systemInstruction = `You are the lead AI Wedding Grooming Stylist at VowGlow.
    Provide a highly-detailed, luxury wedding beauty planner recommendation plan in strict JSON.
    All prices must be in INR (Indian Rupee) and match the specified budget of ₹${budget}.
    Ensure your recommendations refer explicitly to the Hyderabad wedding culture, venues, and the style of bride selected.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['beautyTimeline', 'suggestedPackages', 'budgetPlan', 'checklist'],
          properties: {
            beautyTimeline: {
              type: Type.ARRAY,
              description: "Phase-by-phase timeline leading up to the wedding",
              items: {
                type: Type.OBJECT,
                required: ['phase', 'timeline', 'title', 'details', 'importance'],
                properties: {
                  phase: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                  title: { type: Type.STRING },
                  details: { type: Type.STRING },
                  importance: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                }
              }
            },
            suggestedPackages: {
              type: Type.ARRAY,
              description: "Selected recommended dummy packages (return 2 items)",
              items: {
                type: Type.OBJECT,
                required: ['packageId', 'vendorId', 'vendorName', 'title', 'price', 'reason'],
                properties: {
                  packageId: { type: Type.STRING },
                  vendorId: { type: Type.STRING },
                  vendorName: { type: Type.STRING },
                  title: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                }
              }
            },
            budgetPlan: {
              type: Type.ARRAY,
              description: "Slices of the budget allocated for beauty",
              items: {
                type: Type.OBJECT,
                required: ['category', 'allocatedAmount', 'percentage', 'tips'],
                properties: {
                  category: { type: Type.STRING },
                  allocatedAmount: { type: Type.NUMBER },
                  percentage: { type: Type.NUMBER },
                  tips: { type: Type.STRING }
                }
              }
            },
            checklist: {
              type: Type.ARRAY,
              description: "Interactive tasks",
              items: {
                type: Type.OBJECT,
                required: ['id', 'task', 'timeframe', 'category', 'completed'],
                properties: {
                  id: { type: Type.STRING },
                  task: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  category: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    
    // Inject actual active packages/vendors matching ids if possible, or just return the output
    parsedData.suggestedPackages = parsedData.suggestedPackages.map((pkg: any, index: number) => {
      // Bind to actual VowGlow database structures for interactive "Book Now" connectivity
      const realVendor = VENDORS[index % VENDORS.length];
      const realPkg = PACKAGES.find(p => p.vendorId === realVendor.id) || PACKAGES[index];
      return {
        packageId: realPkg.id,
        vendorId: realVendor.id,
        vendorName: realVendor.name,
        title: realPkg.title,
        price: realPkg.price,
        reason: pkg.reason || `Highly recommended custom package from ${realVendor.name}`
      };
    });

    res.json(parsedData);
  } catch (err) {
    console.error('Gemini Planner Error, falling back gracefully: ', err);
    res.json(getFallbackPlannerData());
  }
});


// AI INSIGHTS FOR VENDOR DASHBOARD (GEMINI API DRIVEN)
app.post('/api/insights', async (req, res) => {
  const { revenue, totalBookings, pendingCount, packagesPerformance } = req.body;

  const ai = getGeminiClient();

  if (!ai) {
    const fallbackInsights = {
      summary: "Aura Bridal Atelier continues to command premium pricing in Jubilee Hills. June performance is driven by Elite tier packages (65% revenue slice). Keep pushing pre-wedding skincare trials.",
      recommendations: [
        "Create a 'Sangeet Special Add-on' priced at ₹12,000 to bundle with traditional Muhurtham packages to increase average ticket value by 18%.",
        "Offer early-bird trial slot incentives on Tuesdays and Wednesdays to balance out peak weekend bridal rushes.",
        "Highlight your sari-draping specialty on social media, as search traffic for authentic Hyderabadi wedding styling has spiked 40% this month."
      ],
      trendingSearchKeywords: ["Nizam Traditional Looks", "Sweat-Proof HD Bases", "Dewy Glass Prep", "Jubilee Hills Bridal Suites"]
    };
    return res.json(fallbackInsights);
  }

  try {
    const prompt = `Analyze current wedding beauty startup analytics for a premium vendor:
    - Monthly Revenue: ₹${revenue} INR
    - Total Bookings: ${totalBookings} brides
    - Pending Inquiries: ${pendingCount} brides
    - Package Performance data: ${JSON.stringify(packagesPerformance || {})}

    Provide business development recommendations, styling trends, and marketing growth insights.`;

    const systemInstruction = `You are the Lead Business Growth Consultant at VowGlow.
    Analyze the vendor metrics and return structured JSON containing:
    1. 'summary' (short luxury-style business brief)
    2. 'recommendations' (string array of 3 distinct high-impact actionable items)
    3. 'trendingSearchKeywords' (string array of 4 popular search phrases in Hyderabad bridal beauty).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['summary', 'recommendations', 'trendingSearchKeywords'],
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            trendingSearchKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err) {
    console.error('Gemini Insights Error: ', err);
    res.status(500).json({ error: 'AI Insights service temporarily offline.' });
  }
});


/* =========================================
   VITE & STATIC ASSETS SETUP
   ========================================= */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VowGlow OS] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
