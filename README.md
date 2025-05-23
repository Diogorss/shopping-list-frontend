# shopping-list-frontend
vídeo: https://www.loom.com/share/2bbc369bc1a346d886e9a692cde88691?sid=40fd1846-8dbd-421c-a99a-7d17a1159bd6

Lista de Compras - Aplicação Full Stack
Uma aplicação completa de lista de compras com autenticação de usuários, desenvolvida com React no frontend e Express/MongoDB no backend.
- Visão Geral
    -Esta aplicação permite que usuários:
    -Criem uma conta e façam login
    -Adicionem itens à sua lista de compras
    -Especifiquem quantidade e categoria para cada item
    -Editem itens existentes
    -Removam itens da lista


- Instalação e Configuração
    Pré-requisitos:
    Node.js (v14 ou superior)
    npm ou yarn
    MongoDB (local ou Atlas)
    Backend
    Clone o repositório do backend:
    bash
    git clone https://github.com/Diogorss/express-backend-example2.git
    cd express-backend-example2
    Instale as dependências:
    bash
    npm install

- Deploy
    Backend (Vercel )
    Importe o repositório do GitHub
    Configure as variáveis de ambiente:
    MONGO_URI
    MONGO_DB_NAME
    JWT_SECRET
    Deploy

    Frontend (Vercel)
    Importe o repositório do GitHub
    Adicione o arquivo vercel.json na raiz do projeto com o seguinte conteúdo:
    json
    {
    "rewrites": [
        {
        "source": "/api/:path*",
        "destination": "https://seu-backend.vercel.app/api/:path*"
        }
    ]
    }
    Deploy
- Uso da Aplicação
    Registro e Login
    Acesse a página inicial da aplicação
    Clique em "Registre-se" para criar uma nova conta
    Preencha o nome de usuário e senha
    Após o registro, você será redirecionado para a página de login

    Faça login com suas credenciais
    Gerenciamento da Lista de Compras

    Na página principal, você verá sua lista de compras
    Para adicionar um item:
    Digite o nome do item
    Especifique a quantidade
    Selecione a categoria
    Clique em "Adicionar"

    Para editar um item:
    Clique no botão "Editar" ao lado do item
    Modifique os campos desejados
    Clique em "Salvar"

    Para remover um item:
    Clique no botão "Remover" ao lado do item

- Autenticação
    A aplicação utiliza JSON Web Tokens (JWT ) para autenticação. O token é armazenado no localStorage do navegador e enviado em todas as requisições que exigem autenticação.

