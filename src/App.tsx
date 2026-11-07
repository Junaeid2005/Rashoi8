import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { OrderOnlinePage } from './pages/OrderOnlinePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Category, MenuItem, CustomerReview } from './types';
import { getCategories, getMenuItems } from './services/menuService';
import { getReviews } from './services/reviewService';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_REVIEWS } from './firebase/seedData';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string>('');

  // Check URL query parameters for Stripe redirects or direct routes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNum = params.get('order_number');
    const sessionId = params.get('session_id');

    if (orderNum || sessionId) {
      setCompletedOrderNumber(orderNum || 'RSH-ONLINE');
      setCurrentPage('order-success');
    }
  }, []);

  // Fetch Firestore categories and menu items
  useEffect(() => {
    let active = true;

    Promise.all([getCategories(), getMenuItems(), getReviews()])
      .then(([cats, items, revs]) => {
        if (!active) return;
        if (cats && cats.length) setCategories(cats);
        if (items && items.length) setMenuItems(items);
        if (revs && revs.length) setReviews(revs);
      })
      .catch((err) => {
        console.warn('Initial data load notice:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOrderCompleted = (orderNumber: string) => {
    setCompletedOrderNumber(orderNumber);
    setCurrentPage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboard = currentPage === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F1916]">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            menuItems={menuItems}
            reviews={reviews}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            categories={categories}
            menuItems={menuItems}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'order' && (
          <OrderOnlinePage
            onNavigate={setCurrentPage}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {currentPage === 'reservations' && (
          <ReservationsPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'account' && (
          <CustomerAccountPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage
            orderNumber={completedOrderNumber}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard onNavigate={setCurrentPage} />
        )}
      </main>

      {/* Footer (hidden inside admin workspace for clean management experience) */}
      {!isDashboard && <Footer setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
