// ============================================================
// FÓRMULA DO EGO — Modelo de dados da Ficha de Personagem
// Define a estrutura padrão salva no Firestore e funções de
// criação/normalização de fichas.
// ============================================================

import { gerarIdAleatorio } from "./ui-utils.js";

// Cria uma ficha nova em branco (mas já com todos os campos),
// pronta para edição livre (sem ordem obrigatória).
function criarFichaVazia({ nomeJogador = "", uid = "" } = {}) {
  return {
    id: gerarIdAleatorio(),
    uid, // dono da ficha (Firebase Auth UID)
    nomeJogador,
    nomePersonagem: "Novo Jogador",
    foto: "",
    numeroCamisa: "",
    posicao: "",
    estagio: "iniciante", // iniciante | intermediario | profissional | mestre

    atributos: {
      potencia: 0, destreza: 0, robustez: 0,
      visao: 0, drible: 0, ego: 0
    },

    corEgo: "",
    essenciaEgo: "",
    categoriaPrincipal: "", // genio | aprendiz
    subcategoria: "",
    classe: "",

    // Estado de jogo (editável livremente, sem ordem)
    tokensEgo: 4,
    tokensEgoLimiteExtra: 0, // ajuste manual opcional sobre o limite calculado
    folegoAtual: 6,
    folegoMaximoExtra: 0, // ajuste manual sobre o cálculo de fôlego máx
    pontosChama: 2,
    fluxoPorcentagem: 0,
    fluxoPDgastos: { vantagemBonus: null, atributo: null, efeitosEspeciais: [] },

    estadoEgoInflado: false,
    estadoQuebraEgo: false,
    estadoQuebraEgoRodadasRestantes: 0,

    talentosImpetuosos: [], // [{ id, nivel }]
    pericias: [], // [{ jogadaId, tipo: 'unica'|'dupla' }]
    singularidadeMaxima: "",

    historicoRolagens: [], // [{ titulo, total, vantagens, desvantagens, bonus, execucao, quando }]

    // Habilidades/cooldowns rastreados nesta ficha (preenchido ao escolher classe)
    cooldowns: [], // [{ id, nome, origem, cooldownMax, cooldownAtual }]

    anotacoes: "",

    criadoEm: Date.now(),
    atualizadoEm: Date.now()
  };
}

// Garante que uma ficha carregada do Firestore tenha todos os campos
// (proteção contra fichas antigas / parciais)
function normalizarFicha(ficha) {
  const base = criarFichaVazia({ uid: ficha.uid });
  return { ...base, ...ficha,
    atributos: { ...base.atributos, ...(ficha.atributos || {}) },
    fluxoPDgastos: { ...base.fluxoPDgastos, ...(ficha.fluxoPDgastos || {}) },
    talentosImpetuosos: ficha.talentosImpetuosos || [],
    pericias: ficha.pericias || [],
    cooldowns: ficha.cooldowns || [],
    historicoRolagens: ficha.historicoRolagens || []
  };
}

// Cria um registro de campanha em branco
function criarCampanhaVazia({ nome, uidMestre, nomeMestre }) {
  return {
    id: gerarIdAleatorio(),
    nome: nome || "Nova Campanha",
    uidMestre,
    nomeMestre,
    codigoConvite: "", // preenchido externamente
    membros: [], // [{ uid, nome, fichaId }]
    rodadaAtual: 1,
    criadoEm: Date.now(),
    atualizadoEm: Date.now()
  };
}

export { criarFichaVazia, normalizarFicha, criarCampanhaVazia };
