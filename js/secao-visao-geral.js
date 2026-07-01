// ============================================================
// FÓRMULA DO EGO — Seção: Visão Geral
// ============================================================

import { estado, salvarCampo, salvarCampoImediato, registrarListenerAtualizacao } from "./ficha-core.js";
import { criarHexagonoAtributos, atualizarValoresHexagono, ORDEM_ATRIBUTOS } from "./hexagono.js";
import { criarStepper, mostrarToast, abrirModal } from "./ui-utils.js";
import { ATRIBUTOS, CORES_EGO, COR_EGO_HEX, ESTAGIOS, JOGADAS_BASE } from "./data/regras-base.js";
import {
  calcDistanciaChute, calcDistanciaPasse, calcFolegoMaximo, calcLimiteTokensEgo,
  textoIndicadorCooldown
} from "./engine-regras.js";import { renderizarListaJogadas, abrirModalRolagem, renderizarCooldowns, nomeAtributoComposto, valorAtributoComposto } from "./render-jogadas.js";

let hexagonoSvg = null;

function montarHexagono() {
  const wrap = document.getElementById("wrap-hexagono");
  hexagonoSvg = criarHexagonoAtributos(estado.ficha.atributos, (atrId) => {
    const valor = valorAtributoComposto(atrId, estado.ficha.atributos);
    abrirModalRolagem({
      titulo: `Rolar ${ATRIBUTOS[atrId].nome}`,
      atributoValor: valor,
      registrarRolagem: registrarRolagemNaFicha
    });
  });
  wrap.innerHTML = "";
  wrap.appendChild(hexagonoSvg);

  // Permite editar cada atributo: clique longo/duplo no número dentro do SVG
  // Usamos um pequeno painel abaixo do hexágono com inputs editáveis também,
  // para acessibilidade e clareza (clicar na fatia rola; editar valor é via long-press
  // ou pelo painel de edição rápida abaixo).
  montarPainelEdicaoAtributos(wrap);
}

function montarPainelEdicaoAtributos(wrapHexagono) {
  let painel = document.getElementById("painel-edicao-atributos");
  if (painel) painel.remove();

  painel = document.createElement("div");
  painel.id = "painel-edicao-atributos";
  painel.style.display = "grid";
  painel.style.gridTemplateColumns = "repeat(3, 1fr)";
  painel.style.gap = "8px";
  painel.style.marginTop = "14px";
  painel.style.width = "100%";

  ORDEM_ATRIBUTOS.forEach((atrId) => {
    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.alignItems = "center";
    box.style.gap = "4px";
    box.style.background = "var(--cinza-claro)";
    box.style.borderRadius = "10px";
    box.style.padding = "8px 4px";

    const label = document.createElement("span");
    label.textContent = ATRIBUTOS[atrId].nome;
    label.style.fontSize = "0.72rem";
    label.style.fontWeight = "700";
    label.style.color = "var(--azul-marinho)";

    const stepper = criarStepper({
      valor: estado.ficha.atributos[atrId] ?? 0,
      min: -1, max: 4,
      onChange: (novoValor) => {
        const novosAtributos = { ...estado.ficha.atributos, [atrId]: novoValor };
        salvarCampo({ atributos: novosAtributos });
        atualizarValoresHexagono(hexagonoSvg, novosAtributos);
        atualizarTextosDistancia();
        atualizarStatusGerais();
      }
    });

    box.append(label, stepper);
    painel.appendChild(box);
  });

  wrapHexagono.appendChild(painel);
}

function atualizarTextosDistancia() {
  const dChute = calcDistanciaChute(estado.ficha.atributos.potencia || 0);
  const dPasse = calcDistanciaPasse(estado.ficha.atributos.visao || 0);
  document.getElementById("texto-dist-chute").textContent = `${dChute} m`;
  document.getElementById("texto-dist-passe").textContent = `${dPasse} m`;
}

