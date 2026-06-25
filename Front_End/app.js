const API_URL = "http://localhost:8080";

// =========================
// ELEMENTOS: AUTENTICAÇÃO
// =========================

const secaoLogin = document.getElementById("secaoLogin");
const formularioLogin = document.getElementById("formularioLogin");
const campoLogin = document.getElementById("login");
const campoSenha = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");
const botaoLogout = document.getElementById("botaoLogout");
const areaSistema = document.getElementById("areaSistema");
const informacoesUsuario = document.getElementById("informacoesUsuario");

// =========================
// ELEMENTOS: CADASTRO PÚBLICO
// =========================

const secaoCadastro = document.getElementById("secaoCadastro");
const botaoMostrarCadastro = document.getElementById("botaoMostrarCadastro");
const botaoVoltarLogin = document.getElementById("botaoVoltarLogin");
const formularioCadastroPublico = document.getElementById(
    "formularioCadastroPublico"
);
const cadastroNome = document.getElementById("cadastroNome");
const cadastroEmail = document.getElementById("cadastroEmail");
const cadastroSenha = document.getElementById("cadastroSenha");
const mensagemCadastro = document.getElementById("mensagemCadastro");

// =========================
// ELEMENTOS: RECURSOS
// =========================

const botaoCarregarRecursos = document.getElementById(
    "botaoCarregarRecursos"
);
const listaRecursos = document.getElementById("listaRecursos");

// =========================
// ELEMENTOS: RESERVAS DO USUÁRIO
// =========================

const formularioReserva = document.getElementById("formularioReserva");
const campoRecursoId = document.getElementById("recursoId");
const campoInicio = document.getElementById("inicio");
const campoFim = document.getElementById("fim");
const campoQuantidadeParticipantes = document.getElementById(
    "quantidadeParticipantes"
);
const campoJustificativa = document.getElementById("justificativa");
const mensagemReserva = document.getElementById("mensagemReserva");
const botaoCarregarReservas = document.getElementById(
    "botaoCarregarReservas"
);
const listaReservas = document.getElementById("listaReservas");

// =========================
// ELEMENTOS: PAINEL ADMINISTRATIVO
// =========================

const secaoAdmin = document.getElementById("secaoAdmin");
const botaoCarregarTodasReservas = document.getElementById(
    "botaoCarregarTodasReservas"
);
const listaReservasAdmin = document.getElementById("listaReservasAdmin");

const formularioUsuario = document.getElementById("formularioUsuario");
const novoUsuarioNome = document.getElementById("novoUsuarioNome");
const novoUsuarioEmail = document.getElementById("novoUsuarioEmail");
const novoUsuarioSenha = document.getElementById("novoUsuarioSenha");
const mensagemUsuario = document.getElementById("mensagemUsuario");
const botaoCarregarUsuarios = document.getElementById(
    "botaoCarregarUsuarios"
);
const listaUsuarios = document.getElementById("listaUsuarios");

// =========================
// DADOS DA SESSÃO
// =========================

let credencialBasic = sessionStorage.getItem("credencialBasic");
let emailUsuario = sessionStorage.getItem("emailUsuario");
let perfilUsuario = sessionStorage.getItem("perfilUsuario") ?? "USUARIO";
let reservasOcultas = new Set();

function obterChaveReservasOcultas() {
    return emailUsuario
        ? ("reservasOcultas:" + (emailUsuario.toLowerCase()))
        : "reservasOcultas:anonimo";
}

function carregarReservasOcultas() {
    try {
        const ids = JSON.parse(
            sessionStorage.getItem(obterChaveReservasOcultas()) ?? "[]"
        );

        reservasOcultas = new Set(
            Array.isArray(ids) ? ids.map(String) : []
        );
    } catch (erro) {
        console.error("Erro ao recuperar reservas ocultas:", erro);
        reservasOcultas = new Set();
    }
}

function salvarReservasOcultas() {
    sessionStorage.setItem(
        obterChaveReservasOcultas(),
        JSON.stringify(Array.from(reservasOcultas))
    );
}

// =========================
// FUNÇÕES GERAIS
// =========================

function codificarBase64Utf8(valor) {
    const bytes = new TextEncoder().encode(valor);
    let textoBinario = "";

    bytes.forEach(function (byte) {
        textoBinario += String.fromCharCode(byte);
    });

    return btoa(textoBinario);
}

