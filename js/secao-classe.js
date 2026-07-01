// ============================================================
// FÓRMULA DO EGO — Seção: Classe & Habilidades
// ============================================================

import { estado, salvarCampo, salvarCampoImediato, registrarListenerAtualizacao, atualizarTopbarClasse } from "./ficha-core.js";
import { mostrarToast, abrirModal } from "./ui-utils.js";
import { CLASSES } from "./data/classes-parte2.js";
import { SINGULARIDADES_MAXIMAS } from "./data/singularidades.js";
import { CATEGORIA_PRINCIPAL } from "./data/essencias.js";
import { renderizarDetalheClasse, renderizarDetalheSingularidade, renderizarDetalheCategoria } from "./render-classe.js";
import { JOGADAS_BASE } from "./data/regras-base.js";

// ----------------------------------------------------------------
// Categoria principal
// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
// Ativação de habilidades com dado de duração + bônus automático
// ----------------------------------------------------------------
function rolarDadoDuracao(notacao) {
  // Suporta "1D4+1", "1D6", "1D2+2" etc.
  const m = notacao.match(/(\d+)D(\d+)([+-]\d+)?/i);
  if (!m) return parseInt(notacao, 10) || 1;
  const qtd = parseInt(m[1], 10);
  const lados = parseInt(m[2], 10);
  const mod = m[3] ? parseInt(m[3], 10) : 0;
  let total = 0;
  for (let i = 0; i < qtd; i++) total += Math.floor(Math.random() * lados) + 1;
  return Math.max(1, total + mod);
}

function nomeJogadaParaId(nome) {
  const j = JOGADAS_BASE.find(x => x.nome === nome);
  return j ? j.id : null;
}

// Abre o modal de rolagem de duração e ativa a habilidade com duração variável
function abrirModalDuracao(habilidade, origem) {
  const dadoText = habilidade.dadoDuracao;
  const resultadoDado = rolarDadoDuracao(dadoText);

  const wrap = document.createElement("div");
  wrap.style.textAlign = "center";
  wrap.innerHTML = `
    <div style="background:var(--cinza-claro);border-radius:var(--radius-md);padding:20px;margin-bottom:16px;">
      <div style="font-size:0.85rem;color:var(--cinza-escuro);margin-bottom:6px;">Rolando ${dadoText}...</div>
      <div style="font-family:var(--fonte-display);font-size:3rem;color:var(--azul-marinho);line-height:1;">${resultadoDado}</div>
      <div style="font-size:0.85rem;margin-top:6px;">rodada${resultadoDado !== 1 ? "s" : ""} de duração</div>
    </div>
    ${habilidade.bonus && (habilidade.bonus.vantagens > 0 || habilidade.bonus.bonusFixo > 0) ? `
      <div class="bonus-automatico-box">
        <strong>Bônus ativo durante a duração:</strong>
        <ul style="margin:6px 0 0;padding-left:18px;">
          ${habilidade.bonus.vantagens > 0 ? `<li>+${habilidade.bonus.vantagens} Vantagem${habilidade.bonus.vantagens > 1 ? "s" : ""}</li>` : ""}
          ${habilidade.bonus.bonusFixo > 0 ? `<li>+${habilidade.bonus.bonusFixo} de Bônus</li>` : ""}
          ${habilidade.bonus.condicao ? `<li style="color:var(--cinza-escuro);font-size:0.8rem;">${habilidade.bonus.condicao}</li>` : ""}
        </ul>
      </div>
    ` : ""}
    <button class="btn btn-primario" id="btn-confirmar-ativacao" style="width:100%;margin-top:8px;">
      ✅ Confirmar — ativar por ${resultadoDado} Rodada${resultadoDado !== 1 ? "s" : ""}
    </button>
  `;

  const { fechar } = abrirModal({ titulo: `⚡ ${habilidade.nome}`, conteudoEl: wrap });

  wrap.querySelector("#btn-confirmar-ativacao").addEventListener("click", () => {
    ativarHabilidadeComDuracao(habilidade, origem, resultadoDado);
    fechar();
  });
}

function ativarHabilidadeComDuracao(habilidade, origem, duracao) {
  const turnoAtual = (estado.campanha?.turnoAtualIndex ?? 0) + 1;
  const rodadaAtual = estado.campanha?.rodadaAtual ?? 1;

  const cooldowns = [...(estado.ficha.cooldowns || [])];
  const id = habilidade.nome.toLowerCase().replace(/\s+/g, "-");
  const existente = cooldowns.find(c => c.id === id);

  const entrada = {
    id,
    nome: habilidade.nome,
    origem,
    cooldownMax: typeof habilidade.cooldown === "number" ? habilidade.cooldown : 0,
    // cooldownAtual começa em 0 — só inicia quando a duração acabar
    cooldownAtual: 0,
    duracaoAtual: duracao,
    duracaoMax: duracao,
    usadoNaTurno: turnoAtual,
    usadoNaRodada: rodadaAtual,
    disponivelNaTurno: turnoAtual,
    disponivelNaRodada: rodadaAtual + (typeof habilidade.cooldown === "number" ? habilidade.cooldown : 0),
    // Bônus que ficam ativos enquanto a habilidade está rodando
    bonusAtivo: habilidade.bonus || null
  };

  if (existente) {
    Object.assign(existente, entrada);
  } else {
    cooldowns.push(entrada);
  }

  salvarCampoImediato({ cooldowns });
  mostrarToast(`${habilidade.nome} ativada por ${duracao} rodada${duracao !== 1 ? "s" : ""}!`, "sucesso");
}

