// ============================================================
// FÓRMULA DO EGO — Renderização: Jogadas, Cooldowns, Resultado de Rolagem
// ============================================================

import { JOGADAS_BASE, ATRIBUTOS, CORES_EGO, COR_EGO_HEX, JOGADAS_COR_EGO } from "./data/regras-base.js";
import { rolarJogada, textoIndicadorCooldown } from "./engine-regras.js";
import { abrirModal } from "./ui-utils.js";
import { calcularBonusAutomatico } from "./bonus-automaticos.js";

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
    const automatico = calcularBonusAutomatico(jogada.id, ficha);
    div.innerHTML = `
      <span class="item-jogada-nome">${jogada.nome}</span>
      <span class="item-jogada-meta">${nomeAtributoComposto(jogada.atributo)} · DJ ${typeof jogada.dj === "number" ? jogada.dj : jogada.dj}</span>
      ${automatico.vantagens > 0 ? `<span class="item-jogada-auto">+${automatico.vantagens}V automático</span>` : ""}
    `;
    div.addEventListener("click", () => onRolar(jogada));
    div.addEventListener("keydown", (e) => { if (e.key === "Enter") onRolar(jogada); });
    container.appendChild(div);
  });
}

// Abre o modal de configuração + resultado de uma rolagem.
// jogadaId + ficha são opcionais: quando informados, pré-calcula os bônus
// automáticos de todas as fontes (Classe, Perícias gerais, Cor de Ego).
function abrirModalRolagem({ titulo, atributoValor, jogadaId, ficha, vantagensIniciais = 0, desvantagensIniciais = 0, bonusInicial = 0, registrarRolagem }) {
  const automatico = (jogadaId && ficha) ? calcularBonusAutomatico(jogadaId, ficha) : { vantagens: 0, desvantagens: 0, bonus: 0, fontes: [], elegivelParaCorEgo: false };

  let vant = vantagensIniciais + automatico.vantagens;
  let desv = desvantagensIniciais + automatico.desvantagens;
  let corOponenteSelecionada = "";

  const wrap = document.createElement("div");
  wrap.innerHTML = `
    ${automatico.fontes.length > 0 ? `
      <div class="bonus-automatico-box">
        <strong>Já incluso automaticamente:</strong>
        <ul>${automatico.fontes.map(f => `<li>${f}</li>`).join("")}</ul>
      </div>
    ` : ""}
    ${automatico.elegivelParaCorEgo ? `
      <div class="form-grupo">
        <label>Cor de Ego do oponente (se souber)</label>
        <div id="seletor-cor-oponente" class="seletor-cor-ego seletor-cor-ego-compacto"></div>
      </div>
    ` : ""}
    <div class="form-grupo">
      <label>Vantagens totais</label>
      <div class="stepper" id="stepper-vant"></div>
    </div>
    <div class="form-grupo">
      <label>Desvantagens totais</label>
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

  const stepperVant = wrap.querySelector("#stepper-vant");
  const stepperDesv = wrap.querySelector("#stepper-desv");
  montarStepperLocal(stepperVant, vant, (v) => vant = v);
  montarStepperLocal(stepperDesv, desv, (v) => desv = v);

  // Seletor de cor do oponente: ao escolher, recalcula o automático e
  // atualiza o stepper de vantagens (soma/remove o +1 da Cor de Ego)
  if (automatico.elegivelParaCorEgo) {
    const seletorCor = wrap.querySelector("#seletor-cor-oponente");
    montarSeletorCorCompacto(seletorCor, (corEscolhida) => {
      const novoCalculo = calcularBonusAutomatico(jogadaId, ficha, { corOponente: corEscolhida });
      const diferenca = novoCalculo.vantagens - automatico.vantagens;
      vant += diferenca;
      automatico.vantagens = novoCalculo.vantagens;
      montarStepperLocal(stepperVant, vant, (v) => vant = v);
    });
  }

  wrap.querySelector("#btn-confirmar-rolagem").addEventListener("click", () => {
    const bonus = parseInt(wrap.querySelector("#input-bonus").value, 10) || 0;
    const resultado = rolarJogada({ atributoValor, vantagens: vant, desvantagens: desv, bonus });
    renderizarResultadoRolagem(wrap.querySelector("#area-resultado"), resultado);
    if (registrarRolagem) registrarRolagem({ titulo, resultado });
  });

  return { fechar };
}

// Versão compacta do seletor de cor (usado dentro do modal de rolagem,
// sem mostrar a explicação de "vantagem sobre" para não poluir o modal)
function montarSeletorCorCompacto(container, onEscolher) {
  container.innerHTML = "";
  const nenhuma = document.createElement("div");
  nenhuma.className = "opcao-cor-ego opcao-cor-ego-pequena selecionada";
  nenhuma.textContent = "Não sei";
  nenhuma.dataset.cor = "";
  container.appendChild(nenhuma);

  CORES_EGO.forEach((cor) => {
    const div = document.createElement("div");
    div.className = "opcao-cor-ego opcao-cor-ego-pequena";
    div.dataset.cor = cor;
    div.innerHTML = `<span class="opcao-cor-ego-amostra" style="background:${COR_EGO_HEX[cor]}"></span><span class="opcao-cor-ego-nome">${cor}</span>`;
    container.appendChild(div);
  });

  container.querySelectorAll(".opcao-cor-ego-pequena").forEach((el) => {
    el.addEventListener("click", () => {
      container.querySelectorAll(".opcao-cor-ego-pequena").forEach(e => e.classList.remove("selecionada"));
      el.classList.add("selecionada");
      onEscolher(el.dataset.cor);
    });
  });
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
function renderizarCooldowns(container, cooldowns, { isMestre, onPassarRodada } = {}) {
  if (!cooldowns || cooldowns.length === 0) {
    container.innerHTML = `<p class="texto-discreto">Nenhuma habilidade em recarga.</p>`;
    return;
  }
  // Mostra habilidades com duração ativa OU em cooldown
  const visiveis = cooldowns.filter(c => (c.duracaoAtual && c.duracaoAtual > 0) || c.cooldownAtual > 0);
  if (visiveis.length === 0) {
    container.innerHTML = `<p class="texto-discreto">Todas as habilidades estão prontas para uso.</p>`;
    return;
  }
  container.innerHTML = "";
  visiveis.forEach((cd) => {
    const emDuracao = cd.duracaoAtual && cd.duracaoAtual > 0;
    const div = document.createElement("div");
    div.className = `item-cooldown ${emDuracao ? "em-duracao" : ""}`;
    div.innerHTML = `
      <div>
        <span class="item-cooldown-nome">${cd.nome}</span>
        <div class="item-cooldown-indicador texto-discreto">${textoIndicadorCooldown(cd)}</div>
      </div>
      <span class="item-cooldown-info">
        <span class="item-cooldown-badge ${emDuracao ? "badge-duracao" : ""}">${emDuracao ? cd.duracaoAtual : cd.cooldownAtual}</span>
        <span class="texto-discreto">${emDuracao ? "dur." : `/ ${cd.cooldownMax}`}</span>
      </span>
    `;
    container.appendChild(div);
  });
}

export {
  renderizarListaJogadas, abrirModalRolagem, renderizarResultadoRolagem,
  renderizarCooldowns, nomeAtributoComposto, valorAtributoComposto
};