function montarStatus() {
  // Tokens de Ego
  const wrapTokens = document.getElementById("wrap-tokens-ego");
  wrapTokens.innerHTML = "";
  wrapTokens.appendChild(criarStepper({
    valor: estado.ficha.tokensEgo ?? 4,
    min: 0, max: 99,
    onChange: (v) => { salvarCampo({ tokensEgo: v }); atualizarTextoLimiteTokens(); }
  }));

  // Fôlego
  const wrapFolego = document.getElementById("wrap-folego");
  wrapFolego.innerHTML = "";
  wrapFolego.appendChild(criarStepper({
    valor: estado.ficha.folegoAtual ?? 6,
    min: 0, max: 99,
    onChange: (v) => salvarCampo({ folegoAtual: v })
  }));

  // Pontos de Chama
  const wrapChama = document.getElementById("wrap-pontos-chama");
  wrapChama.innerHTML = "";
  wrapChama.appendChild(criarStepper({
    valor: estado.ficha.pontosChama ?? 2,
    min: 0, max: 99,
    onChange: (v) => salvarCampo({ pontosChama: v })
  }));

  // Estágio
  const selectEstagio = document.getElementById("select-estagio");
  selectEstagio.value = estado.ficha.estagio || "iniciante";
  selectEstagio.addEventListener("change", () => {
    salvarCampo({ estagio: selectEstagio.value });
    mostrarToast(`Estágio alterado para ${ESTAGIOS.find(e => e.id === selectEstagio.value)?.nome}.`);
  });

  // Cor de Ego (mini-badge clicável que leva para a aba Ego)
  const wrapCor = document.getElementById("wrap-cor-ego");
  renderizarBadgeCorEgo(wrapCor);

  // Toggles de estado
  const toggleInflado = document.getElementById("toggle-ego-inflado");
  toggleInflado.checked = !!estado.ficha.estadoEgoInflado;
  toggleInflado.addEventListener("change", () => salvarCampo({ estadoEgoInflado: toggleInflado.checked }));

  const toggleQuebra = document.getElementById("toggle-quebra-ego");
  toggleQuebra.checked = !!estado.ficha.estadoQuebraEgo;
  toggleQuebra.addEventListener("change", () => {
    if (!toggleQuebra.checked) {
      // Desativando — encerra a Quebra de Ego
      salvarCampo({ estadoQuebraEgo: false, quebraEgoEfeitos: null });
      mostrarToast("Quebra de Ego encerrada.", "sucesso");
      return;
    }
    // Ativando — rola o teste
    abrirModalQuebraEgo();
    // Reverte o toggle enquanto o modal está aberto
    toggleQuebra.checked = false;
  });

  atualizarTextoLimiteTokens();
  atualizarTextoMaxFolego();
  atualizarTextosDistancia();
}

function renderizarBadgeCorEgo(container) {
  const cor = estado.ficha.corEgo;
  if (!cor) {
    container.innerHTML = `<span class="texto-discreto">Não escolhida (vá na aba "Ego &amp; Essência")</span>`;
    return;
  }
  container.innerHTML = `
    <span class="badge-cor-ego" style="background:${COR_EGO_HEX[cor]}">
      <span class="dot-cor" style="background:#fff;"></span>${cor}
    </span>
  `;
}

function atualizarTextoLimiteTokens() {
  const limite = calcLimiteTokensEgo(estado.ficha.atributos.ego || 0) + (estado.ficha.tokensEgoLimiteExtra || 0);
  document.getElementById("texto-limite-tokens").textContent = `Limite: ${limite} (5 + Ego)`;
}

function atualizarTextoMaxFolego() {
  const max = calcFolegoMaximo(estado.ficha.atributos.destreza || 0) + (estado.ficha.folegoMaximoExtra || 0);
  document.getElementById("texto-max-folego").textContent = `Máximo: ${max} (6 + Destreza)`;
}

function atualizarStatusGerais() {
  atualizarTextoLimiteTokens();
  atualizarTextoMaxFolego();
}

function montarJogadasRapidas() {
  const container = document.getElementById("lista-jogadas-base");
  renderizarListaJogadas(container, estado.ficha, {
    onRolar: (jogada) => {
      const valorAtr = valorAtributoComposto(jogada.atributo, estado.ficha.atributos);
      abrirModalRolagem({
        titulo: jogada.nome,
        atributoValor: valorAtr,
        jogadaId: jogada.id,
        ficha: estado.ficha,
        registrarRolagem: registrarRolagemNaFicha
      });
    }
  });
}

