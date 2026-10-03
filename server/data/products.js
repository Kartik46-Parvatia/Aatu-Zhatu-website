const initialProducts = [
  {
    id: 1,
    name: "Aatu Smart Watch Pro",
    slug: "smart-watch-pro",
    price: 499,
    originalPrice: 1999,
    category: "tech",
    icon: "⌚",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    desc: "Modern fitness tracking smartwatch with HD AMOLED display, 7-day battery, and Bluetooth calling.",
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 342,
    stock: 24,
    features: [
      "1.43\" AMOLED Display with Always-On support",
      "SpO2, Heart Rate & Sleep Monitoring",
      "IP68 Water & Dust Resistant",
      "Over 100+ Sports Modes and Custom Watch Faces"
    ],
    reviews: [
      { id: 1, user: "Aarav Sharma", rating: 5, date: "2026-09-15", comment: "Insane value for ₹499! Battery easily lasts 6 days with calling." },
      { id: 2, user: "Priya Patel", rating: 4, date: "2026-09-20", comment: "Very sleek look and accurate step counting. Highly recommend!" }
    ]
  },
  {
    id: 2,
    name: "BassPulse Wireless Headphones",
    slug: "basspulse-wireless-headphones",
    price: 899,
    originalPrice: 2499,
    category: "tech",
    icon: "🎧",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    desc: "Ultra-clear acoustic sound with deep bass, Active Noise Cancellation, and 40-hour playback.",
    badge: "Trending",
    rating: 4.9,
    reviewCount: 512,
    stock: 18,
    features: [
      "40mm High-Fidelity Neodymium Drivers",
      "Active Noise Cancellation (up to 30dB reduction)",
      "Fast Type-C charging (10 mins gives 4 hours)",
      "Ultra-soft memory foam ear cushions"
    ],
    reviews: [
      { id: 1, user: "Rohan Gupta", rating: 5, date: "2026-09-18", comment: "Sound quality punches way above its price tag. ANC works like magic." }
    ]
  },
  {
    id: 3,
    name: "AeroGlide Running Shoes",
    slug: "aeroglide-running-shoes",
    price: 799,
    originalPrice: 1799,
    category: "fashion",
    icon: "👟",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    desc: "Featherlight breathable mesh trainers engineered for daily running, gym workouts, and streetwear.",
    badge: "Hot Deal",
    rating: 4.7,
    reviewCount: 220,
    stock: 15,
    features: [
      "High-rebound EVA cushioning sole",
      "Breathable 3D jacquard mesh upper",
      "Anti-slip rubberized traction outsole",
      "Ergonomic arch support insole"
    ],
    reviews: [
      { id: 1, user: "Vikram Malhotra", rating: 5, date: "2026-08-30", comment: "Super comfy for my daily 5km jogs. True to size!" }
    ]
  },
  {
    id: 4,
    name: "Urban Explorer Classic Backpack",
    slug: "urban-explorer-backpack",
    price: 649,
    originalPrice: 1499,
    category: "fashion",
    icon: "🎒",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    desc: "Water-repellent multi-compartment backpack with padded 15.6\" laptop sleeve and USB charging port.",
    badge: "Editor's Choice",
    rating: 4.6,
    reviewCount: 189,
    stock: 30,
    features: [
      "Dedicated shockproof 15.6\" laptop compartment",
      "High-density water-resistant Oxford fabric",
      "External USB pass-through port",
      "Breathable honeycomb back panel padding"
    ],
    reviews: [
      { id: 1, user: "Sneha Rao", rating: 4, date: "2026-09-12", comment: "Carries my heavy laptop and notebooks effortlessly. Very sturdy." }
    ]
  },
  {
    id: 5,
    name: "Lumina Minimalist Desk Lamp",
    slug: "lumina-minimalist-desk-lamp",
    price: 399,
    originalPrice: 999,
    category: "home",
    icon: "💡",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    desc: "Eye-care LED desk lamp with 3 color temperatures, smooth touch dimming, and flexible 360° gooseneck.",
    badge: "Popular",
    rating: 4.8,
    reviewCount: 147,
    stock: 22,
    features: [
      "Flicker-free eye protection technology",
      "3 color modes (Warm White, Natural, Daylight)",
      "Touch sensitive step-less brightness control",
      "USB powered with low energy consumption"
    ],
    reviews: [
      { id: 1, user: "Karan Mehta", rating: 5, date: "2026-09-25", comment: "Perfect for late night studying. Soft on the eyes." }
    ]
  },
  {
    id: 6,
    name: "Artisan Ceramic Coffee Mug Set",
    slug: "artisan-ceramic-coffee-mug",
    price: 249,
    originalPrice: 599,
    category: "home",
    icon: "☕",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    desc: "Handcrafted matte finish stoneware ceramic mug with ergonomic heat-insulated handle (350ml).",
    badge: "Top Value",
    rating: 4.9,
    reviewCount: 95,
    stock: 40,
    features: [
      "100% Lead-free & food-grade ceramic",
      "Microwave and dishwasher safe",
      "350ml generous capacity for coffee, tea, or cocoa",
      "Smooth artisanal matte glaze finish"
    ],
    reviews: [
      { id: 1, user: "Ananya Joshi", rating: 5, date: "2026-09-28", comment: "The matte texture feels premium in hands. Looks aesthetic on my desk!" }
    ]
  },
  {
    id: 7,
    name: "CyberKeys RGB Mechanical Keyboard",
    slug: "cyberkeys-rgb-mechanical-keyboard",
    price: 1299,
    originalPrice: 3499,
    category: "tech",
    icon: "⌨️",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    desc: "Compact 75% mechanical keyboard with tactile blue switches, per-key RGB, and detachable braided cable.",
    badge: "Gamer Favorite",
    rating: 4.9,
    reviewCount: 420,
    stock: 12,
    features: [
      "Tactile Clicky Blue Switches (50M keystroke rating)",
      "18 vibrant customizable RGB backlight modes",
      "Anti-ghosting on all 84 keys",
      "Braided Type-C detachable cable"
    ],
    reviews: [
      { id: 1, user: "Devansh Roy", rating: 5, date: "2026-09-22", comment: "The clicky sound is so satisfying. Insane build quality at ₹1299." }
    ]
  },
  {
    id: 8,
    name: "Zenith Comfort Ergonomic Mouse",
    slug: "zenith-comfort-ergonomic-mouse",
    price: 549,
    originalPrice: 1299,
    category: "tech",
    icon: "🖱️",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    desc: "Vertical ergonomic wireless mouse engineered to eliminate wrist strain and improve productivity.",
    badge: "Health Pick",
    rating: 4.7,
    reviewCount: 168,
    stock: 19,
    features: [
      "Natural 57° handshake angle reduces wrist strain",
      "Adjustable DPI (800 / 1200 / 1600 / 2400)",
      "Silent click buttons for quiet office/home work",
      "Dual mode: 2.4G USB Dongle & Bluetooth 5.2"
    ],
    reviews: [
      { id: 1, user: "Manish K.", rating: 5, date: "2026-09-19", comment: "Wrist pain is completely gone after 1 week of use." }
    ]
  },
  {
    id: 9,
    name: "Oversized Streetwear Boxy Hoodie",
    slug: "oversized-streetwear-boxy-hoodie",
    price: 999,
    originalPrice: 2299,
    category: "fashion",
    icon: "👕",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    desc: "Heavyweight 380 GSM fleece pullover hoodie in drop-shoulder streetwear fit with kangaroo pocket.",
    badge: "Trending",
    rating: 4.8,
    reviewCount: 310,
    stock: 25,
    features: [
      "380 GSM ultra-heavyweight combed organic cotton fleece",
      "Relaxed drop-shoulder oversized streetwear silhouette",
      "Ribbed cuffs and hem with double-lined warm hood",
      "Pre-shrunk fabric to prevent post-wash shrinking"
    ],
    reviews: [
      { id: 1, user: "Tanmay B.", rating: 5, date: "2026-09-14", comment: "The quality feels like high-end Zara or H&M. Fits perfectly boxy." }
    ]
  },
  {
    id: 10,
    name: "Classic Polarized Aviator Sunglasses",
    slug: "classic-polarized-aviator-sunglasses",
    price: 449,
    originalPrice: 1199,
    category: "fashion",
    icon: "🕶️",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    desc: "Timeless military style aviator sunglasses with UV400 polarized scratch-resistant TAC lenses.",
    badge: "Must Have",
    rating: 4.6,
    reviewCount: 175,
    stock: 35,
    features: [
      "UV400 protection blocking 100% harmful UVA/UVB rays",
      "Polarized TAC lenses eliminating road & water glare",
      "Ultra-lightweight stainless steel metal alloy frame",
      "Includes hard shell magnetic case & microfiber cloth"
    ],
    reviews: [
      { id: 1, user: "Ritesh S.", rating: 4, date: "2026-08-27", comment: "Looks great, very comfortable on the nose bridge." }
    ]
  },
  {
    id: 11,
    name: "AuraMist Ultrasonic Aroma Diffuser",
    slug: "auramist-ultrasonic-aroma-diffuser",
    price: 699,
    originalPrice: 1699,
    category: "home",
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    desc: "500ml ultrasonic essential oil aroma diffuser and cool mist humidifier with 7 LED mood ambient lights.",
    badge: "Wellness",
    rating: 4.8,
    reviewCount: 204,
    stock: 14,
    features: [
      "500ml large capacity for up to 10 hours of continuous mist",
      "Whisper-quiet ultrasonic operation (<23dB)",
      "Waterless auto-shutoff safety sensor",
      "7 soothing LED ambient colors with breathing mode"
    ],
    reviews: [
      { id: 1, user: "Shalini V.", rating: 5, date: "2026-09-08", comment: "My bedroom smells like a luxury spa. Love the ambient night light." }
    ]
  },
  {
    id: 12,
    name: "HydroShield Insulated Thermal Flask (750ml)",
    slug: "hydroshield-insulated-thermal-flask",
    price: 349,
    originalPrice: 899,
    category: "home",
    icon: "🍶",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    desc: "Double-wall vacuum insulated stainless steel water bottle keeping drinks icy cold 24h or hot 12h.",
    badge: "Eco Pick",
    rating: 4.9,
    reviewCount: 288,
    stock: 50,
    features: [
      "Pro-grade 18/8 food-grade stainless steel inside and out",
      "Keeps cold 24 hours / hot 12 hours with zero condensation",
      "100% leakproof spout cap with integrated carry loop",
      "BPA-free, non-toxic, and rust-resistant finish"
    ],
    reviews: [
      { id: 1, user: "Nitin B.", rating: 5, date: "2026-09-17", comment: "Left ice water in the car under direct sun, stayed chilled for 12 hours!" }
    ]
  }
];

module.exports = initialProducts;
