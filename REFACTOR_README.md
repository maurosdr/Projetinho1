# Health Track - Sistema de Registro de Saúde

## Visão Geral

Sistema de saúde completo com design **Liquid Gas** (clean, moderno, com tons de azul claro, branco e cinza).

## Mudanças Implementadas

### 1. Separação das Abas em Páginas Diferentes

Cada funcionalidade agora tem sua própria página em diretórios separados:

```
frontend/
├── dashboard.html              # Página inicial com estatísticas
├── pages/
│   ├── pacientes/             # Nova funcionalidade de pacientes
│   │   ├── index.html
│   │   └── pacientes.js
│   ├── registro-diario/
│   │   ├── index.html
│   │   └── registro-diario.js
│   ├── exames/
│   │   ├── index.html
│   │   └── exames.js
│   ├── treinos/
│   │   ├── index.html
│   │   └── treinos.js
│   ├── refeicoes/
│   │   ├── index.html
│   │   └── refeicoes.js
│   ├── metas/
│   │   ├── index.html
│   │   └── metas.js
│   ├── doencas/
│   │   ├── index.html
│   │   └── doencas.js
│   └── remedios/
│       ├── index.html
│       └── remedios.js
├── css/
│   ├── liquid-gas.css         # Novo design system
│   └── style.css              # Antigo (pode ser removido)
└── js/
    ├── common.js              # Funções compartilhadas
    └── dashboard.js           # Dashboard
```

### 2. Página de Pacientes

Nova funcionalidade completa de gerenciamento de pacientes:

- **Cadastro de pacientes** com informações completas (nome, CPF, data de nascimento, etc.)
- **Visualização do histórico** de cada paciente
- **Filtro por tipo de registro** (Registros diários, Exames, Treinos, Refeições, Metas, Doenças, Remédios)
- **Interface modal** para exibir histórico detalhado

Acesse em: `http://localhost:3000/pages/pacientes/index.html`

### 3. Liquid Gas Design

Novo sistema de design com:

**Paleta de Cores:**
- Azul primário: `#00bcd4` (ciano)
- Azul escuro: `#0097a7`
- Azul claro: `#b2ebf2`
- Azul ultra claro: `#e0f7fa`
- Branco: `#ffffff`
- Cinza claro: `#f5f5f5`
- Cinza médio: `#9e9e9e`
- Cinza escuro: `#424242`

**Características:**
- Layout clean e moderno
- Sidebar de navegação fixa
- Cards com sombras suaves
- Gradientes sutis
- Transições suaves
- Design responsivo

### 4. Navegação Unificada

Todas as páginas compartilham a mesma sidebar de navegação:

- Dashboard
- Pacientes (novo)
- Registro Diário
- Exames
- Treinos
- Refeições
- Metas
- Doenças
- Remédios

## Como Usar

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
```

### Acessar a Aplicação

1. Abra o navegador em: `http://localhost:3000/dashboard.html`
2. Use a navegação lateral para acessar diferentes seções
3. A página de pacientes permite cadastrar e visualizar históricos completos

### Fluxo de Uso Recomendado

1. **Dashboard**: Veja estatísticas gerais
2. **Pacientes**: Cadastre pacientes para organizar os dados
3. **Registro Diário**: Adicione registros diários de saúde
4. **Exames**: Faça upload de exames médicos
5. **Treinos**: Registre seus treinos
6. **Refeições**: Acompanhe sua alimentação
7. **Metas**: Defina e monitore objetivos
8. **Doenças**: Gerencie condições pré-existentes
9. **Remédios**: Controle medicamentos

## Backend

### Nova Tabela: Pacientes

```sql
CREATE TABLE pacientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  data_nascimento DATE,
  cpf TEXT,
  email TEXT,
  telefone TEXT,
  tipo_sanguineo TEXT,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Novas Rotas API

```
GET    /api/pacientes         - Listar todos os pacientes
GET    /api/pacientes/:id     - Obter paciente específico
POST   /api/pacientes         - Criar novo paciente
DELETE /api/pacientes/:id     - Deletar paciente
```

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Banco de Dados**: SQLite
- **Design**: Liquid Gas Design System

## Estrutura de Arquivos

```
Projetinho1/
├── backend/
│   ├── server.js              # Servidor Express com todas as rotas
│   ├── database.js            # Configuração SQLite
│   └── health_tracker.db      # Banco de dados
├── frontend/
│   ├── dashboard.html         # Dashboard principal
│   ├── pages/                 # Páginas separadas por funcionalidade
│   ├── css/
│   │   └── liquid-gas.css    # Design system
│   └── js/
│       ├── common.js          # Funções compartilhadas
│       └── dashboard.js       # JS do dashboard
├── package.json
└── README.md
```

## Próximos Passos

Possíveis melhorias futuras:

1. Adicionar autenticação de usuários
2. Implementar gráficos e visualizações de dados
3. Adicionar exportação de relatórios (PDF)
4. Implementar notificações para lembretes de medicamentos
5. Adicionar integração com dispositivos de saúde (wearables)
6. Criar aplicativo mobile

## Suporte

Para dúvidas ou problemas, consulte a documentação do código ou abra uma issue no repositório.
