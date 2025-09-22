// ========================================
// GERENCIADOR DE ARQUIVOS JSON - SUBSTITUI BANCO DE DADOS
// ========================================

const fs = require("fs").promises // Sistema de arquivos com Promises (async/await)
const path = require("path") // Para trabalhar com caminhos de arquivos

// CLASSE PRINCIPAL: Gerencia operações CRUD em arquivos JSON
class FileManager {
  // CONSTRUTOR: Define onde o arquivo será salvo
  constructor(filename) {
    // Cria o caminho completo: /projeto/data/nomeDoArquivo.json
    this.filepath = path.join(__dirname, "..", "data", filename)
    this.ensureDataDir() // Garante que a pasta 'data' existe
  }

  // MÉTODO PRIVADO: Cria a pasta 'data' se não existir
  async ensureDataDir() {
    const dataDir = path.dirname(this.filepath) // Pega só o diretório
    try {
      await fs.access(dataDir) // Tenta acessar a pasta
    } catch {
      // Se não conseguir acessar, cria a pasta
      await fs.mkdir(dataDir, { recursive: true })
    }
  }

  // ========================================
  // MÉTODOS DE LEITURA E ESCRITA
  // ========================================

  // LER DADOS: Carrega o arquivo JSON e converte para array/objeto JavaScript
  async readData() {
    try {
      const data = await fs.readFile(this.filepath, "utf8") // Lê como texto
      return JSON.parse(data) // Converte JSON para JavaScript
    } catch (error) {
      // Se arquivo não existe ou está vazio, retorna array vazio
      // IMPORTANTE: Isso evita erros na primeira execução
      return []
    }
  }

  // ESCREVER DADOS: Salva array/objeto JavaScript como JSON no arquivo
  async writeData(data) {
    // JSON.stringify(data, null, 2) = converte para JSON formatado (indentado)
    await fs.writeFile(this.filepath, JSON.stringify(data, null, 2))
  }

  // ========================================
  // OPERAÇÕES CRUD (Create, Read, Update, Delete)
  // ========================================

  // READ: Buscar todos os registros
  async findAll() {
    return await this.readData()
  }

  // READ: Buscar um registro por ID
  async findById(id) {
    const data = await this.readData()
    return data.find((item) => item.id === id) // Procura item com ID específico
  }

  // CREATE: Criar novo registro
  async create(item) {
    const data = await this.readData() // Carrega dados existentes

    // GERAR ID AUTOMÁTICO: Pega o maior ID existente + 1
    const newId = data.length > 0 ? Math.max(...data.map((i) => i.id)) + 1 : 1

    // CRIAR NOVO ITEM: Adiciona ID e timestamp
    const newItem = {
      id: newId,
      ...item, // Espalha os dados enviados
      createdAt: new Date().toISOString(), // Data de criação
    }

    data.push(newItem) // Adiciona ao array
    await this.writeData(data) // Salva no arquivo
    return newItem // Retorna o item criado
  }

  // UPDATE: Atualizar registro existente
  async update(id, updates) {
    const data = await this.readData()
    const index = data.findIndex((item) => item.id === id) // Encontra posição do item

    if (index === -1) {
      return null // Item não encontrado
    }

    // ATUALIZAR ITEM: Mescla dados antigos com novos + timestamp
    data[index] = {
      ...data[index], // Dados antigos
      ...updates, // Novos dados (sobrescreve os antigos)
      updatedAt: new Date().toISOString(), // Data de atualização
    }

    await this.writeData(data) // Salva no arquivo
    return data[index] // Retorna item atualizado
  }

  // DELETE: Remover registro
  async delete(id) {
    const data = await this.readData()
    const index = data.findIndex((item) => item.id === id)

    if (index === -1) {
      return false // Item não encontrado
    }

    data.splice(index, 1) // Remove item do array
    await this.writeData(data) // Salva no arquivo
    return true // Sucesso
  }
}

// EXPORTAR CLASSE
module.exports = FileManager

// ========================================
// COMO USAR ESTA CLASSE:
// ========================================
// const userManager = new FileManager("users.json")
//
// // Criar usuário
// const newUser = await userManager.create({ name: "João", email: "joao@email.com" })
//
// // Buscar todos
// const users = await userManager.findAll()
//
// // Buscar por ID
// const user = await userManager.findById(1)
//
// // Atualizar
// await userManager.update(1, { name: "João Silva" })
//
// // Deletar
// await userManager.delete(1)
