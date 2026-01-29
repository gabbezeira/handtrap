import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Plus, Trash2, Edit3, Calendar } from 'lucide-react';
import { getUserDecks, DeckDocument, deleteDeck } from '../../services/deckService';
import { useAuth } from '../../contexts/AuthContext';
import {
  PageWrapper,
  Container,
  TitleSection,
  Title,
  DecksGrid,
  DeckCard,
  DeckHeader,
  DeckName,
  DeckMeta,
  DeckBody,
  StatItem,
  DeckActions,
  IconButton,
  EmptyState,
  CreateButton,
  LoadingWrapper,
  DateLabel
} from './styles';

export const SavedDecks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [decks, setDecks] = useState<DeckDocument[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDecks = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const userDecks = await getUserDecks(user.uid);
            setDecks(userDecks);
        } catch (error) {
            console.error("Failed to load decks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDecks();
    }, [user]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este deck?')) {
            await deleteDeck(id);
            loadDecks();
        }
    };

    return (
        <PageWrapper>
            <Header />
            <Container>
                <TitleSection>
                    <Title>Meus <span>Decks</span></Title>
                    <CreateButton onClick={() => navigate('/builder')}>
                        <Plus size={20} />
                        Novo Deck
                    </CreateButton>
                </TitleSection>

                <div style={{
                    marginBottom: '2rem', 
                    padding: '1rem', 
                    background: 'rgba(234, 179, 8, 0.1)', 
                    border: '1px solid rgba(234, 179, 8, 0.2)', 
                    borderRadius: '8px',
                    color: '#fefce8',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                }}>
                    <span style={{fontSize: '1.2rem'}}>⚠️</span>
                    <span>
                        <strong>Aviso:</strong> O sistema de banlist está em construção. 
                        No momento, não há restrições automáticas para cartas banidas ou limitadas ao adicionar ao deck.
                    </span>
                </div>

                {loading ? (
                    <LoadingWrapper>Carregando decks...</LoadingWrapper>
                ) : decks.length === 0 ? (
                    <EmptyState>
                        <h2>Nenhum deck encontrado</h2>
                        <p>Comece a criar seu primeiro deck para dominar o duelo!</p>
                        <CreateButton onClick={() => navigate('/builder')}>
                            <Plus size={18} /> Criar Deck
                        </CreateButton>
                    </EmptyState>
                ) : (
                    <DecksGrid>
                        {decks.map(deck => (
                            <DeckCard key={deck.id} onClick={() => navigate(`/builder?id=${deck.id}`)}>
                                <DeckHeader>
                                    <DeckName>{deck.name}</DeckName>
                                    <DeckMeta>
                                        <DateLabel>
                                            <Calendar size={14} color="var(--accent-color)"/> 
                                            {new Date(deck.createdAt).toLocaleDateString()}
                                        </DateLabel>
                                    </DeckMeta>
                                </DeckHeader>
                                
                                <DeckBody>
                                    <StatItem>
                                        <span>Principal</span>
                                        <span>{deck.cards.main.length} Cartas</span>
                                    </StatItem>
                                    <StatItem>
                                        <span>Extra</span>
                                        <span>{deck.cards.extra.length} Cartas</span>
                                    </StatItem>
                                </DeckBody>

                                <DeckActions>
                                    <IconButton onClick={(e) => { e.stopPropagation(); navigate(`/builder?id=${deck.id}`); }}>
                                        <Edit3 size={18} />
                                    </IconButton>
                                    <IconButton color="var(--error-color)" onClick={(e) => handleDelete(e, deck.id!)}>
                                        <Trash2 size={18} />
                                    </IconButton>
                                </DeckActions>
                            </DeckCard>
                        ))}
                    </DecksGrid>
                )}
            </Container>
        </PageWrapper>
    );
};
