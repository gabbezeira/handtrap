import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CardProvider } from './contexts/CardContext';
import { ModalProvider } from './contexts/ModalContext';
import { GlobalStyles } from './styles/GlobalStyles';
import styled from 'styled-components';
import { CrtEffect } from './components/CrtEffect';
import { MobileBlocker } from './components/MobileBlocker';
import { DebugProvider } from './contexts/DebugContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import { DeckBuilder } from './pages/DeckBuilder';
import { Login } from './pages/Login';

import { SavedDecks } from './pages/SavedDecks';

const AppContainer = styled.div`
  min-height: 100vh;
`;

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading Auth...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

import { useState, useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';

// ...

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowAdmin(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContainer>
        <DebugProvider>
            <ThemeProvider>
                <CrtEffect />
                <MobileBlocker />
                <GlobalStyles />
                {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
                <AuthProvider>
                    <CardProvider>
                        <ModalProvider>
                            <Router>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/decks" element={<SavedDecks />} />
                                    <Route path="/builder" element={<DeckBuilder />} />
                                    <Route path="*" element={<Navigate to="/decks" replace />} />
                                </Route>
                            </Routes>
                            </Router>
                        </ModalProvider>
                    </CardProvider>
                </AuthProvider>
            </ThemeProvider>
        </DebugProvider>
    </AppContainer>
  )
}

export default App
