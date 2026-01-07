export interface Vehicle {
  id: string
  name: string
  type: string
  capacity: number
  luggage: string
  image: string
  pricePerKm: number
  features: string[]
}

export interface Route {
  id: string
  from: string
  to: string
  distance: string
  duration: string
  startingPrice: number
  popular: boolean
}

export const vehicles: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan",
    type: "Swift Dzire / Honda Amaze",
    capacity: 4,
    luggage: "2 large bags",
    image: "https://res.cloudinary.com/demo/image/upload/v1/taxi1.jpg",
    pricePerKm: 12,
    features: ["AC", "Music System", "First Aid Kit", "Comfortable Seating"],
  },
  {
    id: "suv",
    name: "SUV",
    type: "Toyota Innova / Ertiga",
    capacity: 6,
    luggage: "4 large bags",
    image: "https://res.cloudinary.com/demo/image/upload/v1/taxi2.jpg",
    pricePerKm: 16,
    features: ["AC", "Music System", "Spacious", "Hill Terrain Suitable", "USB Charging"],
  },
  {
    id: "tempo",
    name: "Tempo Traveller",
    type: "Force Tempo Traveller",
    capacity: 12,
    luggage: "10+ bags",
    image: "https://res.cloudinary.com/demo/image/upload/v1/tempo_traveller.jpg",
    pricePerKm: 24,
    features: ["AC", "Push Back Seats", "Music System", "Large Luggage Space", "Ideal for Groups"],
  },
  {
    id: "luxury",
    name: "Luxury",
    type: "Toyota Crysta / Fortuner",
    capacity: 6,
    luggage: "4 large bags",
    image: "https://res.cloudinary.com/demo/image/upload/v1/cab_interior.jpg",
    pricePerKm: 22,
    features: ["Premium AC", "Leather Seats", "Entertainment System", "WiFi", "Refreshments"],
  },
]

export const routes: Route[] = [
  {
    id: "chd-shimla",
    from: "Chandigarh",
    to: "Shimla",
    distance: "117 km",
    duration: "3-4 hours",
    startingPrice: 2500,
    popular: true,
  },
  {
    id: "chd-manali",
    from: "Chandigarh",
    to: "Manali",
    distance: "310 km",
    duration: "7-8 hours",
    startingPrice: 5500,
    popular: true,
  },
  {
    id: "delhi-shimla",
    from: "Delhi Airport",
    to: "Shimla",
    distance: "370 km",
    duration: "8-9 hours",
    startingPrice: 6500,
    popular: true,
  },
  {
    id: "delhi-manali",
    from: "Delhi Airport",
    to: "Manali",
    distance: "540 km",
    duration: "12-13 hours",
    startingPrice: 9500,
    popular: false,
  },
  {
    id: "shimla-manali",
    from: "Shimla",
    to: "Manali",
    distance: "250 km",
    duration: "6-7 hours",
    startingPrice: 4500,
    popular: true,
  },
  {
    id: "chd-dharamshala",
    from: "Chandigarh",
    to: "Dharamshala",
    distance: "240 km",
    duration: "5-6 hours",
    startingPrice: 4000,
    popular: false,
  },
]

export const taxiTestimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "Excellent service! Driver was punctual and very professional. The car was clean and comfortable throughout our Manali trip.",
    date: "December 2024",
  },
  {
    id: "2",
    name: "Rahul Verma",
    location: "Mumbai",
    rating: 5,
    text: "Booked a Tempo Traveller for our group trip. Amazing experience with competitive pricing. Will definitely use again!",
    date: "November 2024",
  },
  {
    id: "3",
    name: "Anita Gupta",
    location: "Bangalore",
    rating: 4,
    text: "Very reliable service. Our driver knew all the scenic routes and made our journey memorable. Highly recommended.",
    date: "October 2024",
  },
]

export const safetyFeatures = [
  {
    title: "Verified Drivers",
    description: "All drivers undergo thorough background checks and verification",
    icon: "shield",
  },
  {
    title: "Sanitized Vehicles",
    description: "Regular sanitization after every trip for your safety",
    icon: "sparkles",
  },
  {
    title: "GPS Tracking",
    description: "Real-time tracking available for all trips",
    icon: "mapPin",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer support for any assistance",
    icon: "headphones",
  },
  {
    title: "Flexible Cancellation",
    description: "Free cancellation up to 24 hours before pickup",
    icon: "clock",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges. Pay only what you see",
    icon: "receipt",
  },
]

export const taxiFaqs = [
  {
    question: "What is your cancellation policy?",
    answer:
      "Free cancellation is available up to 24 hours before the scheduled pickup time. Cancellations made within 24 hours may incur a 20% charge.",
  },
  {
    question: "What payment options do you accept?",
    answer:
      "We accept cash, UPI, all major credit/debit cards, and net banking. Payment can be made at the end of the trip or in advance online.",
  },
  {
    question: "Are there any night charges?",
    answer: "Yes, trips between 10 PM and 6 AM attract a 10% night surcharge on the total fare.",
  },
  {
    question: "What about extra kilometers?",
    answer:
      "Extra kilometers beyond the package are charged at the per-km rate for the selected vehicle type.",
  },
  {
    question: "Do you provide child seats?",
    answer: "Yes, child seats are available on request at no extra charge. Please mention while booking.",
  },
  {
    question: "Can I modify my booking?",
    answer: "Yes, bookings can be modified up to 12 hours before pickup, subject to vehicle availability.",
  },
]