function montarCooldowns() {
  const container = document.getElementById("lista-cooldowns");
  renderizarCooldowns(container, estado.ficha.cooldowns, {
    isMestre: estado.campanha && estado.usuario && estado.campanha.uidMestre === estado.usuario.uid
  });
}

function montarVisaoGeral() {
  montarHexagono();
  montarStatus();
  montarJogadasRapidas();
  montarCooldowns();
  montarHistoricoRolagens();
}

// Salva a rolagem no histórico da própria ficha (visível pelo Mestre e por
// todos na campanha, já que a ficha é compartilhada em tempo real).
// Mantém só as últimas 15 rolagens para não inflar o documento.
function registrarRolagemNaFicha({ titulo, resultado }) {
  const entrada = {
    titulo,
    total: resultado.total,
    vantagens: resultado.vantagens,
    desvantagens: resultado.desvantagens,
    bonus: resultado.bonus,
    execucao: resultado.execucaoAbsoluta ? resultado.execucaoAbsoluta.nome : null,
    quando: Date.now()
  };
  const historicoAtual = estado.ficha.historicoRolagens || [];
  const novoHistorico = [entrada, ...historicoAtual].slice(0, 15);
  salvarCampoImediato({ historicoRolagens: novoHistorico });
  montarHistoricoRolagens();
}

function montarHistoricoRolagens() {
  const container = document.getElementById("lista-historico-rolagens");
  if (!container) return;
  const historico = estado.ficha.historicoRolagens || [];
  if (historico.length === 0) {
    container.innerHTML = `<p class="texto-discreto">Nenhuma rolagem ainda.</p>`;
    return;
  }
  container.innerHTML = "";
  historico.forEach((r) => {
    const div = document.createElement("div");
    div.className = "item-historico-rolagem";
    const hora = new Date(r.quando).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    div.innerHTML = `
      <span class="item-historico-titulo">${r.titulo}</span>
      <span class="item-historico-total ${r.execucao ? "com-execucao" : ""}">${r.total}</span>
      <span class="item-historico-meta">${r.vantagens}V/${r.desvantagens}D · ${hora}${r.execucao ? ` · ⚡${r.execucao}` : ""}</span>
    `;
    container.appendChild(div);
  });
}

