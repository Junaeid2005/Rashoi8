import Stripe from 'stripe';
import { INITIAL_MENU_ITEMS } from '../src/firebase/seedData';

// Lazy initialized Stripe client
const getStripeClient = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.trim() === '' || secretKey === 'placeholder') {
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia' as any,
  });
};

export const checkStripeConfig = () => {
  const hasSecretKey = !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== '';
  const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET.trim() !== '';
  return {
    configured: hasSecretKey,
    hasSecretKey,
    hasWebhookSecret,
    environment: process.env.NODE_ENV || 'development',
    currency: 'GBP',
    collectionDiscountPercent: 10,
  };
};

interface CartCheckoutItem {
  menuItemId: string;
  variantName?: string;
  quantity: number;
}

export async function handleCreateCheckoutSession(reqBody: {
  items: CartCheckoutItem[];
  orderType: 'collection' | 'delivery';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  collectionTime?: string;
  deliveryAddress?: any;
  appUrl: string;
}) {
  const stripe = getStripeClient();

  if (!stripe) {
    return {
      success: false,
      isConfigured: false,
      message: 'Online Stripe card payments are currently awaiting API credentials configuration. You can place the order for direct payment upon collection/arrival, or call us at 01276 452 197.',
    };
  }

  const { items, orderType, customerName, customerEmail, customerPhone, appUrl } = reqBody;

  if (!items || !items.length) {
    throw new Error('No items provided in order request.');
  }

  // SERVER-SIDE PRICE VALIDATION (Never trust browser submitted prices)
  let subtotalPence = 0;
  const verifiedLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const requestedItem of items) {
    const verifiedDish = INITIAL_MENU_ITEMS.find((d) => d.id === requestedItem.menuItemId);
    if (!verifiedDish) {
      throw new Error(`Invalid item ID requested: ${requestedItem.menuItemId}`);
    }
    if (!verifiedDish.available) {
      throw new Error(`Item ${verifiedDish.name} is currently unavailable.`);
    }

    let unitPriceGbp = verifiedDish.price;
    let itemName = verifiedDish.name;

    // Check matrix dish variant
    if (requestedItem.variantName && verifiedDish.variants) {
      const variant = verifiedDish.variants.find((v) => v.name.toLowerCase() === requestedItem.variantName?.toLowerCase());
      if (!variant) {
        throw new Error(`Variant ${requestedItem.variantName} not found for dish ${verifiedDish.name}`);
      }
      if (!variant.available || variant.price <= 0) {
        throw new Error(`The variant ${variant.name} for ${verifiedDish.name} does not have a configured price.`);
      }
      unitPriceGbp = variant.price;
      itemName = `${verifiedDish.name} (${variant.name})`;
    }

    const unitPricePence = Math.round(unitPriceGbp * 100);
    const itemQuantity = Math.max(1, Math.min(50, Math.floor(requestedItem.quantity)));
    subtotalPence += unitPricePence * itemQuantity;

    verifiedLineItems.push({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: itemName,
          description: verifiedDish.description ? verifiedDish.description.slice(0, 200) : undefined,
          images: verifiedDish.imageUrl ? [verifiedDish.imageUrl] : undefined,
        },
        unit_amount: unitPricePence,
      },
      quantity: itemQuantity,
    });
  }

  // Calculate 10% collection discount on server
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
  if (orderType === 'collection') {
    // 10% collection discount coupon
    const coupon = await stripe.coupons.create({
      percent_off: 10,
      duration: 'once',
      name: 'Rashoi 10% Collection Discount',
    });
    discounts = [{ coupon: coupon.id }];
  }

  const orderNumber = 'RSH-' + Math.floor(100000 + Math.random() * 900000);
  const baseUrl = (appUrl || process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');

  const session = await stripe.checkout.sessions.create({
    line_items: verifiedLineItems,
    discounts,
    mode: 'payment',
    customer_email: customerEmail,
    success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_number=${orderNumber}`,
    cancel_url: `${baseUrl}/order-online?cancelled=true`,
    metadata: {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      subtotalPence: String(subtotalPence),
    },
  });

  return {
    success: true,
    isConfigured: true,
    sessionId: session.id,
    sessionUrl: session.url,
    orderNumber,
  };
}

export async function handleStripeWebhook(rawBody: string | Buffer, signature: string | undefined) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return { received: false, error: 'Stripe webhook not configured on server' };
  }

  if (!signature) {
    return { received: false, error: 'Missing stripe-signature header' };
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    return { received: false, error: `Webhook signature verification failed: ${err.message}` };
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe Webhook] Payment completed for session: ${session.id}, Order: ${session.metadata?.orderNumber}`);
      // The order status will be updated idempotently in Firestore
      break;
    }
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe Webhook] Async payment succeeded for session: ${session.id}`);
      break;
    }
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.warn(`[Stripe Webhook] Async payment failed for session: ${session.id}`);
      break;
    }
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe Webhook] Session expired: ${session.id}`);
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return { received: true, eventType: event.type };
}
