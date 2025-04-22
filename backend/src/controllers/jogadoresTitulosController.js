import JogadoresTitulos from "../database/models/JogadoresTitulos.js";
import Jogador from "../database/models/Jogadores.js";
import Titulos from "../database/models/Titulos.js";
import Clubes from "../database/models/Clubes.js";
import { Op } from "sequelize";

export const pegarJogadoresTitulos = async (req, res) => {
    try {
        const search = (req.query.search || "").toString().trim();

        let whereJogador = undefined;

        if (!isNaN(Number(search)) && search !== "") {
            whereJogador = { id: Number(search) };
        } else if (search !== "") {
            whereJogador = { nome: { [Op.iLike]: `%${search}%` } };
        }

        const titulos = await JogadoresTitulos.findAll({
            include: [
                {
                    model: Jogador,
                    as: "jogador",
                    attributes: ["id", "nome"],
                    where: whereJogador // aplica filtro no include
                },
                { model: Titulos, as: "titulo", attributes: ["id", "nome", "tipo"] },
                { model: Clubes, as: "clube", attributes: ["id", "nome"] },
            ],
            order: [["jogador_id", "ASC"], ["titulo_id", "ASC"]],
        });

        res.status(200).json(titulos);
    } catch (error) {
        console.error("Erro ao pegar jogadores títulos:", error);
        res.status(500).json({ error: "Erro ao buscar jogadores títulos." });
    }
};


export const inserirJogadorTitulo = async (req, res) => {
    try {
        const { jogador_id, titulo_id, ano, clube_id } = req.body;

        if (!jogador_id || !titulo_id || !ano || !clube_id) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        const novoTitulo = await JogadoresTitulos.create({
            jogador_id,
            titulo_id,
            ano,
            clube_id,
        });

        res.status(201).json(novoTitulo);
    } catch (error) {
        console.error("Erro ao inserir jogador título:", error);
        res.status(500).json({ error: "Erro ao inserir jogador título." });
    }
};

export const editarJogadorTitulo = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo_id, ano, clube_id } = req.body;

        if (!titulo_id || !ano || !clube_id) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        const registro = await JogadoresTitulos.findByPk(id);

        if (!registro) {
            return res.status(404).json({ error: "Registro não encontrado." });
        }

        await registro.update({
            titulo_id,
            ano,
            clube_id
        });

        res.status(200).json({ mensagem: "Registro atualizado com sucesso", registro });
    } catch (error) {
        console.error("Erro ao editar jogador título:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

export const deletarJogadorTitulo = async (req, res) => {
    try {
        const { id } = req.params;

        const registro = await JogadoresTitulos.findByPk(id);

        if (!registro) {
            return res.status(404).json({ error: "Registro não encontrado." });
        }

        await registro.destroy();
        res.status(200).json({ mensagem: "Registro deletado com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar jogador título:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};
