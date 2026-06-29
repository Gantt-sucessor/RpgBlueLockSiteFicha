// ============================================================
// FÓRMULA DO EGO — Essências de Ego
// ============================================================

const ESSENCIAS_EGO = [
  {
    id: "adaptavel", nome: "Essência Adaptável",
    flavor: "Seu núcleo transparece como a capacidade acelerada de se adaptar a qualquer situação, um verdadeiro divino general imoral que tem um grande poder, porém que pode ser destruído por ele mesmo caso seja incompetente.",
    capacidade: { nome: "Adaptação Retomada", desc: "A cada 3 Jogadas bem-sucedidas, você pode trocar sua Cor de Ego para uma desejada durante 1D6 Rodadas." },
    incapacidade: { nome: "Falta de Compreensão", desc: "Sempre que falhar em uma Jogada de Análise, recebe -2 de Bônus nas próximas 2 Jogadas." }
  },
  {
    id: "destrutiva", nome: "Essência Destrutiva",
    flavor: "Seu núcleo transparece como um sádico total, alguém que vê prazer em devorar e destruir todos em sua volta, uma máquina movida totalmente pelo choro daqueles que você destruiu os sonhos e esperanças.",
    capacidade: { nome: "Eu Quero Ver Tudo Quebrar", desc: "Toda vez que Devorar um aliado, escolhe um Atributo para receber +3 de Bônus durante 1D6 Rodadas." },
    incapacidade: { nome: "Destruído pela Presa", desc: "Sempre que sofrer um Devorar bem-sucedido, recebe 1 Desvantagem em todos os Atributos durante 1D4+1 Rodadas." }
  },
  {
    id: "morta", nome: "Essência Morta",
    flavor: "Seu núcleo transparece como uma preguiça avassaladora, praticamente um corpo morto em campo, amedrontando qualquer um que estiver no caminho mesmo com seu cansaço e cara de sono que parece uma caveira.",
    capacidade: { nome: "Tanto do Mesmo", desc: "Ao fazer a mesma Jogada bem-sucedida duas vezes seguidas, recebe +2 de Bônus no Atributo usado por 1D4 Rodadas." },
    incapacidade: { nome: "Dorminhoco", desc: "Caso gaste mais de 6 Fôlegos em uma Rodada, recebe 1 Desvantagem em Destreza na próxima Jogada desse Atributo." }
  },
  {
    id: "policial", nome: "Essência Policial",
    flavor: "Seu núcleo transparece como o policial que não deixa os ladrões de gol passarem e fazerem pontos, pois se quiserem realmente passar por você, terão que quebrar a coleira que você colocou nesses atacantes.",
    capacidade: { nome: "Garoto Mal!", desc: "Recebe +2 de Bônus em Jogadas de Roubo e Interceptação quando estiver do seu lado do campo." },
    incapacidade: { nome: "Quebrador de Coleiras", desc: "Falhar em Interceptação dá 1 Desvantagem na próxima Jogada; se a falha resultar em gol, 2 Desvantagens." }
  },
  {
    id: "magnifica", nome: "Essência Magnífica",
    flavor: "Seu núcleo transparece como diversos cálculos perfeitos assim como você, sem um erro sequer, aquele que apenas os mais idiotas conseguirão compreender o que vem logo a seguir com sua beleza.",
    capacidade: { nome: "Infinitas Possibilidades", desc: "Ganhando em duas Jogadas seguidas, escolhe uma Jogada diferente delas para +2 de Bônus por 1D2+1 Rodadas." },
    incapacidade: { nome: "Impossível de Falhar?", desc: "Sempre que falhar em uma Jogada, recebe -2 de Bônus em um Atributo aleatório por 1D2 Rodadas." }
  },
  {
    id: "sonhadora", nome: "Essência Sonhadora",
    flavor: "Seu núcleo transparece como aquele que visa o melhor futuro, alguém com um vício em tornar o impossível possível através de jogadas magníficas, a verdadeira força de vontade avassaladora que todos vem um brilho radiante.",
    capacidade: { nome: "Ainda Não!", desc: "Ao receber uma Quebra de Ego, role 1D4. Resultado 4 anula o efeito e recupera 1 Token de Ego." },
    incapacidade: { nome: "Eu.. Perdi?", desc: "Fica 1D2 Rodadas adicionais em Quebra de Ego." }
  },
  {
    id: "cachorrinho", nome: "Essência Cachorrinho",
    flavor: "Seu núcleo transparece como não vindo diretamente de você, mas sim interligado a outro indivíduo, com sua dependência vindo exatamente dessa pessoa e totalmente ligado ao estado mental dela.",
    capacidade: { nome: "À suas Ordens!", desc: "Escolhe um aliado 'Ligado'. Quando ele recebe Token de Ego, você recebe 1 Vantagem na próxima Jogada. +3 de Bônus em Passe pedido por ele." },
    incapacidade: { nome: "Tá Tudo Bem com Você?!", desc: "Se o aliado Ligado sofrer Quebra de Ego, você recebe o mesmo efeito pela metade das Rodadas." }
  },
  {
    id: "gananciosa", nome: "Essência Gananciosa",
    flavor: "Seu núcleo transparece como muito mais que apenas habilidade, mas sim a busca pelo dinheiro, pois ele compra tudo aquilo que é importante, e aquele que discordar só não tem dinheiro o bastante.",
    capacidade: { nome: "Dinheiro Vale Mais do que Talento!", desc: "Vencer J vs J contra inimigo usando habilidade: +1 Token de Ego e 1 Vantagem em 2 Jogadas por 1D4 Rodadas." },
    incapacidade: { nome: "Cê Só me Passou por Sorte", desc: "Perder J vs J contra inimigo sem habilidade: -2 Fôlegos na próxima Rodada e 1 Desvantagem em Destreza." }
  },
  {
    id: "brincalhona", nome: "Essência Brincalhona",
    flavor: "Seu núcleo transparece como apenas diversão, um pequeno menino travesso que só quer brincar e sacanear todos em jogo, com um modo brincalhão e animado de destruir seus adversários e as vezes até seu próprio time só pra rir.",
    capacidade: { nome: "Ciranda Cirandinha", desc: "Toda vez que um oponente gastar um Fôlego ao seu lado, você pode andar 2m em direção ao campo inimigo." },
    incapacidade: { nome: "Sem Graça!", desc: "Cada Roubo/Jogo de Corpo bem-sucedido contra você: -1 Fôlego acumulável na próxima Rodada." }
  },
  {
    id: "instintiva", nome: "Essência Instintiva",
    flavor: "Seu núcleo transparece como alguém extremamente veloz e fugaz, com uma velocidade de reação imensa e não deixando nada passar de seus olhos, um verdadeiro jogador ágil como a esquiva de um gato.",
    capacidade: { nome: "Reação Selvagem", desc: "Recebe +1 Reação disponível e anula até 1 Desvantagem em Jogadas que utilizam Reação." },
    incapacidade: { nome: "Por Pouco!", desc: "Falhar em uma Reação: -2 Fôlegos e -1 de Bônus em qualquer Jogada por 1D4 Rodadas." }
  },
  {
    id: "explosiva", nome: "Essência Explosiva",
    flavor: "Seu núcleo transparece como uma série de explosões em campo, nada que se mantém direto, mas sim que mostra para todos do que é feito de uma vez só, com uma sensaçãozinha de 'eu quero MAIS'.",
    capacidade: { nome: "Explosão Dilacerante", desc: "Ganhar com Execução Absoluta Positiva: 2 Vantagens em qualquer Jogada e +3 Fôlegos por 1 Rodada." },
    incapacidade: { nome: "Auto-Destruição", desc: "Falhar duas Jogadas seguidas: 2 Desvantagens em qualquer Jogada e -3 Fôlegos por 1 Rodada." }
  },
  {
    id: "reconstruida", nome: "Essência Reconstruída",
    flavor: "Seu núcleo transparece não como deveria ser, mas sim como se estivesse quebrado, colado com diversas correntes que te impedem de chegar ao seu objetivo inicial, tendo que tomar uma rota totalmente diferente pelo seu sonho destruído.",
    capacidade: { nome: "Destruído, mas Não Vencido", desc: "Ao fim de uma Quebra de Ego: 2 Vantagens e +3 de Bônus em todos os Atributos por 1D6+2 Rodadas." },
    incapacidade: { nome: "Traumas que Perseguem", desc: "2 Jogadas aleatórias: falhar nelas dá 2 Desvantagens em qualquer Atributo por 1D6 Rodadas." }
  },
  {
    id: "leonino", nome: "Essência Leonino",
    flavor: "Seu núcleo transparece como um leão que caça sua presa até o fim do campo, um devorador de gols com presas que destroem até seu próprio time pra mostrar quem é o verdadeiro rei da selva, aquele que dilacera seus súditos.",
    capacidade: { nome: "Contemplem o Seu Rei", desc: "Devorar um aliado com Roubo/Jogo de Corpo: 1 Vantagem no próximo Chute (acumulável)." },
    incapacidade: { nome: "Destronado", desc: "Ser Devorado por aliado: Jogada de Ego DJ 14, falha = perde a próxima Rodada." }
  },
  {
    id: "dancante", nome: "Essência Dançante",
    flavor: "Seu núcleo transparece como dança e gingado, alguém que baila não apenas por diversão ou para se gabar, mas sim para jogo, esquivando e mostrando aos inimigos que um moonwalk representa muito mais que apenas arte.",
    capacidade: { nome: "My Name Is *Chika Chika*", desc: "Ganhar Drible: anda 1m e recebe +2 de Bônus na próxima Jogada de Destreza." },
    incapacidade: { nome: "Till I Collapse", desc: "Com 30% ou menos de Fôlegos: -3 de Bônus e 1 Desvantagem em Jogadas de Destreza." }
  },
  {
    id: "cadeada", nome: "Essência Cadeada",
    flavor: "Seu núcleo transparece muito mais como uma raiva incessante do que realmente algum motivo por trás, com uma fúria tremenda por tudo e todos, até mesmo com as pessoas que você mais ama, um ser apenas movido pelo ódio.",
    capacidade: { nome: "Quero Ver Você Sair!", desc: "Ao Marcar alguém, o alvo só se move ⅓ e você pode marcar indivíduos em até 2m² de distância dele." },
    incapacidade: { nome: "PARA DE ME ESTRESSAR!", desc: "Escaparem de sua Marcação: -1 Token de Ego adicional e -2 em todos os Atributos por 1D4 Rodadas." }
  }
];

