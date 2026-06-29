// ============================================================
// FÓRMULA DO EGO — Seção: Visão Geral
// ============================================================

import { estado, salvarCampo, salvarCampoImediato, registrarListenerAtualizacao } from "./ficha-core.js";
import { criarHexagonoAtributos, atualizarValoresHexagono, ORDEM_ATRIBUTOS } from "./hexagono.js";
import { criarStepper, mostrarToast } from "./ui-utils.js";
import { ATRIBUTOS, CORES_EGO, COR_EGO_HEX, ESTAGIOS, JOGADAS_BASE } from "./data/regras-base.js";
import {
  calcDistanciaChute, calcDistanciaPasse, calcFolegoMaximo, calcLimiteTokensEgo
} from "./engine-regras.js";
import { renderizarListaJogadas, abrirModalRolagem, renderizarCooldowns, nomeAtributoComposto, valorAtributoComposto } from "./render-jogadas.js";

let hexagonoSvg = null;

function montarHexagono() {
  const wrap = document.getElementById("wrap-hexagono");
  hexagonoSvg = criarHexagonoAtributos(estado.ficha.atributos, (atrId) => {
    const valor = valorAtributoComposto(atrId, estado.ficha.atributos);
    abrirModalRolagem({
      titulo: `Rolar ${ATRIBUTOS[atrId].nome}`,
      atributoValor: valor
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
  toggleQuebra.addEventListener("change", () => salvarCampo({ estadoQuebraEgo: toggleQuebra.checked }));

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
        atributoValor: valorAtr
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
}

function atualizarVisaoGeralRemota() {
  // Quando a ficha muda remotamente (ex: Mestre passou a rodada e
  // decrementou cooldowns), re-renderiza só as partes voláteis.
  if (hexagonoSvg) atualizarValoresHexagono(hexagonoSvg, estado.ficha.atributos);
  montarCooldowns();
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
