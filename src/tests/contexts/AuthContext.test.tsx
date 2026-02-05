import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';

// Mock Modules
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    serverTimestamp: vi.fn(),
  };
});

vi.mock('../../firebase/config', () => ({
  auth: {},
  db: {},
}));

// Test Component to consume context
const TestComponent = () => {
  const { user, login, logout, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <button onClick={() => login('test@test.com', '123456')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: Loading finishes
    (firebaseAuth.onAuthStateChanged as any).mockImplementation((_auth: any, callback: any) => {
      callback(null); // No user initially
      return () => {};
    });
  });

  it('should show loading initially then children', async () => {
    render(
      <AuthProvider>
        <div data-testid="child">Child Content</div>
      </AuthProvider>,
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  it('should call login function', async () => {
    // Mock successful login and profile check
    (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValue({
      user: { uid: '123', email: 'test@test.com' },
    });
    (firebaseFirestore.doc as any).mockReturnValue('doc-ref');
    (firebaseFirestore.getDoc as any).mockResolvedValue({
      exists: () => true,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('user-email')).toHaveTextContent('No User'));

    const loginBtn = screen.getByText('Login');
    await act(async () => {
      loginBtn.click();
    });

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@test.com',
      '123456',
    );
  });
});
