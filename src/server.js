require("dotenv").config();
require("./database/index"); // importando configuracoes BD
const express = require("express");
const routes = require("./routes"); //Importando arquivo de rotas
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); //Define que os dados serão enviados do tipo json
app.use(routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running in PORT ${PORT}`);
});
