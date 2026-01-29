import { useRef, useCallback } from 'react';
import card00 from '../assets/sounds/card00.MP3';
import card01 from '../assets/sounds/card01.MP3';
import card02 from '../assets/sounds/card02.MP3';

export const useSoundEffects = () => {
    // Preload audio objects
    const sounds = useRef([
        new Audio(card00),
        new Audio(card01),
        new Audio(card02)
    ]);

    // Set volume
    sounds.current.forEach(s => s.volume = 0.40);


    const playAddSound = useCallback(() => {
        const sound = sounds.current[0]; // card00
        sound.currentTime = 0;
        sound.play().catch(e => console.warn("Audio playback blocked:", e));
    }, []);

    const playRemoveSound = useCallback(() => {
        const sound = sounds.current[1]; // card01
        sound.currentTime = 0;
        sound.play().catch(e => console.warn("Audio playback blocked:", e));
    }, []);

    return { playAddSound, playRemoveSound };
};
