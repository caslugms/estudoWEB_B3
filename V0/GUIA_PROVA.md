# 🎯 GUIA COMPLETO PARA A PROVA - WEB API EXPRESS CRUD

## 📋 CHECKLIST DO QUE ESTÁ PRONTO

✅ **Express Server** - Servidor configurado e funcionando  
✅ **CRUD Completo** - Create, Read, Update, Delete  
✅ **Persistência JSON** - Dados salvos em arquivos .json  
✅ **Autenticação JWT** - Login/Register com tokens  
✅ **Rotas Organizadas** - Separadas por funcionalidade  
✅ **Middleware Auth** - Proteção automática de rotas  
✅ **Validações** - Verificações de dados e permissões  
✅ **Comentários Detalhados** - Código totalmente explicado  

## 🚀 COMO ADAPTAR PARA QUALQUER FRONTEND

### 1. **ANALISAR O FRONTEND RECEBIDO**
\`\`\`javascript
// Procure por:
// - Quais campos os formulários enviam?
// - Que endpoints o frontend está chamando?
// - Qual estrutura de dados espera receber?
\`\`\`

### 2. **ADAPTAÇÕES MAIS COMUNS**

#### **Mudar Nome das Entidades**
\`\`\`javascript
// Se o frontend usa "tasks" ao invés de "products":
// 1. Renomeie: routes/products.js → routes/tasks.js
// 2. Mude: new FileManager("products.json") → new FileManager("tasks.json")  
// 3. Atualize: app.use("/api/products", ...) → app.use("/api/tasks", ...)
\`\`\`

#### **Adaptar Campos dos Modelos**
\`\`\`javascript
// Frontend envia: { title, content, status }
// Mude no POST/PUT:
const { title, content, status } = req.body

// Validação:
if (!title || !content) {
  return res.status(400).json({ error: "Título e conteúdo obrigatórios" })
}

// Criar/Atualizar:
const newItem = await manager.create({
  title,
  content, 
  status,
  userId: req.user.id
})
\`\`\`

#### **Ajustar Rotas**
\`\`\`javascript
// Se o frontend chama /api/todos ao invés de /api/products:
app.use("/api/todos", productRoutes)  // Mude esta linha no server.js
\`\`\`

### 3. **ESTRUTURAS COMUNS POR TIPO DE APP**

#### **📝 Sistema de Tarefas (TODO)**
\`\`\`javascript
// Campos: { title, description, completed, priority, dueDate }
// Arquivo: tasks.json
// Rotas: /api/tasks
// Validação: title obrigatório
\`\`\`

#### **📰 Blog/Posts**
\`\`\`javascript
// Campos: { title, content, author, tags, published }
// Arquivo: posts.json  
// Rotas: /api/posts
// Validação: title e content obrigatórios
\`\`\`

#### **🛒 E-commerce**
\`\`\`javascript
// Campos: { name, description, price, category, stock }
// Arquivo: products.json
// Rotas: /api/products  
// Validação: name, price obrigatórios
\`\`\`

#### **📅 Sistema de Eventos**
\`\`\`javascript
// Campos: { title, description, date, location, participants }
// Arquivo: events.json
// Rotas: /api/events
// Validação: title, date, location obrigatórios
\`\`\`

## 🔧 PASSOS PARA USAR NA PROVA

### **ANTES DE COMEÇAR:**
1. ✅ Copie todo o código base
2. ✅ Configure as variáveis de ambiente (.env)
3. ✅ Rode `npm install`
4. ✅ Teste se está funcionando: `npm start`

### **DURANTE A PROVA:**
1. 🔍 **Analise o frontend** - Veja que dados ele envia/espera
2. 🔄 **Adapte os modelos** - Mude campos conforme necessário  
3. 🛣️ **Ajuste as rotas** - Mude URLs se necessário
4. ✅ **Teste tudo** - Use Postman ou o próprio frontend
5. 🐛 **Debug** - Use os console.log("[v0] ...") se algo der errado

## 📡 ENDPOINTS DISPONÍVEIS

### **Autenticação**
\`\`\`
POST /api/auth/register - Cadastrar usuário
POST /api/auth/login    - Fazer login
\`\`\`

### **Usuários (Protegido)**
\`\`\`
GET    /api/users     - Listar usuários
GET    /api/users/:id - Buscar usuário
PUT    /api/users/:id - Atualizar usuário  
DELETE /api/users/:id - Deletar usuário
\`\`\`

### **Produtos/Items (Flexível)**
\`\`\`
GET    /api/products     - Listar todos
GET    /api/products/:id - Buscar por ID
POST   /api/products     - Criar (protegido)
PUT    /api/products/:id - Atualizar (protegido)
DELETE /api/products/:id - Deletar (protegido)
\`\`\`

## 🔐 COMO FUNCIONA A AUTENTICAÇÃO

### **1. Frontend faz login:**
\`\`\`javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@email.com', password: '123456' })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('token', data.token)  // Salvar token
})
\`\`\`

### **2. Frontend usa token nas próximas requisições:**
\`\`\`javascript
fetch('/api/products', {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}` 
  }
})
\`\`\`

## 🆘 RESOLUÇÃO DE PROBLEMAS COMUNS

### **Erro: "Token de acesso requerido"**
- ✅ Frontend está enviando o header Authorization?
- ✅ Token está no formato: `Bearer SEU_TOKEN_AQUI`?

### **Erro: "Todos os campos são obrigatórios"**  
- ✅ Frontend está enviando os campos corretos?
- ✅ Nomes dos campos batem com o que a API espera?

### **Erro: "Usuário já existe"**
- ✅ Email/username já foi cadastrado antes?
- ✅ Limpe o arquivo users.json se necessário

### **Erro: "Sem permissão"**
- ✅ Usuário está tentando editar/deletar item de outro usuário?
- ✅ Token é válido e não expirou?

## 💡 DICAS FINAIS

1. **Leia os comentários** - Todo código está explicado
2. **Teste sempre** - Use Postman para testar endpoints
3. **Adapte conforme necessário** - Mude campos, rotas, validações
4. **Mantenha a estrutura** - Não mude a organização dos arquivos
5. **Use os console.log** - Para debugar problemas durante a prova

**BOA SORTE! 🍀**
