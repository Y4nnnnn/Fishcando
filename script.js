const estrelas = document.querySelectorAll(".stars input");
const labelsEstrelas = document.querySelectorAll(".stars label");

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

labelsEstrelas.forEach((label) => {
    label.addEventListener("mouseenter", () => {
        const valor = Number(label.htmlFor.replace("star", ""));
        atualizarEstrelas(valor);
    });
});

document.querySelector(".stars").addEventListener("mouseleave", () => {
    const selecionada = document.querySelector(".stars input:checked");

    if (selecionada) {
        atualizarEstrelas(Number(selecionada.value));
    } else {
        atualizarEstrelas(0);
    }
});



const coracao = document.querySelector("#favorite");
const iconeCoracao = coracao.nextElementSibling.querySelector("i");

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

coracao.addEventListener("change", () => {
    atualizarCoracao(coracao.checked);
});

coracao.nextElementSibling.addEventListener("mouseenter", () => {
    atualizarCoracao(true);
});

coracao.nextElementSibling.addEventListener("mouseleave", () => {
    atualizarCoracao(coracao.checked);
});



const inputTag = document.querySelector(".in");
const areaTags = document.querySelector(".tags");
const opiniao = document.querySelector(".opi");

let quantidadeTags = 0;

inputTag.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();

        const texto = inputTag.value.trim();

        if (texto === "") {
            return;
        }

        if (quantidadeTags >= 8) {
            inputTag.value = "";
            inputTag.placeholder = "Limite de 8 tags atingido!";
            inputTag.classList.add("limite-atingido");
            return;
        }

        const tag = document.createElement("div");
        tag.classList.add("tag");
        tag.textContent = texto;

        areaTags.appendChild(tag);
        inputTag.value = "";
        quantidadeTags++;

        atualizarAltura();
    }
});

function atualizarAltura() {
    const alturaInicial = 200;
    const reducao = 20;

    const novaAltura = Math.max(
        120,
        alturaInicial - quantidadeTags * reducao
    );

    opiniao.style.height = novaAltura + "px";
}


