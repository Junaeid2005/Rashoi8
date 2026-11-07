import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { CustomerMessage } from '../types';

const MESSAGES_COLLECTION = 'customerMessages';

export async function submitCustomerMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: 'complaint' | 'quality' | 'order_issue' | 'suggestion' | 'general';
  message: string;
}): Promise<string> {
  const id = 'msg-' + Date.now();
  const customerMessage: CustomerMessage = {
    id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || '',
    subject: data.subject.trim(),
    category: data.category,
    message: data.message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, MESSAGES_COLLECTION, id);
    await setDoc(docRef, customerMessage);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${MESSAGES_COLLECTION}/${id}`);
  }
}

export async function getCustomerMessages(): Promise<CustomerMessage[]> {
  try {
    const q = query(collection(db, MESSAGES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const messages: CustomerMessage[] = [];
    snapshot.forEach((snap) => {
      messages.push({ id: snap.id, ...snap.data() } as CustomerMessage);
    });
    return messages;
  } catch (err) {
    console.error('Error fetching customer messages:', err);
    return [];
  }
}

export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'archived'): Promise<void> {
  try {
    const docRef = doc(db, MESSAGES_COLLECTION, id);
    await updateDoc(docRef, { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${MESSAGES_COLLECTION}/${id}`);
  }
}

export async function deleteCustomerMessage(id: string): Promise<void> {
  try {
    const docRef = doc(db, MESSAGES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${MESSAGES_COLLECTION}/${id}`);
  }
}
