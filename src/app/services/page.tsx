"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/src/context/CartContext";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const services = [
  { id: 1, name: "AC Service", price: 70, category: "AC Service", image: "/images/ac-service.jpg" },
  { id: 2, name: "Bathroom & Kitchen Cleaning", price: 90, category: "Bathroom & Kitchen Cleaning", image: "/images/bathroom-kitchen-cleaning.jpg" },
  { id: 3, name: "Carpenter", price: 60, category: "Carpenter", image: "/images/carpenter.jpg" },
  { id: 4, name: "Chimney Repair", price: 80, category: "Chimney Repair", image: "/images/chimney-repair.jpg" },
  { id: 5, name: "Electrician", price: 50, category: "Electrician", image: "/images/electrician.jpg" },
  { id: 6, name: "Microwave Repair", price: 55, category: "Microwave Repair", image: "/images/microwave-repair.jpg" },
  { id: 7, name: "Plumbers", price: 65, category: "Plumbers", image: "/images/plumber.jpg" },
  { id: 8, name: "Refrigerator Repair", price: 75, category: "Refrigerator Repair", image: "/images/refrigerator-repair.jpg" },
  { id: 9, name: "Sofa & Carpet Cleaning", price: 85, category: "Sofa & Carpet Cleaning", image: "/images/sofa-carpet-cleaning.jpg" },
  { id: 10, name: "Washing Machine Repair", price: 70, category: "Washing Machine Repair", image: "/images/washing-machine-repair.jpg" },
  { id: 11, name: "Water Purifier Repair", price: 60, category: "Water Purifier Repair", image: "/images/water-purifier-repair.jpg" },
];

// @ts-ignore
const categories = ["All Products", ...new Set(services.map((s) => s.category))];

const ServicesPage = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    setShowCards(true);
  }, []);

  const filteredServices = services.filter(
    (service) =>
      (selectedCategory === "All Products" || service.category === selectedCategory) &&
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Filter */}
      <div className="fixed top-0 left-0 h-full w-1/4 p-6 pt-24 bg-white shadow-md overflow-y-auto">
  <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
  <ul className="space-y-2">
    {categories.map((category, index) => (
      <li key={category}>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className={`w-full text-left p-2 rounded-lg transition-all duration-75 ease-in-out ${
            selectedCategory === category ? "bg-gray-900 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedCategory(category)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      </li>
    ))}
  </ul>
</div>


      {/* Services List */}
      <div className="w-full md:w-3/4 p-6 pt-20 ml-[25%]">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Our Services</h1>
          <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-2 w-96">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="ml-2 w-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={showCards ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white shadow-md rounded-lg p-4 transition-shadow duration-200 ease-in-out hover:shadow-xl"
            >
              <img src={service.image} alt={service.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-gray-600 mb-2">₹{service.price}</p>
              {cart.some((item: { id: number; }) => item.id === service.id) ? (
                <motion.button
                  className="w-full bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                  onClick={() => removeFromCart(service.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  Remove
                </motion.button>
              ) : (
                <motion.button
                  className="w-full bg-black text-white p-3 rounded-full hover:bg-gray-900"
                  onClick={() => addToCart(service)}
                  whileTap={{ scale: 0.9 }}
                >
                  Add to Cart
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;