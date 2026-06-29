// ============================================================
// FÓRMULA DO EGO — Renderização: Jogadas, Cooldowns, Resultado de Rolagem
// ============================================================

import { JOGADAS_BASE, ATRIBUTOS } from "./data/regras-base.js";
import { rolarJogada } from "./engine-regras.js";
import { abrirModal } from "./ui-utils.js";

function nomeAtributoComposto(atrId) {
  if (atrId === "destreza_potencia_meio") return "Destreza + Potência ÷ 2";
  return ATRIBUTOS[atrId]?.nome || atrId;
}

function valorAtributoComposto(atrId, atributos) {
  if (atrId === "destreza_potencia_meio") {
    return Math.round((atributos.destreza + atributos.potencia) / 2);
  }
  return atributos[atrId] || 0;
}

// Renderiza a lista de jogadas-base clicáveis (aba Visão Geral)
function renderizarListaJogadas(container, ficha, { onRolar }) {
  container.innerHTML = "";
  JOGADAS_BASE.forEach((jogada) => {
    const div = document.createElement("div");
    div.className = "item-jogada";
    div.tabIndex = 0;
    div.innerHTML = `
      <span class="item-jogada-nome">${jogada.nome}</span>
      <span class="item-jogada-meta">${nomeAtributoComposto(jogada.atributo)} · DJ ${typeof jogada.dj === "number" ? jogada.dj : jogada.dj}</span>
    `;
    div.addEventListener("click", () => onRolar(jogada));
    div.addEventListener("keydown", (e) => { if (e.key === "Enter") onRolar(jogada); });
    container.appendChild(div);
  });
}

// Abre o modal de configuração + resultado de uma rolagem
function abrirModalRolagem({ titulo, atributoValor, vantagensIniciais = 0, desvantagensIniciais = 0, bonusInicial = 0 }) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="form-grupo">
      <label>Vantagens</label>
      <div class="stepper" id="stepper-vant"></div>
    </div>
    <div class="form-grupo">
      <label>Desvantagens</label>
      <div class="stepper" id="stepper-desv"></div>
    </div>
    <div class="form-grupo">
      <label>Bônus fixo (some ao resultado final)</label>
      <input type="number" id="input-bonus" value="${bonusInicial}">
    </div>
    <button class="btn btn-primario" id="btn-confirmar-rolagem" style="width:100%;">🎲 Rolar</button>
    <div id="area-resultado"></div>
  `;

  const { fechar, body } = abrirModal({ titulo, conteudoEl: wrap });

  // Steppers simples sem o helper (pra não duplicar import circular)
  let vant = vantagensIniciais, desv = desvantagensIniciais;
  const stepperVant = wrap.querySelector("#stepper-vant");
  const stepperDesv = wrap.querySelector("#stepper-desv");
  montarStepperLocal(stepperVant, vant, (v) => vant = v);
  montarStepperLocal(stepperDesv, desv, (v) => desv = v);

  wrap.querySelector("#btn-confirmar-rolagem").addEventListener("click", () => {
    const bonus = parseInt(wrap.querySelector("#input-bonus").value, 10) || 0;
    const resultado = rolarJogada({ atributoValor, vantagens: vant, desvantagens: desv, bonus });
    renderizarResultadoRolagem(wrap.querySelector("#area-resultado"), resultado);
  });

  return { fechar };
}

function montarStepperLocal(container, valorInicial, onChange) {
  let valor = valorInicial;
  container.innerHTML = `
    <button type="button" class="btn btn-icone stepper-btn" data-acao="menos">–</button>
    <span class="stepper-valor">${valor}</span>
    <button type="button" class="btn btn-icone stepper-btn" data-acao="mais">+</button>
  `;
  const display = container.querySelector(".stepper-valor");
  container.querySelector('[data-acao="menos"]').addEventListener("click", () => {
    valor = Math.max(0, valor - 1);
    display.textContent = valor;
    onChange(valor);
  });
  container.querySelector('[data-acao="mais"]').addEventListener("click", () => {
    valor = valor + 1;
    display.textContent = valor;
    onChange(valor);
  });
}

function renderizarResultadoRolagem(container, resultado) {
  const exec = resultado.execucaoAbsoluta;
  const classeExec = exec ? `execucao-${exec.id.toLowerCase()}` : "";

  container.innerHTML = `
    <div class="resultado-rolagem">
      <div class="resultado-rolagem-total ${classeExec}">${resultado.total}</div>
      <div class="resultado-rolagem-detalhe">
        <div class="resultado-rolagem-grupo">
          <span class="resultado-rolagem-grupo-label">D12 ${resultado.d12.pegouMenor ? "(2D12, menor)" : ""}</span>
          <span class="resultado-rolagem-dados">${resultado.d12.resultados.join(" / ")} → ${resultado.d12.usado}</span>
        </div>
        <div class="resultado-rolagem-grupo">
          <span class="resultado-rolagem-grupo-label">D6 (${resultado.vantagens}V / ${resultado.desvantagens}D)</span>
          <span class="resultado-rolagem-dados">${resultado.d6.resultados.length ? resultado.d6.resultados.join(", ") : "—"} = ${resultado.d6.soma}</span>
        </div>
        ${resultado.penalidadeNegativa ? `
        <div class="resultado-rolagem-grupo">
          <span class="resultado-rolagem-grupo-label">Penalidade extra</span>
          <span class="resultado-rolagem-dados">−${resultado.penalidadeNegativa}</span>
        </div>` : ""}
        <div class="resultado-rolagem-grupo">
          <span class="resultado-rolagem-grupo-label">Bônus</span>
          <span class="resultado-rolagem-dados">${resultado.bonus >= 0 ? "+" : ""}${resultado.bonus}</span>
        </div>
      </div>
      ${exec ? `<div class="resultado-execucao-banner">⚡ Execução Absoluta: ${exec.nome} (+${exec.tokensBonus} Token${exec.tokensBonus > 1 ? "s" : ""} de Ego)</div>` : ""}
    </div>
  `;
}

// --- Cooldowns ---
function renderizarCooldowns(container, cooldowns, { isMestre, onPassarRodada }) {
  if (!cooldowns || cooldowns.length === 0) {
    container.innerHTML = `<p class="texto-discreto">Nenhuma habilidade em recarga.</p>`;
    return;
  }
  container.innerHTML = "";
  cooldowns
    .filter(c => c.cooldownAtual > 0)
    .forEach((cd) => {
      const div = document.createElement("div");
      div.className = `item-cooldown ${cd.cooldownAtual === 0 ? "pronto" : ""}`;
      div.innerHTML = `
        <span class="item-cooldown-nome">${cd.nome}</span>
        <span class="item-cooldown-info">
          <span class="item-cooldown-badge">${cd.cooldownAtual}</span>
          <span class="texto-discreto">/ ${cd.cooldownMax} rodadas</span>
        </span>
      `;
      container.appendChild(div);
    });
  if (container.children.length === 0) {
    container.innerHTML = `<p class="texto-discreto">Todas as habilidades estão prontas para uso.</p>`;
  }
}

export {
  renderizarListaJogadas, abrirModalRolagem, renderizarResultadoRolagem,
  renderizarCooldowns, nomeAtributoComposto, valorAtributoComposto
};
