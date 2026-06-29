// ============================================================
// FÓRMULA DO EGO — Seção: Fluxo
// ============================================================

import { estado, salvarCampo, registrarListenerAtualizacao } from "./ficha-core.js";
import { criarStepper } from "./ui-utils.js";
import { CLASSES } from "./data/classes-parte2.js";
import { renderizarHabilidade } from "./render-classe.js";

function montarBarraFluxo() {
  const pct = Math.max(0, Math.min(100, estado.ficha.fluxoPorcentagem || 0));
  const fill = document.getElementById("barra-fluxo-fill");
  fill.style.width = `${pct}%`;
  fill.classList.toggle("cheia", pct >= 100);

  const wrap = document.getElementById("wrap-fluxo-porcentagem");
  wrap.innerHTML = "";
  wrap.appendChild(criarStepper({
    valor: pct, min: 0, max: 100,
    onChange: (v) => salvarCampo({ fluxoPorcentagem: v })
  }));
}

function montarHabilidadeFluxo() {
  const classeObj = CLASSES.find(c => c.id === estado.ficha.classe);
  const container = document.getElementById("detalhe-fluxo-habilidade");
  const textoPorcentagens = document.getElementById("texto-porcentagens-fluxo");

  if (!classeObj) {
    container.innerHTML = `<p class="texto-discreto">Escolha uma Classe na aba "Classe &amp; Habilidades" para ver sua Habilidade de Fluxo.</p>`;
    textoPorcentagens.textContent = "";
    return;
  }

  container.innerHTML = renderizarHabilidade(classeObj.fluxo);
  textoPorcentagens.textContent = "Ganha %: " + classeObj.porcentagensFluxo.map(([n, p]) => `${n} (+${p}%)`).join(" · ");

  const btn = document.createElement("button");
  btn.className = "btn btn-primario btn-pequeno";
  btn.style.marginTop = "8px";
  btn.textContent = "Ativar Fluxo (zera a barra)";
  btn.addEventListener("click", () => {
    salvarCampo({ fluxoPorcentagem: 0 });
    montarBarraFluxo();
  });
  container.querySelector(".detalhe-habilidade")?.appendChild(btn);
}

function montarAbaFluxo() {
  montarBarraFluxo();
  montarHabilidadeFluxo();
}

document.addEventListener("fichaapp:pronta", () => {
  montarAbaFluxo();
  registrarListenerAtualizacao(() => {
    montarBarraFluxo();
    montarHabilidadeFluxo();
  });
});
