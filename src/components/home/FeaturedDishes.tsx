import React from 'react';
import { Sparkles, Plus, Flame, ArrowRight } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface FeaturedDishesProps {
  items: MenuItem[];
  onNavigate: (page: string) => void;
  onSelectItem?: (item: MenuItem) => void;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({ items, onNavigate, onSelectItem }) => {
  const { addItem } = useCart();

  const featured = items.filter((item) =>
    ['spec-1', 'tan-7', 'spec-2', 'spec-18', 'thali-1', 'biri-1'].includes(item.id)
  ).slice(0, 4);

  const displayList = featured.length ? featured : items.slice(0, 4);

  return (
    <section className="py-20 sm:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1228] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Culinary Highlights
            </span>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1916]">
              Chef's Signature Dishes
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl font-normal leading-relaxed">
              Crafted with authentic ground spices and clay oven roasting techniques perfected since 1989.
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-2 uppercase tracking-wider text-xs font-bold text-[#7A1228] hover:text-[#5C0C1D] transition-colors group cursor-pointer"
          >
            <span>View Full Food Menu (15 Categories)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dish Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#EDE6DC] hover:border-[#7A1228]/40 hover:shadow-xl transition-all duration-300 flex flex-col group shadow-sm"
            >
              {/* Dish Photo */}
              <div className="relative h-56 overflow-hidden bg-[#F5EFE6]">
                <img
                  src={dish.imageUrl || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'}
                  alt={dish.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                
                {/* Category Tag */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#7A1228] text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-sm border border-[#EDE6DC]">
                  {dish.categoryName}
                </span>

                {dish.spiceLevel && dish.spiceLevel > 0 && (
                  <span className="absolute top-3 right-3 bg-[#1F1916]/90 text-[#D4AF37] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>{dish.spiceLevel === 1 ? 'Mild' : dish.spiceLevel === 2 ? 'Medium' : 'Hot'}</span>
                  </span>
                )}
              </div>

              {/* Dish Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-['Playfair_Display'] text-base font-bold text-[#1F1916] group-hover:text-[#7A1228] transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-[#6B5E57] line-clamp-2 leading-relaxed font-normal">
                    {dish.description || 'Authentic traditional recipe prepared with fresh aromatic herbs and spices.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EDE6DC] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#6B5E57] block font-medium">Price</span>
                    <span className="text-lg font-bold text-[#7A1228]">
                      £{dish.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectItem) {
                        onSelectItem(dish);
                      } else {
                        addItem({
                          menuItemId: dish.id,
                          name: dish.name,
                          price: dish.price,
                          quantity: 1,
                          imageUrl: dish.imageUrl,
                          categoryName: dish.categoryName,
                        });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full transition-all cursor-pointer shadow-sm"
                    title="Add to order"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 10% Discount Callout */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 border border-amber-200/80 text-[#1F1916] text-xs uppercase tracking-wider font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>All online orders for collection receive an automatic 10% discount at checkout</span>
          </div>
        </div>

      </div>
    </section>
  );
};
