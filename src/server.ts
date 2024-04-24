import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import ExitRouter from "./api/routes/ExitRouter";
import StoreRouter from "./api/routes/StoreRouter";
import ProductRouter from "./api/routes/ProductRouter";
import EntranceRouter from "./api/routes/EntranceRouter";
import DevolutionRouter from "./api/routes/DevolutionRouter";
import DefectiveProductRouter from "./api/routes/DefectiveProductRouter";

const app = express();

const jsonBodyParser = bodyParser.json();
const urlEncoded = bodyParser.urlencoded({ extended: true });

app.use(cors());
app.use(jsonBodyParser);
app.use(urlEncoded);
// app.use(ProductRouter);
// app.use(EntranceRouter);
// app.use(ExitRouter);
// app.use(DevolutionRouter);
// app.use(DefectiveProductRouter);
app.use(StoreRouter);

app.listen(4000, () => {
  console.log("server rodando na porta 4000");
});
