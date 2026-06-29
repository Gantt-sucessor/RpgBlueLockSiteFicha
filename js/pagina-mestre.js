// ============================================================
// FÓRMULA DO EGO — Lógica da página do Mestre (Painel da Campanha)
// ============================================================

import { garantirLogin } from "./firebase-config.js";
import {
  obterCampanha, escutarCampanha, passarRodada,
  escutarFichasMultiplas, atualizarCampoFicha
} from "./store.js";
import { normalizarFicha } from "./modelo-ficha.js";
import { mostrarToast, copiarParaClipboard, escaparHtml } from "./ui-utils.js";
import { passarRodadaCooldowns, calcFolegoMaximo, calcLimiteTokensEgo } from "./engine-regras.js";
import { CLASSES } from "./data/classes-parte2.js";
import { ESTAGIOS, COR_EGO_HEX } from "./data/regras-base.js";

const params = new URLSearchParams(window.location.search);
const campanhaId = params.get("campanha");

const telaLoading = document.getElementById("tela-loading");
const appMestre = document.getElementById("app-mestre");

let campanhaAtual = null;
let usuarioAtual = null;
let unsubFichasMultiplas = null;
let fichasAtuais = {};

async function iniciar() {
  if (!campanhaId) {
    document.body.innerHTML = "<p style='padding:40px;text-align:center;'>Campanha não encontrada.</p>";
    return;
  }

  usuarioAtual = await garantirLogin();
  campanhaAtual = await obterCampanha(campanhaId);

  if (!campanhaAtual) {
    document.body.innerHTML = "<p style='padding:40px;text-align:center;'>Esta campanha não existe.</p>";
    return;
  }

  if (campanhaAtual.uidMestre !== usuarioAtual.uid) {
    document.body.innerHTML = "<p style='padding:40px;text-align:center;'>Você não é o Mestre desta campanha.<br><a href='index.html'>Voltar ao início</a></p>";
    return;
  }

  telaLoading.hidden = true;
  appMestre.hidden = false;

  montarTopo();
  montarConvite();

  escutarCampanha(campanhaId, (camp) => {
    campanhaAtual = camp;
    montarTopo();
    sincronizarListenerFichas();
  });

  sincronizarListenerFichas();

  document.getElementById("btn-passar-rodada-mestre").addEventListener("click", aoClicarPassarRodada);
}

function montarTopo() {
  document.getElementById("texto-nome-campanha").textContent = campanhaAtual.nome;
  document.getElementById("texto-rodada-atual").textContent = `Rodada ${campanhaAtual.rodadaAtual || 1}`;
  document.getElementById("pill-qtd-jogadores").textContent =
    `${(campanhaAtual.membros || []).length} jogador${(campanhaAtual.membros || []).length === 1 ? "" : "es"}`;
}

function montarConvite() {
  document.getElementById("texto-codigo-convite").textContent = campanhaAtual.codigoConvite;

  document.getElementById("btn-copiar-codigo").addEventListener("click", () => {
    copiarParaClipboard(campanhaAtual.codigoConvite);
    mostrarToast("Código copiado!", "sucesso");
  });

  document.getElementById("btn-copiar-link").addEventListener("click", () => {
    const link = `${window.location.origin}${window.location.pathname.replace("mestre.html", "")}entrar-campanha.html?campanha=${campanhaId}`;
    copiarParaClipboard(link);
    mostrarToast("Link copiado!", "sucesso");
  });
}

function sincronizarListenerFichas() {
  const membros = campanhaAtual.membros || [];
  const fichaIds = membros.map(m => m.fichaId).filter(Boolean);

  if (unsubFichasMultiplas) unsubFichasMultiplas();

  if (fichaIds.length === 0) {
    renderizarGridFichas({});
    return;
  }

  unsubFichasMultiplas = escutarFichasMultiplas(fichaIds, (fichasMap) => {
    fichasAtuais = fichasMap;
    renderizarGridFichas(fichasMap);
  });
}

