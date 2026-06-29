// ============================================================
// FÓRMULA DO EGO — Talentos Impetuosos
// Cada talento tem até 3 Níveis (cada Nível custa 1 Ponto de Chama)
// Limite: 5 espaços de armazenamento no total
// ============================================================

const TALENTOS_IMPETUOSOS = [
  {
    id: "carretilha", nome: "Carretilha",
    flavor: "Puxando a bola com os dois pés por trás do corpo, você ao fim joga-a por cima da cabeça do marcador. Parece até um truque de skate, não é?",
    niveis: [
      {
        nivel: 1,
        desc: "Joga a bola 2m para frente. Ninguém no caminho pode Interceptar/Dominar. Você avança 2m com a bola e faz uma Jogada de Domínio DJ 15. Falha: a bola vai mais 2m e fica livre.",
        distancia: "2 m / 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
      },
      {
        nivel: 2,
        desc: "A bola vai 3m (junto de você) em vez de 2m. Opção de Voleio em vez de Domínio ao fim. DJ do Domínio cai para 12.",
        distancia: "3 m / 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
      },
      {
        nivel: 3,
        desc: "A bola vai 3m. Opção de Voleio com +3 de Bônus em vez de Domínio. Se optar por Domínio, é garantido e você ainda anda 2m a mais.",
        distancia: "3 m / 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
      }
    ]
  },
  {
    id: "oneshot", nome: "Oneshot",
    flavor: "Um chute direto ao gol, com grandes chances de rasgar a rede ou até a mão do goleiro se duvidar!",
    niveis: [
      { nivel: 1, desc: "Chute Regular com +2m de distância, 1 Vantagem e +3 de Bônus.", distancia: "Distância de Chute + 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum" },
      { nivel: 2, desc: "Chute Regular ou Knuckleball (escolha) com +2m, 1 Vantagem e +4 de Bônus.", distancia: "Distância de Chute + 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum" },
      { nivel: 3, desc: "Chute Regular, Knuckleball ou Curvo (escolha) com +3m, 2 Vantagens e +5 de Bônus.", distancia: "Distância de Chute + 3 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum" }
    ]
  },
  {
    id: "passe_celestial", nome: "Passe Celestial",
    flavor: "É um pássaro? É um avião? Não, é um passe sob a cabeça de todos e chega em seu alvo!",
    niveis: [
      { nivel: 1, desc: "Passe Longo com +3m, 1 Vantagem para você e 1 Vantagem em Domínio para o receptor.", distancia: "Distância de Passe + 3 m", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum" },
      { nivel: 2, desc: "Passe Longo +3m, 2 Vantagens para você, 2 Vantagens em Domínio para o receptor, e quem tentar Interceptar recebe 1 Desvantagem.", distancia: "Distância de Passe + 3 m", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum" },
      { nivel: 3, desc: "Passe Alto com 3 Vantagens que ignora Desvantagens de Distância, com Domínio Garantido para o receptor.", distancia: "Infinita", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum" }
    ]
  },
  {
    id: "fora_da_bola", nome: "Fora da Bola",
    flavor: "Quem disse que a bola é o mais importante se meus pés se movem melhor sem ela?",
    niveis: [
      { nivel: 1, desc: "+3 Fôlegos por 1D6 Rodadas e 1 Vantagem ao escapar de Marcação (só sem a bola).", distancia: "Pessoal", cooldown: 3, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta" },
      { nivel: 2, desc: "+4 Fôlegos por 1D6+1, 2 Vantagens ao escapar de Marcação e +3 de Bônus em Destreza (só sem a bola).", distancia: "Pessoal", cooldown: 3, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta" },
      { nivel: 3, desc: "+5 Fôlegos por 1D6+2, 2 Vantagens ao escapar de Marcação, +4 de Bônus em Destreza e +1m² em Interceptações, anulando desvantagens dela (só sem a bola).", distancia: "Pessoal", cooldown: 3, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta" }
    ]
  },
  {
    id: "ala_messi", nome: "Ala Messi",
    flavor: "Esse jogo tá tão sério... Então vamos bailar! Mas tipo assim, os cara ainda acha que pode me parar? Então pode parar de tentar!",
    niveis: [
      { nivel: 1, desc: "Por 1D4 Rodadas, 1 Vantagem e +3 de Bônus em Drible; driblar alguém permite andar 1m.", distancia: "Pessoal", cooldown: 5, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta" },
      { nivel: 2, desc: "Por 1D4+2, 2 Vantagens, +3 de Bônus em Drible; driblar dá 1m e +1 de Bônus no próximo Drible (não acumulável).", distancia: "Pessoal", cooldown: 5, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta" },
      { nivel: 3, desc: "Por 1D6+2, 2 Vantagens, +4 de Bônus em Drible; driblar dá 2m e +1 de Bônus no próximo Drible (acumulável).", distancia: "Pessoal", cooldown: 6, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta" }
    ]
  },
  {
    id: "marcacao_anticinetica", nome: "Marcação Anti-Cinética",
    flavor: "Por mais que eu esteja te marcando, recomendo seu time não chegar junto, porque se já tava ruim agora vai ficar pior!",
    niveis: [
      { nivel: 1, desc: "Marcação com 2 Vantagens por 1D4 Rodadas. Inimigos a até 3m de você gastam o dobro de Fôlegos ali.", distancia: "Corpo-a-Corpo / 3 m", cooldown: 5, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum" },
      { nivel: 2, desc: "Marcação com 2 Vantagens e +2 de Bônus por 1D4+1. Raio aumenta para 5m.", distancia: "Corpo-a-Corpo / 3 m", cooldown: 5, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum" },
      { nivel: 3, desc: "Marcação inescapável por 1D4+1. Raio aumenta para 8m.", distancia: "Corpo-a-Corpo / 3 m", cooldown: 5, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum" }
    ]
  },
  {
    id: "contra_ataque_voraz", nome: "Contra-Ataque Voraz",
    flavor: "Esses bros acham mesmo que podem avançar e ficar tranquilo? Vamos mostrar pra eles o que é bom pra tosse!",
    niveis: [
      { nivel: 1, desc: "Após Roubo bem-sucedido no seu lado do campo, como Reação: todo o time anda 2m e pode usar Ação Egoísta mesmo fora da Rodada (mesmo já tendo gastado).", distancia: "Todo seu time", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação" },
      { nivel: 2, desc: "Time anda 3m, +3 de Bônus na próxima Jogada à escolha deles, e Ação Egoísta extra.", distancia: "Todo seu time", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação" },
      { nivel: 3, desc: "Time anda 4m, +4 de Bônus na próxima Jogada, você pode fazer um Passe com garantia (dentro da Distância de Passe), e Ação Egoísta extra para todos.", distancia: "Todo seu time", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação" }
    ]
  },
  {
    id: "quebra_gravidade", nome: "Quebra de Gravidade",
    flavor: "Que velocidade essa sua! Mas que pena, você é fraco demais, é só eu bater no seu centro de gravidade e tu já vai pro chão!",
    niveis: [
      { nivel: 1, desc: "Em Jogada de Drible: troca o Atributo para Robustez e recebe +3 de Bônus.", distancia: "Corpo-a-Corpo", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação" },
      { nivel: 2, desc: "Troca para Robustez, 1 Vantagem e +3 de Bônus. Ganhando, alvo perde 2 Fôlegos na próxima Rodada.", distancia: "Corpo-a-Corpo", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação" },
      { nivel: 3, desc: "Troca para Robustez, 2 Vantagens e +3 de Bônus. Ganhando, alvo perde 3 Fôlegos e -1 Token de Ego adicional.", distancia: "Corpo-a-Corpo", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação" }
    ]
  }
];

const LIMITE_TALENTOS_IMPETUOSOS = 5;

export { TALENTOS_IMPETUOSOS, LIMITE_TALENTOS_IMPETUOSOS };
