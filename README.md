# 📋 Sistema de Registro de Saúde Pessoal

Um aplicativo web completo para gerenciar suas informações de saúde, incluindo exames médicos, treinos de academia, alimentação, metas, doenças pré-existentes e medicamentos.

## 🚀 Funcionalidades

- **📝 Registro Diário**: Registre peso, pressão arterial, temperatura, humor, sono e sintomas
- **🔬 Exames Médicos**: Armazene exames com upload de arquivos (PDF, imagens)
- **💪 Treinos**: Registre seus treinos de academia com séries, repetições e pesos
- **🍽️ Refeições**: Acompanhe suas refeições com informações nutricionais
- **🎯 Metas**: Defina e acompanhe metas de saúde com barra de progresso
- **🏥 Doenças**: Mantenha registro de doenças pré-existentes
- **💊 Remédios**: Gerencie seus medicamentos e horários

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- SQLite3
- Multer (upload de arquivos)
- CORS

### Frontend
- HTML5
- CSS3 (Design responsivo)
- JavaScript (Vanilla)

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Projetinho1
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Acesse no navegador:
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
Projetinho1/
├── backend/
│   ├── server.js           # Servidor Express e rotas da API
│   ├── database.js         # Configuração do SQLite
│   ├── health_tracker.db   # Banco de dados (gerado automaticamente)
│   └── uploads/            # Arquivos de exames
├── frontend/
│   ├── index.html          # Interface principal
│   ├── css/
│   │   └── style.css       # Estilos
│   └── js/
│       └── app.js          # Lógica do frontend
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Registro Diário
- `GET /api/registro-diario` - Listar todos os registros
- `POST /api/registro-diario` - Criar novo registro
- `DELETE /api/registro-diario/:id` - Remover registro

### Exames
- `GET /api/exames` - Listar todos os exames
- `POST /api/exames` - Adicionar exame (com upload)
- `DELETE /api/exames/:id` - Remover exame

### Treinos
- `GET /api/treinos` - Listar todos os treinos
- `POST /api/treinos` - Adicionar treino
- `DELETE /api/treinos/:id` - Remover treino

### Refeições
- `GET /api/refeicoes` - Listar todas as refeições
- `POST /api/refeicoes` - Adicionar refeição
- `DELETE /api/refeicoes/:id` - Remover refeição

### Metas
- `GET /api/metas` - Listar todas as metas
- `POST /api/metas` - Adicionar meta
- `PUT /api/metas/:id` - Atualizar meta
- `DELETE /api/metas/:id` - Remover meta

### Doenças
- `GET /api/doencas` - Listar todas as doenças
- `POST /api/doencas` - Adicionar doença
- `DELETE /api/doencas/:id` - Remover doença

### Remédios
- `GET /api/remedios` - Listar todos os remédios
- `POST /api/remedios` - Adicionar remédio
- `DELETE /api/remedios/:id` - Remover remédio

## 💡 Como Usar

### 1. Registro Diário
- Acesse a aba "Registro Diário"
- Preencha as informações do dia (peso, pressão, humor, sono, etc.)
- Clique em "Adicionar Registro"

### 2. Exames Médicos
- Acesse a aba "Exames"
- Preencha o título e tipo do exame
- Faça upload do arquivo (PDF ou imagem)
- Adicione observações se necessário
- Clique em "Adicionar Exame"

### 3. Treinos de Academia
- Acesse a aba "Treinos"
- Registre data, tipo de treino e exercício
- Adicione séries, repetições, peso e duração
- Clique em "Adicionar Treino"

### 4. Refeições
- Acesse a aba "Refeições"
- Selecione o tipo de refeição (café, almoço, jantar, etc.)
- Liste os alimentos consumidos
- Adicione informações nutricionais (opcional)
- Clique em "Adicionar Refeição"

### 5. Metas de Saúde
- Acesse a aba "Metas"
- Defina título, tipo e valores alvo
- Acompanhe o progresso com a barra visual
- Atualize conforme necessário

### 6. Doenças e Remédios
- Use as abas correspondentes para registrar condições médicas
- Mantenha informações sobre tratamentos e medicamentos
- Marque itens como ativos/inativos

## 🎨 Características da Interface

- Design moderno e responsivo
- Navegação por abas intuitiva
- Sistema de notificações (toasts)
- Barras de progresso para metas
- Cards organizados com informações claras
- Gradientes e animações suaves
- Compatível com dispositivos móveis

## 🔒 Segurança e Privacidade

- Todos os dados são armazenados localmente no SQLite
- Nenhuma informação é enviada para servidores externos
- Recomenda-se fazer backups regulares do arquivo `health_tracker.db`

## 📝 Desenvolvimento

### Modo de Desenvolvimento
```bash
npm run dev
```
(Requer nodemon instalado)

### Estrutura do Banco de Dados

O sistema utiliza 7 tabelas principais:
- `registro_diario` - Registros diários de saúde
- `exames` - Exames médicos e documentos
- `treinos` - Histórico de treinos
- `refeicoes` - Registro de alimentação
- `metas` - Metas e objetivos
- `doencas` - Doenças pré-existentes
- `remedios` - Medicamentos e tratamentos

## 🤝 Contribuindo

Sinta-se à vontade para contribuir com melhorias:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## ✨ Próximas Funcionalidades (Roadmap)

- [ ] Gráficos e estatísticas
- [ ] Exportação de dados (PDF/CSV)
- [ ] Lembretes de medicamentos
- [ ] Autenticação de usuários
- [ ] Tema escuro
- [ ] PWA (Progressive Web App)
- [ ] Integração com dispositivos wearables

## 🐛 Encontrou um Bug?

Abra uma issue descrevendo:
- O que aconteceu
- O que era esperado
- Passos para reproduzir
- Capturas de tela (se aplicável)

---

Desenvolvido com ❤️ para ajudar no cuidado com a saúde pessoal.
