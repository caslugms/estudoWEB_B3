// ========================================
// SERVIDOR PRINCIPAL - PONTO DE ENTRADA DA API
// ========================================

// 1. IMPORTAÇÕES - Bibliotecas necessárias
const express = require("express") // Framework web para Node.js
const cors = require("cors") // Permite requisições de outros domínios (frontend)
require("dotenv").config() // Carrega variáveis de ambiente do arquivo .env

// 2. IMPORTAÇÃO DAS ROTAS - Organização modular
const authRoutes = require("./routes/auth") // Rotas de autenticação (login/register)
const userRoutes = require("./routes/users") // Rotas CRUD de usuários
const productRoutes = require("./routes/products") // Rotas CRUD de produtos

// 3. CONFIGURAÇÃO DO EXPRESS
const app = express() // Cria a aplicação Express
const PORT = process.env.PORT || 3000 // Porta do servidor (variável de ambiente ou 3000)

// ========================================
// MIDDLEWARES - Executam antes das rotas
// ========================================

// CORS: Permite que o frontend (React, Vue, etc.) acesse a API
app.use(cors())

// JSON Parser: Converte o body das requisições para JSON automaticamente
app.use(express.json())

// ========================================
// CONFIGURAÇÃO DAS ROTAS
// ========================================

// Rotas de autenticação: /api/auth/login, /api/auth/register
app.use("/api/auth", authRoutes)

// Rotas de usuários: /api/users (GET, POST, PUT, DELETE)
app.use("/api/users", userRoutes)

// Rotas de produtos: /api/products (GET, POST, PUT, DELETE)
// DICA: Mude "products" para o que o frontend precisar (ex: "tasks", "posts", etc.)
app.use("/api/products", productRoutes)

// ========================================
// ROTA DE TESTE - Para verificar se a API está funcionando
// ========================================
app.get("/", (req, res) => {
  res.json({ message: "API funcionando! Prova de Web API - Express CRUD com JWT" })
})

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📡 Acesse: http://localhost:${PORT}`)
  console.log(`🔐 Endpoints disponíveis:`)
  console.log(`   POST /api/auth/register - Cadastrar usuário`)
  console.log(`   POST /api/auth/login - Fazer login`)
  console.log(`   GET  /api/users - Listar usuários (protegido)`)
  console.log(`   GET  /api/products - Listar produtos (protegido)`)
})
