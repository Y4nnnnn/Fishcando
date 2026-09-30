const filmes = document.querySelectorAll(".filme");
const modal = document.querySelector("#modalAvaliacao");
const fecharModal = document.querySelector("#fecharModal");
const modalTitulo = document.querySelector("#modalTitulo");
const modalAno = document.querySelector("#modalAno");
const modalPoster = document.querySelector("#modalPoster");
const estrelas = modal.querySelectorAll(".stars input");
const etiquetasEstrelas = modal.querySelectorAll(".stars label");
const coracao = document.querySelector("#favorite");
const iconeCoracao = coracao.nextElementSibling.querySelector("i");
const inputTag = document.querySelector("#modalTag");
const areaTags = document.querySelector("#modalTags");
const opiniao = document.querySelector("#modalOpiniao");
const jaVi = document.querySelector("#jaVi");
const salvar = document.querySelector("#salvarAvaliacao");

let quantidadeTags = 0;
let filmeAtual = "";
let posterAtual = "";
let anoAtual = "";

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
        atualizarEstrelas(Number(estrela.value));
    });
});

etiquetasEstrelas.forEach((etiqueta) => {
    etiqueta.addEventListener("mouseenter", () => {
        atualizarEstrelas(Number(etiqueta.htmlFor.replace("star", "")));
    });
});

modal.querySelector(".stars").addEventListener("mouseleave", () => {
    const selecionada = modal.querySelector(".stars input:checked");
    atualizarEstrelas(selecionada ? Number(selecionada.value) : 0);
});

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

coracao.addEventListener("change", () => atualizarCoracao(coracao.checked));

coracao.nextElementSibling.addEventListener("mouseenter", () => atualizarCoracao(true));
coracao.nextElementSibling.addEventListener("mouseleave", () => atualizarCoracao(coracao.checked));

inputTag.addEventListener("keydown", (evento) => {
    if (evento.key !== "Enter") return;

    evento.preventDefault();
    const texto = inputTag.value.trim();

    if (texto === "") return;

    if (quantidadeTags >= 8) {
        inputTag.value = "";
        inputTag.placeholder = "Limite de 8 tags atingido!";
        return;
    }

    criarTag(texto);
    inputTag.value = "";
    quantidadeTags++;
});

function criarTag(texto) {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.textContent = texto;
    areaTags.appendChild(tag);
}

function limparFormulario() {
    estrelas.forEach((estrela) => estrela.checked = false);
    atualizarEstrelas(0);
    coracao.checked = false;
    atualizarCoracao(false);
    opiniao.value = "";
    jaVi.checked = false;
    areaTags.innerHTML = "";
    inputTag.value = "";
    inputTag.placeholder = "Ex: Terror";
    quantidadeTags = 0;
}

function carregarAvaliacao() {
    limparFormulario();

    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};
    const avaliacao = avaliacoes[filmeAtual];

    if (!avaliacao) return;

    if (avaliacao.nota) {
        const estrela = modal.querySelector(`.stars input[value="${avaliacao.nota}"]`);
        if (estrela) {
            estrela.checked = true;
            atualizarEstrelas(Number(avaliacao.nota));
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

filmes.forEach((filme) => {
    filme.addEventListener("click", () => {
        filmeAtual = filme.dataset.titulo;
        anoAtual = filme.dataset.ano;
        posterAtual = filme.dataset.poster;

        modalTitulo.textContent = filmeAtual;
        modalAno.textContent = anoAtual;
        modalPoster.src = posterAtual;
        modalPoster.alt = filmeAtual;

        carregarAvaliacao();
        modal.classList.add("ativo");
    });
});

salvar.addEventListener("click", () => {
    if (!filmeAtual) return;

    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};
    const tags = [];
    let nota = 0;

    areaTags.querySelectorAll(".tag").forEach((tag) => tags.push(tag.textContent));
    estrelas.forEach((estrela) => {
        if (estrela.checked) nota = Number(estrela.value);
    });

    avaliacoes[filmeAtual] = {
        titulo: filmeAtual,
        ano: anoAtual,
        poster: posterAtual,
        nota: nota,
        favorito: coracao.checked,
        opiniao: opiniao.value,
        tags: tags,
        jaVi: jaVi.checked
    };

    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
    localStorage.setItem("filmeSelecionado", filmeAtual);
    window.location.href = "profile.html";
});

fecharModal.addEventListener("click", () => {
    modal.classList.remove("ativo");
});
