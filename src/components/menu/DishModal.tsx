import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Check, AlertCircle } from 'lucide-react';
import { MenuItem, DishVariant } from '../../types';
import { useCart } from '../../context/CartContext';

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<DishVariant | null>(() => {
    if (item.variants && item.variants.length > 0) {
      return item.variants.find((v) => v.available && v.price > 0) || null;
    }
    return null;
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const activePrice = selectedVariant ? selectedVariant.price : item.price;
  const totalPrice = (activePrice * quantity).toFixed(2);

  const handleAddToCart = () => {
    if (item.isMatrixDish && (!selectedVariant || selectedVariant.price <= 0)) {
      return;
    }

    addItem({
      menuItemId: item.id,
      name: item.name,
      price: activePrice,
      quantity,
      variantName: selectedVariant?.name,
      specialInstructions: specialInstructions.trim() || undefined,
      imageUrl: item.imageUrl,
      categoryName: item.categoryName,
    });

    setAddedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-[#1F1916] border border-[#EDE6DC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#1F1916] hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-md border border-[#EDE6DC]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Image */}
        <div className="relative h-60 bg-[#F5EFE6] overflow-hidden">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7A1228] bg-white px-3.5 py-1 rounded-full shadow-sm border border-[#EDE6DC]">
              {item.categoryName}
            </span>

            {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
              <span className="bg-[#1F1916]/90 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>{item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Medium' : 'Hot'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#1F1916]">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm text-[#6B5E57] mt-2 font-normal leading-relaxed">
                {item.description}
              </p>
            )}
            {item.extraNotes && (
              <p className="text-xs text-[#7A1228] mt-2 font-medium bg-[#7A1228]/10 p-3 rounded-2xl border border-[#7A1228]/20">
                {item.extraNotes}
              </p>
            )}
          </div>

          {/* Variants Selector for Category 5 (Classic Dishes) */}
          {item.variants && item.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block uppercase tracking-wider text-xs font-bold text-[#7A1228]">
                Select Option / Protein:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.variants.map((variant) => {
                  const isSelected = selectedVariant?.name === variant.name;
                  const isConfigured = variant.price > 0 && variant.available;

                  return (
                    <button
                      key={variant.name}
                      type="button"
                      disabled={!isConfigured}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 rounded-2xl text-left text-xs transition-all cursor-pointer border ${
                        !isConfigured
                          ? 'opacity-40 bg-stone-100 border-stone-200 cursor-not-allowed text-stone-400'
                          : isSelected
                          ? 'bg-[#7A1228]/10 border-[#7A1228] text-[#1F1916] ring-2 ring-[#7A1228]/30 font-bold'
                          : 'bg-[#FAF7F2] border-[#EDE6DC] hover:border-[#7A1228]/50 text-[#1F1916]'
                      }`}
                    >
                      <div className="font-bold">{variant.name}</div>
                      <div className="text-[11px] font-bold text-[#7A1228] mt-0.5">
                        {isConfigured ? `£${variant.price.toFixed(2)}` : 'Not Configured'}
                      </div>
                    </button>
                  );
                })}
              </div>
              {item.variants.some((v) => v.price <= 0) && (
                <p className="text-[11px] text-[#6B5E57] flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#7A1228]" />
                  <span>Missing prices from the printed menu cannot be ordered online until configured.</span>
                </p>
              )}
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#1F1916]">
              Special Requests or Cooking Preferences (Optional):
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. extra sauce, milder spice, allergy notice..."
              rows={2}
              maxLength={200}
              className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-3.5 py-2.5 text-xs text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228] resize-none"
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EDE6DC]">
            <span className="uppercase tracking-wider text-xs font-bold text-[#1F1916]">
              Quantity:
            </span>
            <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#EDE6DC] rounded-full p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white text-[#1F1916] hover:bg-[#EDE6DC] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-[#1F1916]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="w-7 h-7 rounded-full bg-white text-[#1F1916] hover:bg-[#EDE6DC] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-[#FAF7F2] border-t border-[#EDE6DC] flex items-center justify-between gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#6B5E57] block font-medium">Total</span>
            <span className="text-2xl font-bold text-[#7A1228]">
              £{totalPrice}
            </span>
          </div>

          <button
            type="button"
            disabled={activePrice <= 0 || addedSuccess}
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-6 uppercase tracking-wider text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 ${
              addedSuccess
                ? 'bg-emerald-700 text-white shadow-lg'
                : activePrice <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#7A1228] hover:bg-[#5C0C1D] text-white shadow-md hover:shadow-lg'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Added to Order!</span>
              </>
            ) : (
              <span>Add to Order • £{totalPrice}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
