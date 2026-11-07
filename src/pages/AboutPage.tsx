import React from 'react';
import { Award, Flame, HeartHandshake, Sparkles, Utensils } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1228]/10 text-[#7A1228] text-xs uppercase tracking-[0.2em] font-bold border border-[#7A1228]/20">
            <Award className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Established 1989 • Windlesham, Surrey</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-6xl font-bold text-[#1F1916]">
            Our Heritage & Story
          </h1>
          <p className="font-['Playfair_Display'] italic text-lg sm:text-xl text-[#7A1228]">
            Rashoi — The Authentic Indian Kitchen
          </p>
        </div>

        {/* Narrative Card */}
        <div className="bg-white border border-[#EDE6DC] rounded-3xl p-8 sm:p-14 shadow-sm space-y-10">
          
          <div className="space-y-5 text-base sm:text-lg text-[#1F1916] leading-relaxed font-normal">
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#1F1916] border-b border-[#EDE6DC] pb-4">
              WELCOME TO RASHOI WINDLESHAM
            </h2>

            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#7A1228] first-letter:mr-3 first-letter:float-left first-letter:font-['Playfair_Display']">
              India is a land of culture and tradition, a land of many cuisines. This is not only due to its sheer size, but also due to the impact of various phases in her history.
            </p>

            <p>
              <strong className="text-[#7A1228] font-bold">Rashoi or The Indian Kitchen</strong> has survived the impact over the centuries, has matured over the years and imbibed the best of all cultures.
            </p>

            <p className="text-[#6B5E57]">
              Since opening our doors at 58 Updown Hill in 1989, Rashoi has been a cornerstone of authentic Indian dining in Surrey. We have stayed true to traditional culinary roots while welcoming diners with warmth, hospitality, and pride in our craft.
            </p>
          </div>

          {/* Photographic Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="relative rounded-3xl overflow-hidden h-72 shadow-md border-4 border-[#FAF7F2]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Charcoal Clay Tandoor Cooking"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80" />
              <span className="absolute bottom-4 left-5 text-xs uppercase tracking-wider font-bold text-white bg-[#7A1228] px-3 py-1 rounded-full shadow-sm">
                Traditional Charcoal Clay Tandoor
              </span>
            </div>

            <div className="relative rounded-3xl overflow-hidden h-72 shadow-md border-4 border-[#FAF7F2]">
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
                alt="Aromatic Slow Simmered Spices"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80" />
              <span className="absolute bottom-4 left-5 text-xs uppercase tracking-wider font-bold text-white bg-[#7A1228] px-3 py-1 rounded-full shadow-sm">
                Freshly Ground Spices & Secret Masalas
              </span>
            </div>
          </div>

          {/* Three Cornerstones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#EDE6DC]">
            
            <div className="space-y-2 bg-[#FAF7F2] p-6 rounded-2xl border border-[#EDE6DC]">
              <div className="w-10 h-10 rounded-xl bg-[#7A1228]/10 flex items-center justify-center text-[#7A1228] mb-2">
                <Flame className="w-5 h-5 text-[#C59B27]" />
              </div>
              <h3 className="font-bold text-sm text-[#1F1916]">The Charcoal Clay Oven</h3>
              <p className="text-xs text-[#6B5E57] leading-relaxed">
                All our tandoori specialties are charcoal grilled at intense heat in our traditional clay oven, infusing natural smokiness and sealing in natural juices.
              </p>
            </div>

            <div className="space-y-2 bg-[#FAF7F2] p-6 rounded-2xl border border-[#EDE6DC]">
              <div className="w-10 h-10 rounded-xl bg-[#7A1228]/10 flex items-center justify-center text-[#7A1228] mb-2">
                <Sparkles className="w-5 h-5 text-[#C59B27]" />
              </div>
              <h3 className="font-bold text-sm text-[#1F1916]">Pure Ingredients</h3>
              <p className="text-xs text-[#6B5E57] leading-relaxed">
                We select whole spices, fresh coriander, ginger, garlic, and fresh meats and fish, preparing every curry from scratch without artificial shortcuts.
              </p>
            </div>

            <div className="space-y-2 bg-[#FAF7F2] p-6 rounded-2xl border border-[#EDE6DC]">
              <div className="w-10 h-10 rounded-xl bg-[#7A1228]/10 flex items-center justify-center text-[#7A1228] mb-2">
                <HeartHandshake className="w-5 h-5 text-[#C59B27]" />
              </div>
              <h3 className="font-bold text-sm text-[#1F1916]">Surrey Hospitality</h3>
              <p className="text-xs text-[#6B5E57] leading-relaxed">
                Serving our local community for over 35 years. Whether you dine in our restaurant or order takeaway, you are received as an honoured guest.
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('menu')}
              className="px-8 py-3.5 uppercase tracking-wider text-xs font-bold text-[#1F1916] bg-[#D4AF37] hover:bg-[#E5C14F] rounded-full shadow-md transition-all cursor-pointer"
            >
              Browse Full Food Menu
            </button>
            <button
              onClick={() => onNavigate('reservations')}
              className="px-8 py-3.5 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full transition-all cursor-pointer shadow-md"
            >
              Reserve Table Online
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
