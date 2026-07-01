// ============================================================
// FÓRMULA DO EGO — Engine de Regras
// Funções puras de cálculo: dados, distâncias, fôlego, cooldowns
// ============================================================

// --- Rolagem de dados ---
function rolarDado(lados) {
  return Math.floor(Math.random() * lados) + 1;
}

function rolarVarios(qtd, lados) {
  const resultados = [];
  for (let i = 0; i < qtd; i++) resultados.push(rolarDado(lados));
  return resultados;
}

// Interpreta notação tipo "1D6", "2D4+1", "1D6+2" -> {qtd, lados, mod}
function parseDado(notacao) {
  if (typeof notacao === "number") return { fixo: notacao };
  const m = String(notacao).match(/(\d+)D(\d+)(?:\s*\+\s*(\d+))?/i);
  if (!m) return { fixo: 0 };
  return { qtd: parseInt(m[1]), lados: parseInt(m[2]), mod: m[3] ? parseInt(m[3]) : 0 };
}

function rolarNotacao(notacao) {
  const p = parseDado(notacao);
  if (p.fixo !== undefined) return { total: p.fixo, detalhes: [], formula: String(notacao) };
  const detalhes = rolarVarios(p.qtd, p.lados);
  const soma = detalhes.reduce((a, b) => a + b, 0) + (p.mod || 0);
  return { total: soma, detalhes, formula: notacao };
}

// --- Cálculo de Execução Absoluta (crítico) ---
// Regra: precisa tirar 12 no D12 base. Depois, para cada D6 com 5 ou 6,
// sobe o nível: 1-2 D6 acertando = NP, 3-4 = MP, 5-6 = EP
function calcularExecucaoAbsoluta(d12Resultado, d6Resultados) {
  if (d12Resultado !== 12) return null;
  const acertos = d6Resultados.filter(v => v === 5 || v === 6).length;
  if (acertos >= 5) return { id: "EP", nome: "Extremamente Positivo", tokensBonus: 3 };
  if (acertos >= 3) return { id: "MP", nome: "Medianamente Positivo", tokensBonus: 2 };
  if (acertos >= 1) return { id: "NP", nome: "Normalmente Positivo", tokensBonus: 1 };
  return null;
}

// --- Rolagem completa de uma Jogada ---
// atributoValor: valor do atributo (+4 a -1)
// vantagens, desvantagens: inteiros >= 0
// bonus: modificador fixo aplicado ao resultado final
function rolarJogada({ atributoValor = 0, vantagens = 0, desvantagens = 0, bonus = 0 }) {
  let qtdD6 = Math.max(atributoValor, 0) + vantagens - desvantagens;
  let d12Qtd = 1;
  let pegarMenor = false;

  // Regra do -1: rola 2D12 e pega o menor
  if (atributoValor === -1) {
    d12Qtd = 2;
    pegarMenor = true;
  }

  // Se desvantagens ultrapassarem o total de dados positivos, rola dado
  // extra e pega o menor resultado para cada desvantagem "negativa"
  let dadosNegativosExtra = 0;
  if (qtdD6 < 0) {
    dadosNegativosExtra = Math.abs(qtdD6);
    qtdD6 = 0;
  }

  const d12s = rolarVarios(d12Qtd, 12);
  const d12Final = pegarMenor ? Math.min(...d12s) : d12s[0];

  const d6s = rolarVarios(qtdD6, 6);
  const somaD6 = d6s.reduce((a, b) => a + b, 0);

  // Dados negativos extras: para cada um, rola 1 dado adicional e usa o pior resultado
  // (regra simplificada: cada desvantagem abaixo de 0 rola 1D6 extra e descarta o maior)
  let penalidadeNegativa = 0;
  const d6sNegativos = [];
  for (let i = 0; i < dadosNegativosExtra; i++) {
    const par = rolarVarios(2, 6);
    const usado = Math.min(...par);
    d6sNegativos.push({ rolados: par, usado });
    penalidadeNegativa += usado;
  }

  const totalBruto = d12Final + somaD6 - (dadosNegativosExtra > 0 ? 0 : 0);
  // Nota: quando há dadosNegativosExtra, eles representam desvantagem pura,
  // então subtraem do resultado final ao invés de somar.
  const total = d12Final + somaD6 - penalidadeNegativa + bonus;

  const execucao = calcularExecucaoAbsoluta(d12Final, d6s);

  return {
    d12: { resultados: d12s, usado: d12Final, pegouMenor: pegarMenor },
    d6: { resultados: d6s, soma: somaD6 },
    d6Negativos: d6sNegativos,
    penalidadeNegativa,
    bonus,
    total,
    totalSemBonus: total - bonus,
    execucaoAbsoluta: execucao,
    vantagens, desvantagens, atributoValor
  };
}

// --- Fórmulas derivadas do personagem ---
function calcDistanciaChute(potencia) { return potencia + 6; }
function calcDistanciaPasse(visao) { return visao + 6; }
function calcFolegoMaximo(destreza) { return 6 + destreza; }
function calcLimiteTokensEgo(ego) { return 5 + ego; }
function calcDJQuebraEgo(ego) { return 16 - ego; }

