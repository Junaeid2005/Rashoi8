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
import { CustomerReview } from '../types';
import { INITIAL_REVIEWS } from '../firebase/seedData';

const REVIEWS_COLLECTION = 'reviews';

export async function getReviews(): Promise<CustomerReview[]> {
  try {
    const q = query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return INITIAL_REVIEWS;
    }
    const list: CustomerReview[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as CustomerReview);
    });
    return list;
  } catch (err) {
    console.warn('Error fetching reviews, returning initial reviews:', err);
    return INITIAL_REVIEWS;
  }
}

export async function seedInitialReviews(): Promise<void> {
  try {
    for (const rev of INITIAL_REVIEWS) {
      const ref = doc(db, REVIEWS_COLLECTION, rev.id);
      await setDoc(ref, rev);
    }
  } catch (err) {
    console.warn('Seeding reviews warning:', err);
  }
}

export async function addReview(review: Omit<CustomerReview, 'id' | 'createdAt'>): Promise<string> {
  const id = 'rev-' + Date.now();
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    const newRev: CustomerReview = {
      ...review,
      id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newRev);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${REVIEWS_COLLECTION}/${id}`);
  }
}

export async function updateReview(id: string, updates: Partial<CustomerReview>): Promise<void> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${REVIEWS_COLLECTION}/${id}`);
  }
}

export async function deleteReview(id: string): Promise<void> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${REVIEWS_COLLECTION}/${id}`);
  }
}
