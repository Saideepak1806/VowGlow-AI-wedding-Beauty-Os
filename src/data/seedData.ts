/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vendor, Package, Review } from '../types';

// Curated stunning Unsplash wedding and beauty image collection
export const SEED_IMAGES = {
  makeup: [
    'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&auto=format&fit=crop&q=80'
  ],
  bridal: [
    'https://images.unsplash.com/photo-1605497746445-97d1b0a9eead?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591551910796-3840af7931cf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=800&auto=format&fit=crop&q=80'
  ],
  hair: [
    'https://images.unsplash.com/photo-1519415590294-40647e4c5abc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522337060762-df98a02c0b11?w=800&auto=format&fit=crop&q=80'
  ],
  spa: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80'
  ],
  nails: [
    'https://images.unsplash.com/photo-1632345031435-8797b2d58045?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80'
  ],
  skincare: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80'
  ]
};

const AREAS = ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Madhapur', 'Kondapur', 'Begumpet', 'Secunderabad', 'Financial District'];

const BRIDE_STYLES = [
  'Nizam Traditional Telugu Bride',
  'Hyderabadi Muslim Royal Khada Dupatta',
  'Sabyasachi Pastel Heritage Look',
  'Modern South Indian Minimalist Temple Bride',
  'Christian Editorial Pearl Elegance',
  'Dewy Glass-Skin Bollywood Reception',
  'North-Indian Royal Crimson Lehenga Look'
];

const AMENITIES = [
  'VIP Bridal Suite', 'Sari Draping Experts', 'Airbrush Makeup', 'International Hair Stylists',
  'Organic Skincare Products', 'Trial Consultation Room', 'Champagne Welcome', 'Luxury Private Cabana'
];

// Generate 30 high-fidelity wedding vendors in Hyderabad
export const VENDORS: Vendor[] = Array.from({ length: 30 }).map((_, i) => {
  const id = `v-${i + 1}`;
  
  // Distribute across categories
  const categories: Vendor['category'][] = [
    'Bridal Makeup', 'Bridal Makeup', 'Hair Styling', 'Skincare', 'Spa', 'Nail Studio', 'Luxury Salon', 'Home Service'
  ];
  const category = categories[i % categories.length];
  
  // Location and luxury level setup
  const location = `${AREAS[i % AREAS.length]}, Hyderabad`;
  const rating = parseFloat((4.5 + (i % 6) * 0.1).toFixed(1));
  const reviewCount = 45 + (i * 7);
  
  const luxuryLevels: Vendor['luxuryLevel'][] = ['Elite', 'Ultra Premium', 'Signature', 'Classic'];
  const luxuryLevel = luxuryLevels[i % luxuryLevels.length];
  
  const priceRanges: Vendor['priceRange'][] = ['₹₹₹₹', '₹₹₹', '₹₹', '₹'];
  const priceRange = priceRanges[i % priceRanges.length];

  // Pick elegant luxury images
  let image = '';
  let gallery: string[] = [];
  if (category === 'Bridal Makeup' || category === 'Home Service') {
    image = SEED_IMAGES.bridal[i % SEED_IMAGES.bridal.length];
    gallery = [SEED_IMAGES.bridal[(i+1)%SEED_IMAGES.bridal.length], SEED_IMAGES.makeup[i%SEED_IMAGES.makeup.length], SEED_IMAGES.makeup[(i+1)%SEED_IMAGES.makeup.length]];
  } else if (category === 'Hair Styling') {
    image = SEED_IMAGES.hair[i % SEED_IMAGES.hair.length];
    gallery = [SEED_IMAGES.hair[(i+1)%SEED_IMAGES.hair.length], SEED_IMAGES.makeup[i%SEED_IMAGES.makeup.length]];
  } else if (category === 'Skincare') {
    image = SEED_IMAGES.skincare[i % SEED_IMAGES.skincare.length];
    gallery = [SEED_IMAGES.skincare[(i+1)%SEED_IMAGES.skincare.length], SEED_IMAGES.spa[i%SEED_IMAGES.spa.length]];
  } else if (category === 'Spa') {
    image = SEED_IMAGES.spa[i % SEED_IMAGES.spa.length];
    gallery = [SEED_IMAGES.spa[(i+1)%SEED_IMAGES.spa.length], SEED_IMAGES.skincare[i%SEED_IMAGES.skincare.length]];
  } else if (category === 'Nail Studio') {
    image = SEED_IMAGES.nails[i % SEED_IMAGES.nails.length];
    gallery = [SEED_IMAGES.nails[(i+1)%SEED_IMAGES.nails.length], SEED_IMAGES.makeup[i%SEED_IMAGES.makeup.length]];
  } else {
    image = SEED_IMAGES.makeup[i % SEED_IMAGES.makeup.length];
    gallery = [SEED_IMAGES.makeup[(i+1)%SEED_IMAGES.makeup.length], SEED_IMAGES.bridal[i%SEED_IMAGES.bridal.length]];
  }

  // Brand Name creation
  const prefix = ['Aura', 'Zari', 'Vow', 'Kora', 'Kanchipuram', 'Glow', 'Elysian', 'Royal', 'Nizam', 'Opal', 'Velvet', 'Champagne', 'Ivy', 'Serene'][i % 14];
  const suffix = ['Bridal Atelier', 'Wedding Sanctuary', 'Luxury Salon', 'Skin House', 'Hair & Makeup Lounge', 'Beauty Mansion', 'Spa Retreat'][i % 7];
  const name = `${prefix} ${suffix}`;

  const experiences = ['12+ Years', '8+ Years', '15+ Years', '6+ Years', '10+ Years'];
  const experience = experiences[i % experiences.length];

  // Features list
  const features = [
    'International Artists',
    'Custom Bridal Moodboard',
    category === 'Bridal Makeup' ? 'Sari Draping Expert Included' : 'Premium Luxury Consultation',
    'Trial Session Available',
    'Exclusive VIP Room'
  ];

  return {
    id,
    name,
    category,
    rating,
    reviewCount,
    priceRange,
    location,
    distance: `${(1.2 + (i * 0.3)).toFixed(1)} km`,
    luxuryLevel,
    image,
    gallery,
    description: `Indulge in unmatched grandeur. ${name} represents the pinnacle of luxury wedding grooming in Hyderabad, specializing in highly custom ${category} services that elevate traditional charm into high-fashion bridal elegance. From private trials to champagne welcomes, your comfort is our vow.`,
    experience,
    features,
    availability: ['2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28', '2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03']
  };
});

