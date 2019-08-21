const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // buscaar por um token válido no header do request tipo = authorization === 'Bearer sldkjsdfgjsdkjdfhgkdfjfd'
  const { authorization } = req.headers;

  // se o usuário não tiver um token válido...
  if (!authorization) {
    return res.status(401).send({ error: "Você precisa fazer o login!" });
  }

  const token = authorization.replace("Bearer ", "");
  // Desconstruit o token e verificar se é uma chave válida, usando o secret key usado na sua criação (segundo argumento).
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "Você precisa fazer o login!" });
    }

    const { userId } = payload;
    // Para dizer ao Mongoose procurar por um usuário com esse ID
    const user = await User.findById(userId);
    req.user = user;
    // se estiver tudo certo next() vai seguir para um próximo eventual middleware
    next();
  });
};
