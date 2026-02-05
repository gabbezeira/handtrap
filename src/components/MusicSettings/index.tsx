import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import * as S from './styles';

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
    <S.Wrapper>
      <S.SettingsButton
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Configurações de música"
      >
        <Volume2 size={20} />
      </S.SettingsButton>

      <S.SettingsDropdown ref={dropdownRef} $isOpen={isOpen}>
        <S.SettingItem>
          <S.SettingLabel>
            <Volume2 size={16} />
            Volume
            <S.VolumeValue>{Math.round(volume * 100)}%</S.VolumeValue>
          </S.SettingLabel>
          <S.VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </S.SettingItem>

        <S.SettingItem>
          <S.MuteButton onClick={toggleMute}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isMuted ? 'Desmutar' : 'Mutar'}
          </S.MuteButton>
        </S.SettingItem>
      </S.SettingsDropdown>
    </S.Wrapper>
  );
};
