# API Base para Prova Web

## Como usar

1. Instalar dependências:
\`\`\`bash
npm install
\`\`\`

2. Criar arquivo .env com:
\`\`\`
JWT_SECRET=sua_chave_secreta_super_forte_aqui_123456
PORT=3000
\`\`\`

3. Rodar o servidor:
\`\`\`bash
npm run dev
\`\`\`

## Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Usuários (protegido)
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto (protegido)
- `PUT /api/products/:id` - Atualizar produto (protegido)
- `DELETE /api/products/:id` - Deletar produto (protegido)

## Exemplos de uso

### Registrar usuário:
\`\`\`json
POST /api/auth/register
{
  "username": "joao",
  "email": "joao@email.com",
  "password": "123456"
}
\`\`\`

### Login:
\`\`\`json
POST /api/auth/login
{
  "email": "joao@email.com",
  "password": "123456"
}
\`\`\`

### Criar produto (com token):
\`\`\`json
POST /api/products
Authorization: Bearer SEU_TOKEN_AQUI
{
  "name": "Notebook",
  "description": "Notebook gamer",
  "price": 2500.00,
  "category": "Eletrônicos"
}
\`\`\`

## Estrutura dos dados

Os dados são salvos em arquivos JSON na pasta `data/`:
- `users.json` - Usuários
- `products.json` - Produtos

## Funcionalidades incluídas

✅ Express.js configurado
✅ CRUD completo
✅ Persistência em arquivo JSON
✅ Autenticação JWT
✅ Middleware de autenticação
✅ Rotas organizadas
✅ Validações básicas
✅ Tratamento de erros
✅ CORS habilitado
