// ============================================================
// FÓRMULA DO EGO — Seção: Talentos Impetuosos
// ============================================================

import { estado, salvarCampo, registrarListenerAtualizacao } from "./ficha-core.js";
import { mostrarToast, abrirModal } from "./ui-utils.js";
import { TALENTOS_IMPETUOSOS, LIMITE_TALENTOS_IMPETUOSOS } from "./data/talentos.js";
import { renderizarDetalheTalentoNivel } from "./render-classe.js";

function atualizarContagem() {
  const qtd = (estado.ficha.talentosImpetuosos || []).length;
  document.getElementById("pill-talentos-contagem").textContent = `${qtd} / ${LIMITE_TALENTOS_IMPETUOSOS}`;
  document.getElementById("btn-add-talento").disabled = qtd >= LIMITE_TALENTOS_IMPETUOSOS;
}

function montarListaTalentosEscolhidos() {
  const container = document.getElementById("lista-talentos-escolhidos");
  const escolhidos = estado.ficha.talentosImpetuosos || [];
  container.innerHTML = "";

  if (escolhidos.length === 0) {
    container.innerHTML = `<div class="estado-vazio"><h3>Nenhum talento ainda</h3><p>Adicione até ${LIMITE_TALENTOS_IMPETUOSOS} Talentos Impetuosos.</p></div>`;
    return;
  }

  escolhidos.forEach((escolha, index) => {
    const talento = TALENTOS_IMPETUOSOS.find(t => t.id === escolha.id);
    if (!talento) return;

    const card = document.createElement("div");
    card.className = "card-talento";
    card.innerHTML = `
      <div class="card-talento-header">
        <h4>${talento.nome}</h4>
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="seletor-nivel">
            ${[1, 2, 3].map(n => `<button class="botao-nivel ${escolha.nivel === n ? "ativo" : ""}" data-nivel="${n}">${n}</button>`).join("")}
          </div>
          <button class="btn btn-icone btn-remover-talento" aria-label="Remover talento">🗑️</button>
        </div>
      </div>
      <p class="flavor-classe">"${talento.flavor}"</p>
      <div class="detalhe-talento-corpo"></div>
    `;

    const corpo = card.querySelector(".detalhe-talento-corpo");
    corpo.innerHTML = renderizarDetalheTalentoNivel(talento, escolha.nivel);

    card.querySelectorAll(".botao-nivel").forEach((btn) => {
      btn.addEventListener("click", () => {
        const novoNivel = parseInt(btn.dataset.nivel, 10);
        const novaLista = [...escolhidos];
        novaLista[index] = { ...escolha, nivel: novoNivel };
        salvarCampo({ talentosImpetuosos: novaLista });
      });
    });

    card.querySelector(".btn-remover-talento").addEventListener("click", () => {
      const novaLista = escolhidos.filter((_, i) => i !== index);
      salvarCampo({ talentosImpetuosos: novaLista });
    });

    container.appendChild(card);
  });
}

function abrirModalEscolherTalento() {
  const escolhidos = estado.ficha.talentosImpetuosos || [];
  const idsJaEscolhidos = escolhidos.map(e => e.id);
  const disponiveis = TALENTOS_IMPETUOSOS.filter(t => !idsJaEscolhidos.includes(t.id));

  if (disponiveis.length === 0) {
    mostrarToast("Todos os talentos já foram adicionados.");
    return;
  }

  const wrap = document.createElement("div");
  disponiveis.forEach((t) => {
    const item = document.createElement("button");
    item.className = "item-ficha-usuario";
    item.style.width = "100%";
    item.style.border = "none";
    item.style.marginBottom = "8px";
    item.innerHTML = `<span><span class="item-ficha-usuario-nome">${t.nome}</span><br><span class="item-ficha-usuario-meta">${t.flavor.slice(0, 70)}...</span></span><span>+</span>`;
    item.addEventListener("click", () => {
      const novaLista = [...escolhidos, { id: t.id, nivel: 1 }];
      salvarCampo({ talentosImpetuosos: novaLista });
      fechar();
    });
    wrap.appendChild(item);
  });

  const { fechar } = abrirModal({ titulo: "Adicionar Talento Impetuoso", conteudoEl: wrap });
}

function montarAbaTalentos() {
  atualizarContagem();
  montarListaTalentosEscolhidos();
  document.getElementById("btn-add-talento").addEventListener("click", abrirModalEscolherTalento);
}

document.addEventListener("fichaapp:pronta", () => {
  montarAbaTalentos();
  registrarListenerAtualizacao(() => {
    atualizarContagem();
    montarListaTalentosEscolhidos();
  });
});
