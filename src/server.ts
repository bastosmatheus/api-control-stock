import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import ExitRouter from "./api/routes/ExitRouter";
import ProductRouter from "./api/routes/ProductRouter";
import EntranceRouter from "./api/routes/EntranceRouter";
import DevolutionRouter from "./api/routes/DevolutionRouter";
import DefectProductRouter from "./api/routes/DefectProductRouter";

const app = express();

const jsonBodyParser = bodyParser.json();
const urlEncoded = bodyParser.urlencoded({ extended: true });

app.use(cors());
app.use(jsonBodyParser);
app.use(urlEncoded);
app.use(ProductRouter);
app.use(EntranceRouter);
app.use(ExitRouter);
app.use(DevolutionRouter);
app.use(DefectProductRouter);

app.listen(4000, () => {
  console.log("server rodando na porta 4000");
});