async function fazerRequisicao(endpoint, opcoes = {}) {
    const headers = {
        ...opcoes.headers
    };

    if (credencialBasic) {
        headers.Authorization = ("Basic " + (credencialBasic));
    }

    if (opcoes.body && !(opcoes.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    return fetch(("" + (API_URL) + (endpoint)), {
        ...opcoes,
        headers
    });
}

async function obterMensagemErro(resposta) {
    try {
        const erro = await resposta.json();

        if (erro.detail) {
            return erro.detail;
        }

        if (erro.message) {
            return erro.message;
        }

        if (erro.title) {
            return erro.title;
        }

        if (erro.errors && typeof erro.errors === "object") {
            return Object.values(erro.errors).join(" ");
        }
    } catch (erroLeitura) {
        console.error("Não foi possível interpretar o erro:", erroLeitura);
    }

    return ("Erro " + (resposta.status) + ".");
}

function escaparHTML(valor) {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatarData(data) {
    if (!data) {
        return "Não informada";
    }

    const objetoData = new Date(data);

    if (Number.isNaN(objetoData.getTime())) {
        return data;
    }

    return objetoData.toLocaleString("pt-BR");
}

function normalizarDataHora(valor) {
    if (!valor) {
        return valor;
    }

    return valor.length === 16 ? ("" + (valor) + ":00") : valor;
}

function obterClasseStatus(status) {
    const classes = {
        PENDENTE: "pendente",
        APROVADA: "aprovada",
        REJEITADA: "rejeitada",
        CANCELADA: "cancelada"
    };

    return classes[String(status).toUpperCase()] ?? "pendente";
}

function definirMensagem(elemento, texto, classe = "") {
    if (!elemento) {
        return;
    }

    elemento.textContent = texto;
    elemento.className = ("mensagem " + (classe));
}

function mostrarMensagemLogin(texto, classe = "") {
    definirMensagem(mensagemLogin, texto, classe);
}

function mostrarMensagemCadastro(texto, classe = "") {
    definirMensagem(mensagemCadastro, texto, classe);
}

function mostrarMensagemReserva(texto, classe = "") {
    definirMensagem(mensagemReserva, texto, classe);
}

function mostrarMensagemUsuario(texto, classe = "") {
    definirMensagem(mensagemUsuario, texto, classe);
}

// =========================
// NAVEGAÇÃO ENTRE TELAS
// =========================

function mostrarLogin() {
    secaoLogin.classList.remove("oculto");
    secaoCadastro.classList.add("oculto");
    areaSistema.classList.add("oculto");
    botaoLogout.classList.add("oculto");
}

function mostrarCadastroPublico() {
    secaoLogin.classList.add("oculto");
    secaoCadastro.classList.remove("oculto");
    areaSistema.classList.add("oculto");
    botaoLogout.classList.add("oculto");

    mostrarMensagemCadastro("");
}

function mostrarSistema() {
    secaoLogin.classList.add("oculto");
    secaoCadastro.classList.add("oculto");
    areaSistema.classList.remove("oculto");
    botaoLogout.classList.remove("oculto");

    informacoesUsuario.textContent = ("Usuário conectado: " + (emailUsuario));
}

// =========================
// LOGIN
// =========================

async function processarLogin(evento) {
    evento.preventDefault();

    const email = campoLogin.value.trim();
    const senha = campoSenha.value;

    if (!email || !senha) {
        mostrarMensagemLogin(
            "Informe o e-mail e a senha.",
            "mensagem-erro"
        );
        return;
    }

    credencialBasic = codificarBase64Utf8(("" + (email) + ":" + (senha)));
    mostrarMensagemLogin("Verificando credenciais...");

    try {
        const resposta = await fazerRequisicao("/api/recursos", {
            method: "GET"
        });

        if (resposta.status === 401) {
            credencialBasic = null;
            mostrarMensagemLogin(
                "E-mail ou senha inválidos.",
                "mensagem-erro"
            );
            return;
        }

        if (resposta.status === 403) {
            credencialBasic = null;
            mostrarMensagemLogin(
                "Usuário sem permissão para acessar o sistema.",
                "mensagem-erro"
            );
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            credencialBasic = null;
            mostrarMensagemLogin(mensagemErro, "mensagem-erro");
            return;
        }

        const recursos = await resposta.json();

        emailUsuario = email;
        perfilUsuario = "USUARIO";

        sessionStorage.setItem("credencialBasic", credencialBasic);
        sessionStorage.setItem("emailUsuario", emailUsuario);
        sessionStorage.setItem("perfilUsuario", perfilUsuario);

        carregarReservasOcultas();
        mostrarMensagemLogin("");
        mostrarSistema();
        exibirRecursos(recursos);

        await carregarReservas();
        await verificarPerfilAdministrador();
    } catch (erro) {
        console.error("Erro de conexão durante o login:", erro);
        credencialBasic = null;

        mostrarMensagemLogin(
            "Não foi possível conectar ao back-end.",
            "mensagem-erro"
        );
    }
}

// =========================
// CADASTRO PÚBLICO
// =========================

async function cadastrarUsuarioPublico(evento) {
    evento.preventDefault();

    const nome = cadastroNome.value.trim();
    const email = cadastroEmail.value.trim();
    const senha = cadastroSenha.value;

    if (!nome || !email || !senha) {
        mostrarMensagemCadastro(
            "Preencha todos os campos.",
            "mensagem-erro"
        );
        return;
    }

    if (senha.length < 8) {
        mostrarMensagemCadastro(
            "A senha deve possuir pelo menos 8 caracteres.",
            "mensagem-erro"
        );
        return;
    }

    mostrarMensagemCadastro("Criando conta...");

    try {
        const resposta = await fetch(("" + (API_URL) + "/api/usuarios"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            mostrarMensagemCadastro(mensagemErro, "mensagem-erro");
            return;
        }

        const usuarioCriado = await resposta.json();

        formularioCadastroPublico.reset();
        campoLogin.value = usuarioCriado.email;
        mostrarLogin();
        mostrarMensagemLogin(
            ("Conta de " + (usuarioCriado.nome) + " criada. Informe a senha para entrar."),
            "mensagem-sucesso"
        );
    } catch (erro) {
        console.error("Erro ao criar conta pública:", erro);
        mostrarMensagemCadastro(
            "Não foi possível conectar ao back-end.",
            "mensagem-erro"
        );
    }
}

// =========================
// RECURSOS
// =========================

async function carregarRecursos() {
    listaRecursos.innerHTML = "<p>Carregando recursos...</p>";

    try {
        const resposta = await fazerRequisicao("/api/recursos", {
            method: "GET"
        });

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            listaRecursos.innerHTML = ("\n                <p class=\"mensagem-erro\">\n                    " + (escaparHTML(mensagemErro)) + "\n                </p>\n            ");
            return;
        }

        const recursos = await resposta.json();
        exibirRecursos(recursos);
    } catch (erro) {
        console.error("Erro ao carregar recursos:", erro);
        listaRecursos.innerHTML = ("\n            <p class=\"mensagem-erro\">\n                Não foi possível conectar ao back-end.\n            </p>\n        ");
    }
}

function preencherSelectRecursos(recursos) {
    campoRecursoId.innerHTML = ("\n        <option value=\"\">Selecione um recurso</option>\n    ");

    if (!Array.isArray(recursos)) {
        return;
    }

    recursos.forEach(function (recurso) {
        const opcao = document.createElement("option");
        opcao.value = recurso.id;
        opcao.textContent = recurso.nome ?? ("Recurso " + (recurso.id));
        campoRecursoId.appendChild(opcao);
    });
}

function exibirRecursos(recursos) {
    preencherSelectRecursos(recursos);

    if (!Array.isArray(recursos) || recursos.length === 0) {
        listaRecursos.innerHTML = "<p>Nenhum recurso encontrado.</p>";
        return;
    }

    listaRecursos.innerHTML = recursos
        .map(function (recurso) {
            return ("\n                <article class=\"item-lista\">\n                    <h3>" + (escaparHTML(recurso.nome ?? "Recurso sem nome")) + "</h3>\n\n                    <p>\n                        <strong>ID:</strong>\n                        " + (escaparHTML(recurso.id ?? "Não informado")) + "\n                    </p>\n\n                    <p>\n                        <strong>Tipo:</strong>\n                        " + (escaparHTML(recurso.tipo ?? "Não informado")) + "\n                    </p>\n\n                    <p>\n                        <strong>Descrição:</strong>\n                        " + (escaparHTML(recurso.descricao ?? "Não informada")) + "\n                    </p>\n\n                    <p>\n                        <strong>Status:</strong>\n                        " + (escaparHTML(recurso.status ?? "Não informado")) + "\n                    </p>\n                </article>\n            ");
        })
        .join("");
}

// =========================
// CRIAÇÃO DE RESERVA
// =========================

async function criarReserva(evento) {
    evento.preventDefault();

    const recursoId = Number(campoRecursoId.value);
    const inicioOriginal = campoInicio.value;
    const fimOriginal = campoFim.value;
    const quantidadeParticipantes = Number(
        campoQuantidadeParticipantes.value
    );
    const justificativa = campoJustificativa.value.trim();

    if (!recursoId) {
        mostrarMensagemReserva("Selecione um recurso.", "mensagem-erro");
        return;
    }

    if (!inicioOriginal || !fimOriginal) {
        mostrarMensagemReserva(
            "Informe as datas de início e fim.",
            "mensagem-erro"
        );
        return;
    }

    const dataInicio = new Date(inicioOriginal);
    const dataFim = new Date(fimOriginal);
    const agora = new Date();

    if (dataInicio <= agora) {
        mostrarMensagemReserva(
            "A data de início deve estar no futuro.",
            "mensagem-erro"
        );
        return;
    }

    if (dataFim <= dataInicio) {
        mostrarMensagemReserva(
            "A data final deve ser posterior à data inicial.",
            "mensagem-erro"
        );
        return;
    }

    if (
        !Number.isInteger(quantidadeParticipantes) ||
        quantidadeParticipantes <= 0
    ) {
        mostrarMensagemReserva(
            "A quantidade de participantes deve ser maior que zero.",
            "mensagem-erro"
        );
        return;
    }

    const novaReserva = {
        recursoId,
        inicio: normalizarDataHora(inicioOriginal),
        fim: normalizarDataHora(fimOriginal),
        quantidadeParticipantes,
        justificativa
    };

    mostrarMensagemReserva("Criando reserva...");

    try {
        const resposta = await fazerRequisicao("/api/reservas", {
            method: "POST",
            body: JSON.stringify(novaReserva)
        });

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (resposta.status === 403) {
            mostrarMensagemReserva(
                "Você não possui permissão para criar reservas.",
                "mensagem-erro"
            );
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            mostrarMensagemReserva(mensagemErro, "mensagem-erro");
            return;
        }

        const reservaCriada = await resposta.json();

        mostrarMensagemReserva(
            ("Reserva " + (reservaCriada.id) + " criada com sucesso. ") +
            ("Status: " + (reservaCriada.status) + "."),
            "mensagem-sucesso"
        );

        formularioReserva.reset();
        await carregarReservas();

        if (perfilUsuario === "ADMIN") {
            await carregarTodasReservas();
        }
    } catch (erro) {
        console.error("Erro ao criar reserva:", erro);
        mostrarMensagemReserva(
            "Não foi possível conectar ao back-end.",
            "mensagem-erro"
        );
    }
}

// =========================
// RESERVAS DO USUÁRIO
// =========================

async function carregarReservas() {
    listaReservas.innerHTML = "<p>Carregando reservas...</p>";

    try {
        const resposta = await fazerRequisicao("/api/reservas/minhas", {
            method: "GET"
        });

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            listaReservas.innerHTML = ("\n                <p class=\"mensagem-erro\">\n                    " + (escaparHTML(mensagemErro)) + "\n                </p>\n            ");
            return;
        }

        const reservas = await resposta.json();
        exibirReservas(reservas);
    } catch (erro) {
        console.error("Erro ao carregar reservas:", erro);
        listaReservas.innerHTML = ("\n            <p class=\"mensagem-erro\">\n                Não foi possível conectar ao back-end.\n            </p>\n        ");
    }
}

function exibirReservas(reservas) {
    if (!Array.isArray(reservas)) {
        listaReservas.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
        return;
    }

    const reservasVisiveis = reservas.filter(function (reserva) {
        return !reservasOcultas.has(String(reserva.id));
    });

    if (reservasVisiveis.length === 0) {
        listaReservas.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
        return;
    }

    listaReservas.innerHTML = reservasVisiveis
        .map(function (reserva) {
            const status = String(
                reserva.status ?? "PENDENTE"
            ).toUpperCase();
            const classeStatus = obterClasseStatus(status);

            const botaoOcultar = status === "CANCELADA"
                ? ("\n                    <div class=\"acoes-reserva\">\n                        <button\n                            type=\"button\"\n                            class=\"botao-excluir-reserva\"\n                            data-id=\"" + (escaparHTML(reserva.id)) + "\"\n                        >\n                            Excluir da tela\n                        </button>\n                    </div>\n                ")
                : "";

            return ("\n                <article\n                    class=\"item-lista reserva-" + (classeStatus) + "\"\n                    data-reserva-id=\"" + (escaparHTML(reserva.id)) + "\"\n                >\n                    <h3>\n                        " + (escaparHTML(
                            reserva.recursoNome ?? "Recurso não informado"
                        )) + "\n                    </h3>\n\n                    <p>\n                        <strong>ID da reserva:</strong>\n                        " + (escaparHTML(reserva.id)) + "\n                    </p>\n\n                    <p>\n                        <strong>Usuário:</strong>\n                        " + (escaparHTML(reserva.usuarioNome ?? emailUsuario)) + "\n                    </p>\n\n                    <p>\n                        <strong>Início:</strong>\n                        " + (escaparHTML(formatarData(reserva.inicio))) + "\n                    </p>\n\n                    <p>\n                        <strong>Fim:</strong>\n                        " + (escaparHTML(formatarData(reserva.fim))) + "\n                    </p>\n\n                    <p>\n                        <strong>Participantes:</strong>\n                        " + (escaparHTML(
                            reserva.quantidadeParticipantes ?? "Não informado"
                        )) + "\n                    </p>\n\n                    <p>\n                        <strong>Justificativa:</strong>\n                        " + (escaparHTML(
                            reserva.justificativa ?? "Não informada"
                        )) + "\n                    </p>\n\n                    <p>\n                        <strong>Status:</strong>\n                        <span class=\"status-reserva status-" + (classeStatus) + "\">\n                            " + (escaparHTML(status)) + "\n                        </span>\n                    </p>\n\n                    " + (botaoOcultar) + "\n                </article>\n            ");
        })
        .join("");
}

function ocultarReservaCancelada(evento) {
    const botao = evento.target.closest(".botao-excluir-reserva");

    if (!botao) {
        return;
    }

    const reservaId = String(botao.dataset.id);
    const confirmou = window.confirm(
        "Deseja remover esta reserva cancelada da tela?"
    );

    if (!confirmou) {
        return;
    }

    reservasOcultas.add(reservaId);
    salvarReservasOcultas();

    const cartao = botao.closest(".item-lista");

    if (cartao) {
        cartao.remove();
    }

    if (listaReservas.querySelectorAll(".item-lista").length === 0) {
        listaReservas.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
    }
}

// =========================
// DETECÇÃO DO PERFIL ADMINISTRATIVO
// =========================

async function verificarPerfilAdministrador() {
    try {
        const resposta = await fazerRequisicao("/api/reservas", {
            method: "GET"
        });

        if (resposta.status === 200) {
            perfilUsuario = "ADMIN";
            sessionStorage.setItem("perfilUsuario", perfilUsuario);

            secaoAdmin.classList.remove("oculto");
            informacoesUsuario.textContent =
                ("Usuário conectado: " + (emailUsuario) + " — Administrador");

            const reservas = await resposta.json();
            exibirReservasAdmin(reservas);
            await carregarUsuarios();
            return;
        }

        perfilUsuario = "USUARIO";
        sessionStorage.setItem("perfilUsuario", perfilUsuario);
        secaoAdmin.classList.add("oculto");
        informacoesUsuario.textContent =
            ("Usuário conectado: " + (emailUsuario));

        if (resposta.status === 401) {
            realizarLogout();
        }
    } catch (erro) {
        console.error("Erro ao verificar perfil administrativo:", erro);
        perfilUsuario = "USUARIO";
        secaoAdmin.classList.add("oculto");
    }
}

// =========================
// RESERVAS ADMINISTRATIVAS
// =========================

async function carregarTodasReservas() {
    listaReservasAdmin.innerHTML =
        "<p>Carregando todas as reservas...</p>";

    try {
        const resposta = await fazerRequisicao("/api/reservas", {
            method: "GET"
        });

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (resposta.status === 403) {
            secaoAdmin.classList.add("oculto");
            window.alert("Esta função é exclusiva para administradores.");
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            listaReservasAdmin.innerHTML = ("\n                <p class=\"mensagem-erro\">\n                    " + (escaparHTML(mensagemErro)) + "\n                </p>\n            ");
            return;
        }

        const reservas = await resposta.json();
        exibirReservasAdmin(reservas);
    } catch (erro) {
        console.error("Erro ao carregar reservas administrativas:", erro);
        listaReservasAdmin.innerHTML = ("\n            <p class=\"mensagem-erro\">\n                Não foi possível conectar ao back-end.\n            </p>\n        ");
    }
}

function exibirReservasAdmin(reservas) {
    if (!Array.isArray(reservas) || reservas.length === 0) {
        listaReservasAdmin.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
        return;
    }

    listaReservasAdmin.innerHTML = reservas
        .map(function (reserva) {
            const status = String(
                reserva.status ?? "PENDENTE"
            ).toUpperCase();
            const classeStatus = obterClasseStatus(status);

            const acoes = status === "PENDENTE"
                ? ("\n                    <div class=\"acoes-reserva\">\n                        <button\n                            type=\"button\"\n                            class=\"botao-aprovar-reserva\"\n                            data-id=\"" + (escaparHTML(reserva.id)) + "\"\n                        >\n                            Aprovar\n                        </button>\n\n                        <button\n                            type=\"button\"\n                            class=\"botao-rejeitar-reserva\"\n                            data-id=\"" + (escaparHTML(reserva.id)) + "\"\n                        >\n                            Rejeitar\n                        </button>\n                    </div>\n                ")
                : "";

            return ("\n                <article class=\"item-lista reserva-" + (classeStatus) + "\">\n                    <h3>\n                        " + (escaparHTML(
                            reserva.recursoNome ?? "Recurso não informado"
                        )) + "\n                    </h3>\n\n                    <p><strong>ID:</strong> " + (escaparHTML(reserva.id)) + "</p>\n\n                    <p>\n                        <strong>Usuário:</strong>\n                        " + (escaparHTML(
                            reserva.usuarioNome ?? "Não informado"
                        )) + "\n                    </p>\n\n                    <p>\n                        <strong>E-mail:</strong>\n                        " + (escaparHTML(
                            reserva.usuarioEmail ?? "Não informado"
                        )) + "\n                    </p>\n\n                    <p>\n                        <strong>Início:</strong>\n                        " + (escaparHTML(formatarData(reserva.inicio))) + "\n                    </p>\n\n                    <p>\n                        <strong>Fim:</strong>\n                        " + (escaparHTML(formatarData(reserva.fim))) + "\n                    </p>\n\n                    <p>\n                        <strong>Participantes:</strong>\n                        " + (escaparHTML(
                            reserva.quantidadeParticipantes ?? "Não informado"
                        )) + "\n                    </p>\n\n                    <p>\n                        <strong>Justificativa:</strong>\n                        " + (escaparHTML(
                            reserva.justificativa ?? "Não informada"
                        )) + "\n                    </p>\n\n                    <p>\n                        <strong>Status:</strong>\n                        <span class=\"status-reserva status-" + (classeStatus) + "\">\n                            " + (escaparHTML(status)) + "\n                        </span>\n                    </p>\n\n                    " + (acoes) + "\n                </article>\n            ");
        })
        .join("");
}

async function tratarAcaoReservaAdmin(evento) {
    const botaoAprovar = evento.target.closest(".botao-aprovar-reserva");
    const botaoRejeitar = evento.target.closest(".botao-rejeitar-reserva");

    if (botaoAprovar) {
        await alterarStatusReserva(botaoAprovar.dataset.id, "aprovar");
        return;
    }

    if (botaoRejeitar) {
        await alterarStatusReserva(botaoRejeitar.dataset.id, "rejeitar");
    }
}

async function alterarStatusReserva(reservaId, acao) {
    const verbo = acao === "aprovar" ? "aprovar" : "rejeitar";
    const confirmou = window.confirm(
        ("Deseja realmente " + (verbo) + " a reserva " + (reservaId) + "?")
    );

    if (!confirmou) {
        return;
    }

    try {
        const resposta = await fazerRequisicao(
            ("/api/reservas/" + (reservaId) + "/" + (acao)),
            { method: "PATCH" }
        );

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (resposta.status === 403) {
            window.alert("Apenas administradores podem realizar esta ação.");
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            window.alert(mensagemErro);
            return;
        }

        const reservaAtualizada = await resposta.json();

        window.alert(
            ("Reserva " + (reservaAtualizada.id) + " atualizada para ") +
            ("" + (reservaAtualizada.status) + ".")
        );

        await carregarTodasReservas();
        await carregarReservas();
    } catch (erro) {
        console.error("Erro ao alterar status da reserva:", erro);
        window.alert("Não foi possível conectar ao back-end.");
    }
}

// =========================
// CRIAÇÃO ADMINISTRATIVA DE CONTA
// =========================

async function cadastrarUsuarioPeloAdmin(evento) {
    evento.preventDefault();

    const nome = novoUsuarioNome.value.trim();
    const email = novoUsuarioEmail.value.trim();
    const senha = novoUsuarioSenha.value;

    if (!nome || !email || !senha) {
        mostrarMensagemUsuario(
            "Preencha todos os campos.",
            "mensagem-erro"
        );
        return;
    }

    if (senha.length < 8) {
        mostrarMensagemUsuario(
            "A senha deve possuir pelo menos 8 caracteres.",
            "mensagem-erro"
        );
        return;
    }

    mostrarMensagemUsuario("Criando conta...");

    try {
        const resposta = await fazerRequisicao("/api/usuarios", {
            method: "POST",
            body: JSON.stringify({ nome, email, senha })
        });

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            mostrarMensagemUsuario(mensagemErro, "mensagem-erro");
            return;
        }

        const usuarioCriado = await resposta.json();

        mostrarMensagemUsuario(
            ("Conta de " + (usuarioCriado.nome) + " criada com sucesso."),
            "mensagem-sucesso"
        );

        formularioUsuario.reset();
        await carregarUsuarios();
    } catch (erro) {
        console.error("Erro ao criar usuário pelo admin:", erro);
        mostrarMensagemUsuario(
            "Não foi possível conectar ao back-end.",
            "mensagem-erro"
        );
    }
}

// =========================
// USUÁRIOS ADMINISTRATIVOS
// =========================

async function carregarUsuarios() {
    listaUsuarios.innerHTML = "<p>Carregando usuários...</p>";

    try {
        const resposta = await fazerRequisicao("/api/usuarios", {
            method: "GET"
        });

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (resposta.status === 403) {
            listaUsuarios.innerHTML = ("\n                <p class=\"mensagem-erro\">\n                    Apenas administradores podem visualizar os usuários.\n                </p>\n            ");
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            listaUsuarios.innerHTML = ("\n                <p class=\"mensagem-erro\">\n                    " + (escaparHTML(mensagemErro)) + "\n                </p>\n            ");
            return;
        }

        const usuarios = await resposta.json();
        exibirUsuarios(usuarios);
    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
        listaUsuarios.innerHTML = ("\n            <p class=\"mensagem-erro\">\n                Não foi possível conectar ao back-end.\n            </p>\n        ");
    }
}

function exibirUsuarios(usuarios) {
    if (!Array.isArray(usuarios) || usuarios.length === 0) {
        listaUsuarios.innerHTML = "<p>Nenhum usuário encontrado.</p>";
        return;
    }

    listaUsuarios.innerHTML = usuarios
        .map(function (usuario) {
            const estaAtivo = usuario.ativo === true;
            const emailDaContaAtual = String(emailUsuario).toLowerCase();
            const emailDoUsuario = String(usuario.email).toLowerCase();

            const botaoExcluir = estaAtivo && emailDoUsuario !== emailDaContaAtual
                ? ("\n                    <div class=\"acoes-reserva\">\n                        <button\n                            type=\"button\"\n                            class=\"botao-excluir-usuario\"\n                            data-id=\"" + (escaparHTML(usuario.id)) + "\"\n                            data-nome=\"" + (escaparHTML(usuario.nome)) + "\"\n                        >\n                            Desativar conta\n                        </button>\n                    </div>\n                ")
                : "";

            return ("\n                <article class=\"item-lista usuario-card\">\n                    <h3>" + (escaparHTML(usuario.nome)) + "</h3>\n\n                    <p><strong>ID:</strong> " + (escaparHTML(usuario.id)) + "</p>\n\n                    <p>\n                        <strong>E-mail:</strong>\n                        " + (escaparHTML(usuario.email)) + "\n                    </p>\n\n                    <p>\n                        <strong>Perfil:</strong>\n                        " + (escaparHTML(usuario.perfil)) + "\n                    </p>\n\n                    <p>\n                        <strong>Status:</strong>\n                        <span class=\"status-usuario " + (estaAtivo ? "usuario-ativo" : "usuario-inativo") + "\">\n                            " + (estaAtivo ? "ATIVO" : "INATIVO") + "\n                        </span>\n                    </p>\n\n                    " + (botaoExcluir) + "\n                </article>\n            ");
        })
        .join("");
}

async function tratarExclusaoUsuario(evento) {
    const botao = evento.target.closest(".botao-excluir-usuario");

    if (!botao) {
        return;
    }

    const usuarioId = botao.dataset.id;
    const usuarioNome = botao.dataset.nome;
    const confirmou = window.confirm(
        ("Deseja realmente desativar a conta de " + (usuarioNome) + "?")
    );

    if (!confirmou) {
        return;
    }

    await excluirUsuario(usuarioId);
}

async function excluirUsuario(usuarioId) {
    try {
        const resposta = await fazerRequisicao(
            ("/api/usuarios/" + (usuarioId)),
            { method: "DELETE" }
        );

        if (resposta.status === 401) {
            realizarLogout();
            return;
        }

        if (resposta.status === 403) {
            window.alert("Apenas administradores podem desativar contas.");
            return;
        }

        if (!resposta.ok) {
            const mensagemErro = await obterMensagemErro(resposta);
            window.alert(mensagemErro);
            return;
        }

        window.alert("Conta desativada com sucesso.");
        await carregarUsuarios();
    } catch (erro) {
        console.error("Erro ao desativar usuário:", erro);
        window.alert("Não foi possível conectar ao back-end.");
    }
}

// =========================
// LOGOUT
// =========================

function realizarLogout() {
    credencialBasic = null;
    emailUsuario = null;
    perfilUsuario = "USUARIO";
    reservasOcultas = new Set();

    sessionStorage.removeItem("credencialBasic");
    sessionStorage.removeItem("emailUsuario");
    sessionStorage.removeItem("perfilUsuario");

    formularioLogin.reset();
    formularioCadastroPublico.reset();
    formularioReserva.reset();
    formularioUsuario.reset();

    secaoAdmin.classList.add("oculto");

    listaRecursos.innerHTML = "<p>Nenhum recurso carregado.</p>";
    listaReservas.innerHTML = "<p>Nenhuma reserva carregada.</p>";
    listaReservasAdmin.innerHTML = "<p>Nenhuma reserva carregada.</p>";
    listaUsuarios.innerHTML = "<p>Nenhum usuário carregado.</p>";

    campoRecursoId.innerHTML = ("\n        <option value=\"\">Selecione um recurso</option>\n    ");

    mostrarMensagemLogin("");
    mostrarMensagemCadastro("");
    mostrarMensagemReserva("");
    mostrarMensagemUsuario("");
    mostrarLogin();
}

// =========================
// REGISTRO DOS EVENTOS
// =========================

function registrarEventos() {
    formularioLogin.addEventListener("submit", processarLogin);
    formularioCadastroPublico.addEventListener(
        "submit",
        cadastrarUsuarioPublico
    );
    formularioReserva.addEventListener("submit", criarReserva);
    formularioUsuario.addEventListener(
        "submit",
        cadastrarUsuarioPeloAdmin
    );

    botaoMostrarCadastro.addEventListener("click", mostrarCadastroPublico);

    botaoVoltarLogin.addEventListener("click", function () {
        formularioCadastroPublico.reset();
        mostrarMensagemCadastro("");
        mostrarLogin();
    });

    botaoLogout.addEventListener("click", realizarLogout);
    botaoCarregarRecursos.addEventListener("click", carregarRecursos);
    botaoCarregarReservas.addEventListener("click", carregarReservas);
    botaoCarregarTodasReservas.addEventListener(
        "click",
        carregarTodasReservas
    );
    botaoCarregarUsuarios.addEventListener("click", carregarUsuarios);

    listaReservas.addEventListener("click", ocultarReservaCancelada);
    listaReservasAdmin.addEventListener(
        "click",
        tratarAcaoReservaAdmin
    );
    listaUsuarios.addEventListener("click", tratarExclusaoUsuario);
}

// =========================
// INICIALIZAÇÃO DA PÁGINA
// =========================

async function inicializarPagina() {
    registrarEventos();

    if (!credencialBasic || !emailUsuario) {
        mostrarLogin();
        return;
    }

    carregarReservasOcultas();
    mostrarSistema();

    await carregarRecursos();

    if (!credencialBasic) {
        return;
    }

    await carregarReservas();

    if (!credencialBasic) {
        return;
    }

    await verificarPerfilAdministrador();
}

inicializarPagina();
