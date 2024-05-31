# USO DO DOCKER

Para utilizar o docker garanta que esteja instalado na máquina
Assim ao executar o comando abaixo 

```bash
docker compose -d
``` 
será gerado 2 containers, um com o banco de dados mysql e outro com a api já configurada,ambos já configurados, assim pode utilizar o postman normalmente

No arquivo `docker-compose.yml` existe o seguinte comando 

```bash
command: bash -c "npm install && npx sequelize db:migrate && npm start"
```

responsável por instalar o node, migrar as tabelas conforme o projeto e iniciar a API

Dessa forma ao inicializar o comando para iniciar o docker é necessário que aguarde um tempo