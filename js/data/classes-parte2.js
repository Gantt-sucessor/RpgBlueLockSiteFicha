// ============================================================
// FÓRMULA DO EGO — Classes (parte 2 de 2)
// ============================================================

import { CLASSES_PARTE1 } from "./classes-parte1.js";

const CLASSES_PARTE2 = [
  {
    id: "player_glacial", nome: "Player Glacial",
    flavor: "Seu modo de jogo é focado em passar a bola pra seus aliados enquanto congela todos aqueles que tentarem lhe impedir, como em um videogame.",
    pericias: ["2 Vantagens em Passe Curto", "1 Vantagem em Elástico"],
    comBola: {
      nome: "Passe Deslizante", frase: "Um passe que deixa o campo em -273,15 °C.",
      desc: "Passe Curto com 2 Vantagens. Sucesso: todos em 4m² de você perdem -3 Fôlegos na próxima Rodada.",
      distancia: "4 m / 4 m²", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Sub-Zero Wins", frase: "Isso será uma Flawless Victory.",
      desc: "Domínio com +3 de Bônus. Sucesso: anda 3m e opção de Elástico (1 Vantagem) ou Passe Curto (1 Vantagem) ao fim.",
      distancia: "3 m / Corpo-a-Corpo / 4 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação"
    },
    variavel: {
      nome: "Fica Frio Aí!", frase: "Tou com sede... Eu só vou ganhar esse jogo...",
      desc: "Passe Longo com 2 Vantagens. Sucesso: todos em 6m² de você e do receptor perdem -5 Fôlegos e 1 Desvantagem na próxima Jogada (só se receptor tiver Perícia em Elástico).",
      distancia: "Distância de Passe / 6 m²", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Ice Ice Baby", frase: "Viagem direta pro Polo Norte!",
      desc: "Ganhando um Elástico, ative como Reação: avança 3m. Ao fim, todos em 6m² perdem -6 Fôlegos. +1 Vantagem em Passe Curto por 1D4 Rodadas e -1 Rodada de Cooldown geral.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo / 1D4 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    porcentagensFluxo: [["Passe Curto", 15], ["Caneta", 10], ["Análise", 10]]
  },
  {
    id: "ninja_invisivel", nome: "Ninja Invisível",
    flavor: "Seu modo de jogo é focado em desaparecer em campo, pois com ninguém te vendo fica bem mais fácil de roubar a bola.",
    pericias: ["2 Vantagens em Roubar", "1 Vantagem em Caneta"],
    comBola: {
      nome: "Desu Rēsu", frase: "Tou certo, Dattebayo!",
      desc: "Avanço de 3m ignorando inimigos. Ao fim, escolhe 2 Jogadas de Destreza/Drible para 1 Vantagem por 1D2+1 Rodadas.",
      distancia: "4 m / 4 m²", cooldown: 2, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Towa Shissō", frase: "Sumidão!",
      desc: "Por 1D6 Rodadas, não pode ser Marcado, +1 Vantagem e +3 de Bônus em Roubo; se já Marcado, escapa automaticamente.",
      distancia: "Pessoal", cooldown: 4, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta + 3 Fôlegos"
    },
    variavel: {
      nome: "Katto to Shōshitsu", frase: "Domínio-no-Jutsu!",
      desc: "Domínio com 2 Vantagens. Sucesso: avança 4m e troca Robustez/Potência/Visão de Jogo por Destreza +4 de Bônus por 1D4+2 Rodadas (só se passador tiver Perícia em Análise).",
      distancia: "Pessoal", cooldown: 6, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Reação + 3 Fôlegos", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Kawarimi no Jutsu", frase: "Fiz igual teu pai, te liga!",
      desc: "Ganhando uma Caneta, ative como Reação: +2 Fôlegos, quem te roubar recebe 2 Desvantagens e -2 de Bônus, e você recebe 1 Vantagem em Análise por 1D4+2 Rodadas.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    porcentagensFluxo: [["Roubo", 15], ["Caneta", 10], ["Escape de Marcação", 10]]
  },
  {
    id: "breakdancer_criativo", nome: "Breakdancer Criativo",
    flavor: "Seu modo de jogo é focado em dançar até seus pés cansarem, esse é o problema, porque quando um belo moonwalk é feito você nunca cansa.",
    pericias: ["2 Vantagens em Chapéu", "1 Vantagem em Passe Longo"],
    comBola: {
      nome: "Twister Pass", frase: "Cause i'm the better, yes i'm the real better!",
      desc: "Chapéu com 2 Vantagens. Ganhando: avança 2m e Passe Longo com 2 Vantagens, +2 Fôlegos por 1D4+1 Rodadas.",
      distancia: "2 m / Distância de Passe", cooldown: 5, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    semBola: {
      nome: "Pista de Dança", frase: "You get in my way i'ma feed you to the monster!",
      desc: "Ganhando um Domínio, ative como Reação: +1 Vantagem em Passe Longo e Análise por oponente em 4m² por 1D6+1 Rodadas.",
      distancia: "4 m²", cooldown: 6, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Drift em Tokyo", frase: "Guess who back, back again...",
      desc: "Passe Longo com 2 Vantagens. Sucesso: você e receptor andam 3m, ele recebe 2 Vantagens em Drible/Visão de Jogo por 1D4+1 Rodadas (só se receptor tiver Perícia em Caneta).",
      distancia: "Pessoal", cooldown: 6, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta + Reação + 3 Fôlegos", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Windmill Rítmico", frase: "Cause it feels so empty without me!",
      desc: "Avança 4m. Encontrando alvo, Chapéu com 2 Vantagens. Ganhando, avança +3m e Passe Longo +3m com 3 Vantagens, +3 de Bônus em Visão de Jogo por 1D4+2 Rodadas.",
      distancia: "4 m / 3 m / Distância de Passe + 3 m", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum + 3 Fôlegos"
    },
    porcentagensFluxo: [["Passe Longo", 15], ["Chapéu", 10], ["Domínio", 10]]
  },
  {
    id: "vilao_sadico", nome: "Vilão Sádico",
    flavor: "Seu modo de jogo é focado em destruir todos seus alvos, não apenas seus oponentes, mas qualquer um que te dê vontade de vomitar.",
    pericias: ["2 Vantagens em Chute Curvo", "1 Vantagem em Devorar"],
    comBola: {
      nome: "Destruição Total", frase: "Uma curva seguida de diversos corpos!",
      desc: "Chute Curvo com 1 Vantagem, andando +2m. +1 Vantagem adicional por inimigo em 3m² ou que tentar Interceptar.",
      distancia: "+2 m / Distância de Chute / 3 m²", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Amalgamo Devorador", frase: "Tem um monstro no jogo que não tá satisfeito!",
      desc: "Devorar com 2 Vantagens. Sucesso: todos em 6m² perdem 1 Token de Ego e você recupera 1 por alvo atingido.",
      distancia: "Devorar", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Tipo de Devorar"
    },
    variavel: {
      nome: "Latrocínio", frase: "Um roubo seguido de um assassinato!",
      desc: "Roubo com 2 Vantagens (3 se for Devorar). Ganhando: avança 3m e Chute Curvo com 2 Vantagens e +3 de Bônus. Gol: recarrega habilidade comum à escolha.",
      distancia: "Pessoal", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação + 3 Fôlegos", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Destruição de Pontos Fracos", frase: "Vocês me dão vontade de vomitar!",
      desc: "1 Vantagem e +3 de Bônus em todas as Jogadas contra alvos do time adversário com Perícia Dupla, por 1D6+1 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Chute Curvo", 25], ["Devorar", 10], ["Roubo", 5]]
  },
  {
    id: "maestro_impecavel", nome: "Maestro Impecável",
    flavor: "Seu modo de jogo é focado em fazer passes perfeitos para seus aliados e criar oportunidades de gol que só um macaco poderia errar.",
    pericias: ["2 Vantagens em Passe Alto", "1 Vantagem em Análise"],
    comBola: {
      nome: "Assistência Absoluta", frase: "Não erre esse gol tão fácil, atacante de merda...",
      desc: "Passe Alto com 2 Vantagens e +2m. Se ele Dominar, gaste Reação para obrigá-lo a Chutar (tipo à sua escolha) com 1 Vantagem.",
      distancia: "Distância de Passe + 2 m", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum (+ Reação)"
    },
    semBola: {
      nome: "Diagnóstico Belo", frase: "Devorando seus egos de forma linda!",
      desc: "Análise com 2 Vantagens. Sucesso: ele e todos em 6m² recebem 2 Desvantagens em 3 Jogadas escolhidas por 1D6 Rodadas.",
      distancia: "6 m²", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    variavel: {
      nome: "Oportunidade Perfeita", frase: "Nenhum gênio no mundo tanto animal carregou.",
      desc: "Passe Alto com 3 Vantagens e +4m. Sucesso: receptor recebe 2 Vantagens no Domínio; dominando, 2 Vantagens em 3 Jogadas escolhidas (só se receptor tiver Perícia em Voleio).",
      distancia: "Distância de Passe + 4 m", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Chance de Sinfonia", frase: "Todas as chances mostram minha vitória: 100%",
      desc: "Role 1D100. Múltiplo de 10: +1 de Bônus em 3 Jogadas escolhidas por número (ex: 74 = +7). Múltiplo de 30: +1 Vantagem nas mesmas. Dura 1D6+1 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Passe Alto", 15], ["Análise", 10], ["Caneta", 10]]
  },
  {
    id: "serpente_final", nome: "Serpente Final",
    flavor: "Seu modo de jogo é focado em interceptar jogadas e não deixar nenhum desses cachorrinhos passar e roubar seus gols.",
    pericias: ["2 Vantagens em Interceptação", "1 Vantagem em Análise"],
    comBola: {
      nome: "Emboscada da Víbora", frase: "Uma espreitada que pode se tornar letal.",
      desc: "Análise contra 3 alvos em 8m². Sucesso: escolhe 2 Jogadas J vs J para 2 Desvantagens contra você por 1D4+2 Rodadas.",
      distancia: "8 m²", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Mordida Venenosa", frase: "Eu sou tão britânico!",
      desc: "Interceptação com 2 Vantagens, +2 de Bônus e +2m de distância. Na área do goleiro sem ser goleiro: +1 Vantagem adicional.",
      distancia: "Interceptação + 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Bote de Algoz", frase: "Você não vai passar daqui, farejador de gols!",
      desc: "Avança 3m, Roubo com 2 Vantagens e +3 de Bônus. Sucesso: Visão de Jogo DJ 18 com 2 Vantagens; sucesso, escolhe 2 Jogadas de Destreza/Visão de Jogo +3 de Bônus por 1D6 Rodadas.",
      distancia: "3 m / Pessoal", cooldown: 6, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta (+ Reação)", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "...Ninguém Roubará Gols", frase: "Enquanto eu estiver em patrulha...",
      desc: "Por 1D4+1 Rodadas, todas suas Interceptações têm sucesso garantido.",
      distancia: "Interceptação", cooldown: "1 por Fluxo", duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Interceptação", 15], ["Análise", 10], ["Roubo", 10]]
  },
  {
    id: "demonio_tarado", nome: "Demônio Tarado",
    flavor: "Seu modo de jogo é focado em voleios com um tesão que destrói o goleiro e uma movimentação ágil mesmo fora da cama.",
    pericias: ["2 Vantagens em Voleio", "1 Vantagem em Domínio"],
    comBola: {
      nome: "Medidor de Ereção", frase: "Vamos dormir e morar juntinhos!",
      desc: "Escolhe aliado a 6m²+ de você. Cada 2m de proximidade por 1D6 Rodadas: +2 de Bônus em Destreza e +1 em Potência.",
      distancia: "6 m² / Pessoal", cooldown: 5, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Incubus", frase: "Se eu marcar esse gol, você me dá seu número?!",
      desc: "Voleio com 2 Vantagens e +2 de Bônus. Dentro da área de gol oponente: +1 Vantagem e +2 de Bônus adicional.",
      distancia: "Distância de Chute", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Dragon Header", frase: "Eu tou quaaaase... Tá quase saindoooo...",
      desc: "Ao receber Passe Longo/Alto, avança 4m e Voleio com 3 Vantagens e +2 de Bônus. Se tentarem Roubar, Destreza ao invés de Drible com 2 Vantagens (só se passador tiver Perícia em Passe Alto).",
      distancia: "3 m / Pessoal", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta (+ Reação)", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Big Bang Drive", frase: "EU TOU GOZANDOOO!",
      desc: "Via Passe/Interceptação. Como Reação, avança 3m até a bola. Destreza com 3 Vantagens contra DJ do Passe/Interceptação (22 se aliado). Sucesso: Voleio com 3 Vantagens, +3m e +5 de Bônus.",
      distancia: "3 m / Distância de Chute + 3 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação"
    },
    porcentagensFluxo: [["Voleio + Gol", 25], ["Domínio", 10], ["Elástico", 5]]
  },
  {
    id: "imperador_renascido", nome: "Imperador Renascido",
    flavor: "Seu modo de jogo é focado em executar chutes tão rápidos quanto uma bala e um ciclo vicioso de mostrar para o seu time quem é o imperador.",
    pericias: ["2 Vantagens em Knuckleball", "1 Vantagem em Análise"],
    comBola: {
      nome: "Auf der Knie", frase: "Gosto quando seu holofote tá em mim.",
      desc: "Todos em 5m² perdem Vantagens e Bônus extras. Você recebe 1 Vantagem em 3 Jogadas escolhidas. Ambos os modos duram 1D2+2 Rodadas.",
      distancia: "6 m² / Pessoal", cooldown: 4, duracao: "1D2+2 Rodadas", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Impact Beinschuss", frase: "Comam merda perdedores!",
      desc: "Após Domínio bem-sucedido, ative como Reação: avança 4m. Encontrando alvo, Destreza com 2 Vantagens ao invés de Drible. Ganhando, vai para trás do alvo e Knuckleball com 2 Vantagens e +3 de Bônus.",
      distancia: "4 m / Distância de Chute", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "A Rosa Azul Desabrocha", frase: "Bastardo, bem-vindo a minha dimensão!",
      desc: "Só com 3 Tokens de Ego ou menos. Recupera 1D4+2 Tokens (podendo atingir Ego Inflado) e duplica efeitos positivos extras por 1D4 Rodadas.",
      distancia: "Pessoal", cooldown: 6, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Impact Magnus", frase: "Der thron ist, wo ICH bin!",
      desc: "Knuckleball que inicia com 4m para a direita/esquerda, depois trajeto comum. Role 1D2: resultado 1 = 1 Desvantagem e +2 de Bônus; resultado 2 = 4 Vantagens e +5 de Bônus.",
      distancia: "4 m / Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    porcentagensFluxo: [["Knuckleball + Gol", 25], ["Análise", 10], ["Roubo", 5]]
  },
  {
    id: "feiticeiro_fluido", nome: "Feiticeiro Fluido",
    flavor: "Seu modo de jogo é focado em fazer passes como círculos de magia e driblar com seus calcanhares tipo um 'Abracadabra!'",
    pericias: ["2 Vantagens em Passe Longo", "1 Vantagem em Elástico"],
    comBola: {
      nome: "Coelho na Cartola", frase: "Ocus Pocus!",
      desc: "Passe Longo com 2 Vantagens. Se o receptor dominar, todos em 4m² dele recebem +1 Rodada de Cooldown em todas as habilidades.",
      distancia: "Distância de Passe / 4 m²", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Glória ao Rei", frase: "AU AU!",
      desc: "Escolhe aliado. Por 1D6+2 Rodadas, Passes para ele recebem +1 Vantagem adicional, e ele recebe +4 de Bônus em Domínios de seus Passes.",
      distancia: "Pessoal", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    variavel: {
      nome: "Magnetismo Dependente", frase: "Se você fosse eu não me chamaria de puxa saco!",
      desc: "Escolhe aliado. Por 1D6+2 Rodadas, +2m e +2 Vantagens em Passes para ele; ele recebe Domínio garantido (só se o escolhido tiver 4+ Tokens de Ego que você).",
      distancia: "Pessoal", cooldown: 7, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Magia Negra", frase: "Se você é o melhor, ENTÃO VENHA E PEGUE!",
      desc: "Passe Longo com 3 Vantagens e +3m. Inimigos em 7m² do receptor perdem todas as Reações e recebem 1 Desvantagem em 2 Jogadas escolhidas pelo dominador por 1D2+1 Rodadas.",
      distancia: "Distância de Passe + 3 m", cooldown: "1 por Fluxo", duracao: "1D2+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    porcentagensFluxo: [["Passe Longo", 15], ["Elástico", 10], ["Análise", 10]]
  },
  {
    id: "zumbi_devorador", nome: "Zumbi Devorador de Ás",
    flavor: "Seu modo de jogo é focado em roubos totalmente tortos e avanços que parecem que você vai devorar o cérebro de alguém.",
    pericias: ["2 Vantagens em Roubo", "1 Vantagem em Chapéu"],
    comBola: {
      nome: "Movimentação Estrábica", frase: "Como prever alguém que se mexe de forma torta?",
      desc: "Pelos próximos 8 Fôlegos gastos: 2 Vantagens em Chapéu e +3 de Bônus em Passe Curto.",
      distancia: "Pessoal", cooldown: 4, duracao: "8 Fôlegos", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Corte Dourado", frase: "O que achou do tal gosto das sobras?",
      desc: "Como Reação de Chute/Passe inimigo, avança 4m. Entrando no caminho da bola, Interceptação com 3 Vantagens; sucesso, bola volta 4m.",
      distancia: "4 m / 4 m", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Lixo ao Luxo", frase: "Direttamente dalla tomba!",
      desc: "Roubo com 3 Vantagens. Sucesso: avança 5m e, encontrando alvo, Chapéu com 2 Vantagens.",
      distancia: "5 m", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "fluxo"
    },
    fluxo: {
      nome: "Cemitério de Atacantes", frase: "Sei que os atacantes brilham, mas eu brilho mais!",
      desc: "Do seu lado do campo: +1 Vantagem e +2 de Bônus adicional em Roubo por jogador inimigo na área do seu time, por 1D6+2 Rodadas.",
      distancia: "Meio de Campo do seu time", cooldown: "1 por Fluxo", duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta"
    },
    porcentagensFluxo: [["Roubo", 15], ["Chapéu", 10], ["Interceptação", 10]]
  },
  {
    id: "diabinho_travesso", nome: "Diabinho Travesso",
    flavor: "Seu modo de jogo é focado em passes tão divertidos que irritam seu time e dribles que só servem para sua própria diversão.",
    pericias: ["2 Vantagens em Passe Alto", "1 Vantagem em Caneta"],
    comBola: {
      nome: "Rabona Cross (Foda >:) )", frase: "Eu vou dar a meia volta e volta e meia eles vão dar!",
      desc: "Após Caneta bem-sucedida, ative como Reação: Passe Alto com 2 Vantagens e +4 de Bônus em Voleio para o receptor.",
      distancia: "Distância de Passe", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação"
    },
    semBola: {
      nome: "Rebote Irritante", frase: "Eu sou só um pouco inconsequente!",
      desc: "Como Reação de Passe, em vez de Domínio/Voleio, faz Passe Alto com 2 Vantagens e +3 de Bônus para outro aliado (não o passador).",
      distancia: "Distância de Passe", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação + Ação Comum"
    },
    variavel: {
      nome: "Conexão Doentia", frase: "Finalmente mais alguém pra zuar esses cabaços :P",
      desc: "Após aliado Dominar seu Passe, ative como Reação: 2 Vantagens em Passes Altos e +2 de Bônus com ele; receptor ganha 2 Vantagens e +2m em Voleios. Dura 1D6+2 Rodadas (só se receptor tiver Perícia em Voleio).",
      distancia: "Pessoal", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Brincadeira Imprevisível", frase: "Vamo fazer uma travessura um pouco diferente!",
      desc: "Quando tentarem Dominar seu Passe, ative como Reação: torna-se Passe Alto para outro aliado à escolha, que deve fazer Voleio obrigatoriamente.",
      distancia: "Distância de Passe + 3 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    porcentagensFluxo: [["Passe Alto", 15], ["Caneta", 10], ["Interceptação", 10]]
  },
  {
    id: "corvo_assassino", nome: "Corvo Assassino",
    flavor: "Seu modo de jogo é focado em mostrar para esses jogadores ORDINÁRIOS o quão ruins eles são nesse jogo, humilhando-os com suas interceptações.",
    pericias: ["2 Vantagens em Trash Talk", "1 Vantagem em Interceptação"],
    comBola: {
      nome: "TÃO Ordinários", frase: "Vocês realmente sabem jogar futebol?",
      desc: "Trash Talk com 2 Vantagens contra todos em 5m² (-1 por alvo extra). Ganhando: +1 Token de Ego por afetado (podendo atingir Ego Inflado).",
      distancia: "5 m²", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta"
    },
    semBola: {
      nome: "Ninho do Corvo", frase: "Você tá na minha área, seu lixo!",
      desc: "Cria área de 3m² a até 3m da linha central, dura 1D4 Rodadas. Dentro dela, Interceptações garantidas.",
      distancia: "3 m² / 3 m", cooldown: 6, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta"
    },
    variavel: {
      nome: "Os Dois Babacas", frase: "'Manda ele comer merda!' 'eu não, manda você'",
      desc: "Ao dominar um Passe, ative como Reação: você e o passador fazem Trash Talk em 2 alvos diferentes, 2 Vantagens e +3 de Bônus, ignorando distância (só se o passador tiver Perícia em Roubo).",
      distancia: "Pessoal", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Ka-caw!", frase: "Até a inteligência de um CORVO é maior que a sua!",
      desc: "Após Interceptação bem-sucedida, ative como Reação: avança 4m. Ao fim, alvos em 7m² fazem Ego DJ 20; quem falhar tem 2 Atributos zerados por 1D4+1 Rodadas.",
      distancia: "4 m / 7 m²", cooldown: "1 por Fluxo", duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    porcentagensFluxo: [["Trash Talk", 15], ["Interceptação", 10], ["Roubo", 10]]
  },
  {
    id: "resplendor_aéreo", nome: "Resplendor Aéreo",
    flavor: "Seu modo de jogo é focado em pulos extremamente belos e robustos tão maravilhosos quanto você.",
    pericias: ["2 Vantagens em Interceptação", "1 Vantagem em Roubo"],
    comBola: {
      nome: "Posicioanamento Glam!", frase: "Eu, tu, nós bota eles no bolso!",
      desc: "Você faz um Passe Longo com 2 Vantagens. Caso haja sucesso, você e todos seus aliados em até 8 m à sua volta recebem 1 Vantagem e +2 de Bonus em 2 jogadas à sua escolha por 1d4 + 1 Rodadas.",
      distancia: "Distância de Passe/ 8 m", cooldown: 4, duracao: "1d4 + 1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Ninho do Corvo", frase: "Você tá na minha área, seu lixo!",
      desc: "Cria área de 3m² a até 3m da linha central, dura 1D4 Rodadas. Dentro dela, Interceptações garantidas.",
      distancia: "3 m² / 3 m", cooldown: 6, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta"
    },
    variavel: {
      nome: "Os Dois Babacas", frase: "'Manda ele comer merda!' 'eu não, manda você'",
      desc: "Ao dominar um Passe, ative como Reação: você e o passador fazem Trash Talk em 2 alvos diferentes, 2 Vantagens e +3 de Bônus, ignorando distância (só se o passador tiver Perícia em Roubo).",
      distancia: "Pessoal", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Ka-caw!", frase: "Até a inteligência de um CORVO é maior que a sua!",
      desc: "Após Interceptação bem-sucedida, ative como Reação: avança 4m. Ao fim, alvos em 7m² fazem Ego DJ 20; quem falhar tem 2 Atributos zerados por 1D4+1 Rodadas.",
      distancia: "4 m / 7 m²", cooldown: "1 por Fluxo", duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    porcentagensFluxo: [["Trash Talk", 15], ["Interceptação", 10], ["Roubo", 10]]
  },
   {
    id: "matador_realista", nome: "MATADOR REALISTA",
    flavor: "Seu modo de jogo é focado em menosprezar seus oponentes ao ponto de quebrar suas idealizações, mostrando a verdade nua e crua.",
    pericias: ["2 Vantagens em Trash Talk", " 1 Vantagem em Passe Longo"],
    comBola: {
      nome: "Fardo Forçado", frase: "Você acredita em destino?",
      desc: "Você faz um Passe Longo com 2 Vantagens. Caso haja sucesso, escolha um alvo em até 4 m² de você para receber Quebra de Ego, porém por apenas 2 Rodadas e depois volta com seus Tokens comuns.",
      distancia: " Distância de Passe/4 m", cooldown: 5, duracao: "2 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum"
    },
    semBola: {
      nome: "Vitória Inevitável (habilidade marcada)", frase: "Não é questão de ser, a questão é que eu já sou.",
      desc: "Ao um alvo fazer uma Jogada em até 5 m², você pode escolher uma habilidade dele para se tornar inutilizável por 3 Rodadas (caso seja uma habilidade ativa no momento, ela retorna ao seu funcionamento comum após as 3 Rodadas).",
      distancia: "pessoal", cooldown: 3, duracao: "3 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    variavel: {
      nome: "Humilhação Gratuita", frase: "Tenho 1001 motivos para xingar um lixo como VOCÊ",
      desc: "Ao ganhar um inimigo com qualquer Jogada de J vs J você pode ativar essa habilidade como Reação, assim fazendo um Passe Longo com 2 Vantagens para um alvo no alcance e escolhe uma habilidade do perdedor para se tornar inutilizável por 4 Rodadas (caso seja uma habilidade ativa no momento, ela retorna ao seu funcionamento comum após as 4 Rodadas).",
      distancia: "Distância de Passe", cooldown: 8, duracao: "3 rodadas", tipoAcao: "Ação Comum + Reação", tipoVariavel: "quimica"
    },
    fluxo: {
      nome: "Engrenagens Minimalistas", frase: "Gente como a gente não nasceu pro 1º lugar...",
      desc: "Você escolhe 3 alvos para ficarem marcados pelas "Engrenagens". Durante 1D4 + 2 Rodadas, toda vez que desejarem fazer uma ação, antes devem rodar um Teste de Ego com DJ igual sua Visão de Jogo x 8. Caso falhem, perdem sua Ação Comum e não conseguem fazer a ação desejada.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Reação"
    },
    porcentagensFluxo: [["Trash Talk", 15], ["Interceptação", 10], ["Roubo", 10]]
  }
];

const CLASSES = [...CLASSES_PARTE1, ...CLASSES_PARTE2];

export { CLASSES_PARTE2, CLASSES };
