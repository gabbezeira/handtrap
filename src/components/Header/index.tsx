import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, FolderOpen, ChevronDown, Settings } from 'lucide-react';
import { FaGem, FaCrown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MusicSettings } from '../MusicSettings';
import { SettingsModal } from '../SettingsModal';
import { UpgradeModal } from '../UpgradeModal';
import LogoHandtrap from '../../assets/images/logo-white-text-inline.png';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  HeaderContainer,
  Logo,
  UserArea,
  UserButton,
  Avatar,
  UserName,
  Dropdown,
  MenuItem,
  RightSection,
  DropdownLabel,
  MenuItemDanger,
  ChevronWrapper,
  PremiumButton,
  PremiumBadge,
} from './styles';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
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

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSubscription(data.subscription || { plan: 'free', status: 'active' });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active';

  return (
    <>
      <HeaderContainer>
        <Logo onClick={() => navigate('/decks')}>
          <img src={LogoHandtrap} alt="Logo" />
        </Logo>

        <RightSection>
          {user && (
            <>
              {isPremium ? (
                <PremiumBadge>
                  <FaCrown size={14} /> Membro Premium
                </PremiumBadge>
              ) : (
                <PremiumButton onClick={() => setShowUpgradeModal(true)}>
                  <FaGem size={14} /> Seja Premium
                </PremiumButton>
              )}
            </>
          )}

          <MusicSettings />

          {user && (
            <UserArea ref={containerRef}>
              <UserButton onClick={() => setIsOpen(!isOpen)}>
                <Avatar
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`
                  }
                  alt="User"
                />
                <UserName>{user.displayName || user.email?.split('@')[0]}</UserName>
                <ChevronWrapper>
                  <ChevronDown size={14} />
                </ChevronWrapper>
              </UserButton>

              <Dropdown $isOpen={isOpen}>
                <DropdownLabel>CONTA</DropdownLabel>
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/decks');
                  }}
                >
                  <FolderOpen size={18} />
                  Meus Decks
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    setShowSettings(true);
                  }}
                >
                  <Settings size={18} />
                  Configurações
                </MenuItem>
                <MenuItemDanger onClick={handleLogout}>
                  <LogOut size={18} />
                  Sair
                </MenuItemDanger>
              </Dropdown>
            </UserArea>
          )}
        </RightSection>
      </HeaderContainer>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
};
