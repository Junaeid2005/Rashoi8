import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Category, MenuItem } from '../types';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS } from '../firebase/seedData';

const CATEGORIES_COLLECTION = 'categories';
const MENU_COLLECTION = 'menuItems';

// In-memory cache to guarantee instant response and graceful offline capability
let cachedCategories: Category[] | null = null;
let cachedMenuItems: MenuItem[] | null = null;

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      cachedCategories = INITIAL_CATEGORIES;
      return INITIAL_CATEGORIES;
    }
    
    const list: Category[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Category);
    });
    cachedCategories = list;
    return list;
  } catch (err) {
    console.warn('Using cached categories due to fetch error:', err);
    if (cachedCategories) return cachedCategories;
    return INITIAL_CATEGORIES;
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const q = query(collection(db, MENU_COLLECTION), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      cachedMenuItems = INITIAL_MENU_ITEMS;
      return INITIAL_MENU_ITEMS;
    }
    
    const list: MenuItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as MenuItem);
    });
    cachedMenuItems = list;
    return list;
  } catch (err) {
    console.warn('Using cached menu items due to fetch error:', err);
    if (cachedMenuItems) return cachedMenuItems;
    return INITIAL_MENU_ITEMS;
  }
}

export async function seedInitialCategories() {
  try {
    const batch = writeBatch(db);
    for (const cat of INITIAL_CATEGORIES) {
      const ref = doc(db, CATEGORIES_COLLECTION, cat.id);
      batch.set(ref, {
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        displayOrder: cat.displayOrder,
        active: cat.active,
        createdAt: new Date().toISOString(),
      });
    }
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, CATEGORIES_COLLECTION);
  }
}

export async function seedInitialMenu() {
  try {
    // Process in batches of 25 to respect Firestore limits
    const chunks: MenuItem[][] = [];
    for (let i = 0; i < INITIAL_MENU_ITEMS.length; i += 25) {
      chunks.push(INITIAL_MENU_ITEMS.slice(i, i + 25));
    }
    
    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const item of chunk) {
        const ref = doc(db, MENU_COLLECTION, item.id);
        const data: any = {
          name: item.name,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          price: item.price,
          available: item.available,
          displayOrder: item.displayOrder,
          description: item.description || '',
          imageUrl: item.imageUrl || '',
          spiceLevel: item.spiceLevel ?? 0,
          createdAt: new Date().toISOString(),
        };
        if (item.dietary) data.dietary = item.dietary;
        if (item.isMatrixDish) data.isMatrixDish = item.isMatrixDish;
        if (item.variants) data.variants = item.variants;
        if (item.extraNotes) data.extraNotes = item.extraNotes;
        
        batch.set(ref, data);
      }
      await batch.commit();
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, MENU_COLLECTION);
  }
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  const newId = 'dish-' + Date.now();
  try {
    const docRef = doc(db, MENU_COLLECTION, newId);
    const data = {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, data);
    return newId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${MENU_COLLECTION}/${newId}`);
  }
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${MENU_COLLECTION}/${id}`);
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${MENU_COLLECTION}/${id}`);
  }
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
  const newId = 'cat-' + Date.now();
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, newId);
    await setDoc(docRef, {
      ...category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${CATEGORIES_COLLECTION}/${newId}`);
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CATEGORIES_COLLECTION}/${id}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${id}`);
  }
}
