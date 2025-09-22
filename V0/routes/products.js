// ========================================
// ROTAS CRUD DE PRODUTOS - MODELO FLEXÍVEL
// ========================================
// DICA PARA PROVA: Mude "products" para o que o frontend precisar
// Ex: "tasks", "posts", "items", "eventos", etc.

const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const FileManager = require("../utils/fileManager")

const router = express.Router()
// DICA: Mude o nome do arquivo conforme necessário (ex: "tasks.json", "posts.json")
const productManager = new FileManager("products.json")

// ========================================
// GET /api/products - LISTAR TODOS OS PRODUTOS
// ROTA PÚBLICA: Não precisa de autenticação
// ========================================
router.get("/", async (req, res) => {
  try {
    // BUSCAR TODOS OS PRODUTOS
    const products = await productManager.findAll()

    // DICA PARA PROVA: Adicione filtros se necessário
    // Ex: filtrar por categoria, usuário, status, etc.
    // const { category, userId } = req.query
    // const filtered = products.filter(p =>
    //   (!category || p.category === category) &&
    //   (!userId || p.userId === parseInt(userId))
    // )

    res.json(products)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    res.status(500).json({ error: "Erro ao buscar produtos" })
  }
})

// ========================================
// GET /api/products/:id - BUSCAR PRODUTO POR ID
// ROTA PÚBLICA: Qualquer um pode ver um produto específico
// ========================================
router.get("/:id", async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const product = await productManager.findById(id)

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" })
    }

    res.json(product)
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    res.status(500).json({ error: "Erro ao buscar produto" })
  }
})

// ========================================
// POST /api/products - CRIAR NOVO PRODUTO
// ROTA PROTEGIDA: Precisa estar logado para criar
// ========================================
router.post("/", authenticateToken, async (req, res) => {
  try {
    // EXTRAIR DADOS DO BODY
    const { name, description, price, category } = req.body

    // DICA PARA PROVA: Adapte os campos conforme o frontend
    // Ex: { title, content, status, priority, dueDate } para tasks
    // Ex: { titulo, conteudo, autor, tags } para posts

    // VALIDAÇÃO BÁSICA
    if (!name || !price) {
      return res.status(400).json({
        error: "Nome e preço são obrigatórios",
        // DICA: Adapte a validação conforme necessário
        required: ["name", "price"],
      })
    }

    // CRIAR PRODUTO COM DADOS DO USUÁRIO LOGADO
    const newProduct = await productManager.create({
      name,
      description,
      price: Number.parseFloat(price), // Garantir que é número
      category,
      userId: req.user.id, // Associar ao usuário logado

      // DICA: Adicione outros campos automáticos se necessário
      // status: "active",
      // createdBy: req.user.username,
      // isPublic: true
    })

    res.status(201).json({
      message: "Produto criado com sucesso",
      product: newProduct,
    })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    res.status(500).json({ error: "Erro ao criar produto" })
  }
})

// ========================================
// PUT /api/products/:id - ATUALIZAR PRODUTO
// ROTA PROTEGIDA: Só o dono pode atualizar
// ========================================
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const { name, description, price, category } = req.body

    // 1. VERIFICAR SE PRODUTO EXISTE
    const existingProduct = await productManager.findById(id)
    if (!existingProduct) {
      return res.status(404).json({ error: "Produto não encontrado" })
    }

    // 2. VERIFICAR PERMISSÃO: Só o dono pode atualizar
    if (existingProduct.userId !== req.user.id) {
      return res.status(403).json({
        error: "Sem permissão para atualizar este produto",
        message: "Você só pode atualizar seus próprios produtos",
      })
    }

    // 3. ATUALIZAR PRODUTO
    const updatedProduct = await productManager.update(id, {
      name,
      description,
      price: price ? Number.parseFloat(price) : existingProduct.price, // Manter preço antigo se não enviado
      category,

      // DICA: Adicione outros campos que podem ser atualizados
      // status,
      // isPublic,
      // tags
    })

    res.json({
      message: "Produto atualizado com sucesso",
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    res.status(500).json({ error: "Erro ao atualizar produto" })
  }
})

// ========================================
// DELETE /api/products/:id - DELETAR PRODUTO
// ROTA PROTEGIDA: Só o dono pode deletar
// ========================================
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)

    // 1. VERIFICAR SE PRODUTO EXISTE
    const existingProduct = await productManager.findById(id)
    if (!existingProduct) {
      return res.status(404).json({ error: "Produto não encontrado" })
    }

    // 2. VERIFICAR PERMISSÃO: Só o dono pode deletar
    if (existingProduct.userId !== req.user.id) {
      return res.status(403).json({
        error: "Sem permissão para deletar este produto",
        message: "Você só pode deletar seus próprios produtos",
      })
    }

    // 3. DELETAR PRODUTO
    const deleted = await productManager.delete(id)

    res.json({ message: "Produto deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    res.status(500).json({ error: "Erro ao deletar produto" })
  }
})

// EXPORTAR ROTAS
module.exports = router

// ========================================
// ADAPTAÇÕES PARA DIFERENTES FRONTENDS:
// ========================================
//
// PARA SISTEMA DE TAREFAS (TODO):
// - Mude "products" para "tasks"
// - Campos: { title, description, status, priority, dueDate }
// - Validação: title obrigatório
//
// PARA BLOG/POSTS:
// - Mude "products" para "posts"
// - Campos: { title, content, author, tags, isPublished }
// - Validação: title e content obrigatórios
//
// PARA E-COMMERCE:
// - Mantenha "products"
// - Campos: { name, description, price, category, stock, images }
// - Validação: name, price e stock obrigatórios
//
// PARA EVENTOS:
// - Mude "products" para "events"
// - Campos: { title, description, date, location, maxParticipants }
// - Validação: title, date e location obrigatórios
