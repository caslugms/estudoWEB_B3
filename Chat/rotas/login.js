import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Chave secreta para JWT
const SECRET = "chave_super_secreta";

// Usuário fixo para login
const user = {
  username: "admin",
  password: bcrypt.hashSync("123", 8), // senha 123 criptografada
};

// POST /login → gera token
router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Usuário ou senha inválidos" });
  }

  // Gera token válido por 1h
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

export default router;
export { SECRET }; // exporta SECRET para usar nas rotas protegidas
