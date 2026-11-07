import React from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  UtensilsCrossed,
  MessageSquareWarning,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1514] text-[#E8DFD8] pt-16 pb-12 shadow-2xl border-t border-[#7A1228]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner: Collection Discount */}
        <div className="bg-[#26171A] rounded-3xl p-6 sm:p-10 shadow-xl mb-14 border border-[#7A1228]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Special Customer Offer
            </span>
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
              10% Discount on Collection Orders
            </h3>
            <p className="text-xs sm:text-sm text-[#BDB0A8] max-w-xl font-normal leading-relaxed">
              Order your favourite authentic dishes online for takeaway and automatically receive 10% off your entire order upon checkout.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo('order')}
              className="px-6 py-3.5 uppercase tracking-wider text-xs font-bold text-[#1F1916] bg-[#D4AF37] hover:bg-[#E5C14F] rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Order Online (Takeaway)
            </button>
            <button
              onClick={() => navigateTo('reservations')}
              className="px-6 py-3.5 uppercase tracking-wider text-xs font-semibold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full transition-colors cursor-pointer border border-white/20"
            >
              Book a Table
            </button>
          </div>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-stone-800">
          
          {/* Column 1: Restaurant Brand & Heritage */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7A1228] flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <span className="font-['Playfair_Display'] text-2xl font-bold text-[#FAF7F2] tracking-wider block">RASHOI</span>
                <span className="text-[10px] tracking-widest uppercase text-[#D4AF37] font-semibold">Indian Cuisine</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#A89C95] font-normal">
              Established in 1989 in Windlesham, Surrey. Rashoi has stood the test of time, bringing authentic Indian culinary traditions, tandoori clay oven specialties, and genuine hospitality to our community for over three decades.
            </p>
            <div className="uppercase tracking-wider text-xs text-[#D4AF37] font-medium pt-1">
              Rashoi Indian Cuisine • Est. 1989
            </div>
          </div>

          {/* Column 2: Hours & Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" /> Opening Hours
            </h4>
            <div className="text-xs space-y-2 text-[#E8DFD8]">
              <p className="font-bold text-white">Open 7 Days a Week</p>
              <div className="bg-[#241A18] p-4 rounded-2xl border border-stone-800 space-y-1.5 shadow-inner">
                <div className="flex justify-between">
                  <span>Lunch:</span>
                  <span className="font-semibold text-[#D4AF37]">12:00 PM – 2:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Dinner:</span>
                  <span className="font-semibold text-[#D4AF37]">5:30 PM – 11:00 PM</span>
                </div>
              </div>
              <p className="text-[11px] text-[#A89C95]">Table bookings available for both lunch & dinner services.</p>
            </div>
            
            <div className="pt-2 uppercase tracking-wider text-xs">
              <div className="text-xs font-bold text-white mb-2">Quick Links</div>
              <div className="flex flex-wrap gap-2 text-[#D2C5BD]">
                <button onClick={() => navigateTo('menu')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Menu</button>
                <span>•</span>
                <button onClick={() => navigateTo('order')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Order (Takeaway)</button>
                <span>•</span>
                <button onClick={() => navigateTo('reservations')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Reservations</button>
                <span>•</span>
                <button onClick={() => navigateTo('about')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">About Us</button>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" /> Contact & Visit
            </h4>
            <div className="text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Rashoi</p>
                  <p>58 Updown Hill, Windlesham</p>
                  <p>Surrey, GU20 6DX</p>
                  <p className="text-[#A89C95]">United Kingdom</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-[#A89C95]">Telephone Bookings & Takeaways:</p>
                  <a href="tel:01276452197" className="block font-bold text-white hover:text-[#D4AF37] transition-colors">
                    01276 452 197
                  </a>
                  <a href="tel:01276453388" className="block font-bold text-white hover:text-[#D4AF37] transition-colors">
                    01276 453 388
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-[#A89C95]">
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                <a href="https://www.rashoi.co.uk" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37]">
                  www.rashoi.co.uk
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Complaints & Feedback */}
          <div className="space-y-4 bg-[#241A18] p-6 rounded-3xl border border-stone-800 shadow-inner">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2">
              <MessageSquareWarning className="w-4 h-4 text-[#D4AF37]" /> Complaints & Feedback
            </h4>
            <p className="text-xs text-[#A89C95] leading-relaxed font-normal">
              We take pride in our culinary standards. Please contact our management team directly regarding complaints, food quality, suggestions, or feedback.
            </p>
            <button
              onClick={() => navigateTo('contact')}
              className="w-full flex items-center justify-between px-4 py-3 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full transition-colors cursor-pointer shadow-sm"
            >
              <span>Submit Feedback</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
            <div className="text-[11px] text-[#A89C95] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Email: info@rashoi.co.uk</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89C95]">
          <div>
            © {new Date().getFullYear()} Rashoi Indian Cuisine. Established 1989. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('contact')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Complaints & Feedback
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-1 text-[#A89C95] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Staff / Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
