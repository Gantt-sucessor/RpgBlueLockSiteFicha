// ============================================================
// FÓRMULA DO EGO — Dados do sistema base (RPG de Blue Lock)
// Sistema original por xxpaodeforma — fan content, sem fins lucrativos
// ============================================================

const ATRIBUTOS = {
  potencia:    { nome: "Potência",     desc: "Reflete sua potência em chutes, definindo distância, força e velocidade." },
  destreza:    { nome: "Destreza",     desc: "Reflete sua velocidade em geral, agilidade em roubos e fôlego." },
  robustez:    { nome: "Robustez",     desc: "Reflete sua tenência física, músculos resistentes e resiliência." },
  visao:       { nome: "Visão de Jogo",desc: "Reflete seu intelecto em jogo e sua estratégia em equipe." },
  drible:      { nome: "Drible",       desc: "Reflete sua criatividade e velocidade em driblar e esquivar." },
  ego:         { nome: "Ego",          desc: "Reflete seu instinto individualista, o desejo de se destacar." }
};

const VALORES_ATRIBUTO_INICIAL = [4, 3, 2, 1, 0, -1];

// Cores de Ego — ciclo de vantagem (cada cor tem vantagem SOBRE a próxima nesta lista)
// vermelho -> azul -> roxo -> cinza -> amarelo -> verde -> vermelho
const CORES_EGO = ["vermelho", "azul", "roxo", "cinza", "amarelo", "verde"];
const COR_EGO_HEX = {
  vermelho: "#e53935",
  azul:     "#2196f3",
  roxo:     "#7b3fe4",
  cinza:    "#9e9e9e",
  amarelo:  "#f9a825",
  verde:    "#43a047"
};
function corComVantagemSobre(cor) {
  const i = CORES_EGO.indexOf(cor);
  if (i === -1) return null;
  return CORES_EGO[(i + 1) % CORES_EGO.length];
}
// Jogadas em que a vantagem de Cor de Ego se aplica
const JOGADAS_COR_EGO = ["Devorar", "Ego", "Roubo", "Jogo de Corpo", "Interceptação"];

// Tipos de ação
const TIPOS_ACAO = {
  comum:     { nome: "Ação Comum",      limite: "1 por Rodada sua" },
  egoista:   { nome: "Ação Egoísta",    limite: "1 por Rodada sua" },
  reacao:    { nome: "Reação",          limite: "3 fora da sua Rodada" },
  movimento: { nome: "Ação de Movimento", limite: "1 por Rodada" }
};

// Estágios e bonificações
const ESTAGIOS = [
  {
    id: "iniciante",
    nome: "Iniciante",
    frase: "Você pode não ser um dos melhores, mas logo estará chegando ao topo.",
    bonificacoes: ["+2 Pontos de Chama", "Distribuição dos Atributos", "Escolha da Cor de Ego", "Escolha de Categoria e Sub-Categoria"]
  },
  {
    id: "intermediario",
    nome: "Intermediário",
    frase: "Você conseguiu chegar a outro patamar, melhor que iniciantes, mas ainda não está lá.",
    bonificacoes: ["+1 Ponto de Chama", "Escolha de Essência de Ego", "Perícia Única"]
  },
  {
    id: "profissional",
    nome: "Profissional",
    frase: "Você realmente se tornou alguém melhor que a maioria, um verdadeiro especialista com a bola.",
    bonificacoes: ["+1 Ponto de Chama", "Criação e Liberação do Fluxo"]
  },
  {
    id: "mestre",
    nome: "Mestre",
    frase: "Você é o melhor do mundo, pode até não ser, mas na sua cabeça, você é o melhor.",
    bonificacoes: ["+2 Pontos de Chama", "Liberação e Escolha da Singularidade Máxima", "Perícia Dupla"]
  }
];

