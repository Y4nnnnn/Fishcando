const areaFilmes = document.querySelector(".filmes");
const todosOsFilmes = document.querySelectorAll(".filmes");

function mostrarAvaliacoes() {
    if (!areaFilmes) return;

    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};
    const lista = Object.values(avaliacoes);

    const total = document.querySelector(".total");
    if (total) {
        total.textContent = `TOTAL: ${lista.length}`;
    }

    todosOsFilmes.forEach((area) => area.innerHTML = "");

    lista.forEach((avaliacao, indice) => {
        const filme = document.createElement("div");
        filme.classList.add("filme");

        filme.innerHTML = `
            <img src="${avaliacao.poster}" alt="${avaliacao.titulo}">
            <div class="nota">★ ${avaliacao.nota || 0}</div>
        `;

        filme.addEventListener("click", () => {
            localStorage.setItem("filmeSelecionado", avaliacao.titulo);
            window.location.href = "avali.html";
        });

        const area = todosOsFilmes[Math.floor(indice / 4)] || todosOsFilmes[todosOsFilmes.length - 1];
        if (area) area.appendChild(filme);
    });
}

mostrarAvaliacoes();


