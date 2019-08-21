const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = new User({ email, password });
    await user.save();

    // depois que o usuario está identificado é preciso criar um token e manda-lo de volta. O primeiro argumento do jwt.sign() é o id do usuario e o segundo é segredo para composição do token.
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "Você deve informar um e-mail e senha" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(422)
      .send({ error: "Não encontramos este e-mail em nosso BD" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch {
    return res
      .status(422)
      .send({ error: "Não encontramos este e-mail em nosso BD" });
  }
});

module.exports = router;