// Generate 50 Bridal Beauty Packages
export const PACKAGES: Package[] = Array.from({ length: 50 }).map((_, i) => {
  const id = `pkg-${i + 1}`;
  const vendorIndex = i % VENDORS.length;
  const vendor = VENDORS[vendorIndex];
  
  // Diverse pricing structures based on luxury tiers
  let price = 15000 + (i * 2800);
  if (vendor.luxuryLevel === 'Elite') {
    price = 65000 + (i * 3500);
  } else if (vendor.luxuryLevel === 'Ultra Premium') {
    price = 45000 + (i * 2000);
  } else if (vendor.luxuryLevel === 'Signature') {
    price = 25000 + (i * 1500);
  }

  // Make sure we have local currency increments
  price = Math.round(price / 1000) * 1000;

  const packageThemes = [
    {
      title: 'The Nizam Royal Empress Ritual',
      desc: 'Our ultimate multi-day bridal package. Covers Engagement, Sangeet, Wedding, and Reception looks. Includes HD Airbrush makeup, luxury skincare glow, hair couture, and VIP assistance on the wedding day.',
      duration: '3 Days (Flexible Slots)',
      includes: ['4 High-Definition Makeup Looks', 'Advanced HydraFacial Glowing Ritual', 'Premium Sari Draping & Dupatta Setting', 'Luxury Hair Extensions & Real Flower Styling', 'Bridal Mehendi & Premium Nail Art', 'Exclusive VIP Bridal Suite Access']
    },
    {
      title: 'Classic South Indian Gold & Silk Legacy',
      desc: 'Curated specifically for Muhurtham & Kanchipuram silk drapes. Focuses on sweat-proof HD makeup, gold-dust highlight, premium braid styling with jasmine floral arrangements (Poola Jada), and professional drape pleating.',
      duration: '5 Hours',
      includes: ['High-Definition Sweat-Proof Muhurtham Look', 'Sari Pleating & Security', 'Traditional Hair Braid (Poola Jada) Setup', 'Pure Gold Glow Infused Facial', 'Premium Skin Prep & Hydration']
    },
    {
      title: 'Elysian Dewy Glass-Skin Radiance',
      desc: 'Designed for modern minimalistic brides who desire high-glow, dewy, weightless editorial makeup. Perfect for cocktail parties and lakeside evening receptions.',
      duration: '4 Hours',
      includes: ['Glass-Skin Airbrush Makeup', 'Contemporary Chic Hair Updo / Waves', 'Premium Serum Sheet Infusion', 'Body Shimmer & Decolletage Bronzing', 'False Eyelashes & Brow Lamination']
    },
    {
      title: 'Bridal Detox & Bridal Party Glow Lounge',
      desc: 'Exclusive spa and skincare lounge retreat for the bride and 3 bridesmaids/mother of the bride. Rejuvenate, distress, and receive uniform radiance before the big day.',
      duration: '6 Hours',
      includes: ['Full Body Jasmine Sandalwood Scrub', 'Hot Stone De-stress Massage', 'Premium Radiance Face Peels', 'Luxe Pedicure & Manicure Club', 'Bridal Party Champagne Brunch Included']
    },
    {
      title: 'Royal Heritage Khada Dupatta Classic',
      desc: 'Curated for regal Hyderabadi wedding events. Includes complex Khada Dupatta draping, royal gold-antique eye makeup, long-wear hair couture, and vintage jewelry setting assistance.',
      duration: '5 Hours',
      includes: ['Regal Mughal Eye Makeup & Long Wear Base', 'Traditional Khada Dupatta Draping', 'Royal Hair Bun with Jasmine Garland', 'Premium Skin Radiance Hydration Treatment', 'Bridal Jewelry Pinning & Placement']
    }
  ];

  const theme = packageThemes[i % packageThemes.length];
  
  // Pick image corresponding to theme
  let image = SEED_IMAGES.bridal[i % SEED_IMAGES.bridal.length];
  if (theme.title.includes('Glow') || theme.title.includes('Detox')) {
    image = SEED_IMAGES.skincare[i % SEED_IMAGES.skincare.length];
  } else if (theme.title.includes('South Indian')) {
    image = SEED_IMAGES.makeup[i % SEED_IMAGES.makeup.length];
  }

  return {
    id,
    vendorId: vendor.id,
    vendorName: vendor.name,
    title: `${theme.title} ${vendor.luxuryLevel === 'Elite' ? '💍 Elite' : '✨'}`,
    description: theme.desc,
    price,
    duration: theme.duration,
    includes: theme.includes,
    image
  };
});

