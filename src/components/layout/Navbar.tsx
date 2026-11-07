import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Calendar,
  UtensilsCrossed,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openCartDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
}) => {
  const { currentUser, isAdmin, signInWithGoogle, signOut } = useAuth();
  const { itemCount, subtotalFormatted } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'order', label: 'Order Online' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE6DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Logo Brand: Playfair Display Typography */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#7A1228] flex items-center justify-center text-white shadow-md group-hover:bg-[#5C0C1D] transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold tracking-[0.14em] text-[#1F1916] block leading-none">
                RASHOI
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7A1228] font-bold block mt-1">
                Indian Cuisine • Est. 1989
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-xs xl:text-sm font-semibold tracking-wider uppercase px-3.5 py-2 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#7A1228] bg-[#7A1228]/10 font-bold'
                      : 'text-[#1F1916] hover:text-[#7A1228] hover:bg-[#EDE6DC]/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Table Booking, Order Online, Cart, Google Sign In */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Book Table CTA (Desktop) */}
            <button
              onClick={() => handleNavClick('reservations')}
              className="hidden sm:inline-flex items-center gap-1.5 uppercase tracking-wider text-xs font-bold px-3.5 py-2.5 rounded-full border border-[#7A1228] text-[#7A1228] hover:bg-[#7A1228] hover:text-white transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Book Table</span>
            </button>

            {/* Order Online CTA in Rich Royal Burgundy with (Takeaway) */}
            <button
              onClick={() => handleNavClick('order')}
              className="hidden md:inline-flex items-center gap-1.5 uppercase tracking-wider text-xs font-bold px-4 py-2.5 rounded-full bg-[#7A1228] hover:bg-[#5C0C1D] text-white shadow-sm hover:shadow transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              <span>Order Online (Takeaway)</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => handleNavClick('order')}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-[#1F1916] bg-white hover:bg-[#F5EFE6] border border-[#EDE6DC] rounded-full transition-all cursor-pointer shadow-sm"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#7A1228]" />
              <div className="hidden sm:block text-left text-xs">
                <span className="block text-[#6B5E57] text-[9px] leading-tight font-medium">CART</span>
                <span className="block font-bold text-[#1F1916] leading-tight">{subtotalFormatted}</span>
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#1F1916] border border-amber-600/30 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In with Google Logo */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-[#EDE6DC] hover:border-[#7A1228] bg-white cursor-pointer transition-colors shadow-sm"
                    title={currentUser.displayName || currentUser.email || 'My Account'}
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#7A1228] flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-[#EDE6DC] rounded-2xl shadow-xl py-2 z-50 text-xs">
                      <div className="px-4 py-3 border-b border-[#EDE6DC] bg-[#FAF7F2]">
                        <p className="font-semibold text-[#1F1916] truncate">{currentUser.displayName || 'Customer'}</p>
                        <p className="text-[#6B5E57] text-[11px] truncate">{currentUser.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-[#7A1228] border border-amber-300">
                            <ShieldCheck className="w-3 h-3 text-[#7A1228]" /> Restaurant Admin
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('admin');
                          }}
                          className="w-full text-left px-4 py-2.5 text-[#7A1228] hover:bg-[#FAF7F2] flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#7A1228]" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('account');
                        }}
                        className="w-full text-left px-4 py-2.5 text-[#1F1916] hover:bg-[#FAF7F2] flex items-center gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#6B5E57]" />
                        <span>My Orders & Bookings</span>
                      </button>

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await signOut();
                        }}
                        className="w-full text-left px-4 py-2.5 text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-[#EDE6DC] mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Sign In Button with official Google logo + icon as requested */
                <button
                  onClick={() => signInWithGoogle()}
                  className="flex items-center gap-2 px-3.5 py-2 uppercase tracking-wider text-xs font-semibold text-[#1F1916] bg-white hover:bg-[#FAF7F2] border border-[#EDE6DC] hover:border-[#7A1228] rounded-full transition-colors cursor-pointer shadow-sm"
                  title="Sign in with Google"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1F1916] hover:text-[#7A1228] bg-white border border-[#EDE6DC] rounded-full cursor-pointer shadow-sm"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EDE6DC] px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl uppercase tracking-wider text-sm transition-all ${
                  isActive
                    ? 'text-[#7A1228] bg-[#7A1228]/10 font-bold'
                    : 'text-[#1F1916] hover:text-[#7A1228] hover:bg-white'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#6B5E57]" />
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#EDE6DC] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('reservations')}
              className="w-full py-2.5 px-3 uppercase tracking-wider text-xs font-bold text-center text-[#7A1228] bg-white border border-[#7A1228] rounded-full shadow-sm"
            >
              Book Table
            </button>
            <button
              onClick={() => handleNavClick('order')}
              className="w-full py-2.5 px-3 uppercase tracking-wider text-xs font-bold text-center text-white bg-[#7A1228] rounded-full shadow-md"
            >
              Order Online
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full mt-2 py-2 px-3 text-xs font-semibold text-[#7A1228] bg-white border border-[#EDE6DC] rounded-full flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#7A1228]" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <div className="pt-2 text-center text-xs text-[#6B5E57]">
            <p>58 Updown Hill, Windlesham GU20 6DX</p>
            <a href="tel:01276452197" className="text-[#7A1228] font-bold">01276 452 197 / 453 388</a>
          </div>
        </div>
      )}
    </header>
  );
};
