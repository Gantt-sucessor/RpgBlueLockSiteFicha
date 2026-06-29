// ============================================================
// FÓRMULA DO EGO — Seção: Ego & Essência
// ============================================================

import { estado, salvarCampo, registrarListenerAtualizacao } from "./ficha-core.js";
import { CORES_EGO, COR_EGO_HEX, corComVantagemSobre } from "./data/regras-base.js";
import { ESSENCIAS_EGO } from "./data/essencias.js";
import { renderizarDetalheEssencia } from "./render-classe.js";

function montarSeletorCorEgo() {
  const container = document.getElementById("seletor-cor-ego");
  container.innerHTML = "";
  CORES_EGO.forEach((cor) => {
    const vantagemSobre = corComVantagemSobre(cor);
    const div = document.createElement("div");
    div.className = `opcao-cor-ego ${estado.ficha.corEgo === cor ? "selecionada" : ""}`;
    div.tabIndex = 0;
    div.innerHTML = `
      <span class="opcao-cor-ego-amostra" style="background:${COR_EGO_HEX[cor]}"></span>
      <span class="opcao-cor-ego-nome">${cor}</span>
      <span class="opcao-cor-ego-vantagem">vantagem sobre<br><strong>${vantagemSobre}</strong></span>
    `;
    div.addEventListener("click", () => {
      salvarCampo({ corEgo: cor });
      montarSeletorCorEgo();
    });
    container.appendChild(div);
  });
}

function popularSelectEssencia() {
  const select = document.getElementById("select-essencia");
  select.innerHTML = `<option value="">— Escolher —</option>`;
  ESSENCIAS_EGO.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e.id;
    opt.textContent = e.nome;
    select.appendChild(opt);
  });
  select.value = estado.ficha.essenciaEgo || "";
}

function montarDetalheEssencia() {
  const obj = ESSENCIAS_EGO.find(e => e.id === estado.ficha.essenciaEgo);
  renderizarDetalheEssencia(document.getElementById("detalhe-essencia"), obj);
}

function montarSelectEssencia() {
  popularSelectEssencia();
  const select = document.getElementById("select-essencia");
  select.addEventListener("change", () => {
    salvarCampo({ essenciaEgo: select.value });
    montarDetalheEssencia();
  });
  montarDetalheEssencia();
}

function montarAbaEgo() {
  montarSeletorCorEgo();
  montarSelectEssencia();
}

document.addEventListener("fichaapp:pronta", () => {
  montarAbaEgo();
  registrarListenerAtualizacao(() => {
    montarSeletorCorEgo();
    montarDetalheEssencia();
  });
});
