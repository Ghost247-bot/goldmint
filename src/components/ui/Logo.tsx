import React from 'react';
import { Luggage as GoldNugget } from 'lucide-react';

interface LogoProps {
  isScrolled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ isScrolled = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl'
  };

  return (
    <div className="flex items-center">
      <GoldNugget 
        size={size === 'sm' ? 20 : size === 'md' ? 24 : 28} 
        className="text-gold mr-2" 
      />
      <span className={`font-serif font-semibold ${sizeClasses[size]} ${isScrolled ? 'text-charcoal-dark' : 'text-charcoal-dark'}`}>
        Gold<span className="text-gold">Mint</span>
      </span>
    </div>
  );
};

export default Logo;