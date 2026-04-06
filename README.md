# Hypesoft - Sistema de Gestão de Produtos

Sistema completo de gestão de produtos com Clean Architecture, CQRS, React + TypeScript, MongoDB, Keycloak e Docker.

## Stack Tecnológica

### Backend
- **.NET 9** com C#
- **Clean Architecture + DDD**
- **CQRS + MediatR**
- **MongoDB** como banco de dados
- **FluentValidation** para validação
- **Swagger** para documentação da API

### Frontend
- **React 18** com **TypeScript**
- **Vite** para build
- **TailwindCSS + Shadcn/ui** para estilização
- **TanStack Query** para gerenciamento de estado
- **Chart.js** para gráficos
- **React Router** para navegação

### Infraestrutura
- **Docker + Docker Compose** para containerização
- **Keycloak** para autenticação OAuth2/OpenID Connect
- **Nginx** como reverse proxy

## Arquitetura do Sistema

### Backend - Clean Architecture

```
backend/src/
├── Hypesoft.Domain/              # Camada de Domínio
│   ├── Entities/                 # Entidades (Product, Category, BaseEntity)
│   └── Repositories/            # Interfaces dos repositórios
├── Hypesoft.Application/         # Camada de Aplicação
│   ├── Commands/                # Comandos CQRS
│   ├── Queries/                # Consultas CQRS
│   ├── Handlers/                # Handlers MediatR
│   ├── DTOs/                   # Data Transfer Objects
│   └── Validators/             # Validadores FluentValidation
├── Hypesoft.Infrastructure/     # Camada de Infraestrutura
│   ├── Data/                   # Contexto MongoDB
│   ├── Repositories/           # Implementação dos repositórios
│   ├── Services/               # Serviços JWT
│   └── Configuration/          # Configurações de DI
└── Hypesoft.API/               # Camada de Apresentação
    ├── Controllers/           # Controllers da API
    ├── Middlewares/           # ExceptionMiddleware
    └── Program.cs             # Configuração da aplicação
```

### Frontend - Arquitetura Modular

```
frontend/src/
├── components/
│   ├── ui/                    # Componentes Shadcn/ui
│   └── layout/                # Layout com sidebar
├── pages/                     # Páginas da aplicação
│   ├── Login.tsx              # Login com autenticação
│   ├── Dashboard.tsx          # Dashboard com métricas
│   ├── Products.tsx           # CRUD de produtos
│   └── Categories.tsx         # CRUD de categorias
├── hooks/                     # Custom hooks
│   └── useAuth.tsx           # Hook de autenticação
├── services/                  # Serviços de API
│   └── api.ts                # Axios com interceptors
└── types/                     # Definições de tipos
    └── index.ts
```

## Funcionalidades

### Gestão de Produtos
- CRUD completo (Criar, Listar, Editar, Excluir)
- Campos: nome, descrição, preço, categoria, quantidade em estoque
- Validação de dados obrigatórios
- Busca por nome do produto

### Sistema de Categorias
- CRUD completo de categorias
- Associação com produtos
- Filtro de produtos por categoria

### Dashboard
- Total de produtos cadastrados
- Valor total do estoque
- Lista de produtos com estoque baixo (< 10 unidades)
- Gráfico de produtos por categoria (Pizza e Barras)
- Métricas adicionais (estoque total, média de preço, etc)

### Autenticação
- Integração com Keycloak (OAuth2/OpenID Connect)
- Proteção de rotas no frontend
- JWT Token validation no backend
- Roles: Admin, Manager, User

## URLs de Acesso

| Serviço       | URL                          |
|---------------|------------------------------|
| Frontend      | http://localhost:3000         |
| API           | http://localhost:5000         |
| Swagger       | http://localhost:5000/swagger |
| MongoDB       | http://localhost:27017       |
| Mongo Express | http://localhost:8081        |
| Keycloak      | http://localhost:8080        |

## Instalação e Execução

### Pré-requisitos
- Docker Desktop 4.0+
- Node.js 18+ (para desenvolvimento local)
- .NET 9 SDK (para desenvolvimento local)

### Executar com Docker Compose

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/hypesoft-challenge.git
cd hypesoft-challenge

# Execute toda a aplicação
docker-compose up -d

# Verifique os serviços
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Desenvolvimento Local

```bash
# Backend
cd backend
dotnet restore
dotnet run --project src/Hypesoft.API

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### Credenciais de Teste

| Usuário | Senha   | Roles           |
|---------|---------|-----------------|
| admin   | admin   | admin, manager, user |
| manager | manager | manager, user      |
| user    | user    | user               |

## Endpoints da API

### Products
- `GET /api/products` - Lista produtos (paginação, filtro por categoria, busca)
- `GET /api/products/{id}` - Busca produto por ID
- `GET /api/products/low-stock` - Lista produtos com estoque baixo
- `POST /api/products` - Cria novo produto
- `PUT /api/products/{id}` - Atualiza produto
- `DELETE /api/products/{id}` - Remove produto

### Categories
- `GET /api/categories` - Lista todas as categorias
- `GET /api/categories/{id}` - Busca categoria por ID
- `POST /api/categories` - Cria nova categoria
- `PUT /api/categories/{id}` - Atualiza categoria
- `DELETE /api/categories/{id}` - Remove categoria

### Dashboard
- `GET /api/dashboard` - Retorna métricas do dashboard

### Health
- `GET /api/health` - Health check da API

## Variáveis de Ambiente

### Backend (.env.example)
```env
MongoDb__ConnectionString=mongodb://admin:admin123@mongodb:27017
MongoDb__DatabaseName=hypesoftdb
Keycloak__Url=http://keycloak:8080
Keycloak__Realm=hypesoft
Keycloak__ClientId=hypesoft-api
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:5000
```

### Frontend (.env.example)
```env
VITE_API_URL=http://localhost:5000
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=hypesoft
VITE_KEYCLOAK_CLIENT_ID=hypesoft-frontend
```

## Padrões de Commit

Este projeto utiliza Conventional Commits:

```
feat(products): add bulk import functionality
fix(api): resolve pagination issue in products endpoint
docs(readme): update installation instructions
test(products): add unit tests for product service
refactor(auth): improve JWT token validation
```

## Estrutura de Pastas Docker

```
.
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── Hypesoft.Domain/
│       ├── Hypesoft.Application/
│       ├── Hypesoft.Infrastructure/
│       └── Hypesoft.API/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── keycloak/
│   └── realm-export.json
├── docker-compose.yml
└── README.md
```

## Implementação de Requisitos Técnicos

### Performance
- Paginação eficiente para grandes volumes
- Indexação no MongoDB
- Cache para consultas frequentes (configurado no MongoDB)

### Segurança
- Rate limiting configurado
- Validação de inputs com FluentValidation
- Headers de segurança (CORS)
- JWT Token validation com Keycloak

### Disponibilidade
- Health checks implementados em todos os serviços
- Tratamento de exceções com ExceptionMiddleware
- Logs estruturados com Serilog

### Usabilidade
- Interface responsiva
- Validação em tempo real nos formulários
- Feedback visual para ações do usuário
- Design moderno com gradientes e animações

## Como Testar

1. Acesse http://localhost:3000
2. Faça login com admin/admin
3. Explore o dashboard
4. Cadastre categorias
5. Cadastre produtos
6. Teste filtros e busca

## Contribuição

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

MIT License
