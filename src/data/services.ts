export interface Service {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    discountedPrice: number;
    discount: number;
    image: string;
    rating: number;
    reviews: number;
  }
  
  export const services: Service[] = [
    {
      id: 1,
      name: "Premium AC Service",
      description: "Professional AC maintenance and repair service.",
      category: "AC Service",
      price: 70,
      discount: 15,
      discountedPrice: Math.round(70 - (70 * 15) / 100),
      image: "/api/placeholder/400/300",
      rating: 4.8,
      reviews: 128,
    },
    {
      id: 2,
      name: "Deep Bathroom & Kitchen Cleaning",
      description: "Complete deep cleaning solution for your home.",
      category: "Cleaning",
      price: 90,
      discount: 20,
      discountedPrice: Math.round(90 - (90 * 20) / 100),
      image: "/api/placeholder/400/300",
      rating: 4.6,
      reviews: 95,
    },
    {
      id: 3,
      name: "Expert Carpenter Service",
      description: "Professional woodwork and furniture repair.",
      category: "Carpenter",
      price: 60,
      discount: 10,
      discountedPrice: Math.round(60 - (60 * 10) / 100),
      image: "/api/placeholder/400/300",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: "Emergency Plumbing",
      description: "24/7 emergency plumbing services.",
      category: "Plumbing",
      price: 85,
      discount: 0,
      discountedPrice: 85,
      image: "/api/placeholder/400/300",
      rating: 4.9,
      reviews: 203,
    },
    {
      id: 5,
      name: "House Painting",
      description: "Complete house painting solutions.",
      category: "Painting",
      price: 120,
      discount: 25,
      discountedPrice: Math.round(120 - (120 * 25) / 100),
      image: "/api/placeholder/400/300",
      rating: 4.5,
      reviews: 178,
    },
    {
      id: 6,
      name: "Electrical Repairs",
      description: "Professional electrical repair services.",
      category: "Electrical",
      price: 55,
      discount: 5,
      discountedPrice: Math.round(55 - (55 * 5) / 100),
      image: "/api/placeholder/400/300",
      rating: 4.8,
      reviews: 142,
    },
    {
      id: 7,
      name: "Pest Control",
      description: "Complete pest control treatment.",
      category: "Pest Control",
      price: 95,
      discount: 15,
      discountedPrice: Math.round(95 - (95 * 15) / 100),
      image: "/api/placeholder/400/300",
      rating: 4.7,
      reviews: 167,
    },
    {
      id: 8,
      name: "Appliance Repair",
      description: "Expert appliance repair service.",
      category: "Appliances",
      price: 75,
      discount: 10,
      discountedPrice: Math.round(75 - (75 * 10) / 100),
      image: "/api/placeholder/400/300",
      rating: 4.6,
      reviews: 189,
    },
  ];
  