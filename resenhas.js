const areaAvaliacoes = document.getElementById("avaliacoesFeitas");
const totalAvaliacoes = document.getElementById("totalAvaliacoes");

const modal = document.getElementById("modalAvaliacao");
const fecharModal = document.getElementById("fecharModal");

const modalPoster = document.getElementById("modalPoster");
const modalTitulo = document.getElementById("modalTitulo");
const modalAno = document.getElementById("modalAno");

const modalOpiniao = document.getElementById("modalOpiniao");
const modalTag = document.getElementById("modalTag");
const modalTags = document.getElementById("modalTags");

const favorite = document.getElementById("favorite");
const jaVi = document.getElementById("miCheckbox");

const botaoEditar = document.getElementById("botaoEditar");
const areaBotoes = document.getElementById("areaBotoes");

const estrelas = document.querySelectorAll(".stars input");
const labelsEstrelas = document.querySelectorAll(".stars label");

let avaliacaoAtual = null;
let tags = [];
let editando = false;

function pegarAvaliacoes() {
  return JSON.parse(localStorage.getItem("avaliacoes")) || {};
}

function salvarAvaliacoes(avaliacoes) {
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
}

function mostrarAvaliacoes() {
  const avaliacoes = pegarAvaliacoes();

  areaAvaliacoes.innerHTML = "";

  const lista = Object.values(avaliacoes);

  totalAvaliacoes.textContent = `TOTAL: ${lista.length}`;

  lista.forEach((avaliacao) => {
    const filme = document.createElement("div");

    filme.classList.add("filme");

    filme.dataset.titulo = avaliacao.titulo;

    filme.innerHTML = `
            <img
                src="${avaliacao.poster}"
                alt="${avaliacao.titulo}"
            >
        `;

    filme.addEventListener("click", () => {
      abrirModal(avaliacao);
    });

    areaAvaliacoes.appendChild(filme);
  });
}

function abrirModal(avaliacao) {
  avaliacaoAtual = avaliacao;

  modalTitulo.textContent = avaliacao.titulo;
  modalAno.textContent = avaliacao.ano;
  modalPoster.src = avaliacao.poster;

  modalOpiniao.value = avaliacao.opiniao || "";

  favorite.checked = avaliacao.favorito || false;

  jaVi.checked = avaliacao.jaVi || false;

  tags = avaliacao.tags ? [...avaliacao.tags] : [];

  document.querySelectorAll(".stars input").forEach((estrela) => {
    estrela.checked = false;
  });

  if (avaliacao.avaliacao > 0) {
    const estrela = document.querySelector(
      `.stars input[value="${avaliacao.avaliacao}"]`,
    );

    if (estrela) {
      estrela.checked = true;
    }
  }

  mostrarTags();

  atualizarEstrelas(avaliacao.avaliacao || 0);

  atualizarCoracao(favorite.checked);

  modal.classList.add("ativo");

  editando = false;

  botaoEditar.textContent = "Editar";

  removerBotoesExtras();

  bloquearCampos();
}

function bloquearCampos() {
  modalOpiniao.disabled = true;
  modalTag.disabled = true;
  favorite.disabled = true;
  jaVi.disabled = true;

  estrelas.forEach((estrela) => {
    estrela.disabled = true;
  });
}

function desbloquearCampos() {
  modalOpiniao.disabled = false;
  modalTag.disabled = false;
  favorite.disabled = false;
  jaVi.disabled = false;

  estrelas.forEach((estrela) => {
    estrela.disabled = false;
  });
}

function atualizarEstrelas(valor) {
  estrelas.forEach((estrela) => {
    const numero = Number(estrela.value);

    const icone = estrela.nextElementSibling.querySelector("i");

    if (numero <= valor) {
      icone.classList.remove("bi-star");

      icone.classList.add("bi-star-fill");

      icone.style.color = "#ed105a";
    } else {
      icone.classList.remove("bi-star-fill");

      icone.classList.add("bi-star");

      icone.style.color = "white";
    }
  });
}

estrelas.forEach((estrela) => {
  estrela.addEventListener("change", () => {
    if (!editando) {
      return;
    }

    atualizarEstrelas(Number(estrela.value));
  });
});

labelsEstrelas.forEach((label) => {
  label.addEventListener("mouseenter", () => {
    if (!editando) {
      return;
    }

    const valor = Number(label.htmlFor.replace("star", ""));

    atualizarEstrelas(valor);
  });
});

document.querySelector(".stars").addEventListener("mouseleave", () => {
  if (!editando) {
    return;
  }

  const selecionada = document.querySelector(".stars input:checked");

  if (selecionada) {
    atualizarEstrelas(Number(selecionada.value));
  } else {
    atualizarEstrelas(0);
  }
});

function atualizarCoracao(preenchido) {
  const iconeCoracao = favorite.nextElementSibling.querySelector("i");

  if (preenchido) {
    iconeCoracao.classList.remove("bi-heart");

    iconeCoracao.classList.add("bi-heart-fill");

    iconeCoracao.style.color = "#ed105a";
  } else {
    iconeCoracao.classList.remove("bi-heart-fill");

    iconeCoracao.classList.add("bi-heart");

    iconeCoracao.style.color = "white";
  }
}

favorite.addEventListener("change", () => {
  if (!editando) {
    return;
  }

  atualizarCoracao(favorite.checked);
});

