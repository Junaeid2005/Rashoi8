import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Reservation, ReservationStatus, FullyBookedDate } from '../types';

const RESERVATIONS_COLLECTION = 'reservations';
const FULLY_BOOKED_COLLECTION = 'fullyBookedDates';

export async function isDateFullyBooked(dateStr: string): Promise<boolean> {
  try {
    const docRef = doc(db, FULLY_BOOKED_COLLECTION, dateStr);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;
    return !!snap.data()?.isFullyBooked;
  } catch (err) {
    console.error('Error checking fully booked status for date:', dateStr, err);
    return false;
  }
}

export async function getFullyBookedDates(): Promise<FullyBookedDate[]> {
  try {
    const q = query(collection(db, FULLY_BOOKED_COLLECTION), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const dates: FullyBookedDate[] = [];
    snapshot.forEach((snap) => {
      dates.push({ id: snap.id, ...snap.data() } as FullyBookedDate);
    });
    return dates;
  } catch (err) {
    console.error('Error fetching fully booked dates:', err);
    return [];
  }
}

export async function setFullyBookedDate(dateStr: string, isFullyBooked: boolean, note?: string): Promise<void> {
  try {
    const docRef = doc(db, FULLY_BOOKED_COLLECTION, dateStr);
    await setDoc(docRef, {
      date: dateStr,
      isFullyBooked,
      note: note || '',
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FULLY_BOOKED_COLLECTION}/${dateStr}`);
  }
}

export async function createReservation(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  specialRequests?: string;
  customerId?: string;
}): Promise<Reservation> {
  // Enforce Fully Booked date validation
  const booked = await isDateFullyBooked(data.date);
  if (booked) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (data.date === todayStr) {
      throw new Error('Sorry, all tables are fully booked today. Please choose tomorrow or another available date.');
    } else {
      throw new Error('Sorry, all tables are fully booked on your selected date. Please choose another available date.');
    }
  }

  const reservationId = 'res-' + Date.now();
  const reservationNumber = 'RSH-' + Math.floor(100000 + Math.random() * 900000);

  const reservation: Reservation = {
    id: reservationId,
    reservationNumber,
    customerId: data.customerId || '',
    customerName: data.customerName.trim(),
    customerEmail: data.customerEmail.trim().toLowerCase(),
    customerPhone: data.customerPhone.trim(),
    date: data.date,
    time: data.time,
    guests: Number(data.guests),
    specialRequests: data.specialRequests ? data.specialRequests.trim() : '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, RESERVATIONS_COLLECTION, reservationId);
    await setDoc(docRef, reservation);
    return reservation;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${RESERVATIONS_COLLECTION}/${reservationId}`);
  }
}

export async function getReservations(): Promise<Reservation[]> {
  try {
    const q = query(collection(db, RESERVATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const list: Reservation[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as Reservation);
    });
    return list;
  } catch (err) {
    console.error('Error fetching reservations:', err);
    return [];
  }
}

export async function getUserReservations(customerId: string): Promise<Reservation[]> {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('customerId', '==', customerId)
    );
    const snapshot = await getDocs(q);
    const list: Reservation[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as Reservation);
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching user reservations:', err);
    return [];
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus, internalNotes?: string): Promise<void> {
  try {
    const docRef = doc(db, RESERVATIONS_COLLECTION, id);
    const updates: any = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (internalNotes !== undefined) {
      updates.internalNotes = internalNotes;
    }
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${RESERVATIONS_COLLECTION}/${id}`);
  }
}

export async function deleteReservation(id: string): Promise<void> {
  try {
    const docRef = doc(db, RESERVATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${RESERVATIONS_COLLECTION}/${id}`);
  }
}
