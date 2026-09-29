# 📦 API de Controle de Estoque

> REST API desenvolvida em Node.js para gerenciamento de produtos, categorias e movimentações de estoque.

![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x%2B-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Em%20desenvolvimento-yellow?style=for-the-badge)

---

## 📌 Sobre o projeto

A **API de Controle de Estoque** é um Web Service REST desenvolvido como projeto acadêmico para a disciplina de Web Services.

O sistema foi pensado para pequenos e médios estabelecimentos comerciais que precisam controlar seus produtos e movimentações de estoque de forma simples e organizada.

A API permite o gerenciamento de categorias, produtos e movimentações de entrada e saída de estoque, utilizando um banco de dados MySQL para persistência das informações.

O projeto também tem como objetivo aplicar, na prática, conceitos de desenvolvimento de APIs REST, integração com banco de dados, CRUD, validação de dados, regras de negócio e testes de endpoints.

---

## 🎯 Objetivo

Desenvolver uma API REST capaz de centralizar e organizar o controle de estoque de pequenos e médios estabelecimentos comerciais.

O projeto busca substituir controles manuais ou baseados exclusivamente em planilhas por uma solução que permita consultar e alterar os dados por meio de endpoints HTTP.

---

## 👥 Público-alvo

O sistema é destinado principalmente a:

- Pequenos comércios;
- Mercados;
- Lojas de bairro;
- Conveniências;
- Pequenos estabelecimentos que trabalham com controle de produtos;
- Negócios que atualmente utilizam controles manuais ou planilhas.

---

## 💡 Problema

Pequenos estabelecimentos podem utilizar métodos manuais ou planilhas para controlar seus estoques.

Esse tipo de controle pode dificultar:

- Consulta rápida dos produtos;
- Registro das entradas e saídas;
- Histórico das movimentações;
- Identificação da quantidade disponível;
- Organização das informações;
- Redução de erros no controle manual.

A API foi desenvolvida para centralizar essas informações em um banco de dados e disponibilizá-las por meio de uma interface REST.

---

# 🚀 Funcionalidades

## Categorias

- [x] Criar categoria;
- [x] Listar categorias;
- [x] Excluir categoria;
- [x] Impedir exclusão de categoria que possua produtos vinculados.

## Produtos

- [x] Criar produto;
- [x] Listar produtos;
- [x] Atualizar produto;
- [x] Excluir produto;
- [x] Validação de SKU único;
- [x] Validação de categoria existente;
- [x] Confirmação para exclusão;
- [x] Exclusão das movimentações relacionadas ao produto.

## Movimentações

- [x] Listar movimentações;
- [x] Registrar entrada de estoque;
- [x] Registrar saída de estoque;
- [x] Calcular estoque atual a partir das movimentações;
- [x] Impedir saída superior ao estoque disponível;
- [x] Registrar data e hora da movimentação.

---

# 📋 Regras de negócio

### 1. SKU deve ser único

Cada produto deve possuir um SKU exclusivo.

Caso seja informado um SKU já utilizado por outro produto, a API rejeita a operação.

### 2. Categoria deve existir

Um produto só pode ser cadastrado ou atualizado se a categoria informada existir no banco de dados.

### 3. Categorias com produtos vinculados não podem ser excluídas

Para preservar a integridade dos relacionamentos, uma categoria não pode ser removida enquanto possuir produtos associados.

### 4. Exclusão de produtos exige confirmação

A exclusão de um produto exige uma confirmação explícita através da rota de exclusão.

Além do produto, suas movimentações relacionadas também são excluídas.

### 5. Estoque é calculado pelas movimentações

A quantidade atual do estoque não é armazenada diretamente na tabela `produtos`.

O estoque é calculado através das movimentações:

```text
Estoque atual = Entradas - Saídas
```

Exemplo:

```text
Entrada: 100
Entrada: 50
Saída: 30

Estoque atual = 100 + 50 - 30
Estoque atual = 120
```

### 6. Não é permitida saída superior ao estoque

Caso o estoque atual seja 120 e seja solicitada uma saída de 121 unidades, a API rejeita a operação.

---

