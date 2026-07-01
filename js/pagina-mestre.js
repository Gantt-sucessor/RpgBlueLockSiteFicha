// ============================================================
// FÓRMULA DO EGO — Lógica da página do Mestre (Painel da Campanha)
// ============================================================

import { garantirLogin } from "./firebase-config.js";
import {
  obterCampanha, escutarCampanha, passarRodada, voltarRodada, resetarRodadas,
  iniciarCombate, proximoTurno, encerrarCombate,
  escutarFichasMultiplas, atualizarCampoFicha
} from "./store.js";
import { normalizarFicha } from "./modelo-ficha.js";
import { mostrarToast, copiarParaClipboard, escaparHtml, gerarIdAleatorio } from "./ui-utils.js";
import {
  passarRodadaCooldowns, passarTurnoDoCooldown,
  textoIndicadorCooldown, calcFolegoMaximo, calcLimiteTokensEgo
} from "./engine-regras.js";
import { CLASSES } from "./data/classes-parte2.js";
import { ESTAGIOS } from "./data/regras-base.js";
import "./tema.js";

const params = new URLSearchParams(window.location.search);
const campanhaId = params.get("campanha");

const telaLoading = document.getElementById("tela-loading");
const appMestre = document.getElementById("app-mestre");

let campanhaAtual = null;
let usuarioAtual = null;
let unsubFichasMultiplas = null;
let fichasAtuais = {};

// ----------------------------------------------------------------
// Inicialização
// ----------------------------------------------------------------
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

  montarConvite();
  montarListenersTopbar();

  escutarCampanha(campanhaId, (camp) => {
    campanhaAtual = camp;
    montarTopo();
    renderizarPainelCombate();
    sincronizarListenerFichas();
  });

  sincronizarListenerFichas();
}

// ----------------------------------------------------------------
// Topbar
// ----------------------------------------------------------------
function montarTopo() {
  document.getElementById("texto-nome-campanha").textContent = campanhaAtual.nome;
  document.getElementById("texto-rodada-atual").textContent = `Rodada ${campanhaAtual.rodadaAtual || 1}`;
  document.getElementById("pill-qtd-jogadores").textContent =
    `${(campanhaAtual.membros || []).length} jogador${(campanhaAtual.membros || []).length === 1 ? "" : "es"}`;

  // Troca os botões de acordo com o modo (combate ativo ou não)
  const combateAtivo = campanhaAtual.combateAtivo;
  document.getElementById("btn-passar-rodada-mestre").hidden = combateAtivo;
  document.getElementById("btn-voltar-rodada").hidden = combateAtivo;
  document.getElementById("btn-resetar-rodadas").hidden = combateAtivo;
  document.getElementById("btn-proximo-turno").hidden = !combateAtivo;
  document.getElementById("btn-encerrar-combate").hidden = !combateAtivo;
}

