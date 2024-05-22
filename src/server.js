require("dotenv").config();
require("./database/index"); // importando configuracoes BD
const express = require("express");
const routes = require("./routes"); //Importando arquivo de rotas

const app = express();

//Define que os dados serão enviados do tipo json
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running in PORT ${PORT}`);
});
