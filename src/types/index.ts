export type SpiceLevel = 0 | 1 | 2 | 3;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DishVariant {
  name: string; // e.g. "Chicken", "Lamb", "Prawn", "King Prawn", "Vegetable"
  price: number; // in GBP, e.g. 9.95
  available: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number; // in GBP, e.g. 6.95. If matrix dish, base price or 0
  categoryId: string;
  categoryName: string;
  imageUrl?: string;
  available: boolean;
  dietary?: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Dairy-Free' | 'Nut-Free')[];
  spiceLevel?: SpiceLevel;
  allergens?: string[];
  displayOrder: number;
  isMatrixDish?: boolean; // For Classic Dishes Category 5
  variants?: DishVariant[]; // For matrix variants (Chicken, Lamb, etc.)
  extraNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item cart ID (e.g. menuItemId + variant)
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variantName?: string;
  specialInstructions?: string;
  imageUrl?: string;
  categoryName?: string;
}

export type OrderType = 'collection' | 'delivery';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_collection'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: OrderType;
  items: CartItem[];
  subtotalPence: number;
  discountPence: number; // 10% on collection
  deliveryFeePence: number;
  totalPence: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  collectionTime?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    postcode: string;
    instructions?: string;
  };
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "19:00"
  guests: number;
  specialRequests?: string;
  status: ReservationStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FullyBookedDate {
  id: string; // date string YYYY-MM-DD
  date: string;
  isFullyBooked: boolean;
  note?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface CustomerMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: 'complaint' | 'quality' | 'order_issue' | 'suggestion' | 'general';
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  reviewText: string;
  photoUrl?: string;
  featured: boolean;
  date: string;
  createdAt: string;
}

export interface WebsiteSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  collectionDiscountPercent: number;
  deliveryEnabled: boolean;
  deliveryMinimumSpendPence: number;
  deliveryFeePence: number;
  feedbackEmail: string;
  phone1: string;
  phone2: string;
  address: string;
  lunchHours: string;
  dinnerHours: string;
  announcementText?: string;
  announcementActive?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  isAdmin: boolean;
  createdAt?: string;
}
