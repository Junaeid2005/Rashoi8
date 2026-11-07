import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Order, OrderStatus, PaymentStatus } from '../types';

const ORDERS_COLLECTION = 'orders';

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  const orderId = 'ord-' + Date.now();
  const order: Order = {
    ...orderData,
    id: orderId,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, order);
    return order;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((snap) => {
      orders.push({ id: snap.id, ...snap.data() } as Order);
    });
    return orders;
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
}

export async function getUserOrders(customerId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerId', '==', customerId)
    );
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((snap) => {
      orders.push({ id: snap.id, ...snap.data() } as Order);
    });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Order;
  } catch (err) {
    console.error('Error fetching order by ID:', orderId, err);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      orderStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  stripePaymentIntentId?: string
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updates: any = {
      paymentStatus,
      updatedAt: new Date().toISOString(),
    };
    if (stripePaymentIntentId) {
      updates.stripePaymentIntentId = stripePaymentIntentId;
    }
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}
