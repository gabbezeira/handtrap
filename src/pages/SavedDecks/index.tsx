import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Plus, Trash2, Edit3, Calendar, Dices, Download } from 'lucide-react';
import { getUserDecks, DeckDocument, deleteDeck, saveDeck } from '../../services/deckService';
import { CardData, fetchCardsByIds } from '../../services/cardDatabase';
import { decodeDeck } from '../../utils/deckShareUtils';
import { useModal } from '../../contexts/ModalContext';
import { HandSimulationModal } from '../../components/HandSimulationModal';
import { useAuth } from '../../contexts/AuthContext';
import { DeleteDeckModal } from '../../components/DeleteDeckModal';
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
  DateLabel,
  ImportWrapper,
  ImportInput,
  ImportButton,
  ActionsWrapper,
  WarningBanner,
  WarningIcon
} from './styles';

export const SavedDecks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [decks, setDecks] = useState<DeckDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [simulatingDeck, setSimulatingDeck] = useState<CardData[] | null>(null);
    const [simulatingExtra, setSimulatingExtra] = useState<CardData[]>([]);
    const [showHandModal, setShowHandModal] = useState(false);
    
    // Import State
    const [importLink, setImportLink] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const { showModal } = useModal();

    const [deckToDelete, setDeckToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const handleImportDeck = async () => {
        if (!importLink) return;
        if (!user) {
             showModal({ title: 'Erro', message: 'Você precisa estar logado.', type: 'error' });
             return;
        }

        setIsImporting(true);
        try {
            // Extract code from URL
            let code = importLink;
            if (importLink.includes('import=')) {
                code = importLink.split('import=')[1];
            }

            const { main, extra } = decodeDeck(code);
            if (main.length === 0 && extra.length === 0) {
                 throw new Error("Link inválido ou deck vazio.");
            }

            // Hydrate Cards
            const allIds = [...new Set([...main, ...extra])];
            const uniqueCards = await fetchCardsByIds(allIds);
            const cardMap = new Map(uniqueCards.map(c => [c.id, c]));

            const resolveCards = (ids: number[]) => ids.map(id => cardMap.get(id)).filter(Boolean) as CardData[];
            const mainDeck = resolveCards(main);
            const extraDeck = resolveCards(extra);

            // Save to Account
            await saveDeck(user.uid, {
                name: `Deck Importado ${new Date().toLocaleDateString()}`,
                authorName: user.displayName || 'Duelist',
                isPublic: false,
                cards: { main: mainDeck, extra: extraDeck },
                deckHash: '', // Optional/Generated
            });

            setImportLink('');
            showModal({ title: 'Sucesso', message: 'Deck importado e salvo na sua conta com sucesso!', type: 'success' });
            loadDecks();

        } catch (error: any) {
            console.error(error);
            showModal({ title: 'Falha na Importação', message: 'Link inválido ou erro ao processar: ' + error.message, type: 'error' });
        } finally {
            setIsImporting(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeckToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!user || !deckToDelete) return;

        try {
            await deleteDeck(user.uid, deckToDelete);
            loadDecks();
            setShowDeleteModal(false);
            setDeckToDelete(null);
        } catch (error) {
            console.error("Failed to delete deck", error);
            showModal({ title: 'Erro', message: 'Ocorreu um erro ao excluir o deck.', type: 'error' });
        }
    };

    const handleSimulate = (e: React.MouseEvent, deck: DeckDocument) => {
        e.stopPropagation();
        setSimulatingDeck(deck.cards.main);
        setSimulatingExtra(deck.cards.extra);
        setShowHandModal(true);
    };

    return (
        <PageWrapper>
            <Header />
            <Container>
                <TitleSection>
                    <Title>Meus <span>Decks</span></Title>
                    <ActionsWrapper>
                        <ImportWrapper>
                            <ImportInput 
                                placeholder="Colar Link do Deck..." 
                                value={importLink}
                                onChange={e => setImportLink(e.target.value)}
                            />
                            <ImportButton
                                onClick={handleImportDeck}
                                disabled={!importLink || isImporting}
                            >
                                {isImporting ? <Calendar className="animate-spin" size={16}/> : <Download size={16} />} 
                                Importar
                            </ImportButton>
                        </ImportWrapper>
                        <CreateButton onClick={() => navigate('/builder')}>
                            <Plus size={20} />
                            Novo Deck
                        </CreateButton>
                    </ActionsWrapper>
                </TitleSection>
                
                <WarningBanner>
                    <WarningIcon>⚠️</WarningIcon>
                    <span>
                        <strong>Aviso:</strong> O sistema de banlist está em construção. 
                        No momento, não há restrições automáticas para cartas banidas ou limitadas ao adicionar ao deck.
                    </span>
                </WarningBanner>

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
                                    <IconButton onClick={(e) => handleSimulate(e, deck)} title="Simular Mão Inicial">
                                        <Dices size={18} />
                                    </IconButton>
                                    <IconButton color="var(--error-color)" onClick={(e) => handleDeleteClick(e, deck.id!)}>
                                        <Trash2 size={18} />
                                    </IconButton>
                                </DeckActions>
                            </DeckCard>
                        ))}
                    </DecksGrid>
                )}
            </Container>
            <HandSimulationModal 
                isOpen={showHandModal}
                onClose={() => setShowHandModal(false)}
                deck={simulatingDeck || []}
                extraDeck={simulatingExtra}
            />
            <DeleteDeckModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                deckName={decks.find(d => d.id === deckToDelete)?.name}
            />
        </PageWrapper>
    );
};
