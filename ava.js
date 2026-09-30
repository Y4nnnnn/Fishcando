const estrelas = document.querySelectorAll(".stars input");
const etiquetasEstrelas = document.querySelectorAll(".stars label");
const coracao = document.querySelector("#favorite");
const iconeCoracao = coracao.nextElementSibling.querySelector("i");
const inputTag = document.querySelector(".in");
const areaTags = document.querySelector(".tags");
const opiniao = document.querySelector(".opi");
const jaVi = document.querySelector("#miCheckbox");
const botao = document.querySelector(".save");
const areaBotoes = document.querySelector(".enviar");

const filmeSelecionado = localStorage.getItem("filmeSelecionado");
const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};
const avaliacao = avaliacoes[filmeSelecionado];
let quantidadeTags = 0;

function atualizarEstrelas(valor) {
    estrelas.forEach((estrela) => {
        const icone = estrela.nextElementSibling.querySelector("i");
        if (Number(estrela.value) <= valor) {
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

function atualizarCoracao(preenchido) {
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

function criarTag(texto) {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.textContent = texto;
    areaTags.appendChild(tag);
}

function carregarDados() {
    if (!avaliacao) return;

    document.querySelector(".titulo h1").textContent = avaliacao.titulo;
    document.querySelector(".titulo h3").textContent = avaliacao.ano;
    document.querySelector(".movie").src = avaliacao.poster;
    document.querySelector(".movie").alt = avaliacao.titulo;

    if (avaliacao.nota) {
        const estrela = document.querySelector(`.stars input[value="${avaliacao.nota}"]`);
        if (estrela) {
            estrela.checked = true;
            atualizarEstrelas(avaliacao.nota);
        }
    }

    coracao.checked = avaliacao.favorito || false;
    atualizarCoracao(coracao.checked);
    opiniao.value = avaliacao.opiniao || "";
    jaVi.checked = avaliacao.jaVi || false;

    (avaliacao.tags || []).forEach((tag) => {
        criarTag(tag);
        quantidadeTags++;
    });
}

estrelas.forEach((estrela) => {
    estrela.addEventListener("change", () => atualizarEstrelas(Number(estrela.value)));
});

etiquetasEstrelas.forEach((etiqueta) => {
    etiqueta.addEventListener("mouseenter", () => {
        atualizarEstrelas(Number(etiqueta.htmlFor.replace("star", "")));
    });
});

document.querySelector(".stars").addEventListener("mouseleave", () => {
    const selecionada = document.querySelector(".stars input:checked");
    atualizarEstrelas(selecionada ? Number(selecionada.value) : 0);
});

coracao.addEventListener("change", () => atualizarCoracao(coracao.checked));

coracao.nextElementSibling.addEventListener("mouseenter", () => atualizarCoracao(true));
coracao.nextElementSibling.addEventListener("mouseleave", () => atualizarCoracao(coracao.checked));

inputTag.addEventListener("keydown", (evento) => {
    if (evento.key !== "Enter") return;
    evento.preventDefault();

    const texto = inputTag.value.trim();
    if (!texto || quantidadeTags >= 8) return;

    criarTag(texto);
    quantidadeTags++;
    inputTag.value = "";
});

function salvarAvaliacao() {
    if (!filmeSelecionado) return;

    const dados = JSON.parse(localStorage.getItem("avaliacoes")) || {};
    const tags = [];
    let nota = 0;

    areaTags.querySelectorAll(".tag").forEach((tag) => tags.push(tag.textContent));
    estrelas.forEach((estrela) => {
        if (estrela.checked) nota = Number(estrela.value);
    });

    dados[filmeSelecionado] = {
        titulo: document.querySelector(".titulo h1").textContent,
        ano: document.querySelector(".titulo h3").textContent,
        poster: avaliacao && avaliacao.poster ? avaliacao.poster : document.querySelector(".movie").getAttribute("src"),
        nota: nota,
        favorito: coracao.checked,
        opiniao: opiniao.value,
        tags: tags,
        jaVi: jaVi.checked
    };

    localStorage.setItem("avaliacoes", JSON.stringify(dados));
    window.location.href = "profile.html";
}

function criarBotoes() {
    if (document.querySelector(".excluir")) return;

    const limpar = document.createElement("button");
    limpar.classList.add("limpar");
    limpar.textContent = "Limpar";

    const excluir = document.createElement("button");
    excluir.classList.add("excluir");
    excluir.textContent = "Excluir";

    areaBotoes.insertBefore(limpar, botao);
    areaBotoes.insertBefore(excluir, botao);

    limpar.addEventListener("click", () => {
        opiniao.value = "";
        estrelas.forEach((estrela) => estrela.checked = false);
        atualizarEstrelas(0);
        coracao.checked = false;
        atualizarCoracao(false);
        jaVi.checked = false;
        areaTags.innerHTML = "";
        inputTag.value = "";
        quantidadeTags = 0;
    });

    excluir.addEventListener("click", () => {
        if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;

        const dados = JSON.parse(localStorage.getItem("avaliacoes")) || {};
        delete dados[filmeSelecionado];
        localStorage.setItem("avaliacoes", JSON.stringify(dados));
        localStorage.removeItem("filmeSelecionado");
        window.location.href = "profile.html";
    });
}

botao.addEventListener("click", () => {
    if (botao.textContent.trim() === "Editar") {
        botao.textContent = "Salvar";
        criarBotoes();
        return;
    }

    salvarAvaliacao();
});

carregarDados();
