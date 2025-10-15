import React from "react";
import { Wine, Beer, UtensilsCrossed, Package } from "lucide-react";
import { motion } from "framer-motion";

const AllItemsIcon = () => (
  <div className="grid grid-cols-2 gap-1.5 p-1">
    <Wine className="w-3.5 h-3.5" />
    <Beer className="w-3.5 h-3.5" />
    <UtensilsCrossed className="w-3.5 h-3.5" />
    <Package className="w-3.5 h-3.5" />
  </div>
);

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange, isLoading }) {
  const iconMap = {
    "Drinks": Wine,
    "Cervejas": Beer,
    "Comidas": UtensilsCrossed,
    "Combos": Package
  };

  const allCategories = [
    { id: "all", name: "Todos" },
    ...categories,
  ];

  if (isLoading) {
    return (
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col items-center min-w-0">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl animate-pulse mb-2" />
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
      {allCategories.map((category, index) => {
        const isSelected = selectedCategory === category.id;
        const IconComponent = category.id === 'all' ? AllItemsIcon : (iconMap[category.name] || Package);
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex flex-col items-center min-w-0 transition-all duration-300 ${
              isSelected ? 'scale-110' : 'hover:scale-105'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 ${
              isSelected 
                ? 'bg-[#7C9885] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <span className={`text-xs font-medium transition-colors ${
              isSelected ? 'text-[#7C9885]' : 'text-gray-600'
            }`}>
              {category.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}