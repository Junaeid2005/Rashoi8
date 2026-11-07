import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Trusted admin emails allowlist
const ADMIN_EMAILS = [
  'bluepeakzone2005@gmail.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is verified admin
  const checkAdminPrivilege = async (user: User): Promise<boolean> => {
    if (!user.email) return false;
    const lowerEmail = user.email.toLowerCase();

    // 1. Check verified email allowlist
    if (ADMIN_EMAILS.includes(lowerEmail)) {
      return true;
    }

    // 2. Check /admins/{uid} collection
    try {
      const adminDocRef = doc(db, 'admins', user.uid);
      const snap = await getDoc(adminDocRef);
      if (snap.exists() && snap.data()?.role) {
        return true;
      }
    } catch {
      // Non-admin will receive permission denied or doc not found, which is expected
    }

    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminStatus = await checkAdminPrivilege(user);
        setIsAdmin(adminStatus);

        // Fetch or create customer profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              displayName: data.displayName || user.displayName || '',
              photoURL: data.photoURL || user.photoURL || '',
              phone: data.phone || '',
              isAdmin: adminStatus,
            });
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              phone: '',
              isAdmin: adminStatus,
            };
            await setDoc(userDocRef, {
              email: newProfile.email,
              displayName: newProfile.displayName,
              photoURL: newProfile.photoURL,
              phone: newProfile.phone,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setUserProfile(newProfile);
          }
        } catch {
          // Fallback profile if Firestore read failed
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            isAdmin: adminStatus,
          });
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