# 🛠️ Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript;
- **Express.js** — framework utilizado para construção da API REST;
- **MySQL** — banco de dados relacional;
- **mysql2** — driver utilizado para comunicação entre Node.js e MySQL;
- **dotenv** — gerenciamento das variáveis de ambiente;
- **pnpm** — gerenciador de pacotes;
- **Git/GitHub** — versionamento e publicação do projeto.

---

# 📂 Estrutura do projeto

```text
estoque-api/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── routes/
│   │   ├── categorias.js
│   │   ├── produtos.js
│   │   └── movimentacoes.js
│   │
│   ├── server.js
│   └── teste-db.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
```

### Organização

#### `src/config/database.js`

Responsável pela configuração e criação do pool de conexões com o MySQL.

#### `src/routes/categorias.js`

Contém os endpoints relacionados às categorias.

#### `src/routes/produtos.js`

Contém os endpoints relacionados aos produtos.

#### `src/routes/movimentacoes.js`

Contém os endpoints relacionados às movimentações de estoque.

#### `src/server.js`

Arquivo responsável pela inicialização do servidor Express e registro das rotas.

---

# 🗄️ Banco de dados

O projeto utiliza três tabelas principais:

```text
categorias
    │
    │ 1:N
    ▼
produtos
    │
    │ 1:N
    ▼
movimentacoes
```

## Categorias

| Campo | Tipo | Regras |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | NOT NULL |

## Produtos

| Campo | Tipo | Regras |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | NOT NULL |
| sku | VARCHAR(30) | NOT NULL, UNIQUE |
| preco | DECIMAL(10,2) | NOT NULL |
| categoria_id | INT | FK, NOT NULL |

## Movimentações

| Campo | Tipo | Regras |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| produto_id | INT | FK, NOT NULL |
| tipo | ENUM | ENTRADA ou SAIDA |
| quantidade | INT | NOT NULL |
| data | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

# ⚙️ Como executar o projeto

## Pré-requisitos

Antes de executar a API, é necessário possuir instalado:

- Node.js;
- pnpm;
- MySQL.

---

## 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Depois:

```bash
cd estoque-api
```

---

## 2. Instalar as dependências

```bash
pnpm install
```

---

## 3. Criar o banco de dados

No MySQL:

```sql
CREATE DATABASE estoque_api;
```

Depois selecione o banco:

```sql
USE estoque_api;
```

Crie as tabelas necessárias conforme a estrutura apresentada neste README.

---

