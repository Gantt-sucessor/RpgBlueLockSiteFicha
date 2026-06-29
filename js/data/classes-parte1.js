// ============================================================
// FÓRMULA DO EGO — Classes (parte 1 de 2)
// Cada classe tem: Perícias, Habilidade com bola, sem bola,
// Habilidade Variável, Habilidade de Fluxo, % para Fluxo
// ============================================================

const CLASSES_PARTE1 = [
  {
    id: "mestre_adaptacao", nome: "Mestre da Adaptação",
    flavor: "Seu modo de jogo é focado em estratégia visionária pura, alguém que vê o campo inteiro como peças que devem se juntar.",
    pericias: ["2 Vantagens em Análise", "1 Vantagem em Chute Regular"],
    comBola: {
      nome: "Remontando", frase: "O campo não passa de um quebra-cabeça para EU montar do MEU jeito.",
      desc: "Escolha um aliado para 2 Vantagens em um Atributo e um oponente para você receber +3 de Bônus em um Atributo contra ele, por 1D6 Rodadas.",
      distancia: "Pessoal", cooldown: 6, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Chute Direto", frase: "A bola está chegando, esse será o meu gol perfeito!",
      desc: "Como Reação de um Passe Longo/Alto aliado, faz Chute Regular com 1 Vantagem e +4 de Bônus.",
      distancia: "Distância de Chute", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Roda Adaptativa", frase: "Uma verdadeira jogada de oito empunhaduras!",
      desc: "Escolha 3 Jogadas. Por 1D6+1 Rodadas, 1 Vantagem nelas. Cada vitória nessa Jogada específica ganha +1 Vantagem acumulável até o fim.",
      distancia: "Pessoal", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Demon King", frase: "COMA ESSA GÊNIOZINHO!",
      desc: "Obriga um aliado com a bola a fazer Passe Longo garantido (DJ 18 p/ Interceptação) para você. Ao receber, faz Chute Regular com 3 Vantagens, +4 de Bônus e +2m de Distância como Reação.",
      distancia: "Distância de Chute + 2 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
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
      distancia: "Corpo-a-Corpo / 3 m", cooldown: 5, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum + Reação"
    },
    semBola: {
      nome: "Armadilha", frase: "Achei que esse domínio seria mais difícil...",
      desc: "Jogada de Domínio/Interceptação com 1 Vantagem e +2 de Bônus.",
      distancia: "Pessoal / 2 m", cooldown: 1, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Armadilha de Buraco Negro", frase: "Esse passe sempre foi pra mim!",
      desc: "Domínio/Interceptação com 2 Vantagens e +3 de Bônus. Ganhando a posse, +5 de Bônus em Destreza por 1D4 Rodadas.",
      distancia: "Pessoal / 2 m", cooldown: 4, duracao: "Instantâneo / 1D4 Rodadas", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Gol Inumano", frase: "Sinto esse fogo... Voleio e domínio é o que me resta.",
      desc: "Como Reação de Passe Longo/Alto, Voleio com 3 Vantagens e +4 de Bônus. Quem tentar Interceptar deve antes vencer Visão de Jogo DJ 18.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação + Ação Comum"
    },
    porcentagensFluxo: [["Voleio + Gol", 25], ["Domínio", 10], ["Interceptação", 5]]
  },
  {
    id: "abelha_caotica", nome: "Abelha Caótica",
    flavor: "Seu modo de jogo é apenas instinto e diversão, alguém que pode até não saber o que está fazendo, mas se anima com seus inimigos no chão.",
    pericias: ["2 Vantagens em Caneta", "1 Vantagem em Chapéu"],
    comBola: {
      nome: "Ferrão Cortante", frase: "Um drible que irrita os oponentes com um bzz bzz.",
      desc: "Elástico com 2 Vantagens. Sucesso: anda 2m e o driblado faz Jogada de Ego DJ 18 ou perde -1 Token de Ego adicional.",
      distancia: "Corpo-a-Corpo / 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    semBola: {
      nome: "Instinto Colmeia", frase: "Uma verdadeira colmeia trabalha em equipe!",
      desc: "Domínio com +4 de Bônus. Sucesso: avança 3m e recebe 2 Vantagens em Drible por 1D4+1 Rodadas.",
      distancia: "Pessoal / 3 m", cooldown: 4, duracao: "Instantâneo / 1D6 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Bee Shot", frase: "Esse voleio será uma COLMEdia!",
      desc: "Como Reação de Passe, Voleio usando Destreza + Drible ÷ 2 com 2 Vantagens e +3 de Bônus (só se o passador tiver Perícia em Passe Longo).",
      distancia: "Distância de Chute", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Mil e Uma Possibilidades", frase: "É HORA DO SHOW!",
      desc: "Por 1D6+2 Rodadas, toda vez que driblar alguém recebe +1 Vantagem em Drible acumulativamente.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Caneta", 15], ["Domínio", 10], ["Elástico", 10]]
  },
  {
    id: "pantera_celere", nome: "Pantera Célere",
    flavor: "Seu modo de jogo é focado em velocidade extrema, tanto em passes totalmente calculados quanto em investidas destruidoras.",
    pericias: ["2 Vantagens em Passe Longo", "1 Vantagem em Chute Regular"],
    comBola: {
      nome: "Velocista Felino", frase: "Quer correr? Quer correr? O Tigrão vai te ensinar.",
      desc: "Avanço de 4m, ignorando oponentes no caminho. Ao fim, opção de Passe Longo com 2 Vantagens.",
      distancia: "4 m / Distância de Passe", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Avanço Perpétuo", frase: "Não posso parar... não posso parar!",
      desc: "Avanço de 5m. Se estiver em Marcação, foge dela instantaneamente avançando só 3m.",
      distancia: "5 m / 3 m", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + 2 Fôlegos"
    },
    variavel: {
      nome: "Quebra de 44°", frase: "Um chute específico até demais, não é?",
      desc: "Avança 5m e faz Chute Regular com 2 Vantagens e +4 de Bônus. Falhando o gol, pode se mover 3m.",
      distancia: "5 m / Distância de Chute / 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + 3 Fôlegos", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Você é Muito Lento!", frase: "Você chama isso de 'chute rápido'?",
      desc: "Interceptação com +2m de Distância sem penalidades, 2 Vantagens e +5 de Bônus. Interceptando, pode andar 5m gastando uma Reação.",
      distancia: "2 m + 2 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação + 2 Fôlegos (+ Reação)"
    },
    porcentagensFluxo: [["Passe Longo", 10], ["Roubo", 10], ["Interceptação", 15]]
  },
  {
    id: "rei_leao", nome: "Rei Leão",
    flavor: "Seu modo de jogo é focado em tornar o campo SEU, e apenas SEU, devorando aqueles que tentarem lhe tirar do trono.",
    pericias: ["2 Vantagens em Devorar", "1 Vantagem em Knuckleball"],
    comBola: {
      nome: "Caminho do Rei", frase: "Quem cria a rota desse time sou EU!",
      desc: "Cria área de 4x4 a 6m² por 1D2 Rodadas. Dentro dela: 2 Vantagens em Knuckleball e quem tentar Roubar recebe -4 de Bônus.",
      distancia: "4x4 / 6 m²", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Curvem-se a Mim!", frase: "Entendam uma coisa, EU sou o rei desse campo!",
      desc: "Obriga aliado a fazer Passe para você com 1 Vantagem, como Reação.",
      distancia: "Pessoal", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    variavel: {
      nome: "Hora da Caçada", frase: "Se você é o heróizinho, então eu serei o seu vilão!",
      desc: "Cria área de 6m² que te acompanha por 1D6 Rodadas: +1 Vantagem e +2 de Bônus em Knuckleball por inimigo nela.",
      distancia: "6 m²", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + 3 Fôlegos", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Presa Fraca", frase: "Saiam da frente para eu brilhar!",
      desc: "Avanço de 4m em direção a quem tem a bola. Chegando, Roubo (ou Devorar) com 2 Vantagens e +3 de Bônus. Sucesso: Knuckleball com 3 Vantagens e +5 de Bônus.",
      distancia: "4 m / Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + 2 Fôlegos"
    },
    porcentagensFluxo: [["Knuckleball + Gol", 25], ["Devorar", 10], ["Roubar", 5]]
  },
  {
    id: "defensor_natural", nome: "Defensor Natural",
    flavor: "Seu modo de jogo é focado em defesa direta e instintiva, um goleiro que defende até os chutes mais imprevisíveis.",
    pericias: ["2 Vantagens em Defesa de Goleiro", "1 Vantagem em Passe Alto"],
    comBola: {
      nome: "Garra de Urso", frase: "Pega essa!",
      desc: "Passe Alto com 1 Vantagem. Se for goleiro na área de gol: +3 de Bônus, +1 Vantagem e ignora penalidades de distância.",
      distancia: "Distância de Passe", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Chute Escorpião", frase: "Eu vou ter que... CHUTAR!",
      desc: "Como Reação de um Chute, Defesa de Goleiro com 2 Vantagens. Sucesso: bloqueia o gol e a bola volta 2m.",
      distancia: "Pessoal / 2 m", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Instintos das Montanhas", frase: "Meus instintos não mentem!",
      desc: "Por 1D4+3 Rodadas: 2 Vantagens em Destreza e +1 Reação adicional para usar.",
      distancia: "Pessoal", cooldown: 4, duracao: "1D4+3 Rodadas", tipoAcao: "Ação Egoísta + 3 Fôlegos", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Vamos... De Novo!", frase: "Por pouco... EU NÃO VOU DEIXAR ASSIM!",
      desc: "Defesa de Goleiro com 2 Vantagens e +3 de Bônus. Falhando, gaste outra Reação para re-rolar com 3 Vantagens e +4 de Bônus.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação (+ Reação)"
    },
    porcentagensFluxo: [["Defesa de Goleiro", 25], ["Passe Alto", 10], ["Roubar", 5]]
  },
  {
    id: "muralha_duelista", nome: "Muralha Duelista",
    flavor: "Seu modo de jogo é focado em anular jogadores adversários de forma sexy e segurar a bola o máximo possível até seu grande atacante chegar.",
    pericias: ["2 Vantagens em Marcação", "1 Vantagem em Pivô"],
    comBola: {
      nome: "SAI DO MEU PÉ!", frase: "VOCÊS SÓ ME IRRITAM, SAI DAQUI!",
      desc: "Avança 3m e faz Pivô com 2 Vantagens. Vencendo Jogada de Robustez nesse modo, pode andar 1m.",
      distancia: "3 m", cooldown: 4, duracao: "Até o fim do Pivô", tipoAcao: "Ação Egoísta + Ação Comum + Ação de Movimento"
    },
    semBola: {
      nome: "FICA AÍ!", frase: "VEJAM MEU FUTEBOL SEXY!",
      desc: "Marcação a até 2m do alvo, podendo marcar 2 alvos simultaneamente, +1 Vantagem.",
      distancia: "2 m", cooldown: 5, duracao: "Até o fim da Marcação", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    variavel: {
      nome: "EU AINDA QUEBRO VOCÊS!", frase: "BORA TIME, JOGA!",
      desc: "Após Passe Curto, ative como Reação: avança 3m. Encontrando alvo, Marcação inescapável por 1D2+1 (só se o receptor tiver Perícia em Jogo de Corpo).",
      distancia: "Pessoal", cooldown: 6, duracao: "Instantâneo / 1D2+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "DE ONDE VOCÊ SAIU?!", frase: "DA CAMA DA SUA MÃE MANÉ!",
      desc: "Marcação inescapável contra um alvo durante 1D4+2 Rodadas.",
      distancia: "Corpo-a-Corpo", cooldown: "1 por Fluxo", duracao: "Até o fim da Marcação", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Rodada com Marcação bem-sucedida", 10], ["Drible com Pivô", 10], ["Passe Curto", 5]]
  },
  {
    id: "torre_vigia", nome: "Torre de Vigia",
    flavor: "Seu modo de jogo é focado em uma análise completa do time inimigo, tirando vantagem de seus estudos sob eles.",
    pericias: ["2 Vantagens em Análise", "1 Vantagem em Roubo"],
    comBola: {
      nome: "Acenda o Farol", frase: "Uma luz de ego me guia como os lampejos do farol.",
      desc: "Teste de Análise contra todos os alvos em 6m² (+1 DJ por alvo extra). Sucesso: 1 Vantagem e +3 de Bônus contra todos atingidos por 1D4+2 Rodadas.",
      distancia: "6 m²", cooldown: 5, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Roubo Calculado", frase: "Tudo milimetricamente calculado...",
      desc: "Roubo com 2 Vantagens. Sucesso: Análise com 2 Vantagens logo após contra qualquer alvo.",
      distancia: "Corpo-a-Corpo", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    variavel: {
      nome: "Neurônios", frase: "Um cérebro não trabalha sozinho.",
      desc: "Passe Curto para aliado. Se dominar, Visão de Jogo DJ 18: sucesso dá 2 Vantagens em qualquer Jogada por 1D6 Rodadas para ambos (só se o receptor tiver Perícia em Análise).",
      distancia: "Pessoal", cooldown: 4, duracao: "1D4+3 Rodadas", tipoAcao: "Ação Egoísta + 3 Fôlegos", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Binóculo Visionário", frase: "Eu consigo te ver daqui.",
      desc: "Escolhe 2 aliados: 2 Vantagens em Visão de Jogo + outro Atributo. Escolhe 2 inimigos: 2 Desvantagens em Visão de Jogo + outro Atributo. Por 1D4+2 Rodadas.",
      distancia: "Todo o campo", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Análise", 15], ["Roubar", 10], ["Passe Curto", 10]]
  },
  {
    id: "camaleao_espelhado", nome: "Camaleão Espelhado",
    flavor: "Seu modo de jogo é focado em ver, entender e adaptar as habilidades do oponente para si, espelhando tudo e todos.",
    pericias: ["2 Vantagens em Passe Longo", "1 Vantagem em Análise"],
    comBola: {
      nome: "Postura Igualitária", frase: "Você acha que é o único que se move assim?",
      desc: "Escolhe um Atributo do alvo e copia no lugar do seu, +2 de Bônus. Dura 1D6+1 Rodadas.",
      distancia: "Todo o campo", cooldown: 5, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Cópia 99%", frase: "Tudo nosso nada deles!",
      desc: "Escolhe uma habilidade do alvo, trocando pela sua. Cooldown reinicia, uso único, com 1 Desvantagem.",
      distancia: "Pessoal", cooldown: 6, duracao: "Uso único", tipoAcao: "Ação Egoísta"
    },
    variavel: {
      nome: "Parceria Perfeita", frase: "Dois jogadores iguais no campo?! Impressionante.",
      desc: "Escolhe um aliado. Por 1D6+2 Rodadas, todos seus Atributos viram cópias dos dele +2 de Bônus (só se o receptor tiver Perícia de Classe igual a uma sua).",
      distancia: "Pessoal", cooldown: 6, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Mimetismo Absoluto", frase: "Seu não... NOSSO JOGO!",
      desc: "Escolhe uma habilidade de Fluxo do alvo, trocando pela sua. Cooldown reinicia, uso único.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "Uso único", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Passe Longo", 15], ["Análise", 10], ["Roubo", 10]]
  },
  {
    id: "heroi_coringa", nome: "Herói Coringa",
    flavor: "Seu modo de jogo é focado em ser um robô em campo, com chutes destrutivos e músculos que derrubam qualquer um.",
    pericias: ["2 Vantagens em Jogo de Corpo", "1 Vantagem em Knuckleball"],
    comBola: {
      nome: "Sai da Minha Frente", frase: "Que tal quebrar a mão do goleiro?",
      desc: "Knuckleball com 2 Vantagens e +3m de Distância, só na mesma Rodada que ganhou um Jogo de Corpo; o roubado não pode Interceptar.",
      distancia: "Distância de Chute / Jogo de Corpo", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Atropelamento", frase: "Cansei de vocês, caiam de uma vez.",
      desc: "Jogo de Corpo com 2 Vantagens. Sucesso: avança 3m e troca Drible por Robustez +3 por 1D4+1 Rodadas.",
      distancia: "2 m / Pessoal", cooldown: 3, duracao: "Instantâneo / 1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum + 3 Fôlegos"
    },
    variavel: {
      nome: "Esquerda do Herói", frase: "Parem de me chamar dessa merdinha de 'herói'.",
      desc: "Knuckleball com 3 Vantagens, +3 de Bônus e +2m de Distância. Pode ser Reação de Passe Longo/Alto, tornando-se não Interceptável (exceto por habilidades).",
      distancia: "Distância de Chute + 2 m", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum (+ Reação)", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Músculos de Ferro", frase: "Vencerei, nem que tenha que quebrar suas costas.",
      desc: "Por 1D6+2 Rodadas, +1 Vantagem em Robustez por Jogo de Corpo ganho. Ao fim, Knuckleball com 2 Vantagens e +4 caso esteja com a bola.",
      distancia: "Pessoal / Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    porcentagensFluxo: [["Knuckleball + Gol", 25], ["Jogo de Corpo", 10], ["Drible com Pivô", 5]]
  },
  {
    id: "tubarao_estelar", nome: "Tubarão Estelar",
    flavor: "Seu modo de jogo é focado em uma velocidade como nadadeiras aquáticas e passes rápidos como cometas.",
    pericias: ["2 Vantagens em Passe Curto", "1 Vantagem em Roubo"],
    comBola: {
      nome: "1.2 em Órbita", frase: "As estrelas se alinham entre nós!",
      desc: "Passe Curto com 2 Vantagens. Se o receptor Dominar, avança 3m e ele pode Passe Curto de volta com 2 Vantagens; sucesso permite ele andar 3m também.",
      distancia: "4 m / 3 m", cooldown: 3, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Chomp Chomp", frase: "Não sabia que tubarões jogavam futebol!",
      desc: "Roubo com 2 Vantagens. Sucesso: anda 3m e faz Passe Curto com 2 Vantagens se houver aliado no fim do trajeto.",
      distancia: "2 m / Pessoal", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    variavel: {
      nome: "Ressonância Interplanetária", frase: "Vem, vem brilhar mais, ser uma estrela sob o Sol.",
      desc: "Passe Curto com 2 Vantagens, avança 3m. Receptor pode repetir a sequência (até 3 vezes) (só se tiver Perícia em Passe Curto).",
      distancia: "4 m / 3 m", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Barbatanas Velocistas", frase: "Com dentes perfeitos para devorar até tubarões!",
      desc: "Como Reação após Roubo bem-sucedido: +4 Fôlegos, 2 Vantagens em Passe Curto e Roubo por 1D6+1. Ao fim, -1 Rodada de Cooldown em todas habilidades.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    porcentagensFluxo: [["Passe Curto", 15], ["Roubo", 10], ["Domínio", 10]]
  },
  {
    id: "ansioso_estamina", nome: "Ansioso por Estamina",
    flavor: "Seu modo de jogo é focado em sempre estar atrás da bola sem nunca se cansar, pois seu corpo são apenas músculos e energia infinita.",
    pericias: ["2 Vantagens em Jogo de Corpo", "1 Vantagem em Passe Curto"],
    comBola: {
      nome: "Segura por 1 Segundo?", frase: "Por favor, fica aí que eu já volto!",
      desc: "Passe Curto com 2 Vantagens. Ganhando: avança 3m e +2 Fôlegos adicionais por 1D4+1 Rodadas.",
      distancia: "3 m / Pessoal", cooldown: 3, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Com Licença...", frase: "Desculpa atrapalha-lo, mas me entrega isso!",
      desc: "Jogo de Corpo com 2 Vantagens. Ganhando: +2 Fôlegos e +3 de Bônus em Robustez por 1D4+2 Rodadas.",
      distancia: "3 m / Pessoal", cooldown: 6, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    variavel: {
      nome: "Não Posso Cansar Agora!", frase: "Eu.. Não... Posso... Me... CANSAR!",
      desc: "Ultrapassa limites de Fôlegos; cada Fôlego extra dá -1 de Bônus acumulável na próxima Jogada. Dura 1D4+2 Rodadas.",
      distancia: "Pessoal", cooldown: 8, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Desculpa por Isso!", frase: "Eu não queria te atrapalhar, mas isso é meu!",
      desc: "Ao ser roubado, ative como Reação: Jogo de Corpo para recuperar a bola. Sucesso: anda 4m e +4 Fôlegos por 1D6+2 Rodadas.",
      distancia: "3 m / Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    porcentagensFluxo: [["Jogo de Corpo", 15], ["Passe Curto", 10], ["Drible com Pivô", 10]]
  },
  {
    id: "artista_rua", nome: "Artista de Rua",
    flavor: "Seu modo de jogo é focado em driblar os oponentes no estilo das ruas e chutar de formas que picham a cara dos oponentes com um 'Loser'.",
    pericias: ["2 Vantagens em Elástico", "1 Vantagem em Chute Curvo"],
    comBola: {
      nome: "Corte de Asfalto", frase: "Comam a poeira do meu corte!",
      desc: "Elástico com 1 Vantagem. Ganhando, anda 2m. Encontrando outro oponente, repete com +1 Vantagem adicional, acumulável.",
      distancia: "3 m / Pessoal", cooldown: 4, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    semBola: {
      nome: "Direção Contrária", frase: "Seria legal dar seta no trânsito, não é?",
      desc: "Domínio com +3 de Bônus. Sucesso: move 3m à esquerda/direita e Chute Curvo com 2 Vantagens.",
      distancia: "3 m / Distância de Chute", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação"
    },
    variavel: {
      nome: "Dribles de Rua", frase: "Finta... Fake... Vamos para a melhor jogada!",
      desc: "Avança 3m, Elástico com 2 Vantagens repetível por alvo encontrado. Ao fim, Chute Curvo com +1 Vantagem por driblado.",
      distancia: "3 m / Distância de Chute", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + 3 Fôlegos", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Gyro Ball", frase: "Um chute giratório impossível de prever.",
      desc: "Chute Curvo com 3 Vantagens e +4 de Bônus. Quem tentar Interceptar recebe 1 Desvantagem e gasta -4 Fôlegos.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    porcentagensFluxo: [["Chute Curvo + Gol", 25], ["Elástico", 10], ["Domínio", 5]]
  }
];

export { CLASSES_PARTE1 };
