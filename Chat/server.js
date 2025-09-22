import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import rotasItens from "./rotas/itens.js";
import rotasLogin from "./rotas/login.js";

const app = express();
const PORT = 3000;

// Configurações básicas
app.use(bodyParser.json());

// Caminho para pasta public (frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

// Rotas
app.use("/login", rotasLogin);
app.use("/itens", rotasItens);

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
