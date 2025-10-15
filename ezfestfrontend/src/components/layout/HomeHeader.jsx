import React from 'react';
import { Bell } from "lucide-react";
import CartButton from '../home/CartButton';

export default function HomeHeader({ userName, welcome, cartItemsCount }) {
  return (
    <div className="px-6 pt-12 pb-8 text-white absolute top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">
            {welcome.title(userName)}
          </h1>
          <p className="text-white/80 text-sm">{welcome.subtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-white/20 rounded-xl">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <CartButton count={cartItemsCount} />
        </div>
      </div>
    </div>
  );
}