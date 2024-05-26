const Sequelize = require("sequelize");
const Users = require("../apps/models/Users");
const Topics = require("../apps/models/Topics");

const models = [Users, Topics];
const databaseConfig = require("../configs/db");

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models) //associar as informacoes de duas tabelas exemplo imprimir todos os posts separando por usuario
      );
  }
}
module.exports = new Database();
