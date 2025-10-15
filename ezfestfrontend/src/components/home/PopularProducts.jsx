import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function PopularProducts({ products, cart, onAddToCart, onUpdateQuantity, isLoading }) {
  if (isLoading) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Popular</h3>
        <div className="grid grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Popular</h3>
      <div className="grid grid-cols-2 gap-4">
        {products.slice(0, 4).map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            cart={cart}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}