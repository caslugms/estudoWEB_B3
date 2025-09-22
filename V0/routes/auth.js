// ========================================
// ROTAS DE AUTENTICAÇÃO - LOGIN E REGISTRO
// ========================================

const express = require("express") // Framework web
const bcrypt = require("bcryptjs") // Para criptografar senhas
const jwt = require("jsonwebtoken") // Para gerar tokens JWT
const FileManager = require("../utils/fileManager") // Nosso sistema de arquivos JSON

const router = express.Router() // Cria um roteador do Express
const userManager = new FileManager("users.json") // Gerenciador do arquivo users.json

// ========================================
// ROTA: POST /api/auth/register
// FUNÇÃO: Cadastrar novo usuário
// ========================================
router.post("/register", async (req, res) => {
  try {
    // 1. EXTRAIR DADOS DO BODY DA REQUISIÇÃO
    const { username, email, password } = req.body

    // DICA PARA PROVA: Adapte estes campos conforme o frontend
    // Ex: se o frontend enviar "nome" ao invés de "username", mude aqui

    // 2. VALIDAÇÃO: Verificar se todos os campos foram enviados
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
        required: ["username", "email", "password"],
      })
    }

    // 3. VERIFICAR SE USUÁRIO JÁ EXISTE
    const users = await userManager.findAll() // Busca todos os usuários do arquivo
    const existingUser = users.find((u) => u.email === email || u.username === username)

    if (existingUser) {
      return res.status(400).json({
        error: "Usuário já existe",
        message: "Email ou username já estão em uso",
      })
    }

    // 4. CRIPTOGRAFAR A SENHA
    // NUNCA salve senhas em texto puro! Sempre use hash
    const hashedPassword = await bcrypt.hash(password, 10) // 10 = nível de segurança

    // 5. CRIAR NOVO USUÁRIO NO ARQUIVO JSON
    const newUser = await userManager.create({
      username,
      email,
      password: hashedPassword, // Salva a senha criptografada
      // DICA: Adicione outros campos que o frontend precisar
      // createdAt: new Date().toISOString(),
      // role: "user"
    })

    // 6. REMOVER SENHA DA RESPOSTA (segurança)
    const { password: _, ...userResponse } = newUser

    // 7. RESPOSTA DE SUCESSO
    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: userResponse,
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// ========================================
// ROTA: POST /api/auth/login
// FUNÇÃO: Fazer login e gerar token JWT
// ========================================
router.post("/login", async (req, res) => {
  try {
    // 1. EXTRAIR CREDENCIAIS
    const { email, password } = req.body

    // DICA: Se o frontend enviar "username" ao invés de "email", adapte aqui

    // 2. VALIDAÇÃO BÁSICA
    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      })
    }

    // 3. BUSCAR USUÁRIO NO ARQUIVO
    const users = await userManager.findAll()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return res.status(401).json({
        error: "Credenciais inválidas",
        message: "Email ou senha incorretos",
      })
    }

    // 4. VERIFICAR SENHA
    // Compara a senha enviada com a senha criptografada salva
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({
        error: "Credenciais inválidas",
        message: "Email ou senha incorretos",
      })
    }

    // 5. GERAR TOKEN JWT
    // Este token será usado pelo frontend para acessar rotas protegidas
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        // DICA: Adicione outros dados que precisar no token
      },
      process.env.JWT_SECRET, // Chave secreta (nunca compartilhe!)
      { expiresIn: "24h" }, // Token expira em 24 horas
    )

    // 6. RESPOSTA DE SUCESSO COM TOKEN
    res.json({
      message: "Login realizado com sucesso",
      token, // Frontend deve salvar este token (localStorage, cookies, etc.)
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // Não retorne a senha!
      },
    })
  } catch (error) {
    console.error("Erro no login:", error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// EXPORTAR ROTAS
module.exports = router

// ========================================
// COMO O FRONTEND USA ESTAS ROTAS:
// ========================================
//
// REGISTRO:
// fetch('/api/auth/register', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ username: 'joão', email: 'joao@email.com', password: '123456' })
// })
//
// LOGIN:
// fetch('/api/auth/login', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ email: 'joao@email.com', password: '123456' })
// })
// .then(res => res.json())
// .then(data => {
//   localStorage.setItem('token', data.token)  // Salvar token
// })
