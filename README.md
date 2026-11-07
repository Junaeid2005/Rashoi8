# Rashoi Indian Cuisine — Production Restaurant Website & System

Established in 1989 in Windlesham, Surrey, **Rashoi** is an authentic Indian restaurant serving traditional tandoori dishes, balti curries, and regional specialties. This codebase is a full-stack, production-ready restaurant website with online ordering, 10% collection discount calculations, table reservations, Fully Booked date management, complaints & feedback system, and a comprehensive Admin Dashboard.

---

## 1. Restaurant Information
* **Business Name:** Rashoi Indian Cuisine
* **Established:** 1989
* **Address:** 58 Updown Hill, Windlesham, Surrey, GU20 6DX, United Kingdom
* **Telephone:** 01276 452 197 / 01276 453 388
* **Website:** [www.rashoi.co.uk](https://www.rashoi.co.uk)
* **Opening Hours:** Open 7 Days a week (Lunch: 12:00 PM – 2:30 PM | Dinner: 5:30 PM – 11:00 PM)
* **Collection Offer:** 10% discount automatically calculated on collection orders

---

## 2. Technical Architecture
* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
* **Typography:** Cinzel (Titles) + Playfair Display (Serif highlights) + Plus Jakarta Sans (Body)
* **Backend:** Serverless API Routes (`/api/create-checkout-session`, `/api/stripe-webhook`, `/api/payment-config-status`)
* **Database & Auth:** Firebase Firestore + Firebase Authentication (Google Sign-In)
* **Payments:** Official Stripe Checkout with server-side price validation in integer pence (GBP)

---

## 3. Key Systems & Modules

### 1. Complete Food Menu (15 Categories)
Accurate pricing, descriptions, and high-resolution food photography for all 15 categories:
1. Appetisers (20 items)
2. Tandoori Dishes (13 charcoal-grilled specialties)
3. Rashoi Special Dishes (20 chef specialties)
4. Special Balti Dishes (served with plain naan)
5. Classic Dishes (responsive price matrix for Chicken, Lamb, Prawn, King Prawn, Veg; unconfigured variants Tikka Masala King Prawn and Tikka Danshak Prawn are safely disabled until admin price entry)
6. Hash Dishes (Duck)
7. Keema Dishes
8. Korai Dishes
9. Biriyani (with vegetable curry)
10. Vegetable Side Dishes (18 authentic sides)
11. Rice (11 basmati preparations)
12. Sundries (naans, rotis, chutneys, popadoms)
13. Meat Thali (£16.95 banquet for one)
14. Vegetable Thali (£13.95 banquet for one)
15. Rashoi Sunday Special (4-course meal for £15.95 per person with King Prawn supplements)

### 2. Table Reservation System & Fully Booked Control
* Table booking system with lunch and dinner time slot selectors and guest counters.
* **FULLY BOOKED CONTROL:** Admin can toggle any date ON/OFF in the Admin Dashboard.
  * When ON for today: Displays *"Sorry, all tables are fully booked today. Please choose tomorrow or another available date."*
  * When ON for another selected date: Displays *"Sorry, all tables are fully booked on your selected date. Please choose another available date."*
  * Food ordering remains completely unaffected when reservations are fully booked.

### 3. Food Ordering & 10% Collection Discount
* Persistent shopping cart across page navigation.
* Automatic 10% collection discount calculation in integer pence.
* Delivery toggle (kept disabled until configured and enabled by the restaurant owner).

### 4. Stripe Checkout Architecture
* Server-side price validation: Prices are never trusted from client-side browser requests. The backend retrieves the authentic price records and calculates the subtotal and discount in pence before generating the session.
* Supports Cards, Apple Pay, and Google Pay through Stripe's hosted Checkout portal.
* Graceful development fallback when API keys are being provisioned.

### 5. Complaints & Feedback System
* Dedicated portal for complaints, food quality, ordering issues, and menu suggestions.
* Direct submission to Firestore `customerMessages` collection, viewable in the Admin Dashboard.

### 6. Admin Dashboard
Separate, secure admin portal accessible only by verified administrators:
* Dashboard Overview (live orders, bookings, and revenue)
* Menu Management (add/edit/delete dishes, upload image URLs, change prices)
* Category Management (reorder and toggle)
* Orders Management (update kitchen preparation and collection status)
* Reservations Management (approve/reject/complete table bookings)
* Fully Booked Control (toggle dates ON/OFF)
* Complaints & Feedback Inbox
* Review Management (approve testimonials)
* Website Settings (edit hero headlines, hours, telephone numbers)
* Stripe Settings (key status & production guides)

---

## 4. Environment Variables

Create a `.env` file in the root directory (or configure via Vercel Project Settings):

```env
# Stripe Secrets (Server-side only — never exposed to client)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application URL
APP_URL="https://your-domain.com"
```

---

## 5. Stripe Production Activation
1. Log into your [Stripe Dashboard](https://dashboard.stripe.com).
2. Go to **Developers → API keys** and copy the **Secret key**. Set it as `STRIPE_SECRET_KEY` in Vercel environment variables.
3. Go to **Developers → Webhooks**, add endpoint `https://your-domain.com/api/stripe-webhook`.
4. Select events:
   * `checkout.session.completed`
   * `checkout.session.async_payment_succeeded`
   * `checkout.session.async_payment_failed`
   * `checkout.session.expired`
5. Copy the Signing Secret and set it as `STRIPE_WEBHOOK_SECRET`.
6. Redeploy your application. Stripe Checkout will immediately be active for real customer payments.
