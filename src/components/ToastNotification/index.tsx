import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as S from './styles';

interface ToastNotificationProps {
    message: string;
    onClose?: () => void;
    duration?: number;
}

export const ToastNotification = ({ message, onClose, duration = 5000 }: ToastNotificationProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) setTimeout(onClose, 500); // Wait for animation
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <S.ToastContainer $visible={visible}>
            <Info size={24} color="var(--accent-color)" />
            <S.Message>{message}</S.Message>
        </S.ToastContainer>
    );
};