function ativarHabilidadeInstantanea(habilidade, origem) {
  const turnoAtual = (estado.campanha?.turnoAtualIndex ?? 0) + 1;
  const rodadaAtual = estado.campanha?.rodadaAtual ?? 1;

  const cooldowns = [...(estado.ficha.cooldowns || [])];
  const id = habilidade.nome.toLowerCase().replace(/\s+/g, "-");
  const existente = cooldowns.find(c => c.id === id);

  const entrada = {
    id,
    nome: habilidade.nome,
    origem,
    cooldownMax: typeof habilidade.cooldown === "number" ? habilidade.cooldown : 0,
    cooldownAtual: typeof habilidade.cooldown === "number" ? habilidade.cooldown : 0,
    duracaoAtual: 0,
    duracaoMax: 0,
    usadoNaTurno: turnoAtual,
    usadoNaRodada: rodadaAtual,
    disponivelNaTurno: turnoAtual,
    disponivelNaRodada: rodadaAtual + (typeof habilidade.cooldown === "number" ? habilidade.cooldown : 0),
    bonusAtivo: habilidade.bonus || null
  };

  if (existente) {
    Object.assign(existente, entrada);
  } else {
    cooldowns.push(entrada);
  }

  // Mostra resumo dos bônus desta jogada instantânea
  const b = habilidade.bonus;
  if (b && (b.vantagens > 0 || b.bonusFixo > 0)) {
    const partes = [];
    if (b.vantagens > 0) partes.push(`+${b.vantagens}V`);
    if (b.bonusFixo > 0) partes.push(`+${b.bonusFixo} Bônus`);
    mostrarToast(`${habilidade.nome}: ${partes.join(", ")}${b.condicao ? " — " + b.condicao : ""}`, "sucesso");
  } else {
    mostrarToast(`${habilidade.nome} usada! Cooldown: ${habilidade.cooldown} rodadas.`, "sucesso");
  }

  salvarCampoImediato({ cooldowns });
}

// ----------------------------------------------------------------
// Botões "Usar" nas habilidades
// ----------------------------------------------------------------
function montarBotoesUsoHabilidade(container, classe) {
  const chaves = [
    { ref: classe.comBola, origem: "Com a bola" },
    { ref: classe.semBola, origem: "Sem a bola" },
    { ref: classe.variavel, origem: "Variável" },
  ];

  const blocos = container.querySelectorAll(".detalhe-habilidade");
  chaves.forEach((item, idx) => {
    const h = item.ref;
    const bloco = blocos[idx];
    if (!bloco || typeof h.cooldown !== "number") return;

    const id = h.nome.toLowerCase().replace(/\s+/g, "-");
    const cdAtual = (estado.ficha.cooldowns || []).find(c => c.id === id);
    const emCooldown = cdAtual && cdAtual.cooldownAtual > 0;
    const emDuracao = cdAtual && cdAtual.duracaoAtual > 0;

    // Bloco de bônus da habilidade
    if (h.bonus && (h.bonus.vantagens !== 0 || h.bonus.bonusFixo !== 0 || h.bonus.condicao)) {
      const b = h.bonus;
      const bonusDiv = document.createElement("div");
      bonusDiv.className = "habilidade-bonus-resumo";
      const partes = [];
      if (b.vantagens > 0) partes.push(`+${b.vantagens}V`);
      if (b.bonusFixo > 0) partes.push(`+${b.bonusFixo} Bônus`);
      bonusDiv.innerHTML = `<span class="habilidade-bonus-badge">${partes.join(" / ") || "Ver condição"}</span> ${b.condicao ? `<span class="texto-discreto">${b.condicao}</span>` : ""}`;
      bloco.appendChild(bonusDiv);
    }

    // Indicador de duração ativa
    if (emDuracao) {
      const duracaoDiv = document.createElement("div");
      duracaoDiv.className = "habilidade-duracao-ativa";
      duracaoDiv.textContent = `⏳ Ativa por mais ${cdAtual.duracaoAtual} rodada${cdAtual.duracaoAtual !== 1 ? "s" : ""}`;
      bloco.appendChild(duracaoDiv);
    }

    // Botão Usar
    const btn = document.createElement("button");
    btn.className = "btn btn-primario btn-pequeno";
    btn.style.marginTop = "8px";

    if (emCooldown) {
      btn.disabled = true;
      btn.textContent = `🔒 Cooldown: ${cdAtual.cooldownAtual} rodada${cdAtual.cooldownAtual !== 1 ? "s" : ""}`;
    } else {
      btn.textContent = h.dadoDuracao
        ? `🎲 Usar — rolar ${h.dadoDuracao} de duração`
        : `⚡ Usar (cooldown: ${h.cooldown})`;

      btn.addEventListener("click", () => {
        if (h.dadoDuracao) {
          abrirModalDuracao(h, item.origem);
        } else {
          ativarHabilidadeInstantanea(h, item.origem);
        }
      });
    }

    bloco.appendChild(btn);
  });
}

// ----------------------------------------------------------------
// Detalhes da classe
// ----------------------------------------------------------------
function montarDetalheClasse() {
  const classeObj = CLASSES.find(c => c.id === estado.ficha.classe);
  const container = document.getElementById("detalhe-classe");
  renderizarDetalheClasse(container, classeObj);
  if (classeObj) montarBotoesUsoHabilidade(container, classeObj);
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

// ----------------------------------------------------------------
// Singularidade
// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
// Init
// ----------------------------------------------------------------
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
