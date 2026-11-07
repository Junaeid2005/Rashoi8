import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  Calendar,
  LogOut,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { getUserReservations } from '../services/reservationService';
import { Order, Reservation } from '../types';

export const CustomerAccountPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentUser, isAdmin, signInWithGoogle, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      Promise.all([
        getUserOrders(currentUser.uid),
        getUserReservations(currentUser.uid),
      ]).then(([userOrders, userRes]) => {
        setOrders(userOrders);
        setReservations(userRes);
        setLoading(false);
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-[#EDE6DC] rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#7A1228]/10 flex items-center justify-center mx-auto text-[#7A1228]">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">Customer Account</h2>
            <p className="text-xs text-[#6B5E57] leading-relaxed font-normal">
              Sign in with your Google account to view your past orders, active table bookings, and customer rewards.
            </p>
          </div>

          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-3.5 px-4 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full shadow-md cursor-pointer flex items-center justify-center gap-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white border border-[#EDE6DC] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#7A1228]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#7A1228] text-[#D4AF37] flex items-center justify-center text-xl font-bold shadow-sm">
                {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                  {currentUser.displayName || 'Valued Customer'}
                </h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-[#7A1228] border border-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#7A1228]" /> Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B5E57]">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 text-xs uppercase tracking-wider font-bold text-[#7A1228] bg-[#7A1228]/10 hover:bg-[#7A1228]/20 rounded-full cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 rounded-full cursor-pointer flex items-center gap-1.5 transition-colors border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EDE6DC] gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 uppercase tracking-wider text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'text-[#7A1228] border-b-2 border-[#7A1228]'
                : 'text-[#6B5E57] hover:text-[#1F1916]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 uppercase tracking-wider text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'text-[#7A1228] border-b-2 border-[#7A1228]'
                : 'text-[#6B5E57] hover:text-[#1F1916]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservations ({reservations.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="text-center py-12 text-xs text-[#6B5E57]">
            Loading your records...
          </div>
        ) : activeTab === 'orders' ? (
          /* Orders List */
          orders.length === 0 ? (
            <div className="bg-white border border-[#EDE6DC] rounded-3xl p-10 text-center space-y-3 shadow-sm">
              <Package className="w-8 h-8 text-[#7A1228] mx-auto" />
              <p className="text-xs text-[#6B5E57]">You haven't placed any online orders yet.</p>
              <button
                onClick={() => onNavigate('menu')}
                className="px-5 py-2 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full cursor-pointer transition-colors shadow-sm"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-[#EDE6DC] rounded-3xl p-6 space-y-3 text-xs shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE6DC] pb-3">
                    <div>
                      <span className="font-bold text-sm text-[#7A1228]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[#6B5E57] ml-3">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#FAF7F2] text-[#1F1916] border border-[#EDE6DC]">
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1 text-[#6B5E57]">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name} {item.variantName ? `(${item.variantName})` : ''}</span>
                        <span>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#EDE6DC] flex justify-between font-bold text-[#1F1916]">
                    <span className="uppercase tracking-wider">Total Amount:</span>
                    <span className="text-[#7A1228] text-base">
                      £{(ord.totalPence / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Reservations List */
          reservations.length === 0 ? (
            <div className="bg-white border border-[#EDE6DC] rounded-3xl p-10 text-center space-y-3 shadow-sm">
              <Calendar className="w-8 h-8 text-[#7A1228] mx-auto" />
              <p className="text-xs text-[#6B5E57]">You have no table reservations on record.</p>
              <button
                onClick={() => onNavigate('reservations')}
                className="px-5 py-2 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full cursor-pointer transition-colors shadow-sm"
              >
                Book a Table
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-[#EDE6DC] rounded-3xl p-6 space-y-2 text-xs shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE6DC] pb-2">
                    <div>
                      <span className="font-bold text-sm text-[#7A1228]">
                        {res.reservationNumber}
                      </span>
                      <span className="text-[#6B5E57] ml-3">
                        {res.date} at {res.time}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#FAF7F2] text-[#1F1916] border border-[#EDE6DC] w-fit">
                      {res.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#6B5E57]">
                    <span>Party Size:</span>
                    <span className="font-semibold text-[#1F1916]">{res.guests} Guests</span>
                  </div>

                  {res.specialRequests && (
                    <div className="text-[#6B5E57] italic">
                      Special Requests: {res.specialRequests}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
};
