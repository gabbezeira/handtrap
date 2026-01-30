# 🃏 Handtrap - Yu-Gi-Oh! Deck Builder & Coach

> **O parceiro definitivo para duelistas modernos.**  
> Construa, Analise e Otimize seus decks com o poder da Inteligência Artificial.

Status: 🚀 **Em Desenvolvimento Ativo**  
🌐 **Sistema Online**: [handtrap.xyz](https://handtrap.xyz)

---

## 📖 Sobre o Projeto

**Handtrap** é uma aplicação web moderna desenvolvida para jogadores de Yu-Gi-Oh! (Master Duel / TCG) que buscam elevar seu nível de jogo. Diferente de deck builders tradicionais, o Handtrap integra **AI (Google Gemini)** para oferecer insights táticos, sugestões de combos e análises de fraquezas em tempo real.

O projeto foca em uma boa experiência de usuário, com performance otimizada e ferramentas práticas para o dia a dia do duelista.

---

## ✨ Funcionalidades Principais

- **📦 Deck Building Avançado**: Interface drag-and-drop intuitiva com filtros inteligentes e busca instantânea.
- **🤖 Análise Tática com IA**: Receba feedback detalhado sobre a consistência do seu deck, pontos fracos e sugestões de "tech cards" usando a API do Google Gemini.
- **🎲 Simulador de Mão**: Teste suas mãos iniciais com um simulador de "Buying Phase" (5 cartas) com opção de Mulligan.
- **💾 Gestão na Nuvem**: Salve seus decks na nuvem (Firebase) e acesse de qualquer lugar.
- **⚡ Performance First**: Cache local agressivo (IndexedDB) para carregamento instantâneo de milhares de cartas.

---

## 🛠️ Tech Stack

Este projeto foi construído utilizando as melhores práticas e tecnologias do ecossistema React:

- **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Super fast HMR)
- **Estilização**: [Styled Components](https://styled-components.com/) (CSS-in-JS com temas dinâmicos)
- **Backend / Auth**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **AI**: Google Gemini API

---

## � Backend Endpoints

O backend oferece os seguintes endpoints para análise de decks e cartas:

| Endpoint | Método | Descrição |
|----------|--------|----------|
| `/` | GET | Status do servidor |
| `/api/health` | GET | Health check (retorna status e timestamp) |
| `/analyze` | POST | Análise completa de deck via IA (requer corpo JSON com `deckList`) |
| `/analyze-card` | POST | Análise individual de carta via IA (requer corpo JSON com `cardName`) |

### Variáveis de Ambiente (Backend)

Para executar o backend localmente, crie um arquivo `.env` em `/backend`:

```env
# Firebase Admin SDK (Obrigatório)
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_CLIENT_EMAIL=seu_service_account_email
FIREBASE_PRIVATE_KEY="sua_private_key_com_quebras_de_linha"

# Gemini API
GEMINI_API_KEY=sua_chave_primaria
GEMINI_API_KEY_BACKUP=sua_chave_backup  # Opcional

# Configuração
PORT=3000
NODE_ENV=development
```

> [!IMPORTANT]
> **Segurança Implementada**: Os endpoints de análise de IA (`/analyze`, `/analyze-card`) agora requerem **autenticação Firebase**. Usuários não logados receberão erro 401. Rate limiting ativo: 5 análises de deck/min, 10 de cartas/min.

### Executar Backend

```bash
cd backend
npm install
npm run dev
```

O backend estará disponível em `http://localhost:3000` (ou porta configurada).

---

## �🚀 Como Executar Localmente

Siga os passos abaixo para contribuir com o projeto:

### Pré-requisitos
- Node.js (v18+)
- NPM ou Yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/gabbezeira/handtrap.git
   cd handtrap/frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do frontend:
   ```env
   VITE_FIREBASE_API_KEY=sua_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
   VITE_FIREBASE_PROJECT_ID=seu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_bucket
   VITE_FIREBASE_APP_ID=seu_app_id
   VITE_API_URL=http://localhost:3000
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:5173` no seu navegador.

---

## 🔮 Roadmap & Atualizações Futuras

Estamos apenas começando! Temos grandes planos para o Handtrap:

- [ ] **🚫 Sistema de Banlist**: Integração automática com as listas de banidas/limitadas (TCG/OCG/Master Duel) para validação de decks em tempo real.
- [ ] **🏆 Ranking de Decks**: Leaderboard comunitário com os decks mais populares e vitoriosos do meta atual.
- [ ] **⚔️ Sistema de Campeonatos**: Ferramenta completa para organização de torneios, com geração automática de chaves (Brackets) e gestão de partidas.
- [ ] **📊 Estatísticas de Duelo**: Histórico de partidas e win-rate analytics para seus decks.
- [ ] **📱 Mobile App**: Versão nativa (PWA ou React Native) para edição de decks on-the-go.

---

## 🤝 Como Contribuir

Contribuições são super bem-vindas! Se você é desenvolvedor, designer ou duelista, sinta-se à vontade para ajudar.

1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua feature (`git checkout -b feature/MinhaFeature`).
3. Faça o **Commit** (`git commit -m 'Adiciona nova feature incrível'`).
4. Faça o **Push** (`git push origin feature/MinhaFeature`).
5. Abra um **Pull Request**.

---

## 👨‍💻 Créditos

Desenvolvido com ❤️ e ☕ por **Gabriel Alves** ([@gabbezeira](https://instagram.com/gabbezeira)).

Projeto Open Source. Junte-se a nós para criar a melhor ferramenta de Yu-Gi-Oh! do mundo.
