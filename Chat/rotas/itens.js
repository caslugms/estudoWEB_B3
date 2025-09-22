import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import verificarToken from "../middleware/authMiddleware.js";
import { SECRET } from "./login.js";

const router = express.Router();

// Caminho absoluto para o arquivo data.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../dados/data.json");

// Funções auxiliares
function lerDados() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
  }
  const dados = fs.readFileSync(dataPath);
  return JSON.parse(dados);
}

function salvarDados(dados) {
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
}

// GET /itens → lista todos
router.get("/", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  res.json(dados);
});

// POST /itens → cria novo
router.post("/", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  const novo = req.body;
  novo.id = Date.now();
  dados.push(novo);
  salvarDados(dados);
  res.json({ message: "Item criado com sucesso", item: novo });
});

// PUT /itens/:id → atualiza
router.put("/:id", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  const id = parseInt(req.params.id);
  const index = dados.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: "Item não encontrado" });
  dados[index] = { ...dados[index], ...req.body };
  salvarDados(dados);
  res.json({ message: "Item atualizado com sucesso" });
});

// DELETE /itens/:id → exclui
router.delete("/:id", verificarToken(SECRET), (req, res) => {
  const dados = lerDados();
  const id = parseInt(req.params.id);
  const novosDados = dados.filter((item) => item.id !== id);
  salvarDados(novosDados);
  res.json({ message: "Item deletado com sucesso" });
});

export default router;
