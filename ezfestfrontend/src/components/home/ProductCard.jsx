import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProductCard({ product, cart, onAddToCart, onUpdateQuantity, index }) {
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <motion.div 
      className="bg-white rounded-2xl p-3 card-shadow relative overflow-hidden flex flex-col justify-between"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      layout
    >
      <div className="flex-grow">
        {product.image_url ? (
          <div className="w-full h-24 mb-3 rounded-xl overflow-hidden bg-gray-100">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-24 mb-3 rounded-xl bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
            <span className="text-4xl">🍹</span>
          </div>
        )}

        <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="font-bold text-gray-800 text-base">
          R${product.price?.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {quantity === 0 && (
         <button
          onClick={() => onAddToCart(product)}
          className="absolute top-2 right-2 w-8 h-8 bg-[#7C9885] rounded-lg text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

      {quantity > 0 && (
        <motion.div 
          className="flex items-center justify-center bg-gray-100 rounded-lg p-1 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="h-7 w-7 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <motion.span 
            className="text-gray-800 font-bold min-w-[24px] text-center"
            key={quantity}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {quantity}
          </motion.span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="h-7 w-7 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}