favorite.nextElementSibling.addEventListener("mouseenter", () => {
  if (!editando) {
    return;
  }

  atualizarCoracao(true);
});

favorite.nextElementSibling.addEventListener("mouseleave", () => {
  if (!editando) {
    return;
  }

  atualizarCoracao(favorite.checked);
});

modalTag.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();

  if (!editando) {
    return;
  }

  const texto = modalTag.value.trim();

  if (texto === "") {
    return;
  }

  if (tags.length >= 8) {
    modalTag.value = "";

    modalTag.placeholder = "Limite de 8 tags atingido!";

    modalTag.classList.add("limite-atingido");

    return;
  }

  tags.push(texto);

  modalTag.value = "";

  modalTag.placeholder = "Ex: Terror";

  modalTag.classList.remove("limite-atingido");

  mostrarTags();
});

function mostrarTags() {
  modalTags.innerHTML = "";

  tags.forEach((tag, index) => {
    const elemento = document.createElement("div");

    elemento.classList.add("tag");

    elemento.innerHTML = `
            <span>${tag}</span>
            ${editando ? `<button type="button" data-index="${index}">×</button>` : ""}
        `;

    modalTags.appendChild(elemento);
  });
}

modalTags.addEventListener("click", (event) => {
  if (!editando) {
    return;
  }

  if (event.target.tagName === "BUTTON") {
    const index = Number(event.target.dataset.index);

    tags.splice(index, 1);

    mostrarTags();
  }
});

botaoEditar.addEventListener("click", () => {
  if (!avaliacaoAtual) {
    return;
  }

  if (!editando) {
    editando = true;

    botaoEditar.textContent = "Salvar";

    desbloquearCampos();

    criarBotoesExtras();

    mostrarTags();

    return;
  }

  salvarEdicao();
});

function salvarEdicao() {
  const avaliacoes = pegarAvaliacoes();

  const estrelaSelecionada = document.querySelector(
    '.stars input[name="rating"]:checked',
  );

  const novaAvaliacao = estrelaSelecionada
    ? Number(estrelaSelecionada.value)
    : 0;

  avaliacoes[avaliacaoAtual.titulo] = {
    ...avaliacaoAtual,

    avaliacao: novaAvaliacao,

    favorito: favorite.checked,

    opiniao: modalOpiniao.value.trim(),

    tags: [...tags],

    jaVi: jaVi.checked,
  };

  salvarAvaliacoes(avaliacoes);

  avaliacaoAtual = avaliacoes[avaliacaoAtual.titulo];

  editando = false;

  botaoEditar.textContent = "Editar";

  bloquearCampos();

  removerBotoesExtras();

  mostrarTags();

  atualizarEstrelas(avaliacaoAtual.avaliacao);

  atualizarCoracao(avaliacaoAtual.favorito);

  mostrarAvaliacoes();
}

function criarBotoesExtras() {
  removerBotoesExtras();

  const botaoLimpar = document.createElement("button");

  botaoLimpar.type = "button";

  botaoLimpar.classList.add("limpar");

  botaoLimpar.textContent = "Limpar";

  const botaoExcluir = document.createElement("button");

  botaoExcluir.type = "button";

  botaoExcluir.classList.add("excluir");

  botaoExcluir.textContent = "Excluir";

  areaBotoes.insertBefore(botaoLimpar, botaoEditar);

  areaBotoes.insertBefore(botaoExcluir, botaoEditar);

  botaoLimpar.addEventListener("click", limparDados);

  botaoExcluir.addEventListener("click", excluirAvaliacao);
}

function removerBotoesExtras() {
  const botaoExcluir = document.querySelector(".excluir");

  const botaoLimpar = document.querySelector(".limpar");

  if (botaoExcluir) {
    botaoExcluir.remove();
  }

  if (botaoLimpar) {
    botaoLimpar.remove();
  }
}

function limparDados() {
  const confirmar = confirm("Tem certeza que deseja limpar todos os dados?");

  if (!confirmar) {
    return;
  }

  modalOpiniao.value = "";

  estrelas.forEach((estrela) => {
    estrela.checked = false;
  });

  atualizarEstrelas(0);

  favorite.checked = false;

  atualizarCoracao(false);

  modalTag.value = "";

  modalTag.placeholder = "Ex: Terror";

  modalTag.classList.remove("limite-atingido");

  tags = [];

  modalTags.innerHTML = "";

  jaVi.checked = false;
}

function excluirAvaliacao() {
  const confirmar = confirm("Tem certeza que deseja excluir esta avaliação?");

  if (!confirmar) {
    return;
  }

  const avaliacoes = pegarAvaliacoes();

  delete avaliacoes[avaliacaoAtual.titulo];

  salvarAvaliacoes(avaliacoes);

  modal.classList.remove("ativo");

  avaliacaoAtual = null;

  editando = false;

  removerBotoesExtras();

  mostrarAvaliacoes();
}

fecharModal.addEventListener("click", () => {
  modal.classList.remove("ativo");

  avaliacaoAtual = null;

  editando = false;

  removerBotoesExtras();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("ativo");

    avaliacaoAtual = null;

    editando = false;

    removerBotoesExtras();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.classList.remove("ativo");

    avaliacaoAtual = null;

    editando = false;

    removerBotoesExtras();
  }
});

mostrarAvaliacoes();