// --- Gestão de Cooldowns por Turno do Personagem ---
// Nova estrutura de cooldown:
// { id, nome, origem, cooldownMax, cooldownAtual,
//   usadoNaTurno?, usadoNaRodada?, disponivelNaTurno?, disponivelNaRodada? }
//
// cooldownAtual: quantos turnos do PRÓPRIO personagem ainda faltam
// usadoNaTurno/Rodada: quando foi ativado (para o indicador visual)
// disponivelNaTurno/Rodada: quando volta a ficar disponível

// Cria um registro de cooldown ao ativar uma habilidade
function ativarCooldownHabilidade(habilidade, turnoAtual, rodadaAtual) {
  const disponivelNaTurno = turnoAtual; // mesmo turno, mas na próxima ocorrência
  const rodadasParaVoltar = habilidade.cooldown || habilidade.cooldownMax || 1;
  return {
    id: habilidade.id || habilidade.nome.toLowerCase().replace(/\s+/g, "-"),
    nome: habilidade.nome,
    origem: habilidade.origem || "",
    cooldownMax: rodadasParaVoltar,
    cooldownAtual: rodadasParaVoltar,
    usadoNaTurno: turnoAtual,   // posição na fila (1 = primeiro, 2 = segundo...)
    usadoNaRodada: rodadaAtual,
    disponivelNaTurno: turnoAtual,
    disponivelNaRodada: rodadaAtual + rodadasParaVoltar
  };
}

// Chamado quando CHEGA O TURNO do personagem dono do cooldown.
// Lógica:
//   - Se a habilidade tem duração ativa (duracaoAtual > 0): desconta 1 da duração.
//     Quando a duração chega a 0, inicia o cooldown automaticamente.
//   - Se a habilidade está em cooldown (cooldownAtual > 0, sem duração): desconta 1 do cooldown.
function passarTurnoDoCooldown(cooldowns) {
  return cooldowns.map(h => {
    // Habilidade com duração ativa — desconta duração
    if (h.duracaoAtual && h.duracaoAtual > 0) {
      const novasDuracao = h.duracaoAtual - 1;
      return {
        ...h,
        duracaoAtual: novasDuracao,
        // Quando duração zera, inicia o cooldown automaticamente
        cooldownAtual: novasDuracao <= 0 ? (h.cooldownMax || 0) : 0,
      };
    }
    // Habilidade em cooldown — desconta cooldown
    return {
      ...h,
      cooldownAtual: Math.max(0, (h.cooldownAtual || 0) - 1)
    };
  });
}

// Compatibilidade: usado no modo sem iniciativa (sem combate formal).
// Segue a mesma lógica: duração → cooldown automático quando zera.
function passarRodadaCooldowns(habilidades) {
  return habilidades.map(h => {
    if (h.duracaoAtual && h.duracaoAtual > 0) {
      const novasDuracao = h.duracaoAtual - 1;
      return {
        ...h,
        duracaoAtual: novasDuracao,
        cooldownAtual: novasDuracao <= 0 ? (h.cooldownMax || 0) : 0,
      };
    }
    return {
      ...h,
      cooldownAtual: Math.max(0, (h.cooldownAtual || 0) - 1)
    };
  });
}

// Gera o texto descritivo do indicador visual de cooldown
function textoIndicadorCooldown(cd) {
  if (!cd.usadoNaRodada) return `${cd.cooldownAtual} turno${cd.cooldownAtual !== 1 ? "s" : ""} restante${cd.cooldownAtual !== 1 ? "s" : ""}`;
  if (cd.cooldownAtual === 0) return "Disponível agora ✅";
  return `Usada no Turno ${cd.usadoNaTurno} (Rodada ${cd.usadoNaRodada}) — disponível no Turno ${cd.disponivelNaTurno} (Rodada ${cd.disponivelNaRodada})`;
}

// --- Sistema de Tokens de Ego ---
function aplicarResultadoJogadaTokens(tokensAtuais, venceu) {
  return venceu ? tokensAtuais + 1 : Math.max(0, tokensAtuais - 1);
}

function verificarEgoInflado(tokensAtuais, limiteBase) {
  return tokensAtuais > limiteBase;
}

function verificarQuebraEgo(tokensAtuais) {
  return tokensAtuais <= 0;
}

// --- Cor de Ego: ciclo de vantagem ---
const CICLO_CORES = ["vermelho", "azul", "roxo", "cinza", "amarelo", "verde"];
function temVantagemSobre(corPropria, corAlvo) {
  const i = CICLO_CORES.indexOf(corPropria);
  if (i === -1) return false;
  const proxima = CICLO_CORES[(i + 1) % CICLO_CORES.length];
  return proxima === corAlvo;
}

export {
  rolarDado, rolarVarios, parseDado, rolarNotacao,
  calcularExecucaoAbsoluta, rolarJogada,
  calcDistanciaChute, calcDistanciaPasse, calcFolegoMaximo,
  calcLimiteTokensEgo, calcDJQuebraEgo,
  passarRodadaCooldowns, passarTurnoDoCooldown,
  ativarCooldownHabilidade, textoIndicadorCooldown,
  aplicarResultadoJogadaTokens, verificarEgoInflado, verificarQuebraEgo,
  temVantagemSobre, CICLO_CORES
};
