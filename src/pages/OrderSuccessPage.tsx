import React from 'react';
import { CheckCircle2, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

interface OrderSuccessPageProps {
  orderNumber: string;
  onNavigate: (page: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderNumber,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#EDE6DC] rounded-3xl p-8 sm:p-12 text-center shadow-sm space-y-6">
          
          <div className="w-20 h-20 rounded-full bg-[#7A1228]/10 flex items-center justify-center mx-auto text-[#7A1228] shadow-sm border border-[#7A1228]/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A1228]">
              Order Received Successfully
            </span>
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#1F1916]">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E57] font-normal max-w-md mx-auto leading-relaxed">
              Our kitchen has received your order and our chefs are preparing your authentic Indian dishes.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#FAF7F2] border border-[#EDE6DC] p-6 rounded-2xl text-left text-xs space-y-3.5">
            <div className="flex justify-between items-center border-b border-[#EDE6DC] pb-3">
              <span className="text-[#6B5E57]">Order Reference:</span>
              <span className="text-base font-bold text-[#7A1228]">
                {orderNumber || 'RSH-PENDING'}
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#7A1228] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#6B5E57] block">Estimated Preparation:</span>
                <span className="font-semibold text-[#1F1916]">Approximately 25 – 35 minutes</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#7A1228] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#6B5E57] block">Collection Address:</span>
                <span className="font-semibold text-[#1F1916]">Rashoi, 58 Updown Hill, Windlesham, Surrey GU20 6DX</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#7A1228] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#6B5E57] block">Questions or Directions:</span>
                <span className="font-semibold text-[#7A1228]">01276 452 197 / 01276 453 388</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3.5 px-4 uppercase tracking-wider text-xs font-semibold text-[#1F1916] hover:text-[#7A1228] bg-[#FAF7F2] hover:bg-[#EDE6DC] rounded-full cursor-pointer transition-colors border border-[#EDE6DC]"
            >
              Return to Homepage
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className="flex-1 py-3.5 px-4 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore More Dishes</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