// Jogadas (testes) do sistema base — cada uma com atributo, DJ, distância, ação, anormalidade
const JOGADAS_BASE = [
  {
    id: "chute_regular", nome: "Chute Regular",
    desc: "Você faz um chute reto em direção ao gol inimigo.",
    atributo: "potencia", dj: "J vs G",
    distancia: "Igual sua Distância de Chute",
    acao: "comum", anormalidade: "Nenhuma"
  },
  {
    id: "chute_curvo", nome: "Chute Curvo",
    desc: "Você faz um chute que vira em direção ao gol inimigo.",
    atributo: "potencia", dj: "J vs G",
    distancia: "Igual sua Distância de Chute",
    acao: "comum",
    anormalidade: "A trajetória começa com 3m para a direita/esquerda e depois segue o caminho normal."
  },
  {
    id: "knuckleball", nome: "Knuckleball",
    desc: "Um chute que minimiza o giro na bola, causando um movimento imprevisível.",
    atributo: "potencia", dj: "J vs G",
    distancia: "Igual sua Distância de Chute",
    acao: "comum",
    anormalidade: "Role 1D2. Resultado 2 = 1 Vantagem para você. Resultado 1 = 1 Vantagem para o Goleiro."
  },
  {
    id: "passe_curto", nome: "Passe Curto",
    desc: "Você faz um pequeno passe em direção a um alvo próximo.",
    atributo: "visao", dj: 10, distancia: "4 m",
    acao: "comum", anormalidade: "Nenhuma"
  },
  {
    id: "passe_longo", nome: "Passe Longo",
    desc: "Você faz um passe em direção a um alvo longe o suficiente para chegar até ele.",
    atributo: "visao", dj: 16,
    distancia: "Igual sua Distância de Passe",
    acao: "comum", anormalidade: "Nenhuma"
  },
  {
    id: "passe_alto", nome: "Passe Alto",
    desc: "Você faz um passe tão alto que ninguém conseguirá interceptar.",
    atributo: "visao", dj: 24,
    distancia: "Igual sua Distância de Passe",
    acao: "comum", anormalidade: "Não pode ser Interceptado de nenhuma forma."
  },
  {
    id: "roubo", nome: "Roubo",
    desc: "Você dá um avanço no jogador com a bola e tenta pegá-la para sua posse.",
    atributo: "destreza", dj: "J vs J", distancia: "Corpo-a-Corpo",
    acao: "comum_ou_reacao",
    anormalidade: "Caso ganhe, a bola vai para sua posse e você recupera sua Ação Comum."
  },
  {
    id: "jogo_de_corpo", nome: "Jogo de Corpo",
    desc: "Você faz uma arrancada para frente e rouba a bola com força bruta.",
    atributo: "robustez", dj: "J vs J", distancia: "Avanço de 2 m / Corpo-a-Corpo",
    acao: "comum_ou_reacao", custoFolego: 4,
    anormalidade: "Avanço de 2m. Caso ganhe, a bola vai para sua posse, recupera Ação Comum e +3 Fôlegos."
  },
  {
    id: "pivo", nome: "Pivô",
    desc: "Você segura a bola utilizando o seu corpo como escudo.",
    atributo: "robustez", dj: "J vs J", distancia: "Pessoal",
    acao: "comum_mais_movimento",
    anormalidade: "Usa Robustez + 2 de bônus ao invés de Drible até sua próxima Rodada."
  },
  {
    id: "dominio", nome: "Domínio",
    desc: "Ao receber um passe, a sua única forma de manter a bola em sua posse é com um domínio.",
    atributo: "destreza", dj: "32 - número tirado pelo passador", distancia: "Pessoal",
    acao: "reacao_passe",
    anormalidade: "Você pega a bola em sua posse."
  },
  {
    id: "elastico", nome: "Elástico",
    desc: "Você dribla o oponente puxando a bola para um lado e para o outro com só uma perna.",
    atributo: "drible", dj: "J vs J", distancia: "Corpo-a-Corpo",
    acao: "reacao_roubo",
    anormalidade: "Você anda para a direita ou esquerda do driblado."
  },
  {
    id: "caneta", nome: "Caneta",
    desc: "Você dribla o oponente passando a bola pelo meio das pernas do alvo.",
    atributo: "drible", dj: "J vs J", distancia: "Corpo-a-Corpo",
    acao: "reacao_roubo",
    anormalidade: "Caso ganhe, passa para trás do driblado. Se houver outro alvo, deve driblá-lo sem usar Caneta."
  },
  {
    id: "chapeu", nome: "Chapéu",
    desc: "Você dribla o oponente jogando a bola por cima da cabeça do alvo.",
    atributo: "drible", dj: "J vs J", distancia: "Corpo-a-Corpo",
    acao: "reacao_roubo",
    anormalidade: "Jogador atrás do driblado pode Dominar; sem ninguém lá, você anda 1m."
  },
  {
    id: "voleio", nome: "Voleio",
    desc: "Você faz um chute no ar como reação de um passe aliado.",
    atributo: "destreza_potencia_meio", dj: "J vs G",
    distancia: "Igual sua Distância de Chute",
    acao: "reacao_passe",
    anormalidade: "Antes, role Teste de Destreza DJ 15 para poder fazer o Voleio."
  },
  {
    id: "interceptacao", nome: "Interceptação",
    desc: "Você corta um passe ou chute inimigo no meio de sua trajetória.",
    atributo: "destreza", dj: "J vs J", distancia: "Avanço de 2 m",
    acao: "reacao_chute_passe",
    anormalidade: "Se a 2m da trajetória, recebe 2 Desvantagens."
  },
  {
    id: "analise", nome: "Análise",
    desc: "Você analisa seu oponente para encontrar seu ponto fraco.",
    atributo: "visao", dj: "8 +1 por metro acima de 1m²", distancia: "6 m",
    acao: "egoista",
    anormalidade: "Sucesso dá 1 Vantagem contra o alvo na próxima Rodada. Só contra inimigos."
  },
  {
    id: "defesa_goleiro", nome: "Defesa de Goleiro",
    desc: "Você pega a bola que está indo em sua direção com as próprias mãos.",
    atributo: "destreza", dj: "J vs G", distancia: "Pessoal",
    acao: "reacao_chute_passe",
    anormalidade: "Apenas utilizável caso seja um Goleiro."
  },
  {
    id: "marcacao", nome: "Marcação",
    desc: "Você praticamente anula um dos alvos em campo para ele não sair do lugar.",
    atributo: "robustez", dj: "J vs J", distancia: "Corpo-a-Corpo",
    acao: "comum",
    anormalidade: "Alvo Marcado não faz Ação Comum nem Reação, só anda metade dos Fôlegos. Você tem prioridade em Dominar Passes para ele."
  },
  {
    id: "jogo_sujo", nome: "Jogo Sujo",
    desc: "Essa jogada muitas vezes é proibida, mas quando sem provas, sem crime.",
    atributo: "ego", dj: "J vs J", distancia: "3 m²",
    acao: "egoista",
    anormalidade: "Vencendo: alvo recebe 2 Desvantagens. Perdendo: você recebe 1 Desvantagem e -3 de Bônus."
  },
  {
    id: "trash_talk", nome: "Trash Talk",
    desc: "Você desbanca o alvo com um xingamento ou algo do tipo, diminuindo-o.",
    atributo: "ego", dj: "J vs J", distancia: "8 m",
    acao: "egoista",
    anormalidade: "-1 na Jogada por metro de distância. Vencendo, escolhe 2 Atributos do alvo p/ -5 de Bônus por 1D4+1 Rodadas."
  }
];

