import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, FolderOpen, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MusicSettings } from '../MusicSettings';
import {
  HeaderContainer,
  Logo,
  UserArea,
  UserButton,
  Avatar,
  UserName,
  Dropdown,
  MenuItem,
//   ThemeToggleButton
} from './styles';

export const Header = () => {
    const { user, logout } = useAuth();
    // const { currentTheme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <HeaderContainer>
            <Logo onClick={() => navigate('/decks')}>
                Hand<span>trap</span>
            </Logo>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MusicSettings />

                {user && (
                    <UserArea ref={containerRef}>
                        <UserButton onClick={() => setIsOpen(!isOpen)}>
                            <Avatar 
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`} 
                                alt="User" 
                            />
                            <UserName>{user.displayName || user.email?.split('@')[0]}</UserName>
                            <ChevronDown size={14} style={{opacity: 0.5}} />
                        </UserButton>

                        <Dropdown $isOpen={isOpen}>
                            <div style={{padding: '0 0.5rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.05em'}}>
                                CONTA
                            </div>
                            <MenuItem onClick={() => { setIsOpen(false); navigate('/decks'); }}>
                                <FolderOpen size={18} />
                                Meus Decks
                            </MenuItem>
                            <MenuItem onClick={handleLogout} style={{color: '#ef4444'}}>
                                <LogOut size={18} />
                                Sair
                            </MenuItem>
                        </Dropdown>
                    </UserArea>
                )}
            </div>
        </HeaderContainer>
    );
};
