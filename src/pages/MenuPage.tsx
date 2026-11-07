import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  Leaf,
  Plus,
  Info,
  Filter,
  Sparkles
} from 'lucide-react';
import { Category, MenuItem } from '../types';
import { DishModal } from '../components/menu/DishModal';
import { useCart } from '../context/CartContext';

interface MenuPageProps {
  categories: Category[];
  menuItems: MenuItem[];
  onNavigate: (page: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  categories,
  menuItems,
}) => {
  const { addItem } = useCart();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Filter items based on active filters
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategorySlug !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategorySlug);
        if (cat && item.categoryId !== cat.id) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) || false;
        const matchesCategory = item.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      // Dietary filter
      if (dietaryFilter !== 'all') {
        if (dietaryFilter === 'Vegetarian' && !item.dietary?.includes('Vegetarian')) return false;
        if (dietaryFilter === 'Vegan' && !item.dietary?.includes('Vegan')) return false;
        if (dietaryFilter === 'Gluten-Free' && !item.dietary?.includes('Gluten-Free')) return false;
      }

      return true;
    });
  }, [menuItems, categories, selectedCategorySlug, searchQuery, dietaryFilter]);

  // Group items by category for structured browsing
  const groupedCategories = useMemo(() => {
    const activeCats = selectedCategorySlug === 'all'
      ? categories.filter((c) => c.active).sort((a, b) => a.displayOrder - b.displayOrder)
      : categories.filter((c) => c.slug === selectedCategorySlug);

    return activeCats.map((cat) => ({
      category: cat,
      items: filteredItems
        .filter((item) => item.categoryId === cat.id)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    })).filter((group) => group.items.length > 0 || selectedCategorySlug !== 'all');
  }, [categories, filteredItems, selectedCategorySlug]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] pb-28">
      {/* Top Banner: Warm Dark Charcoal with Burgundy & Gold */}
      <div className="bg-[#1C1514] text-white py-14 px-4 text-center border-b border-[#7A1228]/40">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] inline-block">
            Traditional Indian Cuisine • Est. 1989
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-6xl font-bold text-[#FAF7F2]">
            Our Complete Food Menu
          </h1>
          <p className="text-sm sm:text-base text-[#E8DFD8] max-w-2xl mx-auto font-light leading-relaxed">
            Every dish is cooked fresh to order using traditional methods, authentic spices, and our authentic charcoal clay tandoor.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#28181B] px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mt-2 border border-[#7A1228]/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>10% Discount applied automatically on all collection orders</span>
          </div>
        </div>
      </div>

      {/* Sticky Navigation & Search Bar */}
      <div className="sticky top-20 sm:top-22 z-30 bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#EDE6DC] py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Search & Dietary Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B5E57]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Tikka, Biriyani, Balti, Naan)..."
                className="w-full bg-white border border-[#EDE6DC] rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228] shadow-sm"
              />
            </div>

            {/* Dietary Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-[#6B5E57] shrink-0" />
              {[
                { id: 'all', label: 'All Dishes' },
                { id: 'Vegetarian', label: 'Vegetarian' },
                { id: 'Vegan', label: 'Vegan' },
                { id: 'Gluten-Free', label: 'Gluten-Free' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setDietaryFilter(pill.id)}
                  className={`uppercase tracking-wider px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    dietaryFilter === pill.id
                      ? 'bg-[#7A1228] text-white shadow-sm'
                      : 'bg-white text-[#1F1916] hover:bg-[#F5EFE6] border border-[#EDE6DC]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

          </div>

          {/* Horizontal Scrolling Category Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategorySlug('all')}
              className={`uppercase tracking-wider text-xs px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategorySlug === 'all'
                  ? 'bg-[#7A1228] text-white shadow-sm'
                  : 'bg-white text-[#1F1916] hover:bg-[#F5EFE6] border border-[#EDE6DC]'
              }`}
            >
              All Categories
            </button>

            {categories
              .filter((c) => c.active)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((cat) => {
                const isSelected = selectedCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`uppercase tracking-wider text-xs px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#7A1228] text-white shadow-sm'
                        : 'bg-white text-[#1F1916] hover:bg-[#F5EFE6] border border-[#EDE6DC]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
          </div>

        </div>
      </div>

      {/* Main Menu Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {groupedCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EDE6DC] p-8 max-w-md mx-auto shadow-sm">
            <Info className="w-10 h-10 text-[#7A1228] mx-auto mb-3" />
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1F1916]">No dishes match your search</h3>
            <p className="text-xs text-[#6B5E57] mt-1 mb-4">Try clearing your filters or search terms.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setSelectedCategorySlug('all');
              }}
              className="px-5 py-2.5 bg-[#7A1228] hover:bg-[#5C0C1D] text-white uppercase tracking-wider text-xs font-bold rounded-full cursor-pointer shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          groupedCategories.map(({ category, items }) => (
            <section key={category.id} id={category.slug} className="scroll-mt-48">
              
              {/* Category Header */}
              <div className="border-b border-[#EDE6DC] pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#7A1228] tracking-wide">
                    {category.name}
                  </h2>
                  <span className="uppercase tracking-wider text-xs text-[#6B5E57] font-semibold">
                    {items.length} {items.length === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>
                {category.description && (
                  <p className="text-xs sm:text-sm text-[#6B5E57] mt-1 italic font-light">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Special Note for Category 5 (Classic Dishes Matrix) */}
              {category.slug === 'classic-dishes' && (
                <div className="mb-6 p-5 rounded-2xl bg-[#FDF8EE] border border-amber-200/80 text-xs text-[#1F1916] flex items-start gap-3.5 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-[#C59B27]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#7A1228] block mb-0.5">Customizable Protein Options</span>
                    <span className="text-[#6B5E57] leading-relaxed">
                      Each classic recipe is prepared fresh with your choice of <strong className="text-[#1F1916]">Chicken (£9.95 - £11.95)</strong>, <strong className="text-[#1F1916]">Lamb (£9.95 - £11.95)</strong>, <strong className="text-[#1F1916]">Prawn (£10.95)</strong>, <strong className="text-[#1F1916]">King Prawn (£11.95 - £12.95)</strong>, or <strong className="text-[#1F1916]">Vegetable (£8.95)</strong>. Click any dish to select your option and order.
                    </span>
                  </div>
                </div>
              )}

              {/* Special Note for Category 15 (Sunday Special) */}
              {category.slug === 'sunday-special' && (
                <div className="mb-6 p-5 rounded-2xl bg-[#FDF8EE] border border-amber-200/80 text-xs text-[#1F1916] shadow-sm">
                  <h4 className="font-bold text-[#7A1228] text-sm mb-1">Rashoi 4-Course Sunday Feast — £15.95 per person</h4>
                  <p className="text-[#6B5E57] leading-relaxed">
                    Includes: 1 Starter, 1 Main Dish, 1 Vegetable Side Dish, plus Rice or Plain Naan. (Optional King Prawn Starter: +£1.95, King Prawn Main Dish: +£3.95).
                  </p>
                </div>
              )}

              {/* Dish Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => setSelectedDish(dish)}
                    className="bg-white rounded-3xl overflow-hidden border border-[#EDE6DC] hover:border-[#7A1228]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-sm"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-52 overflow-hidden bg-[#F5EFE6]">
                        <img
                          src={dish.imageUrl || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'}
                          alt={dish.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                        {/* Spice & Dietary Badges */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {dish.dietary?.includes('Vegetarian') && (
                            <span className="p-1.5 rounded-full bg-white/95 text-emerald-700 shadow-sm border border-[#EDE6DC]" title="Vegetarian">
                              <Leaf className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {dish.spiceLevel && dish.spiceLevel > 0 && (
                            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#1F1916]/90 text-[10px] font-bold text-[#D4AF37] shadow-sm">
                              <Flame className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                              <span>{dish.spiceLevel === 1 ? 'Mild' : dish.spiceLevel === 2 ? 'Med' : 'Hot'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-['Playfair_Display'] text-base font-bold text-[#1F1916] group-hover:text-[#7A1228] transition-colors leading-snug">
                            {dish.name}
                          </h3>
                        </div>

                        <p className="text-xs text-[#6B5E57] line-clamp-2 leading-relaxed font-normal">
                          {dish.description || 'Authentic traditional recipe prepared with fresh herbs and aromatic spices.'}
                        </p>

                        {/* Category 5 Protein preview note */}
                        {dish.isMatrixDish && (
                          <div className="pt-1 text-[11px] font-semibold text-[#7A1228]">
                            Options: Chicken, Lamb, Prawn, King Prawn & Veg
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 pt-0">
                      <div className="pt-3 border-t border-[#EDE6DC] flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#6B5E57] block font-medium">Price</span>
                          <span className="text-lg font-bold text-[#7A1228]">
                            {dish.isMatrixDish ? 'From £8.95' : `£${dish.price.toFixed(2)}`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dish.isMatrixDish) {
                              setSelectedDish(dish);
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
                          className="flex items-center gap-1.5 px-4 py-2 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full transition-all cursor-pointer shadow-sm"
                          title="Add item"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{dish.isMatrixDish ? 'Select' : 'Add'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </section>
          ))
        )}
      </div>

      {/* Dish Customization Modal */}
      {selectedDish && (
        <DishModal item={selectedDish} onClose={() => setSelectedDish(null)} />
      )}
    </div>
  );
};
