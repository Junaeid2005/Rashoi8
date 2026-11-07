import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  ShoppingBag,
  Calendar,
  CalendarX2,
  MessageSquare,
  Star,
  Settings,
  CreditCard,
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Flame,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Category, MenuItem, Order, Reservation, CustomerMessage, CustomerReview, WebsiteSettings, FullyBookedDate, OrderStatus, ReservationStatus } from '../types';
import { getCategories, getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, updateCategory, deleteCategory, seedInitialCategories, seedInitialMenu } from '../services/menuService';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { getReservations, updateReservationStatus, getFullyBookedDates, setFullyBookedDate } from '../services/reservationService';
import { getCustomerMessages, updateMessageStatus, deleteCustomerMessage } from '../services/feedbackService';
import { getReviews, addReview, deleteReview, updateReview, seedInitialReviews } from '../services/reviewService';
import { getWebsiteSettings, updateWebsiteSettings } from '../services/settingsService';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin, signInWithGoogle } = useAuth();

  // Active section
  const [activeTab, setActiveTab] = useState<
    'overview' | 'menu' | 'categories' | 'orders' | 'reservations' | 'fullyBooked' | 'messages' | 'reviews' | 'settings' | 'payments'
  >('overview');

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [fullyBookedDates, setFullyBookedDates] = useState<FullyBookedDate[]>([]);
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Stripe config status
  const [stripeStatus, setStripeStatus] = useState<{ configured: boolean; hasSecretKey: boolean; hasWebhookSecret: boolean } | null>(null);

  // Edit/Add dialog states
  const [editingDish, setEditingDish] = useState<Partial<MenuItem> | null>(null);
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<MenuItem | null>(null);
  
  // Fully booked date picker state
  const [selectedBlockDate, setSelectedBlockDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [blockNote, setBlockNote] = useState('');

  // Category modal
  const [newCategoryName, setNewCategoryName] = useState('');

  // Filter/search
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedMenuCat, setSelectedMenuCat] = useState('all');

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [cats, items, ords, res, fbDates, msgs, revs, sett] = await Promise.all([
        getCategories(),
        getMenuItems(),
        getOrders(),
        getReservations(),
        getFullyBookedDates(),
        getCustomerMessages(),
        getReviews(),
        getWebsiteSettings(),
      ]);

      setCategories(cats);
      setMenuItems(items);
      setOrders(ords);
      setReservations(res);
      setFullyBookedDates(fbDates);
      setMessages(msgs);
      setReviews(revs);
      setSettings(sett);

      // Check Stripe server status
      fetch('/api/payment-config-status')
        .then((r) => r.json())
        .then((data) => setStripeStatus(data))
        .catch(() => {});
    } catch (e) {
      console.error('Error loading admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshAllData();
    }
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Guard: Unauthorized check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] flex items-center justify-center p-4">
        <div className="bg-white border border-rose-900/60 rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-600/60 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">Restricted Admin Area</h2>
            <p className="text-xs text-[#6B5E57]">
              Access to the Rashoi Restaurant Management System is strictly restricted to authorized administrators.
            </p>
          </div>

          {currentUser ? (
            <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE6DC] text-xs space-y-1 text-left">
              <span className="text-[#6B5E57] block">Signed in as:</span>
              <span className="font-semibold text-[#1F1916] block truncate">{currentUser.email}</span>
              <span className="text-rose-400 text-[11px] block mt-1">
                This account is not on the administrative allowlist.
              </span>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#020617] bg-[#fbbf24] hover:bg-[#7A1228] rounded-lg cursor-pointer"
            >
              Sign In with Authorized Google Account
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-[#D4AF37] hover:underline block mx-auto cursor-pointer"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todayReservations = reservations.filter((r) => r.date === todayStr);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed');
  const totalRevenuePence = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalPence, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] flex flex-col md:flex-row">
      
      {/* Toast Alert */}
      {actionFeedback && (
        <div className="fixed top-24 right-6 z-50 bg-white border-2 border-[#7A1228] text-[#1F1916] text-xs font-bold px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#1C1514] text-white border-r border-[#2D1C1A] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div className="border-b border-[#EDE6DC] pb-4">
            <span className="font-['Playfair_Display'] text-xl font-bold text-[#D4AF37] tracking-wider block">
              RASHOI ADMIN
            </span>
            <span className="text-[10px] uppercase text-[#6B5E57] tracking-widest block mt-0.5">
              Restaurant Control Panel
            </span>
            <div className="mt-2 text-[11px] text-[#6B5E57] truncate">
              {currentUser?.email}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
              { id: 'categories', label: 'Categories', icon: FolderTree },
              { id: 'orders', label: 'Orders Management', icon: ShoppingBag, badge: pendingOrders.length },
              { id: 'reservations', label: 'Reservations', icon: Calendar, badge: reservations.filter((r) => r.status === 'pending').length },
              { id: 'fullyBooked', label: 'Fully Booked Control', icon: CalendarX2 },
              { id: 'messages', label: 'Complaints & Messages', icon: MessageSquare, badge: messages.filter((m) => m.status === 'unread').length },
              { id: 'reviews', label: 'Customer Reviews', icon: Star },
              { id: 'settings', label: 'Website Content', icon: Settings },
              { id: 'payments', label: 'Stripe & Payments', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7A1228] text-white font-bold border-l-4 border-[#D4AF37]'
                      : 'text-[#A89C95] hover:bg-[#2D1C1A] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#1F1916]">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-[#EDE6DC] space-y-2">
          <button
            onClick={async () => {
              setLoading(true);
              try {
                await seedInitialCategories();
                await seedInitialMenu();
                await seedInitialReviews();
                showToast('Successfully seeded menu and categories to Firestore!');
                await refreshAllData();
              } catch (err: any) {
                console.error('Seeding error:', err);
                showToast('Seeding notice: ' + (err.message || 'Check permissions'));
              } finally {
                setLoading(false);
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-[#020617] bg-[#fbbf24] hover:bg-[#7A1228] rounded cursor-pointer shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Seed Menu to Firestore</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#D4AF37] bg-[#FAF7F2] hover:bg-[#1a2336] rounded border border-[#EDE6DC] cursor-pointer"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={refreshAllData}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs text-[#6B5E57] hover:text-[#1F1916] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Firebase Data</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#1F1916]">
                  Restaurant Overview
                </h1>
                <p className="text-xs text-[#6B5E57]">Real-time operational summary from Firestore database.</p>
              </div>

              <button
                onClick={refreshAllData}
                className="px-4 py-2 bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg text-xs font-medium text-[#D4AF37] hover:bg-[#222f44] cursor-pointer flex items-center gap-1.5 w-fit"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] p-4 rounded-xl space-y-1">
                <span className="text-[11px] text-[#6B5E57] uppercase tracking-wider block">Today's Orders</span>
                <span className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#D4AF37]">
                  {todayOrders.length}
                </span>
                <span className="text-[10px] text-[#6B5E57] block">{orders.length} all-time orders</span>
              </div>

              <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] p-4 rounded-xl space-y-1">
                <span className="text-[11px] text-[#6B5E57] uppercase tracking-wider block">Pending Orders</span>
                <span className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-amber-400">
                  {pendingOrders.length}
                </span>
                <span className="text-[10px] text-[#6B5E57] block">Needs kitchen prep</span>
              </div>

              <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] p-4 rounded-xl space-y-1">
                <span className="text-[11px] text-[#6B5E57] uppercase tracking-wider block">Today's Bookings</span>
                <span className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#D4AF37]">
                  {todayReservations.length}
                </span>
                <span className="text-[10px] text-[#6B5E57] block">{reservations.length} total bookings</span>
              </div>

              <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] p-4 rounded-xl space-y-1">
                <span className="text-[11px] text-[#6B5E57] uppercase tracking-wider block">Verified Paid Revenue</span>
                <span className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-emerald-400">
                  £{(totalRevenuePence / 100).toFixed(2)}
                </span>
                <span className="text-[10px] text-[#6B5E57] block">Stripe / verified records</span>
              </div>

            </div>

            {/* Quick Action Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Orders Card */}
              <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
                  <h3 className="font-['Playfair_Display'] text-base font-bold text-[#1F1916] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Recent Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#D4AF37] hover:underline cursor-pointer">
                    View All →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#6B5E57]">No orders placed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((ord) => (
                      <div key={ord.id} className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE6DC] flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#D4AF37]">{ord.orderNumber}</span>
                          <p className="text-[#1F1916] font-medium">{ord.customerName}</p>
                          <span className="text-[10px] text-[#6B5E57]">{ord.orderType} • {ord.items.length} items</span>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="font-bold text-[#D4AF37]">£{(ord.totalPence / 100).toFixed(2)}</span>
                          <span className="block px-2 py-0.5 rounded text-[10px] font-bold bg-[#1a2336] text-[#D4AF37] border border-[#7A1228]/30">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Today's Table Bookings */}
              <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
                  <h3 className="font-['Playfair_Display'] text-base font-bold text-[#1F1916] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" /> Table Bookings
                  </h3>
                  <button onClick={() => setActiveTab('reservations')} className="text-xs text-[#D4AF37] hover:underline cursor-pointer">
                    Manage →
                  </button>
                </div>

                {reservations.length === 0 ? (
                  <p className="text-xs text-[#6B5E57]">No reservations on file.</p>
                ) : (
                  <div className="space-y-3">
                    {reservations.slice(0, 4).map((res) => (
                      <div key={res.id} className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE6DC] flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#D4AF37]">{res.reservationNumber}</span>
                          <p className="text-[#1F1916] font-medium">{res.customerName}</p>
                          <span className="text-[10px] text-[#6B5E57]">{res.date} at {res.time} ({res.guests} guests)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1a2336] text-[#D4AF37] border border-[#7A1228]/30">
                          {res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                  Food Menu Management
                </h1>
                <p className="text-xs text-[#6B5E57]">
                  Add, edit descriptions, adjust prices, upload photos, or change availability. All changes sync immediately to live customers via Firestore.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingDish({
                    name: '',
                    description: '',
                    price: 9.95,
                    categoryId: categories[0]?.id || 'cat-1',
                    categoryName: categories[0]?.name || 'Appetisers',
                    available: true,
                    spiceLevel: 1,
                    displayOrder: menuItems.length + 1,
                    imageUrl: '',
                  });
                  setIsAddingDish(true);
                }}
                className="px-4 py-2.5 bg-[#7A1228] hover:bg-[#2D1C1A] text-white font-bold text-xs rounded-lg shadow cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food Item</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-[#EDE6DC]">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c796e]" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search dishes by name or description..."
                  className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg pl-9 pr-4 py-2 text-xs text-[#1F1916] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <select
                value={selectedMenuCat}
                onChange={(e) => setSelectedMenuCat(e.target.value)}
                className="w-full sm:w-56 bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-xs text-[#1F1916] focus:outline-none focus:border-[#fbbf24]"
              >
                <option value="all">All Categories ({menuItems.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Dishes Table */}
            <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#EDE6DC] text-[#D4AF37] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Dish</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (GBP)</th>
                      <th className="py-3 px-4">Availability</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a2336]">
                    {menuItems
                      .filter((item) => {
                        if (selectedMenuCat !== 'all' && item.categoryId !== selectedMenuCat) return false;
                        if (menuSearch.trim()) {
                          const q = menuSearch.toLowerCase();
                          return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
                        }
                        return true;
                      })
                      .map((dish) => (
                        <tr key={dish.id} className="hover:bg-[#200b12] transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={dish.imageUrl || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=150&q=80'}
                              alt={dish.name}
                              className="w-10 h-10 rounded-md object-cover border border-[#EDE6DC] shrink-0"
                            />
                            <div>
                              <span className="font-bold text-[#1F1916] block">{dish.name}</span>
                              <span className="text-[11px] text-[#6B5E57] line-clamp-1 max-w-sm">
                                {dish.description || 'No description entered'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-[#6B5E57]">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#FAF7F2] border border-[#EDE6DC] text-[#D4AF37]">
                              {dish.categoryName}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-bold text-[#D4AF37] font-mono">
                            {dish.isMatrixDish ? (
                              <span>Matrix ({dish.variants?.length} options)</span>
                            ) : (
                              <span>£{dish.price.toFixed(2)}</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={async () => {
                                await updateMenuItem(dish.id, { available: !dish.available });
                                setMenuItems((prev) =>
                                  prev.map((i) => (i.id === dish.id ? { ...i, available: !dish.available } : i))
                                );
                                showToast(`Updated ${dish.name} availability.`);
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                                dish.available
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {dish.available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{dish.available ? 'Available' : 'Hidden / Sold Out'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingDish(dish);
                                setIsAddingDish(false);
                              }}
                              className="p-1.5 rounded bg-white text-[#D4AF37] hover:bg-[#3d1421] border border-[#521c29] cursor-pointer"
                              title="Edit Dish"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDishToDelete(dish)}
                              className="p-1.5 rounded bg-white text-rose-400 hover:bg-rose-950 border border-rose-900/60 cursor-pointer"
                              title="Delete Dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit / Add Modal */}
            {editingDish && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-white border border-[#7A1228]/60 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F1916]">
                      {isAddingDish ? 'Add New Menu Item' : `Edit: ${editingDish.name}`}
                    </h3>
                    <button onClick={() => setEditingDish(null)} className="text-[#6B5E57] hover:text-[#1F1916] cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#D4AF37] mb-1">Dish Name *</label>
                      <input
                        type="text"
                        value={editingDish.name || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-[#1F1916]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#D4AF37] mb-1">Category *</label>
                      <select
                        value={editingDish.categoryId || ''}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.id === e.target.value);
                          setEditingDish({
                            ...editingDish,
                            categoryId: e.target.value,
                            categoryName: cat ? cat.name : '',
                          });
                        }}
                        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-[#1F1916]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#D4AF37] mb-1">Price (GBP £) *</label>
                      <input
                        type="number"
                        step="0.05"
                        value={editingDish.price ?? 0}
                        onChange={(e) => setEditingDish({ ...editingDish, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-[#1F1916]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#D4AF37] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingDish.description || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-[#1F1916] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#D4AF37] mb-1">Image URL (Photo)</label>
                      <input
                        type="url"
                        value={editingDish.imageUrl || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-[#1F1916]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#D4AF37] mb-1">Spice Level</label>
                        <select
                          value={editingDish.spiceLevel ?? 0}
                          onChange={(e) => setEditingDish({ ...editingDish, spiceLevel: parseInt(e.target.value) as any })}
                          className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-[#1F1916]"
                        >
                          <option value={0}>Mild (0)</option>
                          <option value={1}>Mild to Medium (1)</option>
                          <option value={2}>Medium Spiced (2)</option>
                          <option value={3}>Hot (3)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#D4AF37] mb-1">Availability</label>
                        <select
                          value={editingDish.available ? 'true' : 'false'}
                          onChange={(e) => setEditingDish({ ...editingDish, available: e.target.value === 'true' })}
                          className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-[#1F1916]"
                        >
                          <option value="true">Available for Orders</option>
                          <option value="false">Sold Out / Hidden</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EDE6DC] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingDish(null)}
                      className="px-4 py-2 rounded-lg bg-[#FAF7F2] text-[#6B5E57] text-xs hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!editingDish.name) return;
                        if (isAddingDish) {
                          await addMenuItem(editingDish as any);
                          showToast('Dish created successfully.');
                        } else if (editingDish.id) {
                          await updateMenuItem(editingDish.id, editingDish);
                          showToast('Dish updated successfully.');
                        }
                        setEditingDish(null);
                        refreshAllData();
                      }}
                      className="px-5 py-2 rounded-lg bg-[#fbbf24] text-[#020617] font-bold text-xs cursor-pointer shadow"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Permanent Deletion Confirmation Dialog (Requested in Section 8) */}
            {dishToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-white border border-rose-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center gap-3 text-rose-400">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="font-['Playfair_Display'] text-lg font-bold">Confirm Permanent Deletion</h3>
                  </div>
                  <p className="text-xs text-[#6B5E57] leading-relaxed">
                    Are you sure you want to permanently delete <strong>{dishToDelete.name}</strong> from the database? This action cannot be undone. (Tip: You can hide items by setting Availability to "Hidden" instead of deleting).
                  </p>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setDishToDelete(null)}
                      className="px-4 py-2 rounded-lg bg-[#FAF7F2] text-xs font-semibold text-[#6B5E57] hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await deleteMenuItem(dishToDelete.id);
                        showToast(`Deleted ${dishToDelete.name}`);
                        setDishToDelete(null);
                        refreshAllData();
                      }}
                      className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-xs font-bold text-white cursor-pointer shadow"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                  Menu Categories Management
                </h1>
                <p className="text-xs text-[#6B5E57]">
                  Control menu category ordering, descriptions, and active status.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category Name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3 py-2 text-xs text-[#1F1916]"
                />
                <button
                  onClick={async () => {
                    if (!newCategoryName.trim()) return;
                    await addCategory({
                      name: newCategoryName.trim(),
                      slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
                      displayOrder: categories.length + 1,
                      active: true,
                    });
                    setNewCategoryName('');
                    showToast('New category added.');
                    refreshAllData();
                  }}
                  className="px-4 py-2 bg-[#fbbf24] text-[#020617] text-xs font-bold rounded-lg cursor-pointer shrink-0"
                >
                  Add Category
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1F1916]">{cat.name}</span>
                    <span className="text-[10px] text-[#D4AF37] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EDE6DC]">
                      Order #{cat.displayOrder}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-[11px] text-[#6B5E57] line-clamp-2">{cat.description}</p>
                  )}
                  <div className="pt-2 border-t border-[#EDE6DC] flex items-center justify-between text-xs">
                    <span className="text-[#6B5E57]">
                      {menuItems.filter((i) => i.categoryId === cat.id).length} items
                    </span>
                    <button
                      onClick={async () => {
                        await updateCategory(cat.id, { active: !cat.active });
                        showToast(`Updated ${cat.name} status`);
                        refreshAllData();
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        cat.active ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      {cat.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                  Order Management
                </h1>
                <p className="text-xs text-[#6B5E57]">
                  Track incoming customer orders, manage kitchen statuses, and review payment records.
                </p>
              </div>

              <span className="text-xs font-bold text-[#D4AF37] bg-[#200b12] px-3 py-1.5 rounded-lg border border-[#EDE6DC]">
                Total Orders: {orders.length}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center text-xs text-[#6B5E57]">
                No customer orders placed yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-xl p-5 space-y-4 text-xs shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE6DC] pb-3">
                      <div>
                        <span className="font-mono text-base font-bold text-[#D4AF37]">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[#6B5E57] ml-3">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                        <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1a2336] text-[#D4AF37] border border-[#7A1228]/40">
                          {ord.orderType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          ord.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          Payment: {ord.paymentStatus.toUpperCase()}
                        </span>

                        {/* Status selector */}
                        <select
                          value={ord.orderStatus}
                          onChange={async (e) => {
                            const newStatus = e.target.value as OrderStatus;
                            await updateOrderStatus(ord.id, newStatus);
                            setOrders((prev) => prev.map((o) => (o.id === ord.id ? { ...o, orderStatus: newStatus } : o)));
                            showToast(`Order ${ord.orderNumber} status changed to ${newStatus}`);
                          }}
                          className="bg-[#FAF7F2] border border-[#EDE6DC] rounded px-2.5 py-1 text-xs text-[#1F1916] font-semibold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready_for_collection">Ready for Collection</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE6DC]">
                      <div>
                        <span className="text-[#6B5E57] block text-[10px] uppercase font-bold">Customer Contact:</span>
                        <p className="font-bold text-[#1F1916]">{ord.customerName}</p>
                        <p className="text-[#6B5E57]">{ord.customerEmail} • {ord.customerPhone}</p>
                        {ord.collectionTime && (
                          <p className="text-[#D4AF37] font-medium mt-1">Requested Time: {ord.collectionTime}</p>
                        )}
                      </div>

                      <div>
                        {ord.orderType === 'delivery' && ord.deliveryAddress ? (
                          <div>
                            <span className="text-[#6B5E57] block text-[10px] uppercase font-bold">Delivery Address:</span>
                            <p>{ord.deliveryAddress.street}</p>
                            <p>{ord.deliveryAddress.postcode}</p>
                            {ord.deliveryAddress.instructions && (
                              <p className="text-amber-300 italic text-[11px]">"{ord.deliveryAddress.instructions}"</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className="text-[#6B5E57] block text-[10px] uppercase font-bold">Collection Location:</span>
                            <p className="text-[#1F1916]">Rashoi Indian Cuisine, Windlesham</p>
                            <p className="text-[#6B5E57]">10% collection discount applied to subtotal</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="space-y-1 border-t border-[#EDE6DC] pt-3 text-[#6B5E57]">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B5E57] block font-bold mb-1">Items:</span>
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name} {item.variantName ? `(${item.variantName})` : ''}</span>
                          <span>£{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals Summary */}
                    <div className="pt-2 border-t border-[#EDE6DC] flex justify-between items-center text-sm font-bold text-[#1F1916]">
                      <div className="text-xs text-[#6B5E57]">
                        Subtotal: £{(ord.subtotalPence / 100).toFixed(2)} | Discount: -£{(ord.discountPence / 100).toFixed(2)}
                      </div>
                      <div className="text-base text-[#D4AF37] font-mono">
                        Total: £{(ord.totalPence / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                  Table Reservations
                </h1>
                <p className="text-xs text-[#6B5E57]">
                  Approve, reject, or mark table bookings completed.
                </p>
              </div>

              <span className="text-xs font-bold text-[#D4AF37] bg-[#200b12] px-3 py-1.5 rounded-lg border border-[#EDE6DC]">
                Total Bookings: {reservations.length}
              </span>
            </div>

            {reservations.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center text-xs text-[#6B5E57]">
                No table reservations recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#D4AF37] text-sm">{res.reservationNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1a2336] text-[#D4AF37] border border-[#7A1228]/40">
                          {res.status}
                        </span>
                      </div>
                      <p className="font-bold text-[#1F1916] text-sm">{res.customerName}</p>
                      <p className="text-[#6B5E57]">{res.customerEmail} • {res.customerPhone}</p>
                      <p className="text-[#D4AF37] font-medium">
                        {res.date} at {res.time} ({res.guests} Guests)
                      </p>
                      {res.specialRequests && (
                        <p className="text-[#1F1916] italic text-[11px] pt-1">
                          Requests: "{res.specialRequests}"
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <select
                        value={res.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as ReservationStatus;
                          await updateReservationStatus(res.id, newStatus);
                          setReservations((prev) => prev.map((r) => (r.id === res.id ? { ...r, status: newStatus } : r)));
                          showToast(`Reservation status updated to ${newStatus}`);
                        }}
                        className="bg-[#FAF7F2] border border-[#EDE6DC] rounded px-3 py-1.5 text-xs text-[#1F1916] font-semibold"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FULLY BOOKED CONTROL (Specifically Requested Feature) */}
        {activeTab === 'fullyBooked' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                FULLY BOOKED CONTROL
              </h1>
              <p className="text-xs text-[#6B5E57] max-w-2xl mt-1">
                When ON for a date, customers are prevented from creating new table bookings on that date. Food ordering and Stripe payments continue normally. Existing bookings remain visible.
              </p>
            </div>

            {/* Toggle Card */}
            <div className="bg-white border border-[#7A1228]/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#D4AF37]">
                Set Fully Booked Status for Specific Date
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-1">
                    Select Target Date *
                  </label>
                  <input
                    type="date"
                    value={selectedBlockDate}
                    onChange={(e) => setSelectedBlockDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-xs text-[#1F1916]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-1">
                    Internal Note / Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={blockNote}
                    onChange={(e) => setBlockNote(e.target.value)}
                    placeholder="e.g. Private corporate event or fully booked"
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-xs text-[#1F1916]"
                  />
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await setFullyBookedDate(selectedBlockDate, true, blockNote);
                    showToast(`Marked ${selectedBlockDate} as FULLY BOOKED (ON).`);
                    refreshAllData();
                  }}
                  className="flex-1 py-3 px-4 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow flex items-center justify-center gap-2"
                >
                  <CalendarX2 className="w-4 h-4" />
                  <span>Set Fully Booked: ON</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await setFullyBookedDate(selectedBlockDate, false, blockNote);
                    showToast(`Turned OFF Fully Booked for ${selectedBlockDate}. Tables available.`);
                    refreshAllData();
                  }}
                  className="flex-1 py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Set Fully Booked: OFF (Accept Bookings)</span>
                </button>
              </div>
            </div>

            {/* List of currently blocked dates */}
            <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-xl p-5 space-y-4">
              <h3 className="font-['Playfair_Display'] text-base font-bold text-[#1F1916]">
                Dates Record in Database ({fullyBookedDates.length})
              </h3>

              {fullyBookedDates.length === 0 ? (
                <p className="text-xs text-[#6B5E57]">No blocked dates currently registered in Firestore.</p>
              ) : (
                <div className="divide-y divide-[#1a2336]">
                  {fullyBookedDates.map((fd) => (
                    <div key={fd.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-sm text-[#1F1916]">{fd.date}</span>
                        {fd.note && <span className="text-[#6B5E57] ml-3 italic">"{fd.note}"</span>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          fd.isFullyBooked
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {fd.isFullyBooked ? 'FULLY BOOKED (CLOSED)' : 'OPEN FOR BOOKINGS'}
                        </span>

                        <button
                          onClick={async () => {
                            await setFullyBookedDate(fd.date, !fd.isFullyBooked, fd.note);
                            showToast(`Toggled ${fd.date}`);
                            refreshAllData();
                          }}
                          className="px-2.5 py-1 rounded bg-[#FAF7F2] text-[#D4AF37] border border-[#EDE6DC] hover:bg-[#222f44] cursor-pointer"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: MESSAGES & COMPLAINTS */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                  Customer Messages & Complaints
                </h1>
                <p className="text-xs text-[#6B5E57]">
                  Messages submitted by customers via the Complaints & Feedback portal.
                </p>
              </div>

              <span className="text-xs font-bold text-[#D4AF37] bg-[#200b12] px-3 py-1.5 rounded-lg border border-[#EDE6DC]">
                Total Messages: {messages.length}
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center text-xs text-[#6B5E57]">
                No customer messages or complaints received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-white border rounded-xl p-5 space-y-3 text-xs shadow-md ${
                      msg.status === 'unread' ? 'border-[#7A1228]' : 'border-[#EDE6DC]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE6DC] pb-2">
                      <div>
                        <span className="font-bold text-[#1F1916] text-sm">{msg.subject}</span>
                        <span className="text-[#6B5E57] ml-3">From: {msg.name} ({msg.email})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1a2336] text-[#D4AF37] border border-[#7A1228]/40">
                          {msg.category.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          msg.status === 'unread' ? 'bg-amber-950 text-amber-300' : 'bg-[#FAF7F2] text-[#6B5E57]'
                        }`}>
                          {msg.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#1F1916] leading-relaxed whitespace-pre-wrap bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE6DC]">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-[#6B5E57]">
                        Received: {new Date(msg.createdAt).toLocaleString()} {msg.phone ? `• Tel: ${msg.phone}` : ''}
                      </span>

                      <div className="flex gap-2">
                        {msg.status === 'unread' ? (
                          <button
                            onClick={async () => {
                              await updateMessageStatus(msg.id, 'read');
                              showToast('Marked as read');
                              refreshAllData();
                            }}
                            className="px-3 py-1 bg-[#FAF7F2] text-[#D4AF37] hover:bg-[#222f44] rounded border border-[#EDE6DC] cursor-pointer"
                          >
                            Mark Read
                          </button>
                        ) : null}
                        <button
                          onClick={async () => {
                            await deleteCustomerMessage(msg.id);
                            showToast('Message deleted');
                            refreshAllData();
                          }}
                          className="px-3 py-1 bg-rose-950 text-rose-400 hover:bg-rose-900 rounded border border-rose-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                  Customer Reviews & Testimonials
                </h1>
                <p className="text-xs text-[#6B5E57]">
                  Manage reviews displayed on the public homepage.
                </p>
              </div>

              <button
                onClick={async () => {
                  const name = prompt('Customer Name:');
                  if (!name) return;
                  const text = prompt('Review Content:');
                  if (!text) return;
                  await addReview({
                    customerName: name,
                    rating: 5,
                    reviewText: text,
                    featured: true,
                    date: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
                  });
                  showToast('Review added.');
                  refreshAllData();
                }}
                className="px-4 py-2 bg-[#fbbf24] text-[#020617] text-xs font-bold rounded-lg cursor-pointer"
              >
                + Add New Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] p-5 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-2">
                    <span className="font-bold text-[#1F1916] text-sm">{rev.customerName}</span>
                    <div className="flex text-[#D4AF37]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#fbbf24]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#6B5E57] italic leading-relaxed">"{rev.reviewText}"</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EDE6DC]">
                    <span className="text-[11px] text-[#6B5E57]">{rev.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await updateReview(rev.id, { featured: !rev.featured });
                          showToast('Updated featured status');
                          refreshAllData();
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          rev.featured ? 'bg-amber-950 text-amber-300' : 'bg-[#FAF7F2] text-[#6B5E57]'
                        }`}
                      >
                        {rev.featured ? 'Featured on Home' : 'Not Featured'}
                      </button>

                      <button
                        onClick={async () => {
                          await deleteReview(rev.id);
                          showToast('Review deleted');
                          refreshAllData();
                        }}
                        className="p-1 text-rose-400 hover:bg-rose-950 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: WEBSITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                Website Content & Restaurant Information
              </h1>
              <p className="text-xs text-[#6B5E57]">
                Update hero headlines, telephone numbers, discount percentages, and announcement banners.
              </p>
            </div>

            {settings && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await updateWebsiteSettings(settings);
                  showToast('Website settings saved successfully!');
                }}
                className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-2xl p-6 sm:p-8 space-y-4 text-xs shadow-xl"
              >
                <div>
                  <label className="block font-bold text-[#D4AF37] mb-1">Hero Main Title</label>
                  <input
                    type="text"
                    value={settings.heroTitle || ''}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#D4AF37] mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={settings.heroSubtitle || ''}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#D4AF37] mb-1">Hero Description Paragraph</label>
                  <textarea
                    rows={3}
                    value={settings.heroDescription || ''}
                    onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#D4AF37] mb-1">Telephone 1</label>
                    <input
                      type="text"
                      value={settings.phone1 || '01276 452 197'}
                      onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#D4AF37] mb-1">Telephone 2</label>
                    <input
                      type="text"
                      value={settings.phone2 || '01276 453 388'}
                      onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#D4AF37] mb-1">Collection Discount (%)</label>
                    <input
                      type="number"
                      value={settings.collectionDiscountPercent || 10}
                      onChange={(e) => setSettings({ ...settings, collectionDiscountPercent: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#D4AF37] mb-1">Delivery Service Status</label>
                    <select
                      value={settings.deliveryEnabled ? 'true' : 'false'}
                      onChange={(e) => setSettings({ ...settings, deliveryEnabled: e.target.value === 'true' })}
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916]"
                    >
                      <option value="false">Disabled (Collection Only)</option>
                      <option value="true">Enabled (Accept Delivery Orders)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#D4AF37] mb-1">Management Feedback Email</label>
                  <input
                    type="email"
                    value={settings.feedbackEmail || 'info@rashoi.co.uk'}
                    onChange={(e) => setSettings({ ...settings, feedbackEmail: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-lg px-3.5 py-2.5 text-[#1F1916]"
                  />
                </div>

                <div className="pt-4 border-t border-[#EDE6DC]">
                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#7A1228] hover:bg-[#2D1C1A] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer"
                  >
                    Save All Website Content
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 10: STRIPE & PAYMENT SETTINGS */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F1916]">
                Stripe Payments Integration
              </h1>
              <p className="text-xs text-[#6B5E57]">
                Live credentials status and setup instructions for production card payments.
              </p>
            </div>

            {/* Gateway Status Badge */}
            <div className={`p-6 rounded-2xl border ${
              stripeStatus?.configured
                ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                : 'bg-amber-950/60 border-amber-600/80 text-amber-200'
            } space-y-3 shadow-xl`}>
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="font-bold text-sm">
                  {stripeStatus?.configured
                    ? 'Stripe Gateway Configured & Active'
                    : 'Stripe Gateway In Development Mode (Keys Awaiting Configuration)'}
                </h3>
              </div>

              <p className="text-xs leading-relaxed">
                {stripeStatus?.configured
                  ? 'Your Stripe API credentials are fully configured on the server. Customers will be directed to the official Stripe-hosted checkout page supporting Cards, Apple Pay, and Google Pay in GBP.'
                  : 'The complete Stripe architecture is pre-built and validated on the backend. When you add your live Stripe API keys to your hosting environment variables, card checkout will automatically activate without code changes.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-[#FAF7F2]/80 p-2.5 rounded border border-[#EDE6DC]">
                  <span className="text-[#6B5E57] block text-[10px]">STRIPE_SECRET_KEY:</span>
                  <span className={stripeStatus?.hasSecretKey ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {stripeStatus?.hasSecretKey ? 'Present (Server Env)' : 'Missing from Environment'}
                  </span>
                </div>

                <div className="bg-[#FAF7F2]/80 p-2.5 rounded border border-[#EDE6DC]">
                  <span className="text-[#6B5E57] block text-[10px]">STRIPE_WEBHOOK_SECRET:</span>
                  <span className={stripeStatus?.hasWebhookSecret ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {stripeStatus?.hasWebhookSecret ? 'Present (Server Env)' : 'Missing from Environment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Setup Instructions Card */}
            <div className="bg-white border border-[#EDE6DC] shadow-sm text-[#1F1916] rounded-2xl p-6 sm:p-8 space-y-4 text-xs">
              <h3 className="font-['Playfair_Display'] text-base font-bold text-[#D4AF37]">
                Production Stripe Setup Instructions
              </h3>

              <ol className="list-decimal list-inside space-y-2.5 text-[#6B5E57] leading-relaxed">
                <li>
                  <strong className="text-[#1F1916]">Stripe Dashboard:</strong> Log in to your Stripe Dashboard at <code>dashboard.stripe.com</code> and navigate to <strong>Developers → API keys</strong>.
                </li>
                <li>
                  <strong className="text-[#1F1916]">Secret Key:</strong> Copy your Secret key (e.g. <code>sk_live_...</code> or <code>sk_test_...</code>) and save it in your hosting platform environment variables as <code>STRIPE_SECRET_KEY</code>.
                </li>
                <li>
                  <strong className="text-[#1F1916]">Webhook Endpoint:</strong> In Stripe Dashboard, navigate to <strong>Developers → Webhooks</strong>, click <strong>Add endpoint</strong>, and enter endpoint URL: <code>https://your-domain.com/api/stripe-webhook</code>.
                </li>
                <li>
                  <strong className="text-[#1F1916]">Select Events:</strong> Choose <code>checkout.session.completed</code>, <code>checkout.session.async_payment_succeeded</code>, <code>checkout.session.async_payment_failed</code>, and <code>checkout.session.expired</code>.
                </li>
                <li>
                  <strong className="text-[#1F1916]">Signing Secret:</strong> Copy the Signing Secret (e.g. <code>whsec_...</code>) and save it as <code>STRIPE_WEBHOOK_SECRET</code>.
                </li>
                <li>
                  <strong className="text-[#1F1916]">Apple Pay & Google Pay:</strong> Enable Apple Pay under Payment Methods in Stripe settings and add your verified domain.
                </li>
              </ol>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
