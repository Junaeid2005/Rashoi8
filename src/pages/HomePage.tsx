import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { FeaturedDishes } from '../components/home/FeaturedDishes';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { DishModal } from '../components/menu/DishModal';
import { MenuItem, CustomerReview } from '../types';
import { Clock, MapPin, Phone } from 'lucide-react';

interface HomePageProps {
  menuItems: MenuItem[];
  reviews: CustomerReview[];
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  menuItems,
  reviews,
  onNavigate,
}) => {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  return (
    <div className="bg-[#FAF7F2] text-[#1F1916]">
      {/* Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* Featured Signature Dishes */}
      <FeaturedDishes
        items={menuItems}
        onNavigate={onNavigate}
        onSelectItem={(dish) => setSelectedDish(dish)}
      />

      {/* Heritage & About Section */}
      <AboutSection onNavigate={onNavigate} />

      {/* Quick Booking & Opening Hours Banner in Warm Dark Tone */}
      <section className="py-16 bg-[#1C1514] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            
            {/* Hours */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center justify-center md:justify-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" /> Open 7 Days A Week
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#FAF7F2]">Lunch & Dinner Service</h3>
              <p className="text-xs text-[#E8DFD8] leading-relaxed font-light">
                Lunch: 12:00 PM – 2:30 PM <br />
                Dinner: 5:30 PM – 11:00 PM
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" /> Windlesham Village
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#FAF7F2]">58 Updown Hill</h3>
              <p className="text-xs text-[#E8DFD8] leading-relaxed font-light">
                Windlesham, Surrey, GU20 6DX <br />
                Free customer parking available
              </p>
            </div>

            {/* Direct Booking CTA */}
            <div className="flex flex-col justify-center items-center md:items-start gap-3">
              <div className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Table Reservations & Takeaway Orders:
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => onNavigate('reservations')}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C14F] text-[#1F1916] uppercase tracking-wider text-xs font-bold rounded-full shadow-md cursor-pointer transition-all"
                >
                  Book Table
                </button>
                <a
                  href="tel:01276452197"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider text-xs font-bold rounded-full flex items-center gap-1.5 cursor-pointer transition-colors border border-white/20"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>01276 452 197</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <ReviewsSection reviews={reviews} />

      {/* Modal for customized item addition */}
      {selectedDish && (
        <DishModal item={selectedDish} onClose={() => setSelectedDish(null)} />
      )}
    </div>
  );
};
