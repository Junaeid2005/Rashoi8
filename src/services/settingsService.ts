import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { WebsiteSettings } from '../types';
import { INITIAL_WEBSITE_SETTINGS } from '../firebase/seedData';

const SETTINGS_COLLECTION = 'websiteSettings';
const GENERAL_SETTINGS_DOC = 'general';

let cachedSettings: WebsiteSettings | null = null;

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      cachedSettings = INITIAL_WEBSITE_SETTINGS;
      return INITIAL_WEBSITE_SETTINGS;
    }
    const data = { id: snap.id, ...snap.data() } as WebsiteSettings;
    cachedSettings = data;
    return data;
  } catch (err) {
    console.warn('Error fetching website settings, using cached or initial:', err);
    if (cachedSettings) return cachedSettings;
    return INITIAL_WEBSITE_SETTINGS;
  }
}

export async function updateWebsiteSettings(updates: Partial<WebsiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    if (cachedSettings) {
      cachedSettings = { ...cachedSettings, ...updates };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${SETTINGS_COLLECTION}/${GENERAL_SETTINGS_DOC}`);
  }
}