function montarListenersTopbar() {
  document.getElementById("btn-passar-rodada-mestre").addEventListener("click", aoClicarPassarRodada);
  document.getElementById("btn-voltar-rodada").addEventListener("click", aoClicarVoltarRodada);
  document.getElementById("btn-resetar-rodadas").addEventListener("click", aoClicarResetarRodadas);
  document.getElementById("btn-proximo-turno").addEventListener("click", aoClicarProximoTurno);
  document.getElementById("btn-encerrar-combate").addEventListener("click", aoClicarEncerrarCombate);
  montarTopo();
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

// ----------------------------------------------------------------
// Painel de Iniciativa / Combate
// ----------------------------------------------------------------
function renderizarPainelCombate() {
  const container = document.getElementById("painel-combate");
  if (!container) return;

  if (campanhaAtual.combateAtivo) {
    renderizarFilaTurnos(container);
  } else {
    renderizarFormIniciativa(container);
  }
}

function renderizarFormIniciativa(container) {
  const membros = campanhaAtual.membros || [];
  const fichasLinhas = membros.map((m) => {
    const ficha = fichasAtuais[m.fichaId];
    const destreza = ficha?.atributos?.destreza || 0;
    const iniciativaRolada = ficha?.historicoRolagens?.find(r => r.titulo === "Destreza");
    const iniciativaValor = iniciativaRolada?.total ?? "";
    return `
      <div class="iniciativa-linha">
        <span class="iniciativa-nome">${escaparHtml(ficha?.nomePersonagem || m.nome)}</span>
        <span class="iniciativa-destreza texto-discreto">DES +${destreza}</span>
        <input type="number" class="iniciativa-input" data-fichaId="${escaparHtml(m.fichaId)}"
          data-uid="${escaparHtml(m.uid)}" data-nome="${escaparHtml(ficha?.nomePersonagem || m.nome)}"
          placeholder="Resultado" value="${iniciativaValor}" min="0">
      </div>
    `;
  }).join("");

  const npcsAtuais = campanhaAtual.npcsIniciativa || [];
  const npcsLinhas = npcsAtuais.map((npc, i) => `
    <div class="iniciativa-linha">
      <input type="text" class="npc-nome-input" data-i="${i}" value="${escaparHtml(npc.nome)}" placeholder="Nome do NPC">
      <input type="number" class="npc-iniciativa-input" data-i="${i}" value="${npc.iniciativa}" placeholder="Resultado" min="0">
      <button class="btn btn-perigo btn-pequeno npc-remover" data-i="${i}">✕</button>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="card painel-iniciativa">
      <div class="bloco-cooldowns-header">
        <h3>⚡ Ordem de Iniciativa</h3>
        <span class="pill">Destreza rolada</span>
      </div>
      <p class="texto-discreto" style="margin:8px 0 14px;">
        Digite o resultado da rolagem de Destreza de cada personagem.
        NPCs você adiciona manualmente.
      </p>

      <h4 style="margin-bottom:8px;">Players</h4>
      <div class="lista-iniciativa-players">${fichasLinhas}</div>

      <h4 style="margin:16px 0 8px;">NPCs</h4>
      <div id="lista-npcs-iniciativa">${npcsLinhas}</div>
      <button class="btn btn-secundario btn-pequeno" id="btn-add-npc" style="margin-top:8px;">+ Adicionar NPC</button>

      <button class="btn btn-primario" id="btn-iniciar-combate" style="margin-top:20px;width:100%;">
        ⚔️ Iniciar Combate
      </button>
    </div>
  `;

  // Listener: adicionar NPC
  container.querySelector("#btn-add-npc").addEventListener("click", () => {
    const novosNpcs = [...(campanhaAtual.npcsIniciativa || []), { id: gerarIdAleatorio(), nome: "", iniciativa: 0 }];
    campanhaAtual = { ...campanhaAtual, npcsIniciativa: novosNpcs };
    renderizarFormIniciativa(container);
  });

  // Listener: remover NPC
  container.querySelectorAll(".npc-remover").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.i);
      const novosNpcs = (campanhaAtual.npcsIniciativa || []).filter((_, idx) => idx !== i);
      campanhaAtual = { ...campanhaAtual, npcsIniciativa: novosNpcs };
      renderizarFormIniciativa(container);
    });
  });

  // Listener: iniciar combate
  container.querySelector("#btn-iniciar-combate").addEventListener("click", () => {
    const players = [];
    container.querySelectorAll(".iniciativa-input").forEach(input => {
      const val = parseInt(input.value, 10);
      if (!isNaN(val)) {
        players.push({
          uid: input.dataset.uid,
          fichaId: input.dataset.fichaId,
          nome: input.dataset.nome,
          iniciativa: val
        });
      }
    });

    const npcs = [];
    const nomesNpc = container.querySelectorAll(".npc-nome-input");
    const iniciativasNpc = container.querySelectorAll(".npc-iniciativa-input");
    nomesNpc.forEach((input, i) => {
      const nome = input.value.trim();
      const iniciativa = parseInt(iniciativasNpc[i]?.value || "0", 10);
      if (nome) {
        const idNpc = (campanhaAtual.npcsIniciativa || [])[i]?.id || gerarIdAleatorio();
        npcs.push({ id: idNpc, nome, iniciativa: isNaN(iniciativa) ? 0 : iniciativa });
      }
    });

    if (players.length === 0 && npcs.length === 0) {
      mostrarToast("Adicione ao menos um personagem com iniciativa.", "aviso");
      return;
    }

    iniciarCombate(campanhaId, players, npcs)
      .then(() => mostrarToast("Combate iniciado!", "sucesso"))
      .catch(err => { console.error(err); mostrarToast("Erro ao iniciar combate.", "erro"); });
  });
}

