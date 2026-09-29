import  express  from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) =>{
    try{
        const [resultado] = await pool.query("SELECT * FROM movimentacoes");
        res.json(resultado);
    } catch (erro){
        console.log(erro);
        return res.status(500).json({
            erro: "Erro inesperado, verifique informações ou entre em contato com o desenvolvedor"
        });
    }
});

router.post("/", async (req, res) =>{

    const {produto_id, tipo, quantidade} = req.body;

    try{

        const [produtoExiste] = await pool.query("SELECT id FROM produtos WHERE id = ?", [produto_id]);

        if(produtoExiste.length === 0){
            return res.status(404).json({
                erro: "Selecione um produto existente"
            });
        }

        if(tipo !== "ENTRADA" && tipo !== "SAIDA"){
            return res.status(400).json({
                erro: "O tipo de movimentação deve ser escolhido: ENTRADA ou SAIDA"
            });
        }

        if(!quantidade || quantidade <= 0 || !Number.isFinite(quantidade)){
            return res.status(400).json({
                erro: "Insira uma quantidade válida"
            });
        }

        
        const [somaEstoque] = await pool.query("SELECT SUM(quantidade) AS total FROM movimentacoes WHERE produto_id = ? AND tipo = ?", [produto_id, "ENTRADA"]);
        const [diminuiEstoque] = await pool.query("SELECT SUM(quantidade) AS total FROM movimentacoes WHERE produto_id = ? AND tipo = ?", [produto_id, "SAIDA"]);

        if(somaEstoque[0].total === null){
            somaEstoque[0].total = 0;
        }

        if(diminuiEstoque[0].total === null){
            diminuiEstoque[0].total = 0;
        }

        let estoqueProduto = somaEstoque[0].total - diminuiEstoque[0].total;

        if(tipo === "SAIDA" && estoqueProduto < quantidade){
            return res.status(409).json({
                erro: "A quantidade indicada não coincide ao estoque real do produto, verifique erros"
            });
        }

        if(tipo === "SAIDA"){
            estoqueProduto = estoqueProduto - quantidade;
        }

        if(tipo === "ENTRADA"){
            estoqueProduto = estoqueProduto + quantidade;
        }

        const [inserirMovimentacao] = await pool.query("INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES (?, ?, ?)", [produto_id, tipo, quantidade]);

        const [nomeProduto] = await pool.query("SELECT nome FROM produtos WHERE id = ?", [produto_id]);

        return res.status(201).json({
            mensagem: "Estoque alterado com sucesso",
            id: inserirMovimentacao.insertId,
            produto: nomeProduto[0].nome,
            tipo: tipo,
            quantidade: quantidade,
            estoqueAtual: estoqueProduto
        });


    } catch (erro){
        return res.status(500).json({
            erro: "Erro inesperado, verifique informações ou entre em contato com o desenvolvedor"
        });
    }
});

export default router;