// Fórmulas derivadas
function distanciaChute(potencia) { return potencia + 6; }
function distanciaPasse(visao) { return visao + 6; }
function folegoMaximo(destreza) { return 6 + destreza; }
function limiteTokensEgo(ego) { return 5 + ego; }

// Falhas
const FALHAS = [
  "Passe Curto/Longo/Alto falho: o receptor recebe 2 Desvantagens na Jogada de Domínio/Voleio.",
  "Domínio/Voleio Falho: a bola passa reto, percorre o resto da Distância de Passe do passador e fica livre no chão (caso ninguém Intercepte/Voleie)."
];

// Execuções Absolutas (críticos)
const EXECUCOES_ABSOLUTAS = [
  { id: "NP", nome: "Normalmente Positivo", regra: "1D6 ou 2D6 com resultado 5/6", tokensBonus: 1 },
  { id: "MP", nome: "Medianamente Positivo", regra: "3D6 ou 4D6 com resultado 5/6", tokensBonus: 2 },
  { id: "EP", nome: "Extremamente Positivo", regra: "5D6 ou 6D6 com resultado 5/6", tokensBonus: 3 }
];

const REGRAS_TOKENS_EGO = {
  inicial: 4,
  limiteBase: limiteTokensEgo,
  perdaPorFalha: 1,
  ganhoPorVitoria: 1,
  quebraEgoDJ: (ego) => 16 - ego,
  egoInfladoGatilho: 8
};

export {
  ATRIBUTOS, VALORES_ATRIBUTO_INICIAL, CORES_EGO, COR_EGO_HEX,
  corComVantagemSobre, JOGADAS_COR_EGO, TIPOS_ACAO, ESTAGIOS,
  JOGADAS_BASE, distanciaChute, distanciaPasse, folegoMaximo,
  limiteTokensEgo, FALHAS, EXECUCOES_ABSOLUTAS, REGRAS_TOKENS_EGO
};