// Sub-categorias de Gênio e Aprendiz
const CATEGORIA_PRINCIPAL = {
  genio: {
    nome: "Gênio",
    flavor: "O gênio é aquele que não entende por que é tão brilhante, apenas é. Seus pés se movem como se estivessem ligados diretamente ao instinto, e o impossível se torna cotidiano.",
    habilidade: {
      nome: "Genialidade Cotidiana",
      frase: "Pra eles, um milagre, pra você, só mais um dia comum.",
      desc: "Escolha 3 Jogadas diferentes. Durante 1D4+1 Rodadas, recebe 1 Vantagem e +2 de Bônus em cada uma, além de +2 Fôlegos.",
      distancia: "Pessoal", cooldown: 5, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta"
    },
    subcategorias: [
      { id: "prodigio", nome: "Prodígio", desc: "Toda vez que ganhar em duas Jogadas seguidas, recebe 2 Tokens de Ego e 1 Vantagem na próxima Jogada (não acumulável)." },
      { id: "ambidestro", nome: "Ambidestro", desc: "Escolha 2 Jogadas sem Perícia (ou 1 com Perícia) de Drible, Destreza ou Potência para +3 de Bônus." },
      { id: "arquiteto", nome: "Arquiteto", desc: "Ganhar uma Jogada de Análise: você e o time recebem +3 de Bônus na próxima Jogada de Ego ou Visão de Jogo (não acumulável)." }
    ]
  },
  aprendiz: {
    nome: "Aprendiz",
    flavor: "O aprendiz é a personificação da luta. Não possui o mesmo brilho espontâneo do gênio, mas carrega a chama incansável do esforço consciente.",
    habilidade: {
      nome: "Versatilidade Assimilada",
      frase: "Todo aquele esforço vai valer de alguma coisa, eles querendo ou não.",
      desc: "Caso falhe em uma Jogada, ative como Reação, re-rolando com 1 Vantagem.",
      distancia: "Pessoal", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    subcategorias: [
      { id: "talentoso", nome: "Talentoso", desc: "Ao falhar em uma Jogada, gaste 1 Token de Ego para +1 Vantagem e +3 de Bônus na tentativa (cooldown 2 Rodadas)." },
      { id: "esforcado", nome: "Esforçado", desc: "Pode falhar em uma Jogada de propósito; ganha 2 Vantagens nessa Jogada falhada por 2 Jogadas." },
      { id: "disciplinado", nome: "Disciplinado", desc: "Ganhar três Jogadas seguidas: diminui o Cooldown de todas as habilidades em -1 Rodada." }
    ]
  }
};

export { ESSENCIAS_EGO, CATEGORIA_PRINCIPAL };
