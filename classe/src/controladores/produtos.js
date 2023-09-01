const knex = require("../conexao");

const listarProdutos = async (req, res) => {
  const { usuario } = req;
  const { categoria } = req.query;

  try {
    const produtosListados = await knex("produtos")
      .where({ usuario_id: usuario.id, categoria });
      console.log(produtosListados);
    return res.status(200).json(produtosListados);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const dadosUsuario = {
      usuario_id: usuario.id,
      id,
    };
    const produtoSelecionado = await knex("produtos").where(dadosUsuario);
    if (!produtoSelecionado) {
      return res.status(404).json("Produto não encontrado.");
    }
    return res.status(200).json(produtoSelecionado);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarProduto = async (req, res) => {
  const { usuario } = req;
  const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

  if (!nome) {
    return res.status(404).json("O campo nome é obrigatório");
  }

  if (!estoque) {
    return res.status(404).json("O campo estoque é obrigatório");
  }

  if (!preco) {
    return res.status(404).json("O campo preco é obrigatório");
  }

  if (!descricao) {
    return res.status(404).json("O campo descricao é obrigatório");
  }

  try {
    const dadosProduto = {
      usuario_id: usuario.id,
      nome,
      estoque,
      preco,
      categoria,
      descricao,
      imagem,
    };
    const produtoInserido = await knex("produtos")
      .insert(dadosProduto)
      .returning("*");

    if (!produtoInserido.length) {
      return res.status(400).json("O produto não foi cadastrado");
    }

    return res.status(200).json(produtoInserido[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  const { nome, estoque, preco, categoria, descricao, imagem } = req.body;
    
  if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
    return res
      .status(404)
      .json("Informe ao menos um campo para atualizaçao do produto");
  }

  try {
    const produtoSelecionado = await knex("produtos").where({
      id,
      usuario_id: usuario.id,
    });
    if (produtoSelecionado === 0) {
      return res.status(404).json("Produto não encontrado");
    }

    const produtoAtualizado = await knex("produtos")
      .update({
        nome,
        estoque,
        preco,
        categoria,
        descricao,
        imagem,
      })
      .where({ id, usuario_id: usuario.id })
      .returning("*");

    if (produtoAtualizado.length === 0) {
      return res.status(400).json("O produto não foi atualizado");
    }

    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {

    const produtoSelecionado = await knex("produtos").where({
      id,
      usuario_id: usuario.id,
    });

    if (produtoSelecionado.length === 0) {
      return res.status(404).json("Produto não encontrado");
    }

    const produtoExcluido = await knex("produtos").del().where({
      id,
      usuario_id: usuario.id,
    }).returning("*");
    
    if (produtoExcluido.length === 0) {
      return res.status(400).json("O produto não foi excluido");
    }

    return res.status(200).json(produtoExcluido);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto,
};
