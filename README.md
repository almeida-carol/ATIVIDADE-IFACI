# Sistema de Monitoramento IoT

Aplicação web para gerenciamento de usuários e equipamentos com suporte a dados de sensores em tempo real, integrada ao Node-RED via HTTP.

---

## Visão Geral da Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                     Frontend                         │
│         Next.js + React + Tailwind CSS               │
│              http://localhost:3000                   │
└───────────────────────┬──────────────────────────────┘
                        │ REST / HTTP
┌───────────────────────▼──────────────────────────────┐
│                  API REST (Node.js)                  │
│               Express + Node.js                      │
│              http://localhost:8080                   │
│                                                      │
│  /usuarios              GET, POST                    │
│  /usuarios/:id          PUT, DELETE                  │
│  /equipamentos          GET, POST                    │
│  /equipamentos/:id      PUT, DELETE                  │
│  /equipamentos/:id/dispositivos   GET, POST          │
│  /dispositivos/:id      PUT, DELETE                  │
│  /iot                   GET                          │
│  /newData               POST                         │
│  /sensor/:id            PUT                          │
└──────────┬─────────────────────────┬─────────────────┘
           │ Notificações (POST)     │ Dados IoT (PUT/POST)
┌──────────▼─────────────────────────▼─────────────────┐
│                     Node-RED                         │
│              http://localhost:1880                   │
│                                                      │
│  Recebe notificações de:                             │
│    /equipamento-criado                               │
│    /equipamento-editado                              │
│    /equipamento-deletado                             │
│    /dispositivo-criado                               │
│    /dispositivo-editado                              │
│    /dispositivo-deletado                             │
│                                                      │
│  Envia dados para a API:                             │
│    POST  /newData      (novo registro de sensor)     │
│    PUT   /sensor/:id   (atualiza a cada 5s)          │
└──────────────────────────────────────────────────────┘
```

### Organização do projeto

```
atividade-ifaci/
├── api/                        # Servidor Express
│   ├── server.js
│   └── package.json
├── frontend/                   # Aplicação Next.js
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── CriarUsuario.tsx
│   │   │   ├── ListarUsuario.tsx
│   │   │   ├── CriarEquipamentos.tsx
│   │   │   ├── ListarEquipamentos.tsx
│   │   │   └── ListarSensores.tsx
│   │   ├── equipamentos/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── package.json
├── node-red/
│   └── file.json               # Fluxo exportado do Node-RED
└── postman/
    └── Painel_IoT.postman_collection.json
```

---

## Requisitos

- [Node.js](https://nodejs.org/) v18+
- [Node-RED](https://nodered.org/)

### Instalando o Node-RED

**Via npm**

```bash
npm install -g --unsafe-perm node-red
node-red
```

**Via Docker (sem persistência)**

```bash
docker run -it -p 1880:1880 --name nodered nodered/node-red
```

**Via Docker (com persistência — recomendado)**

```bash
docker run -it -p 1880:1880 -v node_red_data:/data --name nodered nodered/node-red
```

Para parar e retomar:

```bash
docker stop nodered
docker start nodered
```

> O Node-RED fica disponível em `http://localhost:1880` em qualquer uma das opções.

---

## Executando o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd atividade-ifaci
```

### 2. Subir a API

```bash
cd api
npm install
npm start
```

Disponível em `http://localhost:8080`

### 3. Subir o Frontend

```bash
cd frontend
npm install
npm run dev
```

Disponível em `http://localhost:3000`

### 4. Configurar o Node-RED

Inicie o Node-RED e acesse `http://localhost:1880`, depois importe o fluxo:

1. Abra o menu (☰) e clique em **Import**
2. Selecione o arquivo `node-red/file.json`
3. Clique em **Import** e depois em **Deploy**

---

## O que o sistema faz

| Módulo | Funcionalidades |
|---|---|
| Usuários | Cadastro, listagem, edição e remoção |
| Equipamentos | Cadastro, listagem, edição e remoção |
| Sensores IoT | Leitura de dados em tempo real enviados pelo Node-RED (polling a cada 5s) |
| Node-RED | Recebe eventos CRUD via HTTP e simula envio de dados de sensores |

---

## Stack utilizada

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Automação IoT | Node-RED |

---

## Referência da API

Base URL: `http://localhost:8080`

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/usuarios` | Retorna todos os usuários |
| `POST` | `/novoUsuario` | Cadastra um novo usuário |
| `PUT` | `/usuarios/:id` | Atualiza dados de um usuário |
| `DELETE` | `/usuarios/:id` | Remove um usuário |

**Corpo — POST `/novoUsuario`**
```json
{
  "nome_completo": "Maria Souza",
  "email": "maria@email.com",
  "senha": "minhasenha"
}
```

### Equipamentos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/equipamentos` | Retorna todos os equipamentos |
| `POST` | `/equipamentos` | Cadastra um equipamento e notifica o Node-RED |
| `PUT` | `/equipamentos/:id` | Atualiza um equipamento e notifica o Node-RED |
| `DELETE` | `/equipamentos/:id` | Remove um equipamento e notifica o Node-RED |

**Corpo — POST/PUT `/equipamentos`**
```json
{
  "nome": "Equipamento B"
}
```

### Sensores / IoT

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/iot` | Lista todos os registros de sensores |
| `GET` | `/sensor/:id` | Retorna um sensor pelo id |
| `POST` | `/newData` | Cria um novo registro (chamado pelo Node-RED) |
| `PUT` | `/sensor/:id` | Atualiza ou cria um sensor (upsert) |

**Corpo — POST `/newData` e PUT `/sensor/:id`**
```json
{
  "temperatura": 24.1,
  "pressao": 1013.5,
  "umidade": 58.3,
  "sensor_presenca": true,
  "trava_seguranca": false
}
```

> A Postman Collection com todos os endpoints está em `postman/Painel_IoT.postman_collection.json`
