import express from "express";
import categoriasRouter from "./routes/categorias.js";
import produtosRouter from "./routes/produtos.js";
import movimentacoesRouter from "./routes/movimentacoes.js"

const app = express();
app.use(express.json());

app.use("/categorias", categoriasRouter);
app.use("/produtos", produtosRouter);
app.use("/movimentacoes", movimentacoesRouter);


app.get("/", (req, res) => {
  res.json({
    mensagem: "API de Controle de Estoque funcionando!"
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});