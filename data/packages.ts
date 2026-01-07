export interface Package {
  id: string
  slug: string
  title: string
  excerpt: string
  description: string
  region: string
  duration: string
  durationDays: number
  price: number
  originalPrice: number
  rating: number
  reviewsCount: number
  badge?: string
  theme: string[]
  images: string[]
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: {
    day: number
    title: string
    description: string
    activities: string[]
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  pdfUrl: string
}

export const packages: Package[] = [
  {
    id: "1",
    slug: "manali-adventure-escape",
    title: "Manali Adventure Escape",
    excerpt:
      "Experience the thrill of Solang Valley, Rohtang Pass and riverside camping in the heart of Kullu-Manali.",
    description:
      "Embark on an unforgettable adventure through the stunning landscapes of Manali. This package offers the perfect blend of adrenaline-pumping activities and serene mountain experiences. From paragliding over Solang Valley to exploring the majestic Rohtang Pass, every moment promises to be extraordinary.",
    region: "Manali",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    price: 18999,
    originalPrice: 24999,
    rating: 4.8,
    reviewsCount: 234,
    badge: "Popular",
    theme: ["Adventure", "Nature"],
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1/hero_mountain1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/paragliding1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/valley1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/river1.jpg",
    ],
    highlights: [
      "Paragliding at Solang Valley",
      "Rohtang Pass excursion",
      "River rafting in Beas",
      "Camping under the stars",
      "Visit to Hadimba Temple",
      "Old Manali exploration",
    ],
    inclusions: [
      "4 nights accommodation in 3-star hotel",
      "Daily breakfast and dinner",
      "All transfers in private vehicle",
      "Paragliding session",
      "River rafting experience",
      "Rohtang Pass permit and entry",
      "Professional guide",
      "All applicable taxes",
    ],
    exclusions: [
      "Airfare / train fare",
      "Personal expenses",
      "Travel insurance",
      "Any meals not mentioned",
      "Tips and gratuities",
      "Adventure activities not mentioned",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Manali",
        description:
          "Arrive at Manali bus stand/airport. Transfer to hotel and check-in. Evening at leisure to explore Mall Road and local markets.",
        activities: ["Airport/Bus pickup", "Hotel check-in", "Mall Road visit", "Welcome dinner"],
      },
      {
        day: 2,
        title: "Solang Valley Adventure",
        description:
          "Full day excursion to Solang Valley. Experience paragliding, zorbing, and other adventure activities amidst stunning mountain views.",
        activities: ["Paragliding", "Zorbing", "Snow activities", "Photography"],
      },
      {
        day: 3,
        title: "Rohtang Pass Expedition",
        description:
          "Early morning departure for Rohtang Pass (subject to permit availability). Enjoy snow activities and breathtaking views of the Himalayan ranges.",
        activities: ["Rohtang Pass visit", "Snow activities", "Photography", "Mountain views"],
      },
      {
        day: 4,
        title: "River Rafting & Temples",
        description:
          "Morning river rafting in Beas River. Afternoon visit to Hadimba Temple, Vashisht Hot Springs, and Old Manali.",
        activities: ["River rafting", "Hadimba Temple", "Vashisht Hot Springs", "Old Manali exploration"],
      },
      {
        day: 5,
        title: "Departure",
        description:
          "After breakfast, check-out from hotel. Transfer to bus stand/airport for your onward journey with beautiful memories.",
        activities: ["Breakfast", "Check-out", "Transfer to bus stand/airport"],
      },
    ],
    faqs: [
      {
        question: "What is the best time to visit Manali?",
        answer:
          "The best time to visit Manali is from March to June for pleasant weather and October to February for snow activities. Monsoon (July-September) should be avoided due to landslides.",
      },
      {
        question: "Is Rohtang Pass open throughout the year?",
        answer:
          "No, Rohtang Pass is typically open from May to October. It remains closed during winter months due to heavy snowfall. Permits are required and are subject to availability.",
      },
      {
        question: "What should I pack for this trip?",
        answer:
          "Pack warm clothing (even in summer), comfortable walking shoes, sunscreen, sunglasses, camera, and any personal medications. Layers are recommended as weather can change quickly.",
      },
    ],
    pdfUrl: "https://res.cloudinary.com/demo/raw/upload/v1/sample_itinerary.pdf",
  },
  {
    id: "2",
    slug: "spiritual-dharamshala-mcleodganj",
    title: "Spiritual Dharamshala & McLeodganj",
    excerpt: "Discover Tibetan culture, monasteries, and the serene beauty of the Dhauladhar ranges.",
    description:
      "Immerse yourself in the spiritual heart of India at Dharamshala and McLeodganj. Home to the Dalai Lama and Tibetan government-in-exile, this journey offers a unique blend of Buddhist spirituality, Tibetan culture, and breathtaking Himalayan scenery.",
    region: "Dharamshala",
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    price: 14999,
    originalPrice: 19999,
    rating: 4.9,
    reviewsCount: 187,
    badge: "Spiritual",
    theme: ["Spiritual", "Culture"],
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1/temple1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/hero_mountain1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/valley1.jpg",
    ],
    highlights: [
      "Dalai Lama Temple Complex",
      "Namgyal Monastery",
      "Bhagsu Waterfall trek",
      "Tibetan Museum",
      "Cricket Stadium visit",
      "Local Tibetan market",
    ],
    inclusions: [
      "3 nights accommodation",
      "Daily breakfast",
      "All transfers",
      "Sightseeing as per itinerary",
      "Professional guide",
    ],
    exclusions: ["Airfare / train fare", "Personal expenses", "Meals not mentioned", "Entry fees"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dharamshala",
        description:
          "Arrive and transfer to McLeodganj. Evening visit to the main square and Tibetan market.",
        activities: ["Transfer to hotel", "Tibetan market visit", "Evening stroll"],
      },
      {
        day: 2,
        title: "Spiritual Exploration",
        description:
          "Visit Dalai Lama Temple Complex, Namgyal Monastery, and Tibet Museum. Meditation session in the evening.",
        activities: ["Temple Complex", "Monastery visit", "Tibet Museum", "Meditation"],
      },
      {
        day: 3,
        title: "Nature & Culture",
        description:
          "Morning trek to Bhagsu Waterfall. Visit Dharamshala Cricket Stadium and explore local cafes.",
        activities: ["Bhagsu trek", "Cricket Stadium", "Cafe hopping", "Sunset point"],
      },
      {
        day: 4,
        title: "Departure",
        description: "Morning at leisure. Check-out and transfer for departure.",
        activities: ["Breakfast", "Last minute shopping", "Departure"],
      },
    ],
    faqs: [
      {
        question: "Can we meet the Dalai Lama?",
        answer:
          "Public audiences with the Dalai Lama are held occasionally but are not guaranteed. Check the official schedule for teaching sessions.",
      },
    ],
    pdfUrl: "https://res.cloudinary.com/demo/raw/upload/v1/sample_itinerary.pdf",
  },
  {
    id: "3",
    slug: "shimla-kullu-manali-honeymoon",
    title: "Shimla Kullu Manali Honeymoon",
    excerpt: "Romantic getaway through the queen of hills with candlelight dinners and scenic stays.",
    description:
      "Create magical memories with your partner on this romantic journey through Himachal's most beautiful destinations. From the colonial charm of Shimla to the adventure paradise of Manali, experience the perfect honeymoon.",
    region: "Shimla",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    price: 32999,
    originalPrice: 42999,
    rating: 4.7,
    reviewsCount: 156,
    badge: "New",
    theme: ["Honeymoon", "Romantic"],
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1/valley1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/hero_mountain1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/river1.jpg",
    ],
    highlights: [
      "Mall Road Shimla",
      "Kufri excursion",
      "Kullu River rafting",
      "Solang Valley",
      "Candlelight dinners",
      "Private transfers",
    ],
    inclusions: [
      "6 nights deluxe accommodation",
      "All meals included",
      "Private vehicle transfers",
      "Honeymoon amenities",
      "Candlelight dinner",
      "All sightseeing",
    ],
    exclusions: ["Flights", "Personal shopping", "Travel insurance", "Adventure activities"],
    itinerary: [
      {
        day: 1,
        title: "Arrive Shimla",
        description:
          "Arrive in Shimla, the Queen of Hills. Check into your romantic hotel and enjoy the evening at leisure.",
        activities: ["Hotel check-in", "Welcome drinks", "Evening stroll on Mall Road"],
      },
      {
        day: 2,
        title: "Shimla Sightseeing",
        description: "Full day Shimla sightseeing including Jakhu Temple, Christ Church, and Ridge.",
        activities: ["Jakhu Temple", "Christ Church", "Ridge", "Mall Road shopping"],
      },
      {
        day: 3,
        title: "Kufri Excursion",
        description: "Day trip to Kufri for horse riding and panoramic views. Return for candlelight dinner.",
        activities: ["Kufri visit", "Horse riding", "Candlelight dinner"],
      },
      {
        day: 4,
        title: "Shimla to Manali",
        description: "Scenic drive from Shimla to Manali via Kullu Valley. Check into resort.",
        activities: ["Scenic drive", "Kullu Valley views", "Resort check-in"],
      },
      {
        day: 5,
        title: "Manali Local",
        description: "Visit Hadimba Temple, Old Manali, and Vashisht. Evening bonfire.",
        activities: ["Hadimba Temple", "Old Manali", "Vashisht", "Bonfire"],
      },
      {
        day: 6,
        title: "Solang Valley",
        description: "Full day at Solang Valley. Optional adventure activities.",
        activities: ["Solang Valley", "Photography", "Adventure activities"],
      },
      {
        day: 7,
        title: "Departure",
        description: "Check-out and transfer for departure with sweet memories.",
        activities: ["Breakfast", "Check-out", "Departure transfer"],
      },
    ],
    faqs: [
      {
        question: "Is this package customizable?",
        answer:
          "Yes, we can customize the package based on your preferences, including upgrading hotels or adding activities.",
      },
    ],
    pdfUrl: "https://res.cloudinary.com/demo/raw/upload/v1/sample_itinerary.pdf",
  },
  {
    id: "4",
    slug: "spiti-valley-expedition",
    title: "Spiti Valley Expedition",
    excerpt:
      "Journey through the cold desert mountain valley with ancient monasteries and stunning landscapes.",
    description:
      "Venture into one of India's most remote and beautiful regions. Spiti Valley, the 'Middle Land' between Tibet and India, offers lunar landscapes, ancient Buddhist monasteries, and an adventure of a lifetime.",
    region: "Spiti",
    duration: "9 Days / 8 Nights",
    durationDays: 9,
    price: 45999,
    originalPrice: 55999,
    rating: 4.9,
    reviewsCount: 98,
    badge: "Popular",
    theme: ["Adventure", "Culture"],
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1/trek1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/temple1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/hero_mountain1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/valley1.jpg",
    ],
    highlights: [
      "Key Monastery",
      "Chandratal Lake",
      "Kunzum Pass",
      "Kibber village",
      "Dhankar Monastery",
      "Pin Valley",
    ],
    inclusions: [
      "8 nights accommodation",
      "All meals",
      "4x4 vehicle",
      "Permits",
      "Guide",
      "Camping equipment",
    ],
    exclusions: ["Personal gear", "Travel insurance (mandatory)", "Tips", "Flights"],
    itinerary: [
      {
        day: 1,
        title: "Arrive Chandigarh to Shimla",
        description: "Start your journey from Chandigarh and drive to Shimla.",
        activities: ["Pickup from Chandigarh", "Drive to Shimla", "Overnight stay"],
      },
      {
        day: 2,
        title: "Shimla to Sangla",
        description: "Drive through beautiful Kinnaur valley to Sangla.",
        activities: ["Scenic drive", "Kinnaur valley", "Sangla overnight"],
      },
      {
        day: 3,
        title: "Sangla to Kalpa",
        description: "Short drive to Kalpa with views of Kinnaur Kailash.",
        activities: ["Sangla exploration", "Drive to Kalpa", "Kinnaur Kailash views"],
      },
      {
        day: 4,
        title: "Kalpa to Tabo",
        description: "Enter Spiti Valley via Nako Lake.",
        activities: ["Nako Lake", "Enter Spiti", "Tabo Monastery"],
      },
      {
        day: 5,
        title: "Tabo to Kaza",
        description: "Visit Dhankar and drive to Kaza, the heart of Spiti.",
        activities: ["Dhankar Monastery", "Dhankar Lake trek", "Kaza arrival"],
      },
      {
        day: 6,
        title: "Kaza Exploration",
        description: "Visit Key Monastery, Kibber, and Komik village.",
        activities: ["Key Monastery", "Kibber village", "Komik", "Hikkim post office"],
      },
      {
        day: 7,
        title: "Chandratal Lake",
        description: "Drive to the mystical Chandratal Lake. Camping by the lake.",
        activities: ["Kunzum Pass", "Chandratal Lake", "Camping"],
      },
      {
        day: 8,
        title: "Chandratal to Manali",
        description: "Cross Rohtang Pass and arrive in Manali.",
        activities: ["Rohtang crossing", "Atal Tunnel", "Manali arrival"],
      },
      {
        day: 9,
        title: "Departure",
        description: "Transfer to Manali bus stand or airport.",
        activities: ["Breakfast", "Departure transfer"],
      },
    ],
    faqs: [
      {
        question: "Is Spiti Valley safe to visit?",
        answer:
          "Yes, but the terrain is challenging. High altitude acclimatization is important. We recommend travel insurance and carrying basic medications.",
      },
      {
        question: "What is the best time to visit Spiti?",
        answer:
          "June to September is ideal when all roads are open. Winter visits (Feb-March) are possible via Shimla route only.",
      },
    ],
    pdfUrl: "https://res.cloudinary.com/demo/raw/upload/v1/sample_itinerary.pdf",
  },
  {
    id: "5",
    slug: "kasol-kheerganga-trek",
    title: "Kasol & Kheerganga Trek",
    excerpt: "Backpacker's paradise with stunning treks, riverside camping, and vibrant cafe culture.",
    description:
      "Experience the Israeli vibe of Kasol and trek to the mystical Kheerganga hot springs. This package is perfect for young travelers seeking adventure, nature, and the famous Parvati Valley experience.",
    region: "Himachal",
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    price: 9999,
    originalPrice: 14999,
    rating: 4.6,
    reviewsCount: 312,
    theme: ["Adventure", "Backpacking"],
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1/trek1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/river1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/valley1.jpg",
    ],
    highlights: [
      "Kasol village exploration",
      "Kheerganga trek",
      "Hot springs bath",
      "Riverside camping",
      "Manikaran Gurudwara",
      "Chalal village walk",
    ],
    inclusions: [
      "3 nights accommodation",
      "All meals during trek",
      "Trek guide",
      "Camping equipment",
      "Bonfire",
    ],
    exclusions: ["Transport to Kasol", "Personal expenses", "Porter charges"],
    itinerary: [
      {
        day: 1,
        title: "Arrive Kasol",
        description: "Arrive in Kasol. Explore the village and cafes. Evening by the riverside.",
        activities: ["Kasol exploration", "Cafe hopping", "Riverside evening"],
      },
      {
        day: 2,
        title: "Kasol to Kheerganga Trek",
        description: "Start the 12km trek to Kheerganga. Camp overnight near hot springs.",
        activities: ["Trek start", "Rudra Nag waterfall", "Kheerganga camping", "Hot springs"],
      },
      {
        day: 3,
        title: "Kheerganga to Kasol",
        description: "Morning hot springs dip. Trek down to Kasol. Evening at leisure.",
        activities: ["Hot springs bath", "Trek descent", "Manikaran visit"],
      },
      {
        day: 4,
        title: "Departure",
        description: "Morning at leisure. Departure from Kasol.",
        activities: ["Breakfast", "Shopping", "Departure"],
      },
    ],
    faqs: [
      {
        question: "How difficult is the Kheerganga trek?",
        answer:
          "It's a moderate trek of about 12km one way. Anyone with basic fitness can complete it. The trail is well-marked.",
      },
    ],
    pdfUrl: "https://res.cloudinary.com/demo/raw/upload/v1/sample_itinerary.pdf",
  },
  {
    id: "6",
    slug: "dalhousie-khajjiar-weekend",
    title: "Dalhousie & Khajjiar Weekend",
    excerpt: "Mini Switzerland of India with colonial charm, meadows, and pine forests.",
    description:
      "Escape to the serene hill station of Dalhousie and visit the stunning meadows of Khajjiar, often called the Mini Switzerland of India. Perfect for a relaxing weekend getaway.",
    region: "Himachal",
    duration: "3 Days / 2 Nights",
    durationDays: 3,
    price: 8999,
    originalPrice: 12999,
    rating: 4.5,
    reviewsCount: 178,
    badge: "Weekend",
    theme: ["Nature", "Relaxation"],
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1/valley1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1/hero_mountain1.jpg",
    ],
    highlights: [
      "Khajjiar meadows",
      "Kalatop Wildlife Sanctuary",
      "Dainkund Peak",
      "St. John's Church",
      "Panchpula",
    ],
    inclusions: ["2 nights accommodation", "Daily breakfast", "All transfers", "Sightseeing"],
    exclusions: ["Lunch and dinner", "Personal expenses", "Activity charges"],
    itinerary: [
      {
        day: 1,
        title: "Arrive Dalhousie",
        description: "Arrive and check-in. Evening visit to Mall Road and churches.",
        activities: ["Hotel check-in", "Mall Road", "St. John's Church"],
      },
      {
        day: 2,
        title: "Khajjiar Excursion",
        description: "Full day trip to Khajjiar. Enjoy the meadows and activities.",
        activities: ["Khajjiar visit", "Zorbing", "Horse riding", "Photography"],
      },
      {
        day: 3,
        title: "Departure",
        description: "Visit Panchpula and Dainkund before departure.",
        activities: ["Panchpula", "Dainkund Peak", "Departure"],
      },
    ],
    faqs: [
      {
        question: "How to reach Dalhousie?",
        answer:
          "Nearest airport is Gaggal (Kangra), 120km away. Nearest railway station is Pathankot, 80km away. We provide transfers from both.",
      },
    ],
    pdfUrl: "https://res.cloudinary.com/demo/raw/upload/v1/sample_itinerary.pdf",
  },
]

export const regions = ["All", "Himachal", "Shimla", "Manali", "Dharamshala", "Spiti", "Chintpurni"]
export const durations = ["All", "1-2 Days", "3-5 Days", "5+ Days"]
export const themes = ["All", "Adventure", "Spiritual", "Leisure"]
export const priceRanges = ["All", "Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "Above ₹50,000"]
