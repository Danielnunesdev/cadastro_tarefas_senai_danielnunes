document.addEventListener("DOMContentLoaded", function () {
    const campoTarefa = document.getElementById("campo-tarefa");
    const botaoAdicionar = document.getElementById("botao-adicionar");
    const botaoTema = document.getElementById("botao-tema");
    const botaoAjuda = document.getElementById("botao-ajuda");
    const listaTarefas = document.getElementById("lista-tarefas");
    const contador = document.getElementById("contador-tarefas");
    const botaoLimparTodas = document.getElementById("botao-limpar-todas");
    const botoesFiltro = document.querySelectorAll(".botao-filtro");

    // Carregar tarefas salvas no navegador
    let tarefas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
    let filtroAtual = "todas";

    // Salvar tarefas no navegador
    function salvarTarefas() {
        localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
    }

    // Mostrar tarefas na tela conforme o filtro selecionado
    function renderizarTarefas() {
        listaTarefas.innerHTML = "";

        const tarefasFiltradas = tarefas.filter(function (item) {
            if (filtroAtual === "pendentes") return !item.concluida;
            if (filtroAtual === "concluidas") return item.concluida;
            return true;
        });

        tarefasFiltradas.forEach(function (item) {
            const tarefa = document.createElement("li");
            tarefa.className = "item-tarefa";

            if (item.concluida) {
                tarefa.classList.add("concluida");
            }

            const texto = document.createElement("span");
            texto.textContent = item.texto;

            const acoes = document.createElement("div");
            acoes.className = "acoes-tarefa";

            // Botão concluir
            const concluir = document.createElement("button");
            concluir.className = "botao-acao";
            concluir.type = "button";
            concluir.innerHTML = '<i class="fa-solid fa-check"></i>';
            concluir.title = item.concluida ? "Desmarcar tarefa" : "Concluir tarefa";

            concluir.addEventListener("click", function () {
                item.concluida = !item.concluida;
                salvarTarefas();
                renderizarTarefas();
            });

            // Botão excluir
            const excluir = document.createElement("button");
            excluir.className = "botao-acao excluir";
            excluir.type = "button";
            excluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
            excluir.title = "Excluir tarefa";

            excluir.addEventListener("click", function () {
                tarefas = tarefas.filter(function (t) {
                    return t.id !== item.id;
                });

                salvarTarefas();
                renderizarTarefas();
            });

            acoes.append(concluir, excluir);
            tarefa.append(texto, acoes);
            listaTarefas.appendChild(tarefa);
        });

        // Atualizar contador de tarefas
        const total = tarefas.length;
        const pendentes = tarefas.filter(t => !t.concluida).length;

        if (total === 0) {
            contador.textContent = "0 tarefas na lista";
        } else {
            contador.textContent =
                `${pendentes} ${pendentes === 1 ? "tarefa pendente" : "tarefas pendentes"} (${total} no total)`;
        }
    }

    // Adicionar nova tarefa
    function adicionarTarefa() {
        const texto = campoTarefa.value.trim();

        if (texto === "") {
            campoTarefa.focus();
            return;
        }

        tarefas.push({
            id: Date.now() + Math.random(),
            texto: texto,
            concluida: false
        });

        salvarTarefas();
        renderizarTarefas();

        campoTarefa.value = "";
        campoTarefa.focus();
    }

    // FUNÇÃO 1: Limpar todas as tarefas
    if (botaoLimparTodas) {
        botaoLimparTodas.addEventListener("click", function () {
            if (tarefas.length === 0) return;

            if (confirm("Tem certeza de que deseja apagar todas as tarefas?")) {
                tarefas = [];
                salvarTarefas();
                renderizarTarefas();
            }
        });
    }

    // FUNÇÃO 2: Filtrar tarefas
    botoesFiltro.forEach(function (botao) {
        botao.addEventListener("click", function () {
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            botao.classList.add("ativo");

            filtroAtual = botao.getAttribute("data-filtro");
            renderizarTarefas();
        });
    });

    // FUNÇÃO 3: Botão de Ajuda (Alerta com as alterações)
    if (botaoAjuda) {
        botaoAjuda.addEventListener("click", function () {
            alert(
                "📌 Funcionalidades Adicionadas:\n\n" +
                "1. 🔍 Filtro de Tarefas: Agora você pode alternar visualmente entre as concluidas e as pendentes'.\n\n" +
                "2. 🗑️ Limpar Todas: Um novo botão no rodapé permite apagar toda a lista"
            );
        });
    }

    // Eventos
    botaoAdicionar.addEventListener("click", adicionarTarefa);

    campoTarefa.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            adicionarTarefa();
        }
    });

    // Modo escuro
    if (botaoTema) {
        botaoTema.addEventListener("click", function () {
            document.body.classList.toggle("modo-escuro");

            const escuro = document.body.classList.contains("modo-escuro");
            const icone = botaoTema.querySelector("i");

            if (icone) {
                icone.classList.toggle("fa-moon", !escuro);
                icone.classList.toggle("fa-sun", escuro);
            }

            localStorage.setItem("modoEscuro", escuro);
        });
    }

    if (localStorage.getItem("modoEscuro") === "true") {
        document.body.classList.add("modo-escuro");

        const icone = botaoTema?.querySelector("i");

        if (icone) {
            icone.classList.replace("fa-moon", "fa-sun");
        }
    }

    renderizarTarefas();
});