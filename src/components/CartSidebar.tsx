"use client";

import { useCart } from "@/src/context/CartContext";
import { X } from "lucide-react";
import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";

const CartSidebar = ({isOpen, onClose}: { isOpen: boolean; onClose: () => void }) => {
  const {cart, removeFromCart} = useCart();

  return (
      <div
          className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-gradient-to-b from-gray-900 to-black text-white shadow-lg border-l border-gray-700 
      transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} z-50`}
      >
        {/* Close Button */}
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          <X size={24}/>
        </button>

        {/* Sidebar Content */}
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>

          {/* Empty Cart Message */}
          {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty</p>
          ) : (
              <ul className="space-y-4 mb-6">
                {cart.map((item: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
              <li
                key={item.id}
                className="bg-white text-black flex justify-between p-3 rounded-lg shadow-md"
              >
                <span>{item.name} - ${item.price}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Proceed to Pay Button */}
        <Link
          href="/payment"
          className={`mt-auto text-center text-white py-3 rounded-lg transition duration-300 ${
            cart.length > 0
              ? "bg-gradient-to-r from-green-500 to-green-700 hover:opacity-80"
              : "bg-gray-600 cursor-not-allowed opacity-50"
          }`}
          onClick={(e) => cart.length === 0 && e.preventDefault()}
        >
          Checkout Page
        </Link>
      </div>
    </div>
  );
};

export default CartSidebar;
