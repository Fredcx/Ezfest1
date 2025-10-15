import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageHeader({ title, subtitle, hideBackButton, backPath }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="px-4 pt-12 pb-6 text-white bg-[#7C9885]">
      <div className="flex items-center relative">
        {!hideBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="absolute left-0 hover:bg-white/10 z-10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold leading-none">{title}</h1>
          {subtitle && <p className="text-sm text-white/80 mt-1">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}