function renderizarGridFichas(fichasMap) {
  const container = document.getElementById("grid-fichas-campanha");
  const membros = campanhaAtual.membros || [];

  if (membros.length === 0) {
    container.innerHTML = `<div class="estado-vazio"><h3>Nenhum jogador ainda</h3><p>Compartilhe o código de convite acima.</p></div>`;
    return;
  }

  container.innerHTML = "";
  membros.forEach((membro) => {
    const fichaRaw = fichasMap[membro.fichaId];
    if (!fichaRaw) return;
    const ficha = normalizarFicha(fichaRaw);

    const classeObj = CLASSES.find(c => c.id === ficha.classe);
    const limiteTokens = calcLimiteTokensEgo(ficha.atributos.ego || 0);
    const maxFolego = calcFolegoMaximo(ficha.atributos.destreza || 0);
    const cooldownsAtivos = (ficha.cooldowns || []).filter(c => c.cooldownAtual > 0);

    const card = document.createElement("div");
    card.className = "card-ficha-jogador";
    card.innerHTML = `
      <div class="card-ficha-jogador-header">
        <span class="card-ficha-jogador-nome">${escaparHtml(ficha.nomePersonagem)}</span>
        <span class="pill">${escaparHtml(ESTAGIOS.find(e => e.id === ficha.estagio)?.nome || "Iniciante")}</span>
      </div>
      <span class="card-ficha-jogador-jogador">Jogador: ${escaparHtml(membro.nome)} · ${classeObj ? escaparHtml(classeObj.nome) : "Sem classe"}</span>
      <div class="card-ficha-jogador-stats">
        <div class="stat-mini"><span>Tokens de Ego</span><strong>${ficha.tokensEgo} / ${limiteTokens}</strong></div>
        <div class="stat-mini"><span>Fôlego</span><strong>${ficha.folegoAtual} / ${maxFolego}</strong></div>
        <div class="stat-mini"><span>Pontos de Chama</span><strong>${ficha.pontosChama}</strong></div>
        <div class="stat-mini"><span>Fluxo</span><strong>${ficha.fluxoPorcentagem}%</strong></div>
      </div>
      <div class="card-ficha-jogador-cooldowns">
        ${cooldownsAtivos.length > 0
          ? `🕒 Em cooldown: ${cooldownsAtivos.map(c => `${escaparHtml(c.nome)} (${c.cooldownAtual})`).join(", ")}`
          : "✅ Todas habilidades prontas"}
      </div>
      ${renderizarUltimaRolagem(ficha.historicoRolagens)}
      <a href="ficha.html?id=${ficha.id}&campanha=${campanhaId}" class="btn btn-secundario btn-pequeno">Ver ficha completa</a>
    `;
    container.appendChild(card);
  });
}

function renderizarUltimaRolagem(historico) {
  if (!historico || historico.length === 0) {
    return `<div class="card-ficha-jogador-rolagem texto-discreto">Ainda não rolou dados.</div>`;
  }
  const ultima = historico[0];
  const hora = new Date(ultima.quando).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `
    <div class="card-ficha-jogador-rolagem">
      🎲 <strong>${escaparHtml(ultima.titulo)}</strong>: <span class="card-ficha-jogador-rolagem-total">${ultima.total}</span>
      <span class="texto-discreto">(${ultima.vantagens}V/${ultima.desvantagens}D · ${hora}${ultima.execucao ? ` · ⚡${escaparHtml(ultima.execucao)}` : ""})</span>
    </div>
  `;
}

async function aoClicarPassarRodada() {
  const btn = document.getElementById("btn-passar-rodada-mestre");
  btn.disabled = true;
  btn.textContent = "Passando rodada...";

  try {
    // 1. Decrementa cooldowns de todas as fichas da campanha
    const membros = campanhaAtual.membros || [];
    const promessas = membros.map(async (membro) => {
      const fichaRaw = fichasAtuais[membro.fichaId];
      if (!fichaRaw) return;
      const ficha = normalizarFicha(fichaRaw);
      const novosCooldowns = passarRodadaCooldowns(ficha.cooldowns || []);
      await atualizarCampoFicha(ficha.id, { cooldowns: novosCooldowns });
    });
    await Promise.all(promessas);

    // 2. Avança o contador de rodada da campanha
    await passarRodada(campanhaId);

    mostrarToast("Rodada avançada! Cooldowns de todos os jogadores foram descontados.", "sucesso");
  } catch (err) {
    console.error(err);
    mostrarToast("Erro ao passar a rodada. Veja o console.", "erro");
  } finally {
    btn.disabled = false;
    btn.textContent = "Passar Rodada";
  }
}

iniciar();
