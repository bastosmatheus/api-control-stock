# Api para controle de estoque/entrada e saída de produtos

Uma api que tem como objetivo automatizar uma tarefa super repetitiva, a saída e entrada dos produtos de uma loja. Além disso, fornece também o recurso de controle de estoque, que é calculado a partir do momento que uma entrada é registrada para tal produto.

<h2>Tópicos 📍</h2>

- <a href="#ajustes">Ajustes e melhorias</a>
- <a href="#techs">Tecnologias utilizadas</a>
- <a href="#project">Como rodar esse projeto?</a>
- <a href="#api">Principais endpoints da API</a>

<h2 id="ajustes">Ajustes e melhorias 🧰</h2>

- Criação de usuários/lojas no sistema
- Autenticação com JWT
- Linkagem dos produtos com um(a) único(a) usuário/loja

<h2 id="techs">Tecnologias Utilizadas 🖥️</h2>

- [Node.js](https://nodejs.org/en)
- [Typescript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express](https://www.expressjs.com/pt-br/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)

<h2 id="project">Como rodar esse projeto? 💿</h2>

<h3>Pre-requisitos</h3>

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- [Github](https://github.com/)

<h3>Clonagem</h3>

```bash
# clone o repositório
$ git clone https://github.com/bastosmatheus/api-control-stock
```

<h3>Configuração do arquivo .env</h3>

```bash
# arquivo .env
DATABASE_URL="postgresql://username:password@localhost:5432/yourdatabase?schema=public"
```

<h3>Projeto</h3>

```bash
# depois de clonado, procure a pasta do projeto
$ cd api-control-stock

# instale todas as dependências
$ npm install

# execute o projeto
$ npm run start
```

<h2 id="api">Principais endpoints da API 🗺️</h2>

| ROUTE                                   | DESCRIPTION                                                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| <kbd>RESPOSTAS DE SUCESSO</kbd>         |                                                                                                                                                   |
| <kbd>POST /products</kbd>               | cria um produto, veja mais na [resposta da requisição](#post-products)                                                                            |
| <kbd>POST /entrances</kbd>              | cria uma entrada para determinado produto, veja [detalhes da requisição](#post-entrances)                                                         |
| <kbd>POST /exits</kbd>                  | informa uma saída de um produto, veja mais na [resposta da requisição](#post-exits)                                                               |
| <kbd>POST /devolutions</kbd>            | registra detalhes da devolução de um produto, veja [detalhes da requisição](#post-devolutions)                                                    |
| <kbd>POST /defectiveproducts</kbd>      | registra detalhes de um produto defeituoso, veja mais na [resposta da requisição](#post-defectiveproducts)                                        |
| <kbd>GET /products</kbd>                | retorna todos os produtos registrado na API, veja [detalhes da requisição](#get-products)                                                         |
| <kbd>RESPOSTAS COM ERROS</kbd>          |
| <kbd>GET /products/:idInexistente</kbd> | erro ao passar um id inexistente para o get, veja mais na [resposta da requisição](#get-products-error)                                           |
| <kbd>POST /products</kbd>               | falha ao tentar registrar um produto que já existe no banco de dados, veja mais na [resposta da requisição](#post-products-error)                 |
| <kbd>PUT /entrances/:id</kbd>           | erro ao passar um id de produto errado, veja mais na [resposta da requisição](#put-entrances-error)                                               |
| <kbd>PUT /exits/:id</kbd>               | falha ao passar um tipo errado da descrição, veja mais na [resposta da requisição](#put-exits-error-req)                                          |
| <kbd>POST /defectiveproducts</kbd>      | erro ao tentar registrar um produto defeituoso sem um campo obrigatório, veja mais na [resposta da requisição](#post-defectiveproducts-error-req) |

<h2>Respostas de sucesso</h2>

<h3 id="#post-products">POST /products</h3>

**REQUISIÇÃO**

```json
{
  "name_product": "Barra de cereal",
  "price_product": 2.4
}
```

**RESPOSTA**

```json
{
  "message": "Produto criado com sucesso",
  "type": "OK",
  "statusCode": 200,
  "productCreated": {
    "id": 3,
    "name_product": "Barra de cereal",
    "price_product": 2.4,
    "quantity_product_stock": 0
  }
}
```

<h3 id="#post-entrances">POST /entrances</h3>

**REQUISIÇÃO**

```json
{
  "supplier": "maTheus fornecedor",
  "quantity_products": 200,
  "price_total": 480,
  "id_product": 3
}
```

**RESPOSTA**

```json
{
  "message": "Entrada criada com sucesso",
  "type": "OK",
  "statusCode": 200,
  "entranceCreated": {
    "id": 17,
    "supplier": "maTheus fornecedor",
    "quantity_products": 200,
    "price_total": 480,
    "entrance_date": "2024-03-18T00:00:00.000Z",
    "id_product": 3
  }
}
```

<h3 id="#post-exits">POST /exits</h3>

**REQUISIÇÃO**

```json
{
  "description": "Usuário comprou uma barra de cereal",
  "quantity_products": 1,
  "price_total": 2.4,
  "id_product": 3
}
```

**RESPOSTA**

```json
{
  "message": "Saída criada com sucesso",
  "type": "OK",
  "statusCode": 200,
  "exitCreated": {
    "id": 11,
    "description": "Usuário comprou uma barra de cereal",
    "quantity_products": 1,
    "price_total": 2.4,
    "exit_date": "2024-03-18T00:00:00.000Z",
    "id_product": 3
  }
}
```

<h3 id="#post-devolutions">POST /devolutions</h3>

**REQUISIÇÃO**

```json
{
  "description": "Barra de cereal veio quebrada",
  "quantity_products": 1,
  "id_entrance": 17
}
```

**RESPOSTA**

```json
{
  "message": "Devolução criada com sucesso",
  "type": "OK",
  "statusCode": 200,
  "devolutionCreated": {
    "id": 3,
    "description": "Barra de cereal veio quebrada",
    "quantity_products": 1,
    "devolution_date": "2024-03-18T00:00:00.000Z",
    "id_entrance": 17
  }
}
```

<h3 id="#post-defectiveproducts">POST /defectiveproducts</h3>

**REQUISIÇÃO**

```json
{
  "description": "Barra de cereal com bixinhos dentro",
  "quantity_products": 1,
  "id_entrance": 17
}
```

**RESPOSTA**

```json
{
  "message": "Produto com defeito criado com sucesso",
  "type": "OK",
  "statusCode": 200,
  "defectiveProductCreated": {
    "id": 5,
    "description": "Barra de cereal com bixinhos dentro",
    "quantity_products": 1,
    "id_entrance": 17
  }
}
```

<h3 id="#get-products">GET /products/:id</h3>

**RESPOSTA**

```json
{
  "type": "OK",
  "statusCode": 200,
  "product": {
    "id": 3,
    "name_product": "Barra de ceral",
    "price_product": 2.4,
    "quantity_product_stock": 280,
    "entrance": [
      {
        "id": 17,
        "supplier": "maTheus fornecedor",
        "quantity_products": 1,
        "price_total": 2.4,
        "entrance_date": "2024-03-18T00:00:00.000Z",
        "id_product": 3,
        "defective_product": [
          {
            "id": 5,
            "description": "Barra de cereal com bixinhos dentro",
            "quantity_products": 1,
            "id_entrance": 17
          }
        ],
        "devolution": [
          {
            "id": 3,
            "description": "Barra de cereal veio quebrada",
            "quantity_products": 1,
            "devolution_date": "2024-03-18T00:00:00.000Z",
            "id_entrance": 17
          }
        ]
      }
    ],
    "exit": [
      {
        "id": 11,
        "description": "Usuário comprou uma barra de cereal",
        "quantity_products": 1,
        "price_total": 2.4,
        "exit_date": "2024-03-18T00:00:00.000Z",
        "id_product": 3
      }
    ]
  }
}
```

<h2>Respostas com erros</h2>

Além dessas respostas de sucesso, a API também conta com algumas respostas informando erros, tanto de requisições, quanto de regras de negócio, veja agora:

<h3 id="#get-products-error">GET /products/:idInexistente</h3>

**RESPOSTA**

```json
{
  "message": "Nenhum produto foi encontrado com o ID: {idInexistente}",
  "type": "Not Found",
  "statusCode": 404
}
```

<h3 id="#post-products-error">POST /products</h3>

**REQUISIÇÃO**

```json
{
  "name_product": "Barra de cereal",
  "price_product": 2.4
}
```

**RESPOSTA**

```json
{
  "message": "Já existe um produto com esse nome: Barra de cereal",
  "type": "Conflict",
  "statusCode": 409
}
```

<h3 id="#put-entrances-error">PUT /entrances/:id</h3>

**REQUISIÇÃO**

```json
{
    "supplier": "maTheus fornecedor",
    "quantity_products": 1,
    "price_total": 2.4,
    "id_product": {id_productInexistente}
}
```

**RESPOSTA**

```json
{
  "message": "Nenhum produto foi encontrado com o ID: {id_productInexistente}",
  "type": "Not Found",
  "statusCode": 404
}
```

<h3 id="#put-exits-error-req">PUT /exits/:id</h3>

**REQUISIÇÃO**

```json
{
  "description": null,
  "quantity_products": 1,
  "price_total": 2.4,
  "id_product": 3
}
```

**RESPOSTA**

```json
{
  "message": "A descrição da saída do(s) produto(s) deve ser uma string",
  "type": "Unprocessable Entity",
  "statusCode": 422
}
```

<h3 id="#post-defectiveproducts-error-req">POST /defectiveproducts</h3>

**REQUISIÇÃO**

```json
{
  "quantity_products": 1,
  "id_entrance": 17
}
```

**RESPOSTA**

```json
{
  "message": "Informe o defeito desse produto",
  "type": "Unprocessable Entity",
  "statusCode": 422
}
```
