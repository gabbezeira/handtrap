# 🃏 Handtrap - Yu-Gi-Oh! Deck Builder & Coach

<div align="center">

![Handtrap Logo](https://handtrap.xyz/images/favicon.png)

**O parceiro definitivo para duelistas modernos.**  
Construa, Analise e Otimize seus decks com o poder da Inteligência Artificial.

[![Live Demo](https://img.shields.io/badge/🌐_Demo-handtrap.xyz-6366f1?style=for-the-badge)](https://handtrap.xyz)
[![Backend API](https://img.shields.io/badge/🔗_API-api.handtrap.xyz-10b981?style=for-the-badge)](https://api.handtrap.xyz)
[![Status](https://img.shields.io/badge/Status-Em_Produção-success?style=for-the-badge)]()

</div>

---

## 📖 Sobre o Projeto

**Handtrap** é uma aplicação web moderna desenvolvida para jogadores de Yu-Gi-Oh! (Master Duel / TCG) que buscam elevar seu nível de jogo. Diferente de deck builders tradicionais, o Handtrap integra **IA (Google Gemini)** para oferecer insights táticos, sugestões de combos e análises de fraquezas em tempo real.

---

## ✨ Funcionalidades Principais

| Funcionalidade | Descrição |
|---------------|-----------|
| **📦 Deck Building** | Interface intuitiva com busca instantânea em PT-BR e EN |
| **🤖 Análise com IA** | Feedback detalhado sobre consistência, pontos fracos e sugestões |
| **🎲 Simulador de Mão** | Teste mãos iniciais com análise estratégica da IA |
| **💾 Cloud Sync** | Decks salvos na nuvem via Firebase |
| **⚡ Performance** | Cache IndexedDB para carregamento instantâneo |
| **💎 Plano Premium** | Mais análises diárias com modelo IA avançado (Gemini Pro) |
| **🔊 Música Ambiente** | Trilha sonora oficial de Yu-Gi-Oh! |

---

## 🛠️ Tech Stack

### Frontend
| Tecnologia | Uso |
|------------|-----|
| React 18 + TypeScript | Core |
| Vite | Build tool |
| Styled Components | CSS-in-JS |
| Firebase | Auth + Firestore |
| IndexedDB | Cache de cartas |
| Lucide React | Ícones |

### Backend
| Tecnologia | Uso |
|------------|-----|
| Node.js + Express | API Server |
| TypeScript | Linguagem |
| Google Gemini | IA (2.5 Flash/Pro) |
| Stripe | Pagamentos |
| Firebase Admin | Auth verification |

---

## 🚀 Como Executar

### Frontend

```bash
# Clone e entre no diretório
git clone https://github.com/gabbezeira/handtrap.git
cd handtrap/frontend

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais Firebase

# Execute
npm run dev
```

Acesse `http://localhost:5173`

### Variáveis de Ambiente (.env)

```env
VITE_FIREBASE_API_KEY=sua_key
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket
VITE_FIREBASE_APP_ID=seu_app_id
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_PASSWORD=sua_senha_admin
```

---

## 📱 Screenshots

<div align="center">

| Deck Builder | Análise IA | Simulador de Mão |
|:------------:|:----------:|:----------------:|
| ![Deck Builder](https://via.placeholder.com/250x150?text=Deck+Builder) | ![IA Analysis](https://via.placeholder.com/250x150?text=AI+Analysis) | ![Hand Sim](https://via.placeholder.com/250x150?text=Hand+Simulator) |

</div>

---

## 💎 Sistema Premium

| Recurso | Free | Premium |
|---------|:----:|:-------:|
| Análise de Deck/dia | 1 | 3 |
| Análise de Carta/dia | 5 | 10 |
| Análise de Mão/dia | 3 | 5 |
| Modelo IA | Flash | **Pro** |
| API Customizada | ❌ | ✅ |

---

## 🔮 Roadmap

- [ ] 🚫 Sistema de Banlist automático
- [ ] 🏆 Ranking de Decks comunitário
- [ ] ⚔️ Sistema de Torneios
- [ ] 📊 Analytics de Duelos
- [ ] 📱 PWA / App Mobile

---

## 🌐 Links

- **Aplicação**: [handtrap.xyz](https://handtrap.xyz)
- **API Backend**: [api.handtrap.xyz](https://api.handtrap.xyz)
- **Repositório Backend**: [github.com/gabbezeira/handtrap-api](https://github.com/gabbezeira/handtrap-api)

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 👨‍💻 Autor

**Gabriel Alves** - [@gabbezeira](https://instagram.com/gabbezeira)

---

<div align="center">

Made with ❤️ and ☕ for the Yu-Gi-Oh! Community

**[⭐ Star este repositório se foi útil!](https://github.com/gabbezeira/handtrap)**

</div>
