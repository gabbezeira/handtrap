import { useState, useRef, useEffect } from 'react';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import styled from 'styled-components';
import { useMusic } from '../../contexts/MusicContext';

const SettingsButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  svg {
    color: #fff;
  }
`;

const SettingsDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const SettingItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const VolumeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    border: none;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const MuteButton = styled.button`
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const VolumeValue = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
`;

export const MusicSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { volume, isMuted, setVolume, toggleMute } = useMusic();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <SettingsButton
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Configurações de música"
      >
        <Settings size={20} />
      </SettingsButton>

      <SettingsDropdown ref={dropdownRef} $isOpen={isOpen}>
        <SettingItem>
          <SettingLabel>
            <Volume2 size={16} />
            Volume
            <VolumeValue>{Math.round(volume * 100)}%</VolumeValue>
          </SettingLabel>
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </SettingItem>

        <SettingItem>
          <MuteButton onClick={toggleMute}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isMuted ? 'Desmutar' : 'Mutar'}
          </MuteButton>
        </SettingItem>
      </SettingsDropdown>
    </div>
  );
};
