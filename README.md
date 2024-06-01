# PROJETO FINAL ESPECIALIZAÇÃO TRAINEE COMP
## Índice

- [PROJETO FINAL ESPECIALIZAÇÃO TRAINEE COMP](#projeto-final-especialização-trainee-comp)
  - [Índice](#índice)
  - [Descrição](#descrição)
    - [Modelo Diagrama ER](#modelo-diagrama-er)
  - [Rotas](#rotas)
    - [Rotas apenas de teste](#rotas-apenas-de-teste)
    - [Rotas de Autenticação](#rotas-de-autenticação)
    - [Rotas para Users](#rotas-para-users)
    - [Rotas para Topics](#rotas-para-topics)
  - [Tecnologias Usadas](#tecnologias-usadas)
    - [Pré-requisitos](#pré-requisitos)
    - [Configuração](#configuração)
  - [Instalação](#instalação)
  - [Como Usar](#como-usar)
    - [Alguns exemplos de uso](#alguns-exemplos-de-uso)
      - [Cadastro de usuário](#cadastro-de-usuário)
      - [Autenticação do usuário](#autenticação-do-usuário)
      - [Cadastro de Tópicos](#cadastro-de-tópicos)
  - [Equipe](#equipe)
  - [Feedback e Contato](#feedback-e-contato)
  - [Licença](#licença)
## Descrição
Desenvolvimento de uma api para permitir controle de revisão de estudos de um usuário.
Assim esse usuário poderá inserir tópicos estudados e um prazo que ele pretende revisar esse tópico.
Dessa maneira, cada usuário poderá montar um cronograma para si mesmo.
A princípio a ideia é que aplicação possua duas entidades: Tópico a ser revisado e o usuário. Assim o usuário se cadastra na aplicação e após cadastro fará login e conseguirá adicionar tópicos e o prazo em dias de quando se deseja revisar.  Dessa forma, poderá acompanhar as materias que a revisão está atrasada e atualizar os prazos para novas revisões.
Dessa maneira, cada usuário terá seu próprio historico de revisões.

Caso o usuário esqueça a senha será permitido ele solicitar a redefinição da mesma sendo enviado para ele um token que deve ser passado na solicitação de redefinição

Além disso, o projeto pode ser dockerizado para isso siga a documentação em [Docker](DOCKER.md)

### Modelo Diagrama ER
![Diagrama Entidade Relacionamento do Projeto](./images/diagramaER.png)


## Rotas
O teste de rotas pode ser feito utilizando a ferramenta Postman ou Insomnia, na pasta collections possui um arquivo `EspecializacaoBack.postman_collection.json` que pode ser importado com todas as rotas disponivéis para realizar os testes.
Abaixo está uma descrição das rotas e das ações executadas por cada uma.

### Rotas apenas de teste
| Método  | Caminho da rota    | Ação
|---------| -------------------|--------------
| GET    	| /verify            | Veririca se o servidor está respondendo
| GET     | /auth/verify       | Veririca resposta do usuário com se ele estiver logado

### Rotas de Autenticação
| Método    | Caminho da rota        | Ação
|-----------|------------------------|--------------
| POST      | /auth                  | Autenticação do usuário
| POST	    | /auth/forgot-password  | Envia token para o email do usuário
| POST      | /auth/reset-password   | Reseta a senha do usuário

### Rotas para Users 
| Método  | Caminho da rota    | Ação
|---------| -------------------|--------------
| POST   	| /user              |	Adiciona usuário
| PUT	    | /user	             | Atualiza usuário
| DELETE  | /user	             | Deleta usuário
| GET	    | /user              | Obtém informações do usuário


### Rotas para Topics
| Método  | Caminho da rota    | Ação
|---------| -------------------|--------------
| PUT	    |/topic/id           | Atualiza tópico
| DELETE	|/topic/id           | Deleta tópico
| GET	    |/my-topics	         | Lista todos os tópicos do usuário
| GET	    |/topic/delayed	     | Lista apenas tópicos de hoje e atrasados
| GET     |/all-topics         | Lista todos os tópicos presentes na tabela com o usuário pertencente

## Tecnologias Usadas

- Node.js
- Express

- Sequelize</br> Utilizado para facilitar a integração dos modelos das tabelas a serem utilizadas no banco de dados
- MySql </br> Usado para armazenar os dados 
- bcryptjs</br> Utilizado para permitir encriptar o password e o token utilizado 
- Jsonschema</br> Utilizado para faciliar a verificação dos dados que devem ser inseridos nas requisições
- Jsonwebtoken</br> Utilizado par poder gerar um token de autenticação do usuário
- NodeMailer</br> Utilizado para realizar o envio de emails
- NodeMailer-Express-handlebars</br> Utilizado para poder enviar um email com um template de email, sendo possível trabalhar com variaveis para construção

### Pré-requisitos

Antes de começar, verifique se atendeu aos seguintes requisitos:
- Versão mais recente de `node.js`
- Configuração correta do Banco de Dados
- Para teste das requisições deve se intalar o programa Postman ou Insomnia

### Configuração
- Deve se verificar as informações no arquivo `.env` e adequala-las conforme o banco de dados utlizado
- Configure as variáveis presentes no arquivo `env.example`, renomeando para apenas `.env`.
 
```bash
#SERVER
PORT = 3000

#DB CONFIGS (src/configs/db.js)
MYSQL_DIALECT = mysql
#localhost ou  mysql-backend
MYSQL_HOST = mysql-backend # Definir mesmo nome do conteiner do mysql
MYSQL_USERNAME = root
MYSQL_PASSWORD = root
MYSQL_DATABASE = comp-project-bd  
MYSQL_DB_PORT = 3306
MYSQL_TIMEZONE = '-03:00' #"America/Sao_Paulo"

#BCRYPTJS (src/utils/token.js)
HASH_BCRYPT = af02894afbb2bc3c11c51c530334e474
EXPIRE_IN = '7d' #(src/apps/controllers/AuthenticationController.js)

#crypto (src/utils/crypt.js)
SECRET_CRYPTO = 91fe1aaf70553fd1142ab4f080c18eab


#DOCKER (docker-compose)
MYSQL_DOCKER_PORT = 3306 


#NODEMAILER
#MAILTRAP (src/modules/mailer.js)
MAILERTRAP_HOST = "sandbox.smtp.mailtrap.io"
MAILERTRAP_PORT = 2525
MAILERTRAP_USER = 173eba019e2901
MAILERTRAP_SENHA = 13899467ca07d1
EMAIL_REMETENTE = "willian.souza@compjunior.com.br" # (src/apps/controllers/AuthenticationController.js)

#API (models/Topics e controllers/TopicController)
DIAS_PADRAO_PARA_REVISAO = 7 

#NOMES DOS CONTAINERS (docker-compose)
API_NAME = api-backend
MYSQL_NAME = mysql-backend

```

## Instalação
- Garante que tenha a versão mais recente do node instalada
- Execute os comandos


 ```bash
npm install
```
```bash
npx sequelize db:migrate
``` 



## Como Usar
Após a instalação e configuração do banco de dados, para utilizar o projeto deve se iniciar o servidor

```bash
npm start
```

Assim para poder verificar o funcionamento do sistema deve se garantir que os dados do banco de dados tenham sido passadas corretamente no arquivo `.env` como já mencionado. 
Então deve se iniciar o aplicativo Postman ou Insmonia e testar as requisicoes já importadas.

### Alguns exemplos de uso
#### Cadastro de usuário

Deve ser passado na `http://localhost:[PORT]/user` o  body da requisição post as seguintes informações
```bash
{
    "name": "NOME DO USUARIO AQUI",
    "email": "SEU EMAIL AQUI ",
    "password": "SUA SENHA AQUI"
        
}
```
Dessa maneira o sistema salvará um novo usuário com essas informações e o password criptografo.

#### Autenticação do usuário

Assim após realizar o cadastro do usuário pode realizar o login dele no sistema, somente assim ele terá permissão para realizar interações com o sistema. Assim deve se passar as seguintes informações no body da requisição POST na rota `http://localhost:[PORT]/auth`
```bash
{
    "email": "SEU EMAIL AQUI ",
    "password": "SUA SENHA AQUI"    
}
```

Dessa maneira o servidor gerará um token de autenticação desse usuário que será a autorização para que ele utilize o sistema.


#### Cadastro de Tópicos

Deve ser passado na rota `http://localhost:[PORT]/topic` o  body da requisição post as seguintes informações
```bash
{
    "description": "DESCRIÇÃO DO TÓPICO AQUI",
    "revision_in": numero-de-dias-aqui
        
}
```
## Equipe

- [@WillianBrandao](https://github.com/WillianBrandao) - Ideia & Desenvolvimento inicial, documentação e manutenção

## Feedback e Contato

Para enviar feedback ou entrar em contato, por favor, envie um e-mail para `willian.souza@compjunior.com.br`.

## Licença

Este projeto está licenciado sob a Licença ISC