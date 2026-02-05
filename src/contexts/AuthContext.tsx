import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (mode?: 'login' | 'register') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const createProfile = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Usuário',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        subscription: {
          plan: 'free',
          status: 'active',
        },
      });
    }
  };

  const login = async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    // Ensure profile exists even on regular login, just in case
    const userRef = doc(db, 'users', result.user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error(
        'Perfil de usuário não encontrado. Por favor, contate o suporte ou registre-se novamente.',
      );
    }
  };

  const register = async (email: string, pass: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await createProfile(result.user);
  };

  const loginWithGoogle = async (mode: 'login' | 'register' = 'login') => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (mode === 'login') {
      if (!userSnap.exists()) {
        await signOut(auth);
        throw new Error('Conta não encontrada. Por favor, faça o cadastro primeiro.');
      }
    } else {
      // mode === 'register'
      if (!userSnap.exists()) {
        await createProfile(user);
      }
      // If it exists, we just proceed as logged in
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
