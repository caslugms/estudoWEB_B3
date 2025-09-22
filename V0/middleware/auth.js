// ========================================
// MIDDLEWARE DE AUTENTICAÇÃO JWT
// ========================================

const jwt = require("jsonwebtoken") // Biblioteca para trabalhar com JWT

// FUNÇÃO MIDDLEWARE: Verifica se o usuário está autenticado
// Esta função é executada ANTES das rotas protegidas
const authenticateToken = (req, res, next) => {
  // 1. EXTRAIR O TOKEN DO HEADER
  // O frontend deve enviar: Authorization: "Bearer SEU_TOKEN_AQUI"
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Pega só a parte do token (remove "Bearer ")

  // 2. VERIFICAR SE O TOKEN EXISTE
  if (!token) {
    return res.status(401).json({
      error: "Token de acesso requerido",
      message: "Você precisa estar logado para acessar este recurso",
    })
  }

  // 3. VERIFICAR SE O TOKEN É VÁLIDO
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "Token inválido",
        message: "Seu token expirou ou é inválido. Faça login novamente.",
      })
    }

    // 4. TOKEN VÁLIDO: Adiciona os dados do usuário na requisição
    // Agora qualquer rota pode acessar req.user com os dados do usuário logado
    req.user = user

    // 5. CONTINUAR PARA A PRÓXIMA FUNÇÃO (a rota em si)
    next()
  })
}

// EXPORTAR PARA USO EM OUTRAS PARTES DA API
module.exports = { authenticateToken }

// ========================================
// COMO USAR ESTE MIDDLEWARE:
// ========================================
// Em qualquer rota que precisa de autenticação:
// router.get("/rota-protegida", authenticateToken, (req, res) => {
//   // req.user contém os dados do usuário logado
//   console.log("Usuário logado:", req.user.username)
// })
