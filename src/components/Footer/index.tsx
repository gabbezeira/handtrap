import { Github, Instagram } from 'lucide-react';
import { FooterContainer, Link, Separator } from './styles';

export const Footer = () => {
    return (
        <FooterContainer>
            <span>Desenvolvido por <strong>Gabriel Alves</strong></span>
            
            <Link href="https://instagram.com/gabbezeira" target="_blank" rel="noopener noreferrer">
                <Instagram /> @gabbezeira
            </Link>

            <Separator>|</Separator>

            <Link href="https://github.com/gabbezeira/handtrap" target="_blank" rel="noopener noreferrer">
                <Github /> Open Source
            </Link>
        </FooterContainer>
    );
};
