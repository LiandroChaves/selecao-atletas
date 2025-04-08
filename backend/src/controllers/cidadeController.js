import Cidades from "../database/models/Cidades.js";

export const inserirCidades = async (req, res) => {
    try {
        const { nome, pais_id, estado_id } = req.body;

        if (!nome || !pais_id) {
            return res.status(400).json({ error: "Nome e país são obrigatórios." });
        }

        const nomeFormatado = nome
            .toLowerCase()
            .split(" ")
            .map((palavra, index) => {
                const palavrasMinusculas = ["de", "da", "do", "das", "dos", "e", "em", "na", "no"];
                if (index === 0 || !palavrasMinusculas.includes(palavra)) {
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                } else {
                    return palavra;
                }
            })
            .join(" ");

        const cidade = await Cidades.create({
            nome: nomeFormatado,
            pais_id,
            estado_id: estado_id || null,
        });

        res.status(201).json({ cidade });
    } catch (error) {
        console.error("❌ Erro ao inserir cidade:", error);
        res.status(500).json({ error: "Erro ao inserir cidade." });
    }
};

export const pegarCidades = async (_req, res) => {
    try {
        const cidades = await Cidades.findAll({ order: [["id", "ASC"]] });
        res.json(cidades);
    } catch (error) {
        console.error("❌ Erro ao buscar cidades:", error);
        res.status(500).json({ error: "Erro ao buscar cidades." });
    }
};
