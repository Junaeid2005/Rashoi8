import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  CreditCard,
  Building,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { getWebsiteSettings } from '../services/settingsService';

interface OrderOnlinePageProps {
  onNavigate: (page: string) => void;
  onOrderCompleted: (orderNumber: string) => void;
}

export const OrderOnlinePage: React.FC<OrderOnlinePageProps> = ({
  onNavigate,
  onOrderCompleted,
}) => {
  const {
    items,
    orderType,
    setOrderType,
    updateQuantity,
    removeItem,
    clearCart,
    subtotalPence,
    discountPence,
    deliveryFeePence,
    totalPence,
    subtotalFormatted,
    discountFormatted,
    deliveryFeeFormatted,
    totalFormatted,
    isDeliveryAvailable,
    setIsDeliveryAvailable,
  } = useCart();

  const { currentUser } = useAuth();

  // Customer Checkout Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [collectionTime, setCollectionTime] = useState('As soon as possible (~25-35 mins)');
  
  // Delivery address fields
  const [streetAddress, setStreetAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment mode
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'counter'>('stripe');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !customerName) {
        setCustomerName(currentUser.displayName);
      }
      if (currentUser.email && !customerEmail) {
        setCustomerEmail(currentUser.email);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    getWebsiteSettings().then((settings) => {
      setIsDeliveryAvailable(!!settings.deliveryEnabled);
    });
  }, [setIsDeliveryAvailable]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!items.length) {
      setErrorMessage('Your cart is empty. Please select food items from the menu.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your name, email, and contact phone number.');
      return;
    }

    if (orderType === 'delivery') {
      if (!streetAddress.trim() || !postcode.trim()) {
        setErrorMessage('Please provide full delivery address and UK postcode.');
        return;
      }
    }

    setLoading(true);

    try {
      const orderNumber = 'RSH-' + Math.floor(100000 + Math.random() * 900000);

      if (paymentMethod === 'stripe') {
        const checkoutPayload = {
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            variantName: i.variantName,
            quantity: i.quantity,
          })),
          orderType,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          collectionTime,
          deliveryAddress: orderType === 'delivery' ? { street: streetAddress, postcode, instructions: deliveryNotes } : undefined,
          appUrl: window.location.origin,
        };

        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkoutPayload),
        });

        const data = await res.json();

        if (data.success && data.sessionUrl) {
          await createOrder({
            orderNumber: data.orderNumber || orderNumber,
            customerId: currentUser?.uid || '',
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            customerPhone: customerPhone.trim(),
            orderType,
            items,
            subtotalPence,
            discountPence,
            deliveryFeePence,
            totalPence,
            paymentStatus: 'pending',
            orderStatus: 'pending',
            collectionTime,
            deliveryAddress: orderType === 'delivery' ? { street: streetAddress, city: 'Windlesham / Surrey', postcode, instructions: deliveryNotes } : undefined,
            stripeSessionId: data.sessionId,
          });

          window.location.href = data.sessionUrl;
          return;
        }

        if (!data.isConfigured) {
          setErrorMessage(
            'Notice: Stripe live API keys are not yet configured on this deployment. Please select "Pay at Counter upon Collection" to complete your order, or add your STRIPE_SECRET_KEY in hosting env variables.'
          );
          setLoading(false);
          return;
        }

        throw new Error(data.error || 'Failed to initiate secure checkout session.');
      } else {
        // Counter Payment
        await createOrder({
          orderNumber,
          customerId: currentUser?.uid || '',
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          orderType,
          items,
          subtotalPence,
          discountPence,
          deliveryFeePence,
          totalPence,
          paymentStatus: 'pending',
          orderStatus: 'pending',
          collectionTime,
          deliveryAddress: orderType === 'delivery' ? { street: streetAddress, city: 'Windlesham / Surrey', postcode, instructions: deliveryNotes } : undefined,
        });

        clearCart();
        onOrderCompleted(orderNumber);
      }
    } catch (err: any) {
      console.error('Order placement error:', err);
      setErrorMessage(err.message || 'An error occurred while creating your order. Please call us at 01276 452 197.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7A1228] block">
            Online Takeaway & Food Orders
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-5xl font-bold text-[#1F1916]">
            Order Online from Rashoi
          </h1>
          <p className="text-sm text-[#6B5E57] font-normal leading-relaxed">
            Freshly prepared authentic Indian cuisine from our charcoal clay tandoor. 10% discount on collection orders.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-[#EDE6DC] rounded-3xl p-12 max-w-lg mx-auto text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#7A1228]/10 flex items-center justify-center mx-auto text-[#7A1228]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">Your Cart is Empty</h3>
            <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed font-normal">
              Explore our complete 15-category food menu to select your favourite appetisers, signature tandoori grills, balti curries, and freshly baked naans.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('menu')}
                className="px-6 py-3.5 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full shadow-md transition-all cursor-pointer"
              >
                Browse Complete Menu
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items & Customization */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Order Type Selector */}
              <div className="bg-white border border-[#EDE6DC] p-6 rounded-3xl shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A1228] block mb-3">
                  1. Choose Order Type:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('collection')}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                      orderType === 'collection'
                        ? 'bg-[#7A1228]/10 border-[#7A1228] text-[#1F1916] ring-2 ring-[#7A1228]/30'
                        : 'bg-[#FAF7F2] border-[#EDE6DC] text-[#1F1916] hover:border-[#7A1228]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1F1916]">Collection</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                        10% DISCOUNT
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A1228] mt-1 font-medium">
                      Pick up at 58 Updown Hill, Windlesham
                    </p>
                  </button>

                  <button
                    type="button"
                    disabled={!isDeliveryAvailable}
                    onClick={() => {
                      if (isDeliveryAvailable) setOrderType('delivery');
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      !isDeliveryAvailable
                        ? 'opacity-50 bg-stone-100 border-stone-200 cursor-not-allowed text-stone-400'
                        : orderType === 'delivery'
                        ? 'bg-[#7A1228]/10 border-[#7A1228] text-[#1F1916] ring-2 ring-[#7A1228]/30'
                        : 'bg-[#FAF7F2] border-[#EDE6DC] text-[#1F1916] hover:border-[#7A1228]/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1F1916]">Delivery</span>
                      <span className="text-[10px] text-[#6B5E57] uppercase">
                        {isDeliveryAvailable ? 'Surrey area' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E57] mt-1">
                      {isDeliveryAvailable ? 'Delivered straight to your door' : 'Not configured by restaurant'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white border border-[#EDE6DC] rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#EDE6DC] flex items-center justify-between">
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1F1916] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#7A1228]" />
                    <span>Your Selected Dishes ({items.length})</span>
                  </h3>
                  <button
                    onClick={() => onNavigate('menu')}
                    className="uppercase tracking-wider text-xs font-bold text-[#7A1228] hover:underline cursor-pointer"
                  >
                    + Add More Items
                  </button>
                </div>

                <div className="divide-y divide-[#EDE6DC] p-3">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-[#EDE6DC]"
                          />
                        )}
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-[#1F1916]">
                            {item.name}
                          </h4>
                          {item.variantName && (
                            <span className="text-xs font-semibold text-[#7A1228] block">
                              Option: {item.variantName}
                            </span>
                          )}
                          {item.specialInstructions && (
                            <p className="text-[11px] text-[#6B5E57] italic">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                          <span className="text-xs text-[#6B5E57]">
                            £{item.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Total */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#EDE6DC] rounded-full p-1 shadow-inner">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-white text-[#1F1916] hover:bg-[#EDE6DC] flex items-center justify-center cursor-pointer shadow-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#1F1916]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-white text-[#1F1916] hover:bg-[#EDE6DC] flex items-center justify-center cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[#7A1228] min-w-[55px] text-right">
                          £{(item.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Customer Details, Order Summary & Payment */}
            <div className="lg:col-span-5 space-y-6">
              
              <form onSubmit={handlePlaceOrder} className="bg-white border border-[#EDE6DC] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916] border-b border-[#EDE6DC] pb-3">
                  Customer & Order Details
                </h3>

                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Customer Details Inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Smith"
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                        Telephone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 07123 456789"
                        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                      Requested {orderType === 'collection' ? 'Collection' : 'Delivery'} Time
                    </label>
                    <select
                      value={collectionTime}
                      onChange={(e) => setCollectionTime(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                    >
                      <option value="As soon as possible (~25-35 mins)">As soon as possible (~25-35 mins)</option>
                      <option value="In 45 minutes">In 45 minutes</option>
                      <option value="In 1 hour">In 1 hour</option>
                      <option value="Today at 18:00">Today at 6:00 PM</option>
                      <option value="Today at 18:30">Today at 6:30 PM</option>
                      <option value="Today at 19:00">Today at 7:00 PM</option>
                      <option value="Today at 19:30">Today at 7:30 PM</option>
                      <option value="Today at 20:00">Today at 8:00 PM</option>
                      <option value="Today at 20:30">Today at 8:30 PM</option>
                    </select>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="space-y-3 pt-2 border-t border-[#EDE6DC]">
                      <div>
                        <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="e.g. 14 High Street"
                          className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228]"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          required
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          placeholder="e.g. GU20 6DX"
                          className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228]"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                          Delivery Instructions
                        </label>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="e.g. buzzer number, leave at porch"
                          className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE6DC] space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B5E57]">
                    <span>Items Subtotal:</span>
                    <span className="font-semibold text-[#1F1916]">{subtotalFormatted}</span>
                  </div>

                  {orderType === 'collection' && (
                    <div className="flex justify-between text-[#7A1228] font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>10% Collection Discount:</span>
                      </span>
                      <span>-{discountFormatted}</span>
                    </div>
                  )}

                  {orderType === 'delivery' && isDeliveryAvailable && (
                    <div className="flex justify-between text-[#6B5E57]">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold text-[#1F1916]">{deliveryFeeFormatted}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#EDE6DC] flex justify-between items-center text-sm font-bold text-[#1F1916]">
                    <span>Total Amount (GBP):</span>
                    <span className="text-2xl text-[#7A1228] font-extrabold">
                      {totalFormatted}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A1228] block">
                    Payment Option:
                  </span>
                  
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'stripe'
                        ? 'bg-[#7A1228]/10 border-[#7A1228] ring-2 ring-[#7A1228]/20'
                        : 'bg-[#FAF7F2] border-[#EDE6DC] hover:border-[#7A1228]/40'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'stripe'}
                        onChange={() => setPaymentMethod('stripe')}
                        className="text-[#7A1228] focus:ring-[#7A1228]"
                      />
                      <CreditCard className="w-4 h-4 text-[#7A1228]" />
                      <div className="flex-1">
                        <span className="block text-xs font-bold text-[#1F1916]">
                          Online Card / Apple Pay / Google Pay (Stripe Checkout)
                        </span>
                        <span className="block text-[11px] text-[#6B5E57]">
                          Official secure Stripe-hosted payment portal
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'counter'
                        ? 'bg-[#7A1228]/10 border-[#7A1228] ring-2 ring-[#7A1228]/20'
                        : 'bg-[#FAF7F2] border-[#EDE6DC] hover:border-[#7A1228]/40'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'counter'}
                        onChange={() => setPaymentMethod('counter')}
                        className="text-[#7A1228] focus:ring-[#7A1228]"
                      />
                      <Building className="w-4 h-4 text-[#7A1228]" />
                      <div className="flex-1">
                        <span className="block text-xs font-bold text-[#1F1916]">
                          Pay at Counter upon Collection
                        </span>
                        <span className="block text-[11px] text-[#6B5E57]">
                          Pay by Card or Cash when picking up at 58 Updown Hill
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Order Button in Royal Burgundy */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 uppercase tracking-wider text-xs sm:text-sm font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {loading
                      ? 'Processing Order...'
                      : paymentMethod === 'stripe'
                      ? `Proceed to Stripe Checkout • ${totalFormatted}`
                      : `Place Collection Order • ${totalFormatted}`}
                  </span>
                </button>

                <div className="text-[11px] text-center text-[#6B5E57] flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7A1228]" />
                  <span>Bank-grade encryption & server-validated pricing</span>
                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