// ----------------------------------------------------------------
// Quebra de Ego — rolagem automática com efeitos
// ----------------------------------------------------------------
function abrirModalQuebraEgo() {
  const egoAtributo = estado.ficha.atributos.ego || 0;
  const dj = 16 - egoAtributo;

  // Rola o teste de Ego:
  // Ego positivo: D12 + D6 por ponto (soma tudo)
  // Ego 0: só D12
  // Ego negativo: rola D12s extras (1 por ponto negativo + o base) e pega o menor
  const qtdD12 = egoAtributo < 0 ? (1 + Math.abs(egoAtributo)) : 1;
  const qtdD6 = Math.max(0, egoAtributo);

  const todosD12 = Array.from({ length: qtdD12 }, () => Math.floor(Math.random() * 12) + 1);
  const d6s = Array.from({ length: qtdD6 }, () => Math.floor(Math.random() * 6) + 1);

  let total;
  let descricaoDados;

  if (egoAtributo >= 0) {
    const d12 = todosD12[0];
    const somaD6 = d6s.reduce((a, b) => a + b, 0);
    total = d12 + somaD6;
    descricaoDados = `D12: ${d12}${d6s.length > 0 ? ` + D6s: ${d6s.join("+")}=${somaD6}` : ""}`;
  } else {
    total = Math.min(...todosD12);
    descricaoDados = `${qtdD12}D12: [${todosD12.join(", ")}] → pega o menor (${total})`;
  }

  const passou = total >= dj;

  // Sorteia 3 jogadas aleatórias diferentes para o debuff (se falhar)
  const JOGADAS_NOMES = JOGADAS_BASE.map(j => j.nome);
  const jogadasDebuff = [];
  const pool = [...JOGADAS_NOMES];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    jogadasDebuff.push(pool.splice(idx, 1)[0]);
  }

  const wrap = document.createElement("div");
  wrap.style.textAlign = "center";
  wrap.innerHTML = `
    <div style="background:var(--cinza-claro);border-radius:var(--radius-md);padding:16px;margin-bottom:14px;">
      <div style="font-size:0.8rem;color:var(--cinza-escuro);margin-bottom:4px;">Teste de Ego — DJ ${dj} (16 − Ego ${egoAtributo >= 0 ? "+" : ""}${egoAtributo})</div>
      <div style="font-family:var(--fonte-display);font-size:3rem;color:${passou ? "var(--sucesso)" : "var(--erro)"};line-height:1;">${total}</div>
      <div style="font-size:0.8rem;margin-top:4px;">${descricaoDados}</div>
    </div>

    ${passou ? `
      <div style="background:#e6f4ec;border-radius:var(--radius-md);padding:14px;color:var(--sucesso);">
        <strong>✅ Passou! (${total} ≥ ${dj})</strong><br>
        <span style="font-size:0.85rem;">Nenhum efeito de Quebra de Ego.</span>
      </div>
      <button class="btn btn-primario" id="btn-confirmar-quebra" style="width:100%;margin-top:12px;">OK</button>
    ` : `
      <div style="background:#fde8e8;border-radius:var(--radius-md);padding:14px;color:var(--erro);text-align:left;">
        <strong>❌ Falhou! (${total} < ${dj}) — Quebra de Ego!</strong>
        <ul style="margin:8px 0 0;padding-left:18px;font-size:0.85rem;">
          <li>2 Desvantagens em qualquer Atributo</li>
          <li>−3 Fôlegos imediatamente</li>
          <li>−2 Bônus em: <strong>${jogadasDebuff.join(", ")}</strong></li>
        </ul>
      </div>
      <button class="btn btn-primario" id="btn-confirmar-quebra" style="width:100%;margin-top:12px;background:var(--erro);">
        Aplicar Quebra de Ego
      </button>
    `}
  `;

  const { fechar } = abrirModal({ titulo: "💔 Teste de Quebra de Ego", conteudoEl: wrap });

  wrap.querySelector("#btn-confirmar-quebra").addEventListener("click", () => {
    if (passou) {
      fechar();
      return;
    }
    // Lê o fôlego atual direto do estado mais recente
    const folegoAtual = typeof estado.ficha.folegoAtual === "number"
      ? estado.ficha.folegoAtual
      : calcFolegoMaximo(estado.ficha.atributos?.destreza || 0);
    const novoFolego = Math.max(0, folegoAtual - 3);

    salvarCampoImediato({
      estadoQuebraEgo: true,
      folegoAtual: novoFolego,
      quebraEgoEfeitos: {
        desvantagensAtributo: 2,
        jogadasDebuff,
        bonusDebuff: -2
      }
    }).then(() => {
      // Atualiza a UI de status (fôlego, tokens etc.)
      montarStatus();
      document.getElementById("toggle-quebra-ego").checked = true;
    });

    mostrarToast("Quebra de Ego aplicada! −3 Fôlego, 2 Desv. em atributos, −2 Bônus em 3 Jogadas.", "erro");
    fechar();
  });
}

function atualizarVisaoGeralRemota() {
  // Quando a ficha muda remotamente (ex: Mestre passou a rodada e
  // decrementou cooldowns), re-renderiza só as partes voláteis.
  if (hexagonoSvg) atualizarValoresHexagono(hexagonoSvg, estado.ficha.atributos);
  montarCooldowns();
  montarHistoricoRolagens();
  // Atualiza steppers de tokens/fôlego/chama sem perder o foco do usuário se possível
  const ativo = document.activeElement;
  const dentroDeStepper = ativo && ativo.closest && ativo.closest(".stepper");
  if (!dentroDeStepper) {
    montarStatus();
  }
}

document.addEventListener("fichaapp:pronta", () => {
  montarVisaoGeral();
  registrarListenerAtualizacao(atualizarVisaoGeralRemota);
});
