// ========================================
// ROTAS CRUD DE USUÁRIOS - OPERAÇÕES PROTEGIDAS
// ========================================

const express = require("express")
const { authenticateToken } = require("../middleware/auth") // Middleware de autenticação
const FileManager = require("../utils/fileManager") // Sistema de arquivos JSON

const router = express.Router() // Roteador do Express
const userManager = new FileManager("users.json") // Gerenciador do arquivo users.json

// ========================================
// GET /api/users - LISTAR TODOS OS USUÁRIOS
// ROTA PROTEGIDA: Precisa de token JWT
// ========================================
router.get("/", authenticateToken, async (req, res) => {
  try {
    // 1. BUSCAR TODOS OS USUÁRIOS
    const users = await userManager.findAll()

    // 2. REMOVER SENHAS DA RESPOSTA (SEGURANÇA)
    // Nunca retorne senhas, mesmo criptografadas!
    const usersResponse = users.map(({ password, ...user }) => user)

    // 3. RETORNAR LISTA LIMPA
    res.json(usersResponse)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    res.status(500).json({ error: "Erro ao buscar usuários" })
  }
})

// ========================================
// GET /api/users/:id - BUSCAR USUÁRIO POR ID
// ROTA PROTEGIDA: Precisa de token JWT
// ========================================
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    // 1. EXTRAIR ID DA URL E CONVERTER PARA NÚMERO
    const id = Number.parseInt(req.params.id)

    // 2. BUSCAR USUÁRIO NO ARQUIVO
    const user = await userManager.findById(id)

    // 3. VERIFICAR SE USUÁRIO EXISTE
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    // 4. REMOVER SENHA E RETORNAR
    const { password, ...userResponse } = user
    res.json(userResponse)
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    res.status(500).json({ error: "Erro ao buscar usuário" })
  }
})

// ========================================
// PUT /api/users/:id - ATUALIZAR USUÁRIO
// ROTA PROTEGIDA: Usuário só pode atualizar a si mesmo
// ========================================
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    // 1. EXTRAIR DADOS
    const id = Number.parseInt(req.params.id)
    const { username, email } = req.body

    // DICA PARA PROVA: Adapte os campos conforme o frontend
    // Ex: se vier "nome" ao invés de "username", mude aqui

    // 2. VERIFICAÇÃO DE SEGURANÇA: Usuário só pode atualizar a si mesmo
    if (req.user.id !== id) {
      return res.status(403).json({
        error: "Sem permissão para atualizar este usuário",
        message: "Você só pode atualizar seu próprio perfil",
      })
    }

    // 3. ATUALIZAR NO ARQUIVO
    const updatedUser = await userManager.update(id, { username, email })

    // 4. VERIFICAR SE USUÁRIO EXISTE
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    // 5. REMOVER SENHA E RETORNAR SUCESSO
    const { password, ...userResponse } = updatedUser
    res.json({
      message: "Usuário atualizado com sucesso",
      user: userResponse,
    })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    res.status(500).json({ error: "Erro ao atualizar usuário" })
  }
})

// ========================================
// DELETE /api/users/:id - DELETAR USUÁRIO
// ROTA PROTEGIDA: Usuário só pode deletar a si mesmo
// ========================================
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // 1. EXTRAIR ID
    const id = Number.parseInt(req.params.id)

    // 2. VERIFICAÇÃO DE SEGURANÇA: Usuário só pode deletar a si mesmo
    if (req.user.id !== id) {
      return res.status(403).json({
        error: "Sem permissão para deletar este usuário",
        message: "Você só pode deletar sua própria conta",
      })
    }

    // 3. DELETAR DO ARQUIVO
    const deleted = await userManager.delete(id)

    // 4. VERIFICAR SE USUÁRIO EXISTIA
    if (!deleted) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    // 5. CONFIRMAR EXCLUSÃO
    res.json({ message: "Usuário deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)
    res.status(500).json({ error: "Erro ao deletar usuário" })
  }
})

// EXPORTAR ROTAS
module.exports = router

// ========================================
// COMO O FRONTEND USA ESTAS ROTAS:
// ========================================
//
// LISTAR USUÁRIOS:
// fetch('/api/users', {
//   headers: { 'Authorization': `Bearer ${token}` }
// })
//
// BUSCAR USUÁRIO:
// fetch('/api/users/1', {
//   headers: { 'Authorization': `Bearer ${token}` }
// })
//
// ATUALIZAR USUÁRIO:
// fetch('/api/users/1', {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   },
//   body: JSON.stringify({ username: 'NovoNome', email: 'novo@email.com' })
// })
//
// DELETAR USUÁRIO:
// fetch('/api/users/1', {
//   method: 'DELETE',
//   headers: { 'Authorization': `Bearer ${token}` }
// })
