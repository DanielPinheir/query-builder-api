const knex = require("../conexao");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;
    
  if (!nome) {
    return res.status(404).json("O campo nome é obrigatório");
  }

  if (!email) {
    return res.status(404).json("O campo email é obrigatório");
  }

  if (!senha) {
    return res.status(404).json("O campo senha é obrigatório");
  }

  if (!nome_loja) {
    return res.status(404).json("O campo nome_loja é obrigatório");
  }
  try {
    const usuariosPorEmail = await knex("usuarios").where({ email });
    const quantidadeUsuariosPorEmail = usuariosPorEmail.length;

    if (quantidadeUsuariosPorEmail > 0) {
      return res.status(404).json("O email já existe");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const dadosUsuario = {
      nome,
      email,
      senha: senhaCriptografada,
      nome_loja,
    };
    const usuario = await knex("usuarios").insert(dadosUsuario).returning("*");
    if (usuario.length === 0) {
      return res.status(404).json("O usuário não foi cadastrado.");
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterPerfil = async (req, res) => {
    const { usuario } = req;
  try {
    const usuarioSelecionado = await knex("usuarios").where({ id: usuario.id }).first();

    if (!usuarioSelecionado) {
      return res.status(404).json("Usuário não encontrado.");
    }

    return res.status(200).json(usuarioSelecionado);
  } catch (error) {
    return res.status(400).json("Usuário não encontrado");
  }
};

const atualizarPerfil = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;
  const { usuario } = req;

  if (!nome && !email && !senha && !nome_loja) {
    return res
      .status(404)
      .json("É obrigatório informar ao menos um campo para atualização");
  }

  try {
    const perfilSelecionado = await knex("usuarios")
      .where({
        id: usuario.id
      })
      .first();

    if (!perfilSelecionado) {
      return res.status(404).json("Perfil não encontrado.");
    }

    const perfilAtualizado = await knex("usuarios")
      .update({
        nome,
        email,
        senha,
        nome_loja,
      })
      .where({ id: usuario.id }).returning("*");

      if (!perfilAtualizado) {
        return res.status(404).json("Não foi possível atualizar o perfil do usário.")
      }

    return res.status(200).json(perfilAtualizado[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarUsuario,
  obterPerfil,
  atualizarPerfil,
};
