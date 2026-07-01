// ============================================================
// FÓRMULA DO EGO — Bônus Automáticos por Jogada
// Calcula, a partir de TODAS as fontes passivas da ficha
// (Perícias de Classe, Perícias gerais escolhidas, Cor de Ego),
// quantas Vantagens/Desvantagens/Bônus já se aplicam de cara
// a uma Jogada específica, antes de qualquer ajuste manual.
// ============================================================

import { JOGADAS_BASE, JOGADAS_COR_EGO, corComVantagemSobre } from "./data/regras-base.js";
import { CLASSES } from "./data/classes-parte2.js";

const MAPA_NOME_PARA_ID = (() => {
  const mapa = {};
  JOGADAS_BASE.forEach((j) => { mapa[normalizarNome(j.nome)] = j.id; });
  mapa[normalizarNome("Roubar")] = "roubo"; // variante usada na Ninja Invisível
  return mapa;
})();

function normalizarNome(str) {
  return str.trim().toLowerCase();
}

// Faz o parsing de uma string de perícia tipo "2 Vantagens em Passe Longo"
// Retorna { qtd, jogadaId } ou null se não for uma perícia de Jogada testável
// (ex: "Vantagem em Devorar" não mapeia pra uma Jogada própria, é mecânica especial).
function parsearStringPericia(str) {
  const m = str.match(/(\d+)\s+(?:Vantagem|Vantagens)\s+em\s+(.+)/i);
  if (!m) return null;
  const qtd = parseInt(m[1], 10);
  const nomeJogada = normalizarNome(m[2]);
  const jogadaId = MAPA_NOME_PARA_ID[nomeJogada];
  if (!jogadaId) return null; // ex: "Devorar" — mecânica especial, sem Jogada própria
  return { qtd, jogadaId };
}

// Pré-processa as Perícias de Classe de todas as 25 classes uma única vez,
// indexando por jogadaId -> { classeId -> qtd }
const PERICIAS_CLASSE_POR_JOGADA = (() => {
  const indice = {};
  CLASSES.forEach((classe) => {
    classe.pericias.forEach((str) => {
      const parsed = parsearStringPericia(str);
      if (!parsed) return;
      if (!indice[parsed.jogadaId]) indice[parsed.jogadaId] = {};
      indice[parsed.jogadaId][classe.id] = parsed.qtd;
    });
  });
  return indice;
})();

/**
 * Calcula o total de Vantagens automáticas que uma ficha já recebe
 * para uma Jogada específica, vindas de todas as fontes conhecidas.
 *
 * @param {string} jogadaId - id da jogada em JOGADAS_BASE (ex: "passe_longo")
 * @param {object} ficha - ficha completa do personagem
 * @param {object} [opcoes]
 * @param {string} [opcoes.corOponente] - cor de ego do oponente, se relevante
 * @returns {{ vantagens: number, desvantagens: number, bonus: number, fontes: string[] }}
 */
function calcularBonusAutomatico(jogadaId, ficha, opcoes = {}) {
  let vantagens = 0;
  let desvantagens = 0;
  let bonus = 0;
  const fontes = [];

  // --- 1. Perícia de Classe ---
  const porClasse = PERICIAS_CLASSE_POR_JOGADA[jogadaId];
  if (porClasse && ficha.classe && porClasse[ficha.classe] !== undefined) {
    const qtd = porClasse[ficha.classe];
    vantagens += qtd;
    const classeObj = CLASSES.find((c) => c.id === ficha.classe);
    fontes.push(`+${qtd} Vantagem${qtd > 1 ? "s" : ""} (Perícia de ${classeObj?.nome || "Classe"})`);
  }

  // --- 2. Perícias gerais escolhidas pelo jogador ---
  (ficha.pericias || []).forEach((p) => {
    if (p.jogadaId !== jogadaId) return;
    const qtd = p.tipo === "dupla" ? 2 : 1;
    vantagens += qtd;
    fontes.push(`+${qtd} Vantagem${qtd > 1 ? "s" : ""} (Perícia ${p.tipo === "dupla" ? "Dupla" : "Única"})`);
  });

  // --- 3. Cor de Ego ---
  const jogadaObj = JOGADAS_BASE.find((j) => j.id === jogadaId);
  const nomeJogadaAtual = jogadaObj?.nome;
  const elegivelParaCorEgo = nomeJogadaAtual && JOGADAS_COR_EGO.includes(nomeJogadaAtual);
  if (elegivelParaCorEgo && ficha.corEgo && opcoes.corOponente) {
    const temVantagem = corComVantagemSobre(ficha.corEgo) === opcoes.corOponente;
    if (temVantagem) {
      vantagens += 1;
      fontes.push(`+1 Vantagem (Cor de Ego: ${ficha.corEgo} vs ${opcoes.corOponente})`);
    }
  }

  // --- 4. Habilidades com duração ativa OU instantâneas recém usadas ---
  (ficha.cooldowns || []).forEach((cd) => {
    if (!cd.bonusAtivo) return;
    const b = cd.bonusAtivo;

    // Habilidade com duração: só aplica enquanto duracaoAtual > 0
    const temDuracao = cd.duracaoAtual && cd.duracaoAtual > 0;
    // Habilidade instantânea recém usada: aplica uma vez (cooldownAtual === cooldownMax, ou seja, acabou de ser ativada)
    const foiUsadaAgora = b.duracaoUnica && cd.cooldownAtual === cd.cooldownMax && cd.cooldownMax > 0;

    if (!temDuracao && !foiUsadaAgora) return;

    const aplicavel = !b.jogadaAlvo || b.jogadaAlvo === jogadaId;
    if (!aplicavel) return;

    if (b.vantagens && b.vantagens > 0) {
      vantagens += b.vantagens;
      const label = temDuracao
        ? `+${b.vantagens}V (${cd.nome} ativa — ${cd.duracaoAtual} rod. restante${cd.duracaoAtual !== 1 ? "s" : ""})`
        : `+${b.vantagens}V (${cd.nome})`;
      fontes.push(label);
    }
    if (b.bonusFixo && b.bonusFixo > 0) {
      bonus += b.bonusFixo;
      fontes.push(`+${b.bonusFixo} Bônus (${cd.nome})`);
    }
  });

  return { vantagens, desvantagens, bonus, fontes, elegivelParaCorEgo };
}

export { calcularBonusAutomatico, parsearStringPericia, PERICIAS_CLASSE_POR_JOGADA };
