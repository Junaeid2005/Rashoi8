import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, Clock, Award, Flame, Phone } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#1C1514] text-white">
      {/* Background Photography with Sophisticated Deep Warm Burgundy Scrim */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 scale-105 ${
            videoLoaded ? 'opacity-35' : 'opacity-0'
          }`}
          poster="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1920&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-table-full-of-delicious-food-40986-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Fallback Image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            videoLoaded ? 'opacity-25' : 'opacity-40'
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1920&q=85')`,
          }}
        />

        {/* Atmospheric Warm Scrim - Perfectly balanced dark warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1514] via-[#241719]/80 to-[#1C1514]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7A1228]/35 via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        
        {/* Heritage Tag with Warm Gold */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1228]/80 text-[#D4AF37] text-xs uppercase tracking-[0.25em] mb-6 shadow-md backdrop-blur-md border border-[#D4AF37]/30">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Windlesham, Surrey • Established 1989</span>
        </div>

        {/* Main Title: Playfair Display typography */}
        <h1 className="font-['Playfair_Display'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#FAF7F2] tracking-wide leading-tight mb-4 drop-shadow-sm">
          RASHOI
          <span className="block font-['Playfair_Display'] italic font-normal text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] mt-2">
            Authentic Traditional Indian Cuisine
          </span>
        </h1>

        {/* Introduction */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#E8DFD8] font-light leading-relaxed mb-10">
          Celebrating over 35 years of culinary heritage in Surrey. Savor charcoal-grilled clay oven tandoori, fragrant slow-simmered curries, and freshly baked naans prepared with pure ground spices.
        </p>

        {/* CTA Buttons: Explore Menu, Book a Table, Order Online */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-14">
          
          {/* Explore Menu CTA */}
          <button
            onClick={() => onNavigate('menu')}
            className="w-full sm:w-auto px-8 py-4 uppercase tracking-wider text-xs sm:text-sm font-bold text-white bg-[#7A1228] hover:bg-[#8F1630] rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group border border-[#D4AF37]/30"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Explore Menu</span>
          </button>

          {/* Book a Table CTA */}
          <button
            onClick={() => onNavigate('reservations')}
            className="w-full sm:w-auto px-7 py-4 uppercase tracking-wider text-xs sm:text-sm font-semibold text-[#1F1916] bg-[#D4AF37] hover:bg-[#E5C14F] rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#7A1228]" />
            <span>Book a Table</span>
          </button>

          {/* Order Online CTA with 10% discount badge */}
          <button
            onClick={() => onNavigate('order')}
            className="w-full sm:w-auto px-6 py-4 uppercase tracking-wider text-xs sm:text-sm font-medium text-[#FAF7F2] hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-sm border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Order Takeaway (10% Off)</span>
          </button>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6">
          
          <div className="bg-[#241B19]/80 p-4 rounded-2xl text-center backdrop-blur-md shadow-lg border border-[#7A1228]/30 hover:border-[#D4AF37]/40 transition-all">
            <Flame className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
            <p className="text-xs font-bold text-[#FAF7F2]">Charcoal Tandoor</p>
            <p className="text-[11px] text-[#A89C95]">Authentic Clay Oven</p>
          </div>

          <div className="bg-[#241B19]/80 p-4 rounded-2xl text-center backdrop-blur-md shadow-lg border border-[#7A1228]/30 hover:border-[#D4AF37]/40 transition-all">
            <Clock className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
            <p className="text-xs font-bold text-[#FAF7F2]">Open 7 Days</p>
            <p className="text-[11px] text-[#A89C95]">Lunch & Dinner</p>
          </div>

          <div className="bg-[#241B19]/80 p-4 rounded-2xl text-center backdrop-blur-md shadow-lg border border-[#7A1228]/30 hover:border-[#D4AF37]/40 transition-all">
            <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
            <p className="text-xs font-bold text-[#FAF7F2]">Established 1989</p>
            <p className="text-[11px] text-[#A89C95]">35+ Years Heritage</p>
          </div>

          <div className="bg-[#241B19]/80 p-4 rounded-2xl text-center backdrop-blur-md shadow-lg border border-[#7A1228]/30 hover:border-[#D4AF37]/40 transition-all">
            <Phone className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
            <p className="text-xs font-bold text-[#FAF7F2]">01276 452 197</p>
            <p className="text-[11px] text-[#A89C95]">Direct Bookings</p>
          </div>

        </div>

      </div>
    </div>
  );
};
