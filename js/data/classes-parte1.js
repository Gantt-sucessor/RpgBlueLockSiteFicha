// ============================================================
// FÓRMULA DO EGO — Classes (parte 1 de 2)
// Cada habilidade tem um campo "bonus" estruturado com:
// { jogadaAlvo, vantagens, bonusFixo, atributoAlvo, condicao, dadoDuracao }
// dadoDuracao: string da notação do dado (ex: "1D4+1") quando a
// habilidade tem duração variável que precisa ser rolada.
// ============================================================

const CLASSES_PARTE1 = [
  {
    id: "mestre_adaptacao", nome: "Mestre da Adaptação",
    flavor: "Seu modo de jogo é focado em estratégia visionária pura, alguém que vê o campo inteiro como peças que devem se juntar.",
    pericias: ["2 Vantagens em Análise", "1 Vantagem em Chute Regular"],
    comBola: {
      nome: "Remontando", frase: "O campo não passa de um quebra-cabeça para EU montar do MEU jeito.",
      desc: "Escolha um aliado para 2 Vantagens em um Atributo e um oponente para você receber +3 de Bônus em um Atributo contra ele, por 1D6 Rodadas.",
      distancia: "Pessoal", cooldown: 6, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 3, atributoAlvo: "qualquer", condicao: "Contra o oponente escolhido" }
    },
    semBola: {
      nome: "Chute Direto", frase: "A bola está chegando, esse será o meu gol perfeito!",
      desc: "Como Reação de um Passe Longo/Alto aliado, faz Chute Regular com 1 Vantagem e +4 de Bônus.",
      distancia: "Distância de Chute", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "chute_regular", vantagens: 1, bonusFixo: 4, condicao: "Como Reação de Passe aliado" }
    },
    variavel: {
      nome: "Roda Adaptativa", frase: "Uma verdadeira jogada de oito empunhaduras!",
      desc: "Escolha 3 Jogadas. Por 1D6+1 Rodadas, 1 Vantagem nelas. Cada vitória nessa Jogada específica ganha +1 Vantagem acumulável até o fim.",
      distancia: "Pessoal", cooldown: 4, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo",
      dadoDuracao: "1D6+1",
      bonus: { jogadaAlvo: null, vantagens: 1, bonusFixo: 0, condicao: "3 Jogadas à escolha" }
    },
    fluxo: {
      nome: "Demon King", frase: "COMA ESSA GÊNIOZINHO!",
      desc: "Obriga um aliado com a bola a fazer Passe Longo garantido (DJ 18 p/ Interceptação) para você. Ao receber, faz Chute Regular com 3 Vantagens, +4 de Bônus e +2m de Distância como Reação.",
      distancia: "Distância de Chute + 2 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "chute_regular", vantagens: 3, bonusFixo: 4, condicao: "Como Reação após receber o Passe" }
    },
    porcentagensFluxo: [["Chute Regular + Gol", 25], ["Análise", 10], ["Roubo", 5]]
  },
  {
    id: "espectro_desleixado", nome: "Espectro Desleixado",
    flavor: "Seu modo de jogo é focado em domínios perfeitos e chutes preparados, um verdadeiro cirurgião que não precisa estar focado, apenas relaxado.",
    pericias: ["2 Vantagens em Domínio", "1 Vantagem em Voleio"],
    comBola: {
      nome: "Voleio Falso", frase: "1, 2, 3, será que consigo mais um?",
      desc: "Faz Drible usando Destreza contra o alvo. Ganhando, avança 3m e pode driblar outro alvo com Destreza. Sem mais alvos, faz Voleio com +1 Vantagem por driblado no caminho.",
      distancia: "Corpo-a-Corpo / 3 m", cooldown: 5, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum + Reação",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: "voleio", vantagens: 1, bonusFixo: 0, condicao: "+1V por driblado no caminho" }
    },
    semBola: {
      nome: "Armadilha", frase: "Achei que esse domínio seria mais difícil...",
      desc: "Jogada de Domínio/Interceptação com 1 Vantagem e +2 de Bônus.",
      distancia: "Pessoal / 2 m", cooldown: 1, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "dominio", vantagens: 1, bonusFixo: 2, condicao: null }
    },
    variavel: {
      nome: "Armadilha de Buraco Negro", frase: "Esse passe sempre foi pra mim!",
      desc: "Domínio/Interceptação com 2 Vantagens e +3 de Bônus. Ganhando a posse, +5 de Bônus em Destreza por 1D4 Rodadas.",
      distancia: "Pessoal / 2 m", cooldown: 4, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica",
      dadoDuracao: "1D4",
      bonus: { jogadaAlvo: "dominio", vantagens: 2, bonusFixo: 3, condicao: "Se ganhar: +5 Bônus em Destreza" }
    },
    fluxo: {
      nome: "Gol Inumano", frase: "Isso foi... previsível.",
      desc: "Como Reação de Passe Longo/Alto, Voleio com 3 Vantagens e +4 de Bônus. Quem tentar Interceptar deve antes vencer Visão de Jogo DJ 18.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "voleio", vantagens: 3, bonusFixo: 4, condicao: "Como Reação de Passe aliado" }
    },
    porcentagensFluxo: [["Voleio + Gol", 25], ["Domínio", 10], ["Destreza (Drible)", 5]]
  },
  {
    id: "abelha_caotica", nome: "Abelha Caótica",
    flavor: "Seu modo de jogo é focado em dribles caóticos e estilos imprevisíveis, um artista que confunde e domina os oponentes.",
    pericias: ["2 Vantagens em Caneta", "1 Vantagem em Chapéu"],
    comBola: {
      nome: "Ferrão Cortante", frase: "Vem pra cá, pequenino!",
      desc: "Elástico com 2 Vantagens. Sucesso: anda 2m e o driblado faz Jogada de Ego DJ 18 ou perde -1 Token de Ego adicional.",
      distancia: "3 m / Pessoal", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "elastico", vantagens: 2, bonusFixo: 0, condicao: null }
    },
    semBola: {
      nome: "Instinto Colmeia", frase: "Sinto a bola... ela está chegando!",
      desc: "Domínio com +4 de Bônus. Sucesso: avança 3m e recebe 2 Vantagens em Drible por 1D4+1 Rodadas.",
      distancia: "3 m / Pessoal", cooldown: 4, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: "dominio", vantagens: 0, bonusFixo: 4, condicao: "Se ganhar: +2V em Drible por rodadas" }
    },
    variavel: {
      nome: "Bee Shot", frase: "O que você disse? Que eu ia perder?",
      desc: "Como Reação de Passe, Voleio usando Destreza + Drible ÷ 2 com 2 Vantagens e +3 de Bônus (só se o passador tiver Perícia em Passe Longo).",
      distancia: "Distância de Chute", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica",
      bonus: { jogadaAlvo: "voleio", vantagens: 2, bonusFixo: 3, condicao: "Reação de Passe (passador com Perícia em Passe Longo)" }
    },
    fluxo: {
      nome: "Mil e Uma Possibilidades", frase: "Não existe limite para mim!",
      desc: "Por 1D6+2 Rodadas, toda vez que driblar alguém recebe +1 Vantagem em Drible acumulativamente.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+2",
      bonus: { jogadaAlvo: "elastico", vantagens: 1, bonusFixo: 0, condicao: "+1V por drible bem-sucedido (acumulável)" }
    },
    porcentagensFluxo: [["Caneta + Gol", 25], ["Chapéu", 10], ["Elástico", 5]]
  },
  {
    id: "pantera_celere", nome: "Pantera Célere",
    flavor: "Seu modo de jogo é focado em velocidade e passes precisos, uma pantera que jamais pode ser alcançada.",
    pericias: ["2 Vantagens em Passe Longo", "1 Vantagem em Chute Regular"],
    comBola: {
      nome: "Velocista Felino", frase: "Vocês não conseguem me alcançar!",
      desc: "Avanço de 4m, ignorando oponentes no caminho. Ao fim, opção de Passe Longo com 2 Vantagens.",
      distancia: "4 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "passe_longo", vantagens: 2, bonusFixo: 0, condicao: "Opcional ao fim do avanço" }
    },
    semBola: {
      nome: "Avanço Perpétuo", frase: "Esse campo é muito pequeno pra me segurar!",
      desc: "Avanço de 5m. Se estiver em Marcação, foge dela instantaneamente avançando só 3m.",
      distancia: "5 m", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação de Movimento",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "Movimento puro — fuga de Marcação" }
    },
    variavel: {
      nome: "Quebra de 44°", frase: "Corre, corre, corre — não chegarás a tempo!",
      desc: "Avança 5m e faz Chute Regular com 2 Vantagens e +4 de Bônus. Falhando o gol, pode se mover 3m.",
      distancia: "5 m / Distância de Chute", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "fluxo",
      bonus: { jogadaAlvo: "chute_regular", vantagens: 2, bonusFixo: 4, condicao: null }
    },
    fluxo: {
      nome: "Você é Muito Lento!", frase: "Tente acompanhar, se conseguir.",
      desc: "Interceptação com +2m de Distância sem penalidades, 2 Vantagens e +5 de Bônus. Interceptando, pode andar 5m gastando uma Reação.",
      distancia: "Distância de Interceptação + 2 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "interceptacao", vantagens: 2, bonusFixo: 5, condicao: null }
    },
    porcentagensFluxo: [["Passe Longo + Assistência", 25], ["Chute Regular + Gol", 10], ["Roubo", 5]]
  },
  {
    id: "rei_leao", nome: "Rei Leão",
    flavor: "Seu modo de jogo é focado em dominar e intimidar, um rei que controla o campo através de sua presença avassaladora.",
    pericias: ["2 Vantagens em Devorar", "1 Vantagem em Knuckleball"],
    comBola: {
      nome: "Caminho do Rei", frase: "Inclinem-se diante de mim.",
      desc: "Cria área de 4x4 a 6m² por 1D2 Rodadas. Dentro dela: 2 Vantagens em Knuckleball e quem tentar Roubar recebe -4 de Bônus.",
      distancia: "6 m²", cooldown: 6, duracao: "1D2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D2",
      bonus: { jogadaAlvo: "knuckleball", vantagens: 2, bonusFixo: 0, condicao: "Dentro da área criada" }
    },
    semBola: {
      nome: "Curvem-se a Mim!", frase: "Você vai me passar a bola. Agora.",
      desc: "Obriga aliado a fazer Passe para você com 1 Vantagem, como Reação.",
      distancia: "Pessoal", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "Força aliado a passar a bola" }
    },
    variavel: {
      nome: "Hora da Caçada", frase: "Fujam se quiserem. Só adiará o inevitável.",
      desc: "Cria área de 6m² que te acompanha por 1D6 Rodadas: +1 Vantagem e +2 de Bônus em Knuckleball por inimigo nela.",
      distancia: "6 m²", cooldown: 4, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: "knuckleball", vantagens: 1, bonusFixo: 2, condicao: "+1V/+2 por inimigo na área (acumulável)" }
    },
    fluxo: {
      nome: "Presa Fraca", frase: "Você foi uma presa tão fácil.",
      desc: "Avanço de 4m em direção a quem tem a bola. Chegando, Roubo (ou Devorar) com 2 Vantagens e +3 de Bônus. Sucesso: Knuckleball com 3 Vantagens e +5 de Bônus.",
      distancia: "4 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "knuckleball", vantagens: 3, bonusFixo: 5, condicao: "Após Roubo bem-sucedido" }
    },
    porcentagensFluxo: [["Knuckleball + Gol", 25], ["Devorar", 10], ["Roubo", 5]]
  },
  {
    id: "defensor_natural", nome: "Defensor Natural",
    flavor: "Seu modo de jogo é focado em defesa e controle de área, um goleiro nato que protege seu espaço com força bruta.",
    pericias: ["2 Vantagens em Defesa de Goleiro", "1 Vantagem em Passe Alto"],
    comBola: {
      nome: "Garra de Urso", frase: "Eu seguro tudo que vem pra cá.",
      desc: "Passe Alto com 1 Vantagem. Se for goleiro na área de gol: +3 de Bônus, +1 Vantagem e ignora penalidades de distância.",
      distancia: "Distância de Passe", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "passe_alto", vantagens: 1, bonusFixo: 3, condicao: "Se for goleiro na área (+1V e +3 adicional)" }
    },
    semBola: {
      nome: "Chute Escorpião", frase: "Não passa por mim. Nunca.",
      desc: "Como Reação de um Chute, Defesa de Goleiro com 2 Vantagens. Sucesso: bloqueia o gol e a bola volta 2m.",
      distancia: "Pessoal", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "defesa_goleiro", vantagens: 2, bonusFixo: 0, condicao: "Como Reação de Chute" }
    },
    variavel: {
      nome: "Instintos das Montanhas", frase: "Meu corpo age sozinho.",
      desc: "Por 1D4+3 Rodadas: 2 Vantagens em Destreza e +1 Reação adicional para usar.",
      distancia: "Pessoal", cooldown: 4, duracao: "1D4+3 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo",
      dadoDuracao: "1D4+3",
      bonus: { jogadaAlvo: null, vantagens: 2, bonusFixo: 0, atributoAlvo: "destreza", condicao: "+1 Reação adicional" }
    },
    fluxo: {
      nome: "Vamos... De Novo!", frase: "Não deixarei nenhum gol entrar.",
      desc: "Defesa de Goleiro com 2 Vantagens e +3 de Bônus. Falhando, gaste outra Reação para re-rolar com 3 Vantagens e +4 de Bônus.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "defesa_goleiro", vantagens: 2, bonusFixo: 3, condicao: "Re-rolar com 3V/+4 se falhar" }
    },
    porcentagensFluxo: [["Defesa de Goleiro", 25], ["Passe Alto + Assistência", 10], ["Roubo", 5]]
  },
  {
    id: "muralha_duelista", nome: "Muralha Duelista",
    flavor: "Seu modo de jogo é focado em marcação e duelos físicos, uma muralha que nada e ninguém consegue derrubar.",
    pericias: ["2 Vantagens em Marcação", "1 Vantagem em Jogo de Corpo"],
    comBola: {
      nome: "SAI DO MEU PÉ!", frase: "OLHA O QUE VOCÊ FEZ! OLHA O QUE VOCÊ FEZ!!",
      desc: "Avança 3m e faz Pivô com 2 Vantagens. Vencendo Jogada de Robustez nesse modo, pode andar 1m.",
      distancia: "3 m / Pessoal", cooldown: 4, duracao: "Até o fim do Pivô", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "pivo", vantagens: 2, bonusFixo: 0, condicao: null }
    },
    semBola: {
      nome: "FICA AÍ!", frase: "VOU TE DESTRUIR! VOU TE DESTRUIR! VOU TE DESTRUIR!",
      desc: "Marcação a até 2m do alvo, podendo marcar 2 alvos simultaneamente, +1 Vantagem.",
      distancia: "2 m", cooldown: 5, duracao: "Até o fim da Marcação", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "marcacao", vantagens: 1, bonusFixo: 0, condicao: "Pode marcar 2 alvos simultâneos" }
    },
    variavel: {
      nome: "EU AINDA QUEBRO VOCÊS!", frase: "PODEM RIR AGORA! VERÃO QUEM SE ARREPENDE!",
      desc: "Após Passe Curto, ative como Reação: avança 3m. Encontrando alvo, Marcação inescapável por 1D2+1 (só se o receptor tiver Perícia em Jogo de Corpo).",
      distancia: "3 m", cooldown: 6, duracao: "1D2+1 Rodadas", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica",
      dadoDuracao: "1D2+1",
      bonus: { jogadaAlvo: "marcacao", vantagens: 0, bonusFixo: 0, condicao: "Marcação inescapável após Passe Curto aliado" }
    },
    fluxo: {
      nome: "DE ONDE VOCÊ SAIU?!", frase: "AGORA EU PEGUEI VOCÊ! NÃO TEM SAÍDA!",
      desc: "Marcação inescapável contra um alvo durante 1D4+2 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: "marcacao", vantagens: 0, bonusFixo: 0, condicao: "Marcação inescapável" }
    },
    porcentagensFluxo: [["Marcação", 25], ["Jogo de Corpo", 10], ["Interceptação", 5]]
  },
  {
    id: "torre_de_vigia", nome: "Torre de Vigia",
    flavor: "Seu modo de jogo é focado em análise e visão do campo, um estrategista que controla o ritmo de cada jogada.",
    pericias: ["2 Vantagens em Análise", "1 Vantagem em Roubo"],
    comBola: {
      nome: "Acenda o Farol", frase: "Vejo tudo. Absolutamente tudo.",
      desc: "Teste de Análise contra todos os alvos em 6m² (+1 DJ por alvo extra). Sucesso: 1 Vantagem e +3 de Bônus contra todos atingidos por 1D4+2 Rodadas.",
      distancia: "6 m²", cooldown: 5, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: null, vantagens: 1, bonusFixo: 3, condicao: "Contra os alvos atingidos pela Análise" }
    },
    semBola: {
      nome: "Roubo Calculado", frase: "Calculei 48 possibilidades. Isso foi a 49ª.",
      desc: "Roubo com 2 Vantagens. Sucesso: Análise com 2 Vantagens logo após contra qualquer alvo.",
      distancia: "Pessoal / 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "roubo", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: Análise com 2V logo após" }
    },
    variavel: {
      nome: "Neurônios", frase: "Esse campo é meu tabuleiro de xadrez.",
      desc: "Passe Curto para aliado. Se dominar, Visão de Jogo DJ 18: sucesso dá 2 Vantagens em qualquer Jogada por 1D6 Rodadas para ambos (só se o receptor tiver Perícia em Análise).",
      distancia: "Distância de Passe", cooldown: 4, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: null, vantagens: 2, bonusFixo: 0, condicao: "Você e aliado (se vencer Visão de Jogo DJ 18)" }
    },
    fluxo: {
      nome: "Binóculo Visionário", frase: "É tão... previsível. Todos vocês.",
      desc: "Escolhe 2 aliados: 2 Vantagens em Visão de Jogo + outro Atributo. Escolhe 2 inimigos: 2 Desvantagens em Visão de Jogo + outro Atributo. Por 1D4+2 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: null, vantagens: 2, bonusFixo: 0, condicao: "+2V em Visão + Atributo para 2 aliados" }
    },
    porcentagensFluxo: [["Análise", 25], ["Roubo", 10], ["Passe Longo + Assistência", 5]]
  },
  {
    id: "camaleao_espelhado", nome: "Camaleão Espelhado",
    flavor: "Seu modo de jogo é focado em imitar e copiar, um espelho perfeito que reflete o melhor e o pior dos adversários.",
    pericias: ["2 Vantagens em Roubo", "1 Vantagem em Análise"],
    comBola: {
      nome: "Postura Igualitária", frase: "Não sou eu que estou jogando. Sou você.",
      desc: "Escolhe um Atributo do alvo e copia no lugar do seu, +2 de Bônus. Dura 1D6+1 Rodadas.",
      distancia: "Pessoal", cooldown: 5, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+1",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 2, condicao: "Copia Atributo do alvo pelo dado de duração" }
    },
    semBola: {
      nome: "Cópia 99%", frase: "Você jogaria assim, não jogaria?",
      desc: "Escolhe uma habilidade do alvo, trocando pela sua. Cooldown reinicia, uso único, com 1 Desvantagem.",
      distancia: "Pessoal", cooldown: 6, duracao: "Uso único", tipoAcao: "Ação Egoísta",
      bonus: { jogadaAlvo: null, vantagens: -1, bonusFixo: 0, condicao: "Usa habilidade copiada do alvo (1 Desvantagem)" }
    },
    variavel: {
      nome: "Parceria Perfeita", frase: "Juntos somos invencíveis. Você apenas não sabe disso ainda.",
      desc: "Escolhe um aliado. Por 1D6+2 Rodadas, todos seus Atributos viram cópias dos dele +2 de Bônus (só se o receptor tiver Perícia de Classe igual a uma sua).",
      distancia: "Pessoal", cooldown: 6, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "quimica",
      dadoDuracao: "1D6+2",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 2, condicao: "Copia todos Atributos do aliado" }
    },
    fluxo: {
      nome: "Mimetismo Absoluto", frase: "Aprendi tudo com você.",
      desc: "Escolhe uma habilidade de Fluxo do alvo, trocando pela sua. Cooldown reinicia, uso único.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "Uso único", tipoAcao: "Ação Egoísta",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "Usa habilidade de Fluxo copiada do alvo" }
    },
    porcentagensFluxo: [["Roubo", 25], ["Análise", 10], ["Domínio", 5]]
  },
  {
    id: "heroi_coringa", nome: "Herói Coringa",
    flavor: "Seu modo de jogo é focado em chutes poderosos e duelos físicos, um herói que resolve tudo no confronto direto.",
    pericias: ["2 Vantagens em Jogo de Corpo", "1 Vantagem em Knuckleball"],
    comBola: {
      nome: "Sai da Minha Frente", frase: "Sai da frente, plebeu.",
      desc: "Knuckleball com 2 Vantagens e +3m de Distância, só na mesma Rodada que ganhou um Jogo de Corpo; o roubado não pode Interceptar.",
      distancia: "Distância de Chute + 3 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "knuckleball", vantagens: 2, bonusFixo: 0, condicao: "Só na mesma Rodada de Jogo de Corpo ganho" }
    },
    semBola: {
      nome: "Atropelamento", frase: "Sai da frente ou é atropelado.",
      desc: "Jogo de Corpo com 2 Vantagens. Sucesso: avança 3m e troca Drible por Robustez +3 por 1D4+1 Rodadas.",
      distancia: "3 m / Pessoal", cooldown: 3, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: "jogo_de_corpo", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: Drible vira Robustez+3" }
    },
    variavel: {
      nome: "Esquerda do Herói", frase: "Esse chute... é impossível de defender.",
      desc: "Knuckleball com 3 Vantagens, +3 de Bônus e +2m de Distância. Pode ser Reação de Passe Longo/Alto, tornando-se não Interceptável (exceto por habilidades).",
      distancia: "Distância de Chute + 2 m", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "fluxo",
      bonus: { jogadaAlvo: "knuckleball", vantagens: 3, bonusFixo: 3, condicao: "Pode ser Reação de Passe (não Interceptável)" }
    },
    fluxo: {
      nome: "Músculos de Ferro", frase: "Cada golpe me torna mais forte.",
      desc: "Por 1D6+2 Rodadas, +1 Vantagem em Robustez por Jogo de Corpo ganho. Ao fim, Knuckleball com 2 Vantagens e +4 caso esteja com a bola.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+2",
      bonus: { jogadaAlvo: "jogo_de_corpo", vantagens: 1, bonusFixo: 0, condicao: "+1V por Jogo de Corpo ganho (acumulável)" }
    },
    porcentagensFluxo: [["Knuckleball + Gol", 25], ["Jogo de Corpo", 10], ["Roubo", 5]]
  },
  {
    id: "tubarao_estelar", nome: "Tubarão Estelar",
    flavor: "Seu modo de jogo é focado em passes rápidos e pressão constante, uma corrente interplanetária que não para nunca.",
    pericias: ["2 Vantagens em Passe Curto", "1 Vantagem em Roubo"],
    comBola: {
      nome: "1.2 em Órbita", frase: "Essa troca de passes... parece um satélite!",
      desc: "Passe Curto com 2 Vantagens. Se o receptor Dominar, avança 3m e ele pode Passe Curto de volta com 2 Vantagens; sucesso permite ele andar 3m também.",
      distancia: "Distância de Passe", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "passe_curto", vantagens: 2, bonusFixo: 0, condicao: null }
    },
    semBola: {
      nome: "Chomp Chomp", frase: "Obrigado pela bola!",
      desc: "Roubo com 2 Vantagens. Sucesso: anda 3m e faz Passe Curto com 2 Vantagens se houver aliado no fim do trajeto.",
      distancia: "Pessoal / 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "roubo", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: Passe Curto com 2V" }
    },
    variavel: {
      nome: "Ressonância Interplanetária", frase: "A órbita não tem fim.",
      desc: "Passe Curto com 2 Vantagens, avança 3m. Receptor pode repetir a sequência (até 3 vezes) (só se tiver Perícia em Passe Curto).",
      distancia: "Distância de Passe / 3 m", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica",
      bonus: { jogadaAlvo: "passe_curto", vantagens: 2, bonusFixo: 0, condicao: "Receptor repete até 3x (Perícia em Passe Curto)" }
    },
    fluxo: {
      nome: "Barbatanas Velocistas", frase: "Esse é o meu campo. Meu oceano.",
      desc: "Como Reação após Roubo bem-sucedido: +4 Fôlegos, 2 Vantagens em Passe Curto e Roubo por 1D6+1. Ao fim, -1 Rodada de Cooldown em todas habilidades.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta + Reação",
      dadoDuracao: "1D6+1",
      bonus: { jogadaAlvo: "passe_curto", vantagens: 2, bonusFixo: 0, condicao: "+2V em Roubo também; -1 Cooldown ao fim" }
    },
    porcentagensFluxo: [["Passe Curto + Assistência", 25], ["Roubo", 10], ["Domínio", 5]]
  },
  {
    id: "ansioso_estamina", nome: "Ansioso por Estamina",
    flavor: "Seu modo de jogo é focado em resistência e passes de suporte, um jogador que nunca para e sempre tem mais fôlego que os outros.",
    pericias: ["2 Vantagens em Jogo de Corpo", "1 Vantagem em Passe Curto"],
    comBola: {
      nome: "Segura por 1 Segundo?", frase: "Eu sei que consigo chegar lá!",
      desc: "Passe Curto com 2 Vantagens. Ganhando: avança 3m e +2 Fôlegos adicionais por 1D4+1 Rodadas.",
      distancia: "Distância de Passe / 3 m", cooldown: 3, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: "passe_curto", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: +2 Fôlegos/Rodada" }
    },
    semBola: {
      nome: "Com Licença...", frase: "Me deixa só passar...",
      desc: "Jogo de Corpo com 2 Vantagens. Ganhando: +2 Fôlegos e +3 de Bônus em Robustez por 1D4+2 Rodadas.",
      distancia: "Pessoal / 2 m", cooldown: 6, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: "jogo_de_corpo", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: +2 Fôlego e +3 Bônus em Robustez" }
    },
    variavel: {
      nome: "Não Posso Cansar Agora!", frase: "Meu corpo ainda aguenta!",
      desc: "Ultrapassa limites de Fôlegos; cada Fôlego extra dá -1 de Bônus acumulável na próxima Jogada. Dura 1D4+2 Rodadas.",
      distancia: "Pessoal", cooldown: 8, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "Fôlego extra: -1 Bônus acumulável na próxima Jogada" }
    },
    fluxo: {
      nome: "Resistência Inabalável", frase: "Eu não paro. Nunca.",
      desc: "Por 1D6+1 Rodadas, cada Jogada bem-sucedida recupera +1 Fôlego adicional.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+1",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "+1 Fôlego por Jogada bem-sucedida" }
    },
    porcentagensFluxo: [["Jogo de Corpo", 25], ["Passe Curto + Assistência", 10], ["Roubo", 5]]
  }
];

export { CLASSES_PARTE1 };
