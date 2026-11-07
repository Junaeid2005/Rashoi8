import React from 'react';
import { Star, Quote, Award } from 'lucide-react';
import { CustomerReview } from '../../types';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const displayReviews = reviews.filter((r) => r.featured).slice(0, 3);

  return (
    <section className="py-20 sm:py-24 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1228] flex items-center justify-center gap-2">
            <Award className="w-3.5 h-3.5 text-[#C59B27]" /> Customer Reflections
          </span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1916]">
            What Our Guests Say
          </h2>
          <p className="text-sm text-[#6B5E57] font-normal leading-relaxed">
            Genuine dining experiences from guests who have celebrated evenings and family meals at Rashoi in Windlesham.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-8 border border-[#EDE6DC] relative shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#7A1228]/20 mb-2" />
                
                {/* 5 Stars in Warm Gold */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'text-[#D4AF37] fill-[#D4AF37]'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-[#1F1916] leading-relaxed italic font-light">
                  "{rev.reviewText}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#EDE6DC] mt-6 flex items-center gap-3">
                {rev.photoUrl ? (
                  <img
                    src={rev.photoUrl}
                    alt={rev.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#7A1228] flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                    {rev.customerName[0]}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-[#1F1916]">{rev.customerName}</h4>
                  <span className="text-[11px] text-[#6B5E57]">{rev.date || 'Verified Diner'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
