import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try{

        const [categorias] = await pool.query("SELECT * FROM categorias");

        res.json(categorias);

    }catch(erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar categorias"
        });
    }
});

router.post("/", async (req, res) => {
   
    const { nome } = req.body;

    if(!nome || nome.trim() === ""){
        return res.status(400).json({
            erro: "O nome da categoria é obrigatório"
        });
    }

    const nomeLimpo = nome.trim();

    try{

        const [resultado] = await pool.query("INSERT INTO categorias (nome) VALUES (?)", [nomeLimpo]);

        res.status(201).json({
        mensagem: "Categoria criada com sucesso",
        id: resultado.insertId,
        nome: nomeLimpo
        });

    } catch (erro) {

        console.error(erro);
        res.status(500).json({erro: "Erro ao criar categoria"});

    }
});

router.delete("/:id", async (req, res) =>{
    const { id } = req.params;

    try{
        
        const [resultado] = await pool.query("SELECT id FROM categorias WHERE id = ?", [id]);
        const [produtos] = await pool.query("SELECT id FROM produtos WHERE categoria_id = ?", [id]);

        if (resultado.length === 0) {
            return res.status(404).json({
                erro: "Categoria não encontrada"
            });
        }
    
        if (produtos.length > 0) {
            return res.status(409).json({
                erro: "Não é possível excluir a categoria porque existem produtos vinculados a ela"
            });
        }

        await pool.query("DELETE FROM categorias WHERE id = ?", [id]);

        res.status(204).send();

    } catch(erro) {

        console.log(erro);
        res.status(500).json({
            erro: "Erro inesperado, tente novamente ou entre em contato com os desenvolvedores"
        });

    }

});

export default router;