// Generate 20 realistic luxury reviews per vendor (600 total, created dynamically)
export const REVIEWS: Review[] = [];

const REVIEW_COMMENTS = [
  {
    rating: 5,
    text: "Absolutely stunning! The Sabyasachi pastel heritage look was perfect. Everyone at my wedding in Hyderabad was asking where I got my makeup done. The Nizam Royal Empress Ritual is worth every rupee!",
    tag: "South Indian Bride"
  },
  {
    rating: 5,
    text: "Excellent service. The Muhurtham poola jada hair styling and saree pleating were immaculate. It stayed perfectly intact for 8 hours under hot venue lights. Highly recommended!",
    tag: "Muhurtham Muhurat"
  },
  {
    rating: 5,
    text: "We booked the Bridal Detox lounge for my bridesmaids and mother. It was an ethereal luxury experience! The private VIP bridal suite and champagne welcome made us feel like royalty.",
    tag: "Bridesmaid Experience"
  },
  {
    rating: 4,
    text: "Very professional artist team. The airbrush makeup felt completely weightless and photographed beautiful. Only issue was slightly tight time slots, but the final outcome was breathtaking.",
    tag: "Contemporary Bride"
  },
  {
    rating: 5,
    text: "The Khada Dupatta draping was absolutely authentic and royal. They helped me pin my heavy heirloom jewelry with so much care. Nizam level hospitality!",
    tag: "Hyderabadi Wedding"
  },
  {
    rating: 5,
    text: "The HydraFacial glow package before my Sangeet gave me the most stunning dewy skin. Complete game changer. Highly recommend booking 2 weeks in advance.",
    tag: "Pre-Wedding Glow"
  },
  {
    rating: 5,
    text: "We did a trial session first. The customization options were premium. They listened to exactly what I wanted and executed a flawless minimalist look.",
    tag: "Minimalist Bride"
  }
];

const REVIEW_AUTHORS = [
  { name: 'Ananya Reddy', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { name: 'Sana Fatima', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Keerthi Rao', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Meenakshi Iyer', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { name: 'Simran Kaur', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { name: 'Deepika Rao', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop&q=80' }
];

VENDORS.forEach((vendor, vIndex) => {
  // Generate 20 reviews for each vendor
  for (let r = 0; r < 20; r++) {
    const author = REVIEW_AUTHORS[(vIndex + r) % REVIEW_AUTHORS.length];
    const commentTemplate = REVIEW_COMMENTS[(vIndex * 2 + r) % REVIEW_COMMENTS.length];
    
    // Add variations to date
    const date = new Date();
    date.setDate(date.getDate() - (r * 4 + 1));
    const dateString = date.toISOString().split('T')[0];

    REVIEWS.push({
      id: `rev-${vendor.id}-${r + 1}`,
      vendorId: vendor.id,
      userName: author.name,
      userAvatar: author.avatar,
      rating: commentTemplate.rating,
      date: dateString,
      comment: commentTemplate.text.replace('makeup done.', `grooming done at ${vendor.name}.`),
      tag: commentTemplate.tag
    });
  }
});
