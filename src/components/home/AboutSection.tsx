import React from 'react';
import { Award, Clock, HeartHandshake, Utensils } from 'lucide-react';

export const AboutSection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#F5EFE6] relative overflow-hidden border-y border-[#EDE6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Large Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                  alt="Rashoi Charcoal Tandoori Preparation"
                  className="w-full h-[380px] sm:h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Overlapping Secondary Image */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 w-56 h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
                  alt="Fragrant Indian Biryani"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-[#7A1228] text-white p-4 rounded-2xl shadow-xl max-w-[190px] border border-[#D4AF37]/50">
                <span className="block text-3xl font-extrabold font-['Playfair_Display'] text-[#D4AF37] leading-none">1989</span>
                <span className="text-[11px] uppercase tracking-wider text-[#FAF7F2] font-semibold leading-tight block mt-1">
                  Over 35 Years Serving Windlesham & Surrey
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Heritage Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1228] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C59B27]" /> Our Heritage & Story
              </span>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1916] leading-tight">
                WELCOME TO RASHOI WINDLESHAM
              </h2>
            </div>

            <div className="space-y-4 text-[#1F1916] text-base leading-relaxed font-normal">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#7A1228] first-letter:mr-2.5 first-letter:float-left first-letter:font-['Playfair_Display']">
                India is a land of culture and tradition, a land of many cuisines. This is not only due to its sheer size, but also due to the impact of various phases in her history.
              </p>
              
              <p>
                <strong className="font-semibold text-[#7A1228]">Rashoi or The Indian Kitchen</strong> has survived the impact over the centuries, has matured over the years and imbibed the best of all cultures.
              </p>

              <p className="text-[#6B5E57]">
                From our authentic clay oven in which all our tandoori dishes are charcoal grilled to our slow-simmered regional gravies and classic balti creations, every dish is an homage to timeless recipes passed down through generations.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#EDE6DC]">
                <div className="p-2 rounded-xl bg-[#7A1228]/10 shrink-0">
                  <Utensils className="w-4 h-4 text-[#7A1228]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1916]">Traditional Recipes</h4>
                  <p className="text-[11px] text-[#6B5E57]">Ground whole spices</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#EDE6DC]">
                <div className="p-2 rounded-xl bg-[#7A1228]/10 shrink-0">
                  <HeartHandshake className="w-4 h-4 text-[#7A1228]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1916]">Warm Hospitality</h4>
                  <p className="text-[11px] text-[#6B5E57]">Family run & welcoming</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#EDE6DC]">
                <div className="p-2 rounded-xl bg-[#7A1228]/10 shrink-0">
                  <Clock className="w-4 h-4 text-[#7A1228]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1916]">Open 7 Days</h4>
                  <p className="text-[11px] text-[#6B5E57]">Lunch & Dinner</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 uppercase tracking-wider text-xs font-bold text-[#1F1916] bg-white hover:bg-[#FAF7F2] border border-[#7A1228] rounded-full transition-colors cursor-pointer shadow-sm"
              >
                Read Full Story
              </button>
              <button
                onClick={() => onNavigate('reservations')}
                className="px-6 py-3 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full shadow-md transition-all cursor-pointer"
              >
                Reserve Your Table
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
