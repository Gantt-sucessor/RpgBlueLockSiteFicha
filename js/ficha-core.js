// ============================================================
// FÓRMULA DO EGO — Orquestrador da Página de Ficha (núcleo)
// ============================================================

import { garantirLogin } from "./firebase-config.js";
import { obterFicha, escutarFicha, atualizarCampoFicha, obterCampanha, escutarCampanha, passarRodada } from "./store.js";
import { normalizarFicha } from "./modelo-ficha.js";
import { mostrarToast } from "./ui-utils.js";
import { CLASSES } from "./data/classes-parte2.js";

const params = new URLSearchParams(window.location.search);
const fichaId = params.get("id");
const campanhaIdParam = params.get("campanha");

const estado = {
  ficha: null,
  usuario: null,
  campanha: null,
  campanhaIdParam,
  fichaId,
  unsubFicha: null,
  unsubCampanha: null,
  salvandoTimeout: null,
  listenersSecao: [] // funções chamadas quando a ficha é atualizada remotamente
};

const telaLoading = document.getElementById("tela-loading");
const appFicha = document.getElementById("app-ficha");

function registrarListenerAtualizacao(fn) {
  estado.listenersSecao.push(fn);
}

function salvarCampo(campos) {
  estado.ficha = { ...estado.ficha, ...campos };
  clearTimeout(estado.salvandoTimeout);
  estado.salvandoTimeout = setTimeout(() => {
    atualizarCampoFicha(fichaId, campos).catch((err) => {
      console.error(err);
      mostrarToast("Não foi possível salvar. Confira sua conexão.", "erro");
    });
  }, 350);
}

function salvarCampoImediato(campos) {
  estado.ficha = { ...estado.ficha, ...campos };
  return atualizarCampoFicha(fichaId, campos).catch((err) => {
    console.error(err);
    mostrarToast("Não foi possível salvar. Confira sua conexão.", "erro");
  });
}

function atualizarTopbarClasse() {
  const el = document.getElementById("campo-classe-atual");
  const classeObj = CLASSES.find(c => c.id === estado.ficha.classe);
  el.textContent = classeObj ? classeObj.nome : "Sem classe definida";
}

function atualizarPillsCampanha() {
  const pillCampanha = document.getElementById("pill-campanha-vinculada");
  const pillRodada = document.getElementById("pill-rodada-atual");
  const btnPassarRodada = document.getElementById("btn-passar-rodada");

  if (estado.campanha) {
    pillCampanha.hidden = false;
    pillCampanha.textContent = estado.campanha.nome;
    pillRodada.hidden = false;
    pillRodada.textContent = `Rodada ${estado.campanha.rodadaAtual || 1}`;

    const ehMestre = estado.usuario && estado.campanha.uidMestre === estado.usuario.uid;
    btnPassarRodada.hidden = !ehMestre;
  } else {
    pillCampanha.hidden = true;
    pillRodada.hidden = true;
    btnPassarRodada.hidden = true;
  }
}

function montarTopbar() {
  const campoNome = document.getElementById("campo-nome-personagem");
  campoNome.textContent = estado.ficha.nomePersonagem || "Novo Jogador";
  campoNome.addEventListener("blur", () => {
    const novoNome = campoNome.textContent.trim() || "Novo Jogador";
    campoNome.textContent = novoNome;
    salvarCampo({ nomePersonagem: novoNome });
  });
  campoNome.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); campoNome.blur(); }
  });

  atualizarTopbarClasse();
  atualizarPillsCampanha();

  document.getElementById("btn-passar-rodada").addEventListener("click", async () => {
    if (!estado.campanhaIdParam) return;
    const btn = document.getElementById("btn-passar-rodada");
    btn.disabled = true;
    try {
      await passarRodada(estado.campanhaIdParam);
      mostrarToast("Rodada avançada. Cooldowns descontados.", "sucesso");
    } catch (err) {
      console.error(err);
      mostrarToast("Erro ao passar rodada.", "erro");
    } finally {
      btn.disabled = false;
    }
  });
}

function montarAbas() {
  const botoes = document.querySelectorAll(".ficha-aba");
  botoes.forEach((btn) => {
    btn.addEventListener("click", () => {
      botoes.forEach(b => b.classList.remove("ativa"));
      btn.classList.add("ativa");
      document.querySelectorAll(".painel-aba").forEach(p => p.classList.remove("ativa"));
      document.getElementById(`aba-${btn.dataset.aba}`).classList.add("ativa");
    });
  });
}

async function iniciar() {
  if (!fichaId) {
    document.body.innerHTML = "<p style='padding:40px;text-align:center;'>Ficha não encontrada (faltou o parâmetro na URL).</p>";
    return;
  }

  estado.usuario = await garantirLogin();

  const fichaInicial = await obterFicha(fichaId);
  if (!fichaInicial) {
    document.body.innerHTML = "<p style='padding:40px;text-align:center;'>Esta ficha não existe ou foi excluída.</p>";
    return;
  }
  estado.ficha = normalizarFicha(fichaInicial);

  if (estado.campanhaIdParam) {
    estado.campanha = await obterCampanha(estado.campanhaIdParam);
  }

  telaLoading.hidden = true;
  appFicha.hidden = false;

  montarAbas();
  montarTopbar();

  // Módulos de seção se registram via window.__fichaSecoes (carregados depois deste script)
  document.dispatchEvent(new CustomEvent("fichaapp:pronta"));

  estado.unsubFicha = escutarFicha(fichaId, (fichaRemota) => {
    if (!fichaRemota) return;
    estado.ficha = normalizarFicha(fichaRemota);
    atualizarTopbarClasse();
    estado.listenersSecao.forEach(fn => fn());
  });

  if (estado.campanhaIdParam) {
    estado.unsubCampanha = escutarCampanha(estado.campanhaIdParam, (camp) => {
      estado.campanha = camp;
      atualizarPillsCampanha();
    });
  }
}

// Disponibiliza globalmente para os módulos de seção (carregados via <script type="module">
// na mesma página, em ordem, e que importam este módulo diretamente — ver export abaixo).
export { estado, salvarCampo, salvarCampoImediato, atualizarTopbarClasse, registrarListenerAtualizacao };

iniciar();
