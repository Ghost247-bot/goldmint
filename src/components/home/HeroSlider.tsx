import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  position: 'left' | 'right' | 'center';
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Premium Gold Investments',
    subtitle: 'Discover our exclusive collection of investment-grade gold bars and coins',
    cta: 'Shop Gold Bars',
    ctaLink: '/category/bars',
    image: 'https://images.pexels.com/photos/5116686/pexels-photo-5116686.jpeg',
    position: 'left'
  },
  {
    id: 2,
    title: 'Exquisite Gold Jewelry',
    subtitle: 'Timeless pieces that combine investment value with elegant design',
    cta: 'Explore Jewelry',
    ctaLink: '/category/jewelry',
    image: 'https://images.pexels.com/photos/11627086/pexels-photo-11627086.jpeg',
    position: 'right'
  },
  {
    id: 3,
    title: 'Collector\'s Gold Coins',
    subtitle: 'Rare and limited edition gold coins from mints around the world',
    cta: 'View Coins',
    ctaLink: '/category/coins',
    image: 'https://images.pexels.com/photos/6770775/pexels-photo-6770775.jpeg',
    position: 'center'
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out 
            ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative h-full container-custom mx-auto flex items-center">
            <div 
              className={`max-w-lg text-white p-6 rounded-lg ${
                slide.position === 'left' 
                  ? 'ml-0 mr-auto' 
                  : slide.position === 'right' 
                    ? 'mr-0 ml-auto' 
                    : 'mx-auto text-center'
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={slide.ctaLink} 
                  className="btn btn-primary bg-gold hover:bg-gold-dark"
                >
                  {slide.cta}
                </Link>
                <Link 
                  to="/track-order" 
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-charcoal-dark flex items-center justify-center"
                >
                  <Package size={18} className="mr-2" />
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-gold' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;