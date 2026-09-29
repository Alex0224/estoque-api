import express from "express";
import pool from "../config/database.js";

const router = express.Router();


router.get("/", async (req, res) => {

    try{

        const [produtos] = await pool.query("SELECT * FROM produtos");
        res.json(produtos);

    } catch (erro) {
        console.log(erro);
        res.status(500).json({
            erro: "Erro ao buscar os produtos"
        });
    }
});

router.post("/", async (req, res) =>{

    const { nome, sku, preco, categoria_id } = req.body;

    try{    

        if(!nome || !sku){
            return res.status(400).json({
                erro: "É necessário declarar um NOME e um SKU para o produto"
            });
        }
        
        const skuLimpo = sku.trim();
        const nomeLimpo = nome.trim();

        if(nomeLimpo === ""){
            return res.status(400).json({
                erro: "O nome do produto é obrigatório"
            });
        }

        if(skuLimpo === ""){
            return res.status(400).json({
                erro: "É necessário cadastrar um SKU válido para o produto"
            });
        } else {

            const [resultado] = await pool.query("SELECT sku FROM produtos WHERE sku = ?", [skuLimpo]);

            if(resultado.length>0){
                return res.status(409).json({
                    erro: "Não é possível cadastrar dois produtos com o mesmo SKU"
                });
            }
        }

        if(!preco || preco <= 0 || !Number.isFinite(preco)){
            return res.status(400).json({
                erro: "É necessário inserir um preço válido para cadastrar um produto"
            });
        }

        if (!categoria_id || categoria_id <= 0 || !Number.isFinite(categoria_id)) {
            return res.status(400).json({
                erro: "Selecione alguma categoria válida para cadastrar o produto!"
            });
        } else {

            const [resultadoID] = await pool.query("SELECT id FROM categorias WHERE id = ?", [categoria_id]);

            if(resultadoID.length === 0){
                return res.status(404).json({
                    erro: "Categoria não encontrada, selecione outra"
                });
            }
        }

        const [resultado] = await pool.query("INSERT INTO produtos (nome, sku, preco, categoria_id) VALUES (?, ?, ?, ?)", [nomeLimpo, skuLimpo, preco, categoria_id]);
        const [nomeCategoria] = await pool.query("SELECT nome FROM categorias WHERE id =?", [categoria_id]);
        res.status(201).json({
            mensagem: "Produto criado com sucesso",
            id: resultado.insertId,
            nome: nomeLimpo,
            sku: skuLimpo,
            preco: `R$ ${preco}`,
            categoria: nomeCategoria[0].nome

        });


    } catch (erro){

        console.log(erro)

        return res.status(500).json({
            erro: "Erro inesperado, não foi possível cadastrar o produto. Verifique as informações ou entre em contato com o desenvolvedor"
        });
    }
});

router.put("/:id", async (req, res) =>{
    const { id } = req.params;
    const {nome, sku, preco, categoria_id} = req.body;

    try{
        const [resultadoID] = await pool.query("SELECT id FROM produtos WHERE id = ?", [id]);

        if(resultadoID.length === 0){
            return res.status(404).json({
                erro: "O produto informado não existe"
            });
        }

        if(!nome || !sku){
            return res.status(400).json({
                erro: "É obrigatório informar um NOME e um SKU válido para atualizar o produto"
            });
        }

        const nomeLimpo = nome.trim();
        const skuLimpo = sku.trim();

        if(nomeLimpo === "" || skuLimpo === ""){
            return res.status(400).json({
                erro: "É obrigatório informar um NOME e um SKU válido para atualizar o produto"
            });
        }

        const [resultado] = await pool.query("SELECT id FROM produtos WHERE sku = ?", [skuLimpo]);

        if(resultado.length > 0){
            
            if(resultado[0].id !== Number(id)){

            return res.status(409).json({
                erro: "O SKU informado é utilizado por outro produto"
            });

            }
        }

        if(!preco || preco <= 0 || !Number.isFinite(preco)){
            return res.status(400).json({
                erro: "É necessário inserir um preço válido para cadastrar um produto"
            });
        }

        if (!categoria_id || categoria_id <= 0 || !Number.isFinite(categoria_id)) {
            return res.status(400).json({
                erro: "Selecione alguma categoria válida para cadastrar o produto!"
            });
        } else {

            const [resultadoID] = await pool.query("SELECT id FROM categorias WHERE id = ?", [categoria_id]);

            if(resultadoID.length === 0){
                return res.status(404).json({
                    erro: "Categoria não encontrada, selecione outra"
                });
            }
        }

        const [resultadoAtualizar] = await pool.query("UPDATE produtos SET nome = ?, sku = ?, preco = ?, categoria_id = ? WHERE id = ?", [nomeLimpo, skuLimpo, preco, categoria_id, Number(id)]);
        const [nomeCategoria] = await pool.query("SELECT nome FROM categorias WHERE id = ?", [categoria_id]);

        res.status(200).json({
            mensagem: "Produto atualizado com sucesso!",
            id: Number(id),
            nome: nomeLimpo,
            sku: skuLimpo,
            preco: `R$ ${preco}`,
            categoria: nomeCategoria[0].nome
        });

    } catch (erro){
        console.log(erro);
        return res.status(500).json({
            erro: "Erro ao atualizar o produto. Verifique as informações ou entre em contato com o desenvolvedor"
        });
    }

});

router.delete("/:id/:confirmacao", async (req, res) =>{

    const { id, confirmacao } = req.params;

    try{    

        const [resultado] = await pool.query("SELECT id FROM produtos WHERE id = ?", [id]);

        if(resultado.length === 0){
            return res.status(404).json({
                mensagem: "O produto informado não existe"
            });
        }

        if(confirmacao !== "s"){
            return res.status(400).json({
                mensagem: "É necessária confirmação para exclusão dos produtos e de suas movimentações"
            });
        }

        await pool.query("DELETE FROM movimentacoes WHERE produto_id = ?", [Number(id)]);
        await pool.query("DELETE FROM produtos WHERE id = ?", [Number(id)]);

        return res.status(204).send();


    } catch (erro){
        console.log(erro);
        return res.status(500).json({
            mensagem: "Erro inesperado. Verifique as informações ou entre em contato com o desenvolvedor"
        });
    }
});

export default router;