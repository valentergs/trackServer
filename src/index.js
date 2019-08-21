require("./models/User");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri =
  "mongodb+srv://admin:Gustavo2012@cluster0-lhunq.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true });
mongoose.connection.on("connected", () => {
  console.log("Conectado ao mongo!");
});
mongoose.connection.on("error", err => {
  console.log("Erro ao conectar o Mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Seu e-mail: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("Escutando na porta 3000");
});