## 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA
DB_NAME=estoque_api
```

> O arquivo `.env` não deve ser enviado ao GitHub.

---

## 5. Iniciar a API

Execute:

```bash
node src/server.js
```

A API será iniciada em:

```text
http://localhost:3000
```

Ao acessar a rota principal:

```http
GET /
```

A API retorna:

```json
{
  "mensagem": "API de Controle de Estoque funcionando!"
}
```

---

# 📡 Endpoints

Base URL:

```text
http://localhost:3000
```

---

## 📁 Categorias

### Listar categorias

```http
GET /categorias
```

Exemplo de resposta:

```json
[
  {
    "id": 1,
    "nome": "Bebidas"
  }
]
```

---

### Criar categoria

```http
POST /categorias
```

Body:

```json
{
  "nome": "Bebidas"
}
```

Resposta:

```json
{
  "mensagem": "Categoria criada com sucesso",
  "id": 1,
  "nome": "Bebidas"
}
```

Status:

```text
201 Created
```

---

### Excluir categoria

```http
DELETE /categorias/:id
```

Exemplo:

```http
DELETE /categorias/1
```

Se existirem produtos vinculados à categoria, a API retorna:

```text
409 Conflict
```

---

# 📦 Produtos

### Listar produtos

```http
GET /produtos
```

Exemplo:

```json
[
  {
    "id": 1,
    "nome": "Coca Cola 2L",
    "sku": "B3",
    "preco": "12.99",
    "categoria_id": 3
  }
]
```

---

### Criar produto

```http
POST /produtos
```

Body:

```json
{
  "nome": "Coca Cola 2L",
  "sku": "B3",
  "preco": 12.99,
  "categoria_id": 3
}
```

---

### Atualizar produto

```http
PUT /produtos/:id
```

Exemplo:

```http
PUT /produtos/1
```

Body:

```json
{
  "nome": "Coca Cola 2L",
  "sku": "B3",
  "preco": 12.99,
  "categoria_id": 3
}
```

Status de sucesso:

```text
200 OK
```

---

### Excluir produto

```http
DELETE /produtos/:id/:confirmacao
```

A API exige confirmação explícita utilizando `s`.

Exemplo:

```http
DELETE /produtos/1/s
```

A exclusão remove:

- O produto;
- As movimentações relacionadas ao produto.

Status de sucesso:

```text
204 No Content
```

---

# 🔄 Movimentações

### Listar movimentações

```http
GET /movimentacoes
```

Exemplo:

```json
[
  {
    "id": 1,
    "produto_id": 2,
    "tipo": "ENTRADA",
    "quantidade": 100,
    "data": "2026-09-29T03:38:14.000Z"
  },
  {
    "id": 2,
    "produto_id": 2,
    "tipo": "ENTRADA",
    "quantidade": 50,
    "data": "2026-09-29T03:38:25.000Z"
  },
  {
    "id": 3,
    "produto_id": 2,
    "tipo": "SAIDA",
    "quantidade": 30,
    "data": "2026-09-29T03:38:35.000Z"
  }
]
```

---

### Registrar movimentação

```http
POST /movimentacoes
```

#### Entrada

```json
{
  "produto_id": 2,
  "tipo": "ENTRADA",
  "quantidade": 100
}
```

#### Saída

```json
{
  "produto_id": 2,
  "tipo": "SAIDA",
  "quantidade": 30
}
```

Resposta de sucesso:

```json
{
  "mensagem": "Estoque alterado com sucesso",
  "id": 3,
  "produto": "Pepsi Black 2L",
  "tipo": "SAIDA",
  "quantidade": 30,
  "estoqueAtual": 120
}
```

---

# 📊 Principais códigos HTTP utilizados

| Código | Significado | Utilização |
|---|---|---|
| `200` | OK | Consultas e atualizações realizadas com sucesso |
| `201` | Created | Criação de categorias, produtos e movimentações |
| `204` | No Content | Exclusões realizadas com sucesso |
| `400` | Bad Request | Dados inválidos enviados pelo cliente |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito com uma regra de negócio |
| `500` | Internal Server Error | Erro inesperado no servidor |

---

# 🧪 Testes realizados

Durante o desenvolvimento foram realizados testes manuais dos principais endpoints.

### Categorias

- Criação de categoria;
- Validação de nome vazio;
- Consulta das categorias;
- Exclusão de categoria inexistente;
- Exclusão de categoria existente;
- Bloqueio de exclusão de categoria com produtos vinculados.

### Produtos

- Criação de produto;
- Validação de campos obrigatórios;
- Validação de SKU único;
- Validação de preço;
- Validação de categoria;
- Consulta de produtos;
- Atualização de produto;
- Atualização mantendo o próprio SKU;
- Bloqueio de utilização de SKU pertencente a outro produto;
- Exclusão com confirmação.

### Movimentações

Foi validado o seguinte cenário:

```text
Entrada: 100
Entrada: 50
Saída: 30
----------------
Estoque: 120
```

Também foi testada uma saída superior ao estoque disponível:

```text
Estoque disponível: 120
Saída solicitada: 121

Resultado: operação rejeitada
HTTP: 409 Conflict
```

A movimentação inválida não é registrada no banco de dados.

---

# 📈 Próximas etapas

O projeto continuará evoluindo com:

- [ ] Documentação da API com Swagger;
- [ ] Testes mais estruturados;
- [ ] Testes de desempenho;
- [ ] Deploy da API;
- [ ] Documentação acadêmica final;
- [ ] Vídeo de apresentação do projeto.

---

# 🎓 Contexto acadêmico

Este projeto foi desenvolvido como parte de um projeto acadêmico relacionado ao desenvolvimento de **Web Services**, com foco na aplicação prática de conceitos de:

- APIs REST;
- HTTP;
- CRUD;
- Banco de dados relacionais;
- SQL;
- Node.js;
- Express;
- Validação de dados;
- Regras de negócio;
- Testes de APIs;
- Versionamento com Git;
- Publicação de Web Services.

---

# 👨‍💻 Autor

**Alex Assis**

Projeto acadêmico — API de Controle de Estoque.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e de estudo.