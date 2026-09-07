# Sistema de Gestão de Clientes

Projeto prático da disciplina de Programação Multiplataforma. Sistema completo composto por:

- **API REST em Node.js** (`/backend`)
- **Front-end Web em React** (`/frontend-web`)
- **Front-end Mobile em React Native / Expo** (`/frontend-mobile`)

## Dados do cliente

| Campo     | Tipo   |
|-----------|--------|
| Id        | número (gerado automaticamente) |
| Nome      | texto  |
| Telefone  | texto  |
| Email     | texto  |
| Endereço  | texto  |
| Cidade    | texto  |
| Estado    | texto (UF) |

## Endpoints da API

Base URL padrão: `http://localhost:3001`

| Rota                        | Método | Descrição                                  |
|-----------------------------|--------|---------------------------------------------|
| `/api/inserir`               | POST   | Insere um novo cliente                       |
| `/api/alterar`               | PUT    | Altera os dados de um cliente (envia `id`)   |
| `/api/excluir`               | DELETE | Exclui um cliente (envia `id`)               |
| `/api/consultar/:id`         | GET    | Consulta um cliente específico pelo Id       |
| `/api/consultartodos`        | GET    | Lista todos os clientes cadastrados          |

Os dados são persistidos em `backend/clientes.json` (funciona como um banco simples baseado em arquivo, sem necessidade de instalar SGBD).

### Exemplos com curl

```bash
# Inserir
curl -X POST http://localhost:3001/api/inserir \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","telefone":"11999990000","email":"maria@email.com","endereco":"Rua A, 123","cidade":"São Paulo","estado":"SP"}'

# Consultar todos
curl http://localhost:3001/api/consultartodos

# Consultar por id
curl http://localhost:3001/api/consultar/1

# Alterar
curl -X PUT http://localhost:3001/api/alterar \
  -H "Content-Type: application/json" \
  -d '{"id":1,"telefone":"11988887777"}'

# Excluir
curl -X DELETE http://localhost:3001/api/excluir \
  -H "Content-Type: application/json" \
  -d '{"id":1}'
```

## Como executar

### 1) Backend (API)

```bash
cd backend
npm install
npm start
```
A API sobe em `http://localhost:3001`.

### 2) Front-end Web (React)

Em outro terminal:
```bash
cd frontend-web
npm install
npm run dev
```
Acesse `http://localhost:5173`. Certifique-se de que o backend está rodando.

### 3) Front-end Mobile (React Native / Expo)

Em outro terminal:
```bash
cd frontend-mobile
npm install
npm start
```
Isso abre o Metro Bundler / Expo Dev Tools. Escaneie o QR Code com o app **Expo Go** (Android/iOS) ou rode em um emulador.

> **Importante:** o arquivo `frontend-mobile/api.js` aponta para `http://localhost:3001`. Se for testar em um celular físico ou emulador, troque `localhost` pelo IP da máquina onde o backend está rodando (por exemplo `http://192.168.0.10:3001`). No emulador Android, use `http://10.0.2.2:3001`.

## Estrutura do repositório

```
gestao-clientes/
├── backend/              # API Node.js (Express)
│   ├── server.js
│   ├── db.js
│   ├── clientes.json
│   └── package.json
├── frontend-web/         # React (Vite)
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── main.jsx
│   └── package.json
├── frontend-mobile/       # React Native (Expo)
│   ├── App.js
│   ├── api.js
│   ├── app.json
│   ├── babel.config.js
│   └── package.json
└── README.md
```

## Funcionalidades implementadas

- [x] Cadastro (inserir) de cliente
- [x] Alteração de cliente
- [x] Exclusão de cliente
- [x] Consulta de cliente por Id
- [x] Consulta de todos os clientes
- [x] Interface Web (React) completa para gestão dos dados
- [x] Interface Mobile (React Native) completa para gestão dos dados
- [x] Persistência dos dados em arquivo (sobrevive a reinícios da API)
