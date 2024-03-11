import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import RouterProduct from "./api/routes/RouterProduct";

const app = express();

const jsonBodyParser = bodyParser.json();
const urlEncoded = bodyParser.urlencoded({ extended: true });

app.use(cors());
app.use(jsonBodyParser);
app.use(urlEncoded);
app.use(RouterProduct);

app.listen(4000, () => {
  console.log("server rodando na porta 4000");
});
