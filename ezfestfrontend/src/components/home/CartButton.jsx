import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CartButton({ count }) {
  return (
    <Link to={createPageUrl("Cart")}>
      <div className="relative p-2 bg-white/20 rounded-xl">
        <ShoppingCart className="w-5 h-5 text-white" />
        <AnimatePresence>
          {count > 0 && (
            <motion.div 
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {count}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}