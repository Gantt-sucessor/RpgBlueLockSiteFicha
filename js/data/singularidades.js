// ============================================================
// FÓRMULA DO EGO — Singularidades Máximas
// Liberadas no Estágio Mestre. Ativam automaticamente em Ego Inflado.
// Cada uma dá 2 habilidades utilizáveis apenas enquanto com ela ativa.
// ============================================================

const SINGULARIDADES_MAXIMAS = [
  {
    id: "metavisao", nome: "Metavisão",
    flavor: "Em vez de manter seus olhos apenas na bola, você mantém seus olhos em tudo ao seu redor, prevendo até mesmo o futuro.",
    habilidades: [
      {
        nome: "Meta Burst Point", frase: "Um avanço perfeito, pois você já sabe onde a bola estará.",
        desc: "Interceptação usando Visão de Jogo, 2 Vantagens e +3 de Bônus. Sucesso: +4 de Bônus em Destreza e Visão de Jogo por 1D6+3 Rodadas.",
        distancia: "Interceptação", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação (+ Reação)"
      },
      {
        nome: "Previsão Perfeita", frase: "Todos os caminhos levam a Roma...",
        desc: "Por 1D6+4 Rodadas, cria área de 5m² que te acompanha. Inimigos dentro recebem 3 Desvantagens e -3 de Bônus em qualquer Jogada.",
        distancia: "5 m²", cooldown: 8, duracao: "1D6+4 Rodadas", tipoAcao: "Ação Egoísta"
      }
    ]
  },
  {
    id: "olhos_predador", nome: "Olhos de Predador",
    flavor: "Caçar, apenas isso passa em sua mente, porquê todos os alvos em campo não passam de presas, e você o predador.",
    habilidades: [
      {
        nome: "Devorando a Presa", frase: "É apenas um alimento, nada mais nada menos.",
        desc: "Devorar com 3 Vantagens contra um aliado. Sucesso: recupera todas Ações e Fôlegos, +1 Vantagem adicional em qualquer Jogada por 1D4+2 Rodadas.",
        distancia: "Devorar", cooldown: 6, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum"
      },
      {
        nome: "Mordida Mortífera", frase: "Ninguém está nem aos seus pés, apenas presas indefesas.",
        desc: "Todos em 6m² perdem -1 Token de Ego (você recupera +1 por afetado). +1 Vantagem acumulativa em qualquer Jogada por 1D6 Rodadas por alvo que sofreu Quebra de Ego pela habilidade.",
        distancia: "5 m²", cooldown: 8, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
      }
    ]
  },
  {
    id: "ginga", nome: "Ginga",
    flavor: "Imagina uma borboleta em campo driblando todos, exatamente isso, imagine, pois a imaginação cria mais de 1001 tipos de dribles.",
    habilidades: [
      {
        nome: "Passinho do Romano", frase: "Paara, quando eu te driblo o mundo paara.",
        desc: "Avanço de 5m. 3 Vantagens em Drible contra quem tentar Roubar no caminho.",
        distancia: "5 m", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + 4 Fôlegos"
      },
      {
        nome: "Malandramente", frase: "EU TENTEEEEI não ser moleque com você, mas meu drible te surpreende!",
        desc: "Após Drible bem-sucedido, ative como Reação: 2 Vantagens em Drible e +3 Fôlegos por 1D6+2 Rodadas. Ao fim, o próximo Drible recebe +5 de Bônus.",
        distancia: "Pessoal", cooldown: 8, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Reação"
      }
    ]
  },
  {
    id: "instintos_destrutivos", nome: "Instintos Destrutivos",
    flavor: "A destruição é a chave da vitória, devorando os sonhos daqueles que tentaram passar no seu caminho e assassinando seus alvos.",
    habilidades: [
      {
        nome: "Válvula de Quebra", frase: "Todo esse time, que sempre está do meu lado... Me dá vontade de vomitar!",
        desc: "Roubo (podendo ser Devorar) com 3 Vantagens. Sucesso: alvo perde 3 Tokens de Ego; todos em 6m² dele perdem 2 Tokens.",
        distancia: "6 m²", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
      },
      {
        nome: "Auto-Destruição Aniquiladora", frase: "Você já jogou futebol com a sua vida em risco?",
        desc: "Fica com 1 Token de Ego (perde os demais), mas recebe 2 Vantagens e +4 de Bônus em 4 Jogadas escolhidas. Ganhando J vs J, recupera +1 Token. Dura 1D6+1 Rodadas.",
        distancia: "5 m", cooldown: 8, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + 4 Fôlegos"
      }
    ]
  },
  {
    id: "analise_porcentagens", nome: "Análise de Porcentagens",
    flavor: "Tudo tem uma chance de acontecer, mesmo que seja 0.1%, e você aumenta essas probabilidades em 100% quando envolve sua vitória.",
    habilidades: [
      {
        nome: "Aposta 50/50", frase: "Que droga, essa vai ser difícil... Solta a carta tigrinho, que o pai tá on!",
        desc: "Como Reação antes de uma Jogada, transforma a DJ em 1D2: resultado 1 = sucesso garantido; resultado 2 = derrota garantida.",
        distancia: "Pessoal", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Reação + Ação Egoísta"
      },
      {
        nome: "Brecha de Ocorrências", frase: "Uma brecha torna qualquer jogada em 1000%.",
        desc: "Ao falharem uma Jogada em 6m² (sem ser contra você), ative como Reação: 3 Vantagens em qualquer Jogada contra quem falhou, por 1D4+1 Rodadas.",
        distancia: "6 m² / Pessoal", cooldown: 8, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
      }
    ]
  },
  {
    id: "deus_velocidade", nome: "Deus da Velocidade",
    flavor: "Tudo está em câmera lenta, não importa o que, ninguém, eu repito, NINGUÉM conseguirá me acompanhar.",
    habilidades: [
      {
        nome: "Katchau", frase: "Eu sou a velocidade...",
        desc: "Após Interceptação bem-sucedida, ative como Reação: anda 5m sem gastar Fôlegos. Pelas próximas 1D6+1 Rodadas, gasta só 1 Fôlego a cada 2m andados.",
        distancia: "5 m", cooldown: 6, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
      },
      {
        nome: "Distorção Velocista", frase: "Duvido que vocês consigam me acompanhar!",
        desc: "Avança 8m. Sem a bola e encontrando quem tem: Roubo com 3 Vantagens. Com a bola e encontrando roubador: Drible usando Destreza com 2 Vantagens.",
        distancia: "7 m", cooldown: 8, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
      }
    ]
  },
  {
    id: "perfeicao", nome: "Perfeição",
    flavor: "Tudo seu é o ápice de um jogador, tudo está literalmente no máximo, tudo no cem tá equilibrado.",
    habilidades: [
      {
        nome: "S+", frase: "Meu overall tá no máximo, drible, força, passe, salto, chute e velocidade.",
        desc: "Escolhe 6 Jogadas para +4 de Bônus por 1D6+1 Rodadas, além de +3 Fôlegos.",
        distancia: "Pessoal", cooldown: 6, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta"
      },
      {
        nome: "Corpo Perfeito", frase: "Você pode até ser perfeito, mas não é eu...",
        desc: "Escolhe 3 Atributos para 1 Vantagem e +4 de Bônus nas próximas 12 Jogadas (independente de usarem esses Atributos).",
        distancia: "Pessoal", cooldown: 8, duracao: "12 Jogadas", tipoAcao: "Ação Egoísta"
      }
    ]
  }
];

export { SINGULARIDADES_MAXIMAS };