function renderizarFilaTurnos(container) {
  const fila = campanhaAtual.filaTurnos || [];
  const indexAtual = campanhaAtual.turnoAtualIndex || 0;
  const rodada = campanhaAtual.rodadaAtual || 1;

  const itens = fila.map((p, i) => {
    const ehAtual = i === indexAtual;
    const ficha = p.fichaId ? fichasAtuais[p.fichaId] : null;
    const cooldownsAtivos = ficha
      ? (ficha.cooldowns || []).filter(c => c.cooldownAtual > 0)
      : [];

    return `
      <div class="item-turno ${ehAtual ? "turno-ativo" : ""} ${p.tipo === "npc" ? "turno-npc" : ""}">
        <div class="item-turno-header">
          <span class="item-turno-pos">${i + 1}º</span>
          <span class="item-turno-nome">${escaparHtml(p.nome)}</span>
          <span class="pill item-turno-iniciativa">${p.iniciativa}</span>
          <span class="pill ${p.tipo === "npc" ? "pill-npc" : "pill-player"}">${p.tipo === "npc" ? "NPC" : "Player"}</span>
          ${ehAtual ? `<span class="item-turno-atual-badge">▶ AGINDO</span>` : ""}
        </div>
        ${cooldownsAtivos.length > 0 ? `
          <div class="item-turno-cooldowns">
            ${cooldownsAtivos.map(c => `
              <div class="item-turno-cooldown-linha">
                🕒 <strong>${escaparHtml(c.nome)}</strong>
                <span class="texto-discreto">— ${textoIndicadorCooldown(c)}</span>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="card painel-iniciativa">
      <div class="bloco-cooldowns-header">
        <h3>⚔️ Ordem de Turno — Rodada ${rodada}</h3>
        <span class="pill">${fila[indexAtual]?.nome || "—"} agindo</span>
      </div>
      <div class="lista-turnos">${itens}</div>
    </div>
  `;
}

// ----------------------------------------------------------------
// Grid de fichas dos jogadores
// ----------------------------------------------------------------
function sincronizarListenerFichas() {
  const membros = campanhaAtual.membros || [];
  const fichaIds = membros.map(m => m.fichaId).filter(Boolean);

  if (unsubFichasMultiplas) unsubFichasMultiplas();

  if (fichaIds.length === 0) {
    renderizarGridFichas({});
    renderizarPainelCombate();
    return;
  }

  unsubFichasMultiplas = escutarFichasMultiplas(fichaIds, (fichasMap) => {
    fichasAtuais = fichasMap;
    renderizarGridFichas(fichasMap);
    renderizarPainelCombate();
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
          ? cooldownsAtivos.map(c => `🕒 <strong>${escaparHtml(c.nome)}</strong> — ${textoIndicadorCooldown(c)}`).join("<br>")
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

// ----------------------------------------------------------------
// Ações dos botões
// ----------------------------------------------------------------
async function aoClicarProximoTurno() {
  const btn = document.getElementById("btn-proximo-turno");
  btn.disabled = true;
  try {
    await proximoTurno(campanhaId, campanhaAtual, fichasAtuais, atualizarCampoFicha, passarTurnoDoCooldown);
    const fila = campanhaAtual.filaTurnos || [];
    const proxIndex = ((campanhaAtual.turnoAtualIndex || 0) + 1) % fila.length;
    mostrarToast(`Turno de: ${fila[proxIndex]?.nome || "próximo"}`, "sucesso");
  } catch (err) {
    console.error(err);
    mostrarToast("Erro ao avançar turno.", "erro");
  } finally {
    btn.disabled = false;
  }
}

async function aoClicarEncerrarCombate() {
  if (!window.confirm("Encerrar o combate e limpar a ordem de iniciativa?")) return;
  await encerrarCombate(campanhaId);
  mostrarToast("Combate encerrado.", "sucesso");
}

async function aoClicarPassarRodada() {
  const btn = document.getElementById("btn-passar-rodada-mestre");
  btn.disabled = true;
  btn.textContent = "Passando...";
  try {
    const membros = campanhaAtual.membros || [];
    const promessas = membros.map(async (membro) => {
      const fichaRaw = fichasAtuais[membro.fichaId];
      if (!fichaRaw) return;
      const ficha = normalizarFicha(fichaRaw);
      const novosCooldowns = passarRodadaCooldowns(ficha.cooldowns || []);
      await atualizarCampoFicha(ficha.id, { cooldowns: novosCooldowns });
    });
    await Promise.all(promessas);
    await passarRodada(campanhaId);
    mostrarToast("Rodada avançada! Cooldowns descontados.", "sucesso");
  } catch (err) {
    console.error(err);
    mostrarToast("Erro ao passar a rodada.", "erro");
  } finally {
    btn.disabled = false;
    btn.textContent = "Passar Rodada →";
  }
}

async function aoClicarVoltarRodada() {
  const rodadaAtual = campanhaAtual.rodadaAtual || 1;
  if (rodadaAtual <= 1) { mostrarToast("Já está na Rodada 1.", "aviso"); return; }
  const btn = document.getElementById("btn-voltar-rodada");
  btn.disabled = true;
  try {
    await voltarRodada(campanhaId);
    mostrarToast(`Voltou para a Rodada ${rodadaAtual - 1}.`, "sucesso");
  } catch (err) {
    console.error(err);
    mostrarToast("Erro ao voltar rodada.", "erro");
  } finally {
    btn.disabled = false;
  }
}

async function aoClicarResetarRodadas() {
  if (!window.confirm("Resetar para a Rodada 1?")) return;
  const btn = document.getElementById("btn-resetar-rodadas");
  btn.disabled = true;
  try {
    await resetarRodadas(campanhaId);
    mostrarToast("Rodadas resetadas para 1.", "sucesso");
  } catch (err) {
    console.error(err);
    mostrarToast("Erro ao resetar rodadas.", "erro");
  } finally {
    btn.disabled = false;
  }
}

iniciar();
