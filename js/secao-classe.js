// ============================================================
// FÓRMULA DO EGO — Seção: Classe & Habilidades
// ============================================================

import { estado, salvarCampo, registrarListenerAtualizacao, atualizarTopbarClasse } from "./ficha-core.js";
import { mostrarToast } from "./ui-utils.js";
import { CLASSES } from "./data/classes-parte2.js";
import { SINGULARIDADES_MAXIMAS } from "./data/singularidades.js";
import { CATEGORIA_PRINCIPAL } from "./data/essencias.js";
import { renderizarDetalheClasse, renderizarDetalheSingularidade, renderizarDetalheCategoria } from "./render-classe.js";

function popularSelectSubcategoria() {
  const selectCategoria = document.getElementById("select-categoria");
  const selectSub = document.getElementById("select-subcategoria");
  const categoriaObj = CATEGORIA_PRINCIPAL[selectCategoria.value];

  if (!categoriaObj) {
    selectSub.innerHTML = `<option value="">— Escolher categoria primeiro —</option>`;
    selectSub.disabled = true;
    return;
  }
  selectSub.disabled = false;
  selectSub.innerHTML = `<option value="">— Escolher —</option>`;
  categoriaObj.subcategorias.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.nome;
    selectSub.appendChild(opt);
  });
  selectSub.value = estado.ficha.subcategoria || "";
}

function montarDetalheCategoria() {
  const categoriaObj = CATEGORIA_PRINCIPAL[estado.ficha.categoriaPrincipal];
  renderizarDetalheCategoria(document.getElementById("detalhe-categoria"), categoriaObj, estado.ficha.subcategoria);
}

function montarSelectCategoria() {
  const selectCategoria = document.getElementById("select-categoria");
  const selectSub = document.getElementById("select-subcategoria");

  selectCategoria.value = estado.ficha.categoriaPrincipal || "";
  popularSelectSubcategoria();

  selectCategoria.addEventListener("change", () => {
    salvarCampo({ categoriaPrincipal: selectCategoria.value, subcategoria: "" });
    popularSelectSubcategoria();
    montarDetalheCategoria();
  });

  selectSub.addEventListener("change", () => {
    salvarCampo({ subcategoria: selectSub.value });
    montarDetalheCategoria();
  });

  montarDetalheCategoria();
}

function popularSelectClasses() {
  const select = document.getElementById("select-classe");
  select.innerHTML = `<option value="">— Escolher —</option>`;
  CLASSES.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nome;
    select.appendChild(opt);
  });
  select.value = estado.ficha.classe || "";
}

function montarBotoesUsoHabilidade(container, classe) {
  const habilidadesComCooldown = [
    { ref: classe.comBola, origem: "Com a bola" },
    { ref: classe.semBola, origem: "Sem a bola" },
    { ref: classe.variavel, origem: "Variável" },
  ];

  const blocos = container.querySelectorAll(".detalhe-habilidade");
  habilidadesComCooldown.forEach((item, idx) => {
    const bloco = blocos[idx];
    if (!bloco || typeof item.ref.cooldown !== "number") return;
    const btn = document.createElement("button");
    btn.className = "btn btn-primario btn-pequeno";
    btn.style.marginTop = "8px";
    btn.textContent = `Usar (ativa cooldown de ${item.ref.cooldown})`;
    btn.addEventListener("click", () => ativarCooldown(item.ref.nome, item.ref.cooldown, item.origem));
    bloco.appendChild(btn);
  });
}

function ativarCooldown(nomeHabilidade, cooldownMax, origem) {
  const cooldowns = [...(estado.ficha.cooldowns || [])];
  const existente = cooldowns.find(c => c.nome === nomeHabilidade);
  if (existente) {
    existente.cooldownAtual = cooldownMax;
    existente.cooldownMax = cooldownMax;
  } else {
    cooldowns.push({
      id: nomeHabilidade.toLowerCase().replace(/\s+/g, "-"),
      nome: nomeHabilidade,
      origem,
      cooldownMax,
      cooldownAtual: cooldownMax
    });
  }
  salvarCampo({ cooldowns });
  mostrarToast(`${nomeHabilidade} entrou em cooldown (${cooldownMax} rodadas).`, "sucesso");
}

function montarDetalheClasse() {
  const classeObj = CLASSES.find(c => c.id === estado.ficha.classe);
  const container = document.getElementById("detalhe-classe");
  renderizarDetalheClasse(container, classeObj);
  if (classeObj) montarBotoesUsoHabilidade(container, classeObj);
}

function montarSelectClasse() {
  popularSelectClasses();
  const select = document.getElementById("select-classe");
  select.addEventListener("change", () => {
    salvarCampo({ classe: select.value });
    montarDetalheClasse();
    atualizarTopbarClasse();
  });
  montarDetalheClasse();
}

function popularSelectSingularidade() {
  const select = document.getElementById("select-singularidade");
  select.innerHTML = `<option value="">— Escolher —</option>`;
  SINGULARIDADES_MAXIMAS.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.nome;
    select.appendChild(opt);
  });
  select.value = estado.ficha.singularidadeMaxima || "";
}

function montarSingularidade() {
  const card = document.getElementById("card-singularidade");
  card.hidden = estado.ficha.estagio !== "mestre";
  if (card.hidden) return;

  popularSelectSingularidade();
  const select = document.getElementById("select-singularidade");
  const detalhe = document.getElementById("detalhe-singularidade");

  function render() {
    const obj = SINGULARIDADES_MAXIMAS.find(s => s.id === select.value);
    renderizarDetalheSingularidade(detalhe, obj);
  }

  select.addEventListener("change", () => {
    salvarCampo({ singularidadeMaxima: select.value });
    render();
  });
  render();
}

function montarAbaClasse() {
  montarSelectCategoria();
  montarSelectClasse();
  montarSingularidade();
}

document.addEventListener("fichaapp:pronta", () => {
  montarAbaClasse();
  registrarListenerAtualizacao(() => {
    montarDetalheClasse();
    montarSingularidade();
    montarDetalheCategoria();
  });
});
