const { Validator } = require("jsonschema");

const v = new Validator();
/**
 * Verifica se o schema passado como parametro está igual ao req.body
 * Deve ser importado em routes
 * @param {*} schema
 * @returns
 */

const schemaValidator = (schema) => (req, res, next) => {
  const result = v.validate(req.body, schema);
  if (!result.valid) {
    const messageError = [];
    for (const item of result.errors) {
      messageError.push(item.message.replace('"', "").replace('"', ""));
    }

    return res.status(401).send({
      SchemaError: messageError,
    });
  }
  next();
};

module.exports = schemaValidator;
