# USO DO DOCKER

Para utilizar o docker garanta que esteja instalado
Assim ao executar o comando abaixo 

```bash
docker compose-compose -d
``` 
será gerado 2 containers um com o banco de dados e outro com a api já configuradas, assim pode utilizar o postman normalmente

No docker compose existe o seguinte comando 

```bash
command: bash -c "npm install && npx sequelize db:migrate && npm start"
```

Que é responsavel por instalar o node, migrar as tabelas conforme o projeto e iniciar a API

Dessa forma ao inicializar o comando para iniciar o docker é necessário que aguarde um tempo