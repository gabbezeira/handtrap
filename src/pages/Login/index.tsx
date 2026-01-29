import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import {
  Container,
  GlassCard,
  Title,
  Substring,
  InputGroup,
  Input,
  IconWrapper,
  Button,
  GoogleButton,
  ToggleText,
  ErrorMsg,
  Divider
} from './styles';

export const Login = () => {
    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, pass);
            } else {
                await register(email, pass);
            }
            navigate('/dashboard');
        } catch (err: any) {
            let msg = err.message.replace('Firebase:', '');
            if (msg.includes('auth/invalid-credential')) msg = 'Credenciais inválidas.';
            if (msg.includes('auth/email-already-in-use')) msg = 'Este email já está em uso.';
            if (msg.includes('auth/weak-password')) msg = 'A senha deve ter pelo menos 6 caracteres.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err: any) {
            setError('Falha no login com Google: ' + err.message);
        }
    };

    return (
        <Container>
            <GlassCard>
                <Title>Acessar <span>Sistema</span></Title>
                <Substring>
                    {isLogin ? 'Entre com suas credenciais para continuar' : 'Crie uma nova conta para começar'}
                </Substring>

                {error && <ErrorMsg>{error}</ErrorMsg>}
                
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <IconWrapper><Mail size={18} /></IconWrapper>
                        <Input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <IconWrapper><Lock size={18} /></IconWrapper>
                        <Input 
                            type="password" 
                            placeholder="Senha" 
                            value={pass} 
                            onChange={e => setPass(e.target.value)} 
                            required 
                        />
                    </InputGroup>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </Button>
                </form>
                
                <Divider>
                    <div></div>
                    <span>Ou continue com</span>
                    <div></div>
                </Divider>

                <GoogleButton onClick={handleGoogle} type="button">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width={18} />
                    Entrar com Google
                </GoogleButton>

                <ToggleText onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Não tem conta? " : "Já tem conta? "}
                    <span>{isLogin ? "Cadastre-se" : "Entrar"}</span>
                </ToggleText>
            </GlassCard>
        </Container>
    );
};
