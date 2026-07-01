// ============================================================
// FÓRMULA DO EGO — Classes (parte 2 de 2)
// ============================================================

import { CLASSES_PARTE1 } from "./classes-parte1.js";

const CLASSES_PARTE2 = [
  {
    id: "artista_rua", nome: "Artista de Rua",
    flavor: "Seu modo de jogo é focado em driblar os oponentes no estilo das ruas e chutar de formas que picham a cara dos oponentes com um 'Loser'.",
    pericias: ["2 Vantagens em Elástico", "1 Vantagem em Chute Curvo"],
    comBola: {
      nome: "Corte de Asfalto", frase: "Comam a poeira do meu corte!",
      desc: "Elástico com 1 Vantagem. Ganhando, anda 2m. Encontrando outro oponente, repete com +1 Vantagem adicional, acumulável.",
      distancia: "3 m / Pessoal", cooldown: 4, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Reação",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: "elastico", vantagens: 1, bonusFixo: 0, condicao: "+1V por oponente encadeado (acumulável)" }
    },
    semBola: {
      nome: "Direção Contrária", frase: "Seria legal dar seta no trânsito, não é?",
      desc: "Domínio com +3 de Bônus. Sucesso: move 3m à esquerda/direita e Chute Curvo com 2 Vantagens.",
      distancia: "3 m / Distância de Chute", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação",
      bonus: { jogadaAlvo: "dominio", vantagens: 0, bonusFixo: 3, condicao: "Se ganhar: lateral + Chute Curvo com 2V" }
    },
    variavel: {
      nome: "Dribles de Rua", frase: "Finta... Fake... Vamos para a melhor jogada!",
      desc: "Avança 3m, Elástico com 2 Vantagens repetível por alvo encontrado. Ao fim, Chute Curvo com +1 Vantagem por driblado.",
      distancia: "3 m / Distância de Chute", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + 3 Fôlegos", tipoVariavel: "fluxo",
      bonus: { jogadaAlvo: "elastico", vantagens: 2, bonusFixo: 0, condicao: "+1V no Chute Curvo por driblado (acumulável)" }
    },
    fluxo: {
      nome: "Gyro Ball", frase: "Um chute giratório impossível de prever.",
      desc: "Chute Curvo com 3 Vantagens e +4 de Bônus. Quem tentar Interceptar recebe 1 Desvantagem e gasta -4 Fôlegos.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "chute_curvo", vantagens: 3, bonusFixo: 4, condicao: "Interceptador: 1 Desv. e -4 Fôlegos" }
    },
    porcentagensFluxo: [["Chute Curvo + Gol", 25], ["Elástico", 10], ["Domínio", 5]]
  },
  {
    id: "player_glacial", nome: "Player Glacial",
    flavor: "Seu modo de jogo é focado em passar a bola pra seus aliados enquanto congela todos aqueles que tentarem lhe impedir, como em um videogame.",
    pericias: ["2 Vantagens em Passe Curto", "1 Vantagem em Elástico"],
    comBola: {
      nome: "Passe Deslizante", frase: "Um passe que deixa o campo em -273,15 °C.",
      desc: "Passe Curto com 2 Vantagens. Sucesso: todos em 4m² de você perdem -3 Fôlegos na próxima Rodada.",
      distancia: "4 m / 4 m²", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "passe_curto", vantagens: 2, bonusFixo: 0, condicao: "Oponentes próximos: -3 Fôlego" }
    },
    semBola: {
      nome: "Sub-Zero Wins", frase: "Isso será uma Flawless Victory.",
      desc: "Domínio com +3 de Bônus. Sucesso: anda 3m e opção de Elástico (1 Vantagem) ou Passe Curto (1 Vantagem) ao fim.",
      distancia: "3 m / Corpo-a-Corpo / 4 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum + Reação",
      bonus: { jogadaAlvo: "dominio", vantagens: 0, bonusFixo: 3, condicao: "Se ganhar: Elástico ou Passe Curto com 1V" }
    },
    variavel: {
      nome: "Fica Frio Aí!", frase: "Tou com sede... Eu só vou ganhar esse jogo...",
      desc: "Passe Longo com 2 Vantagens. Sucesso: todos em 6m² de você e do receptor perdem -5 Fôlegos e 1 Desvantagem na próxima Jogada (só se receptor tiver Perícia em Elástico).",
      distancia: "Distância de Passe / 6 m²", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica",
      bonus: { jogadaAlvo: "passe_longo", vantagens: 2, bonusFixo: 0, condicao: "Receptor c/ Perícia Elástico: -5 Fôlego+1Desv em área" }
    },
    fluxo: {
      nome: "Ice Ice Baby", frase: "Viagem direta pro Polo Norte!",
      desc: "Ganhando um Elástico, ative como Reação: avança 3m. Ao fim, todos em 6m² perdem -6 Fôlegos. +1 Vantagem em Passe Curto por 1D4 Rodadas e -1 Rodada de Cooldown geral.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta + Reação",
      dadoDuracao: "1D4",
      bonus: { jogadaAlvo: "passe_curto", vantagens: 1, bonusFixo: 0, condicao: "Reação de Elástico; -6 Fôlego área e -1 Cooldown geral" }
    },
    porcentagensFluxo: [["Passe Curto + Assistência", 25], ["Elástico", 10], ["Domínio", 5]]
  },
  {
    id: "ninja_invisivel", nome: "Ninja Invisível",
    flavor: "Seu modo de jogo é focado em velocidade e invisibilidade, um ninja que nunca pode ser alcançado.",
    pericias: ["2 Vantagens em Roubo", "1 Vantagem em Caneta"],
    comBola: {
      nome: "Desu Rēsu", frase: "Nem me viu passar.",
      desc: "Avanço de 3m ignorando inimigos. Ao fim, escolhe 2 Jogadas de Destreza/Drible para 1 Vantagem por 1D2+1 Rodadas.",
      distancia: "3 m", cooldown: 2, duracao: "1D2+1 Rodadas", tipoAcao: "Ação de Movimento",
      dadoDuracao: "1D2+1",
      bonus: { jogadaAlvo: null, vantagens: 1, bonusFixo: 0, condicao: "2 Jogadas de Destreza/Drible à escolha" }
    },
    semBola: {
      nome: "Towa Shissō", frase: "Marcação? Que marcação?",
      desc: "Por 1D6 Rodadas, não pode ser Marcado, +1 Vantagem e +3 de Bônus em Roubo; se já Marcado, escapa automaticamente.",
      distancia: "Pessoal", cooldown: 4, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: "roubo", vantagens: 1, bonusFixo: 3, condicao: "Imune a Marcação durante duração" }
    },
    variavel: {
      nome: "Katto to Shōshitsu", frase: "Piscou e eu desapareci.",
      desc: "Domínio com 2 Vantagens. Sucesso: avança 4m e troca Robustez/Potência/Visão de Jogo por Destreza +4 de Bônus por 1D4+2 Rodadas (só se passador tiver Perícia em Análise).",
      distancia: "4 m / Pessoal", cooldown: 6, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum + Reação", tipoVariavel: "quimica",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: "dominio", vantagens: 2, bonusFixo: 4, condicao: "Troca Atrib. por Destreza (passador c/ Perícia Análise)" }
    },
    fluxo: {
      nome: "Kawarimi no Jutsu", frase: "Meu corpo... é um fantasma.",
      desc: "Ganhando uma Caneta, ative como Reação: +2 Fôlegos, quem te roubar recebe 2 Desvantagens e -2 de Bônus, e você recebe 1 Vantagem em Análise por 1D4+2 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Reação",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: "caneta", vantagens: 1, bonusFixo: 0, condicao: "Reação de Caneta; roubador: 2Desv./-2 Bônus; +1V em Análise" }
    },
    porcentagensFluxo: [["Roubo", 25], ["Caneta", 10], ["Destreza (Drible)", 5]]
  },
  {
    id: "breakdancer_criativo", nome: "Breakdancer Criativo",
    flavor: "Seu modo de jogo é focado em dribles acrobáticos e passes longos, um artista que dança em campo com a bola.",
    pericias: ["2 Vantagens em Chapéu", "1 Vantagem em Passe Longo"],
    comBola: {
      nome: "Twister Pass", frase: "Cuidado pra não se perder no ritmo!",
      desc: "Chapéu com 2 Vantagens. Ganhando: avança 2m e Passe Longo com 2 Vantagens, +2 Fôlegos por 1D4+1 Rodadas.",
      distancia: "2 m / Distância de Passe", cooldown: 5, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum + Reação",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: "chapeu", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: Passe Longo 2V e +2 Fôlego/Rod." }
    },
    semBola: {
      nome: "Pista de Dança", frase: "Esse campo é minha pista de dança.",
      desc: "Ganhando um Domínio, ative como Reação: +1 Vantagem em Passe Longo e Análise por oponente em 4m² por 1D6+1 Rodadas.",
      distancia: "4 m²", cooldown: 6, duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta + Reação",
      dadoDuracao: "1D6+1",
      bonus: { jogadaAlvo: "dominio", vantagens: 0, bonusFixo: 0, condicao: "Se ganhar Domínio: +1V/oponente em Passe Longo e Análise" }
    },
    variavel: {
      nome: "Drift em Tokyo", frase: "Acelerando curva!",
      desc: "Passe Longo com 2 Vantagens. Sucesso: você e receptor andam 3m, ele recebe 2 Vantagens em Drible/Visão de Jogo por 1D4+1 Rodadas (só se receptor tiver Perícia em Caneta).",
      distancia: "Distância de Passe / 3 m", cooldown: 6, duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: "passe_longo", vantagens: 2, bonusFixo: 0, condicao: "Receptor c/ Perícia Caneta: 2V em Drible/Visão" }
    },
    fluxo: {
      nome: "Windmill Rítmico", frase: "E agora o grande finale!",
      desc: "Avança 4m. Encontrando alvo, Chapéu com 2 Vantagens. Ganhando, avança +3m e Passe Longo +3m com 3 Vantagens, +3 de Bônus em Visão de Jogo por 1D4+2 Rodadas.",
      distancia: "4 m / Distância de Passe + 3 m", cooldown: "1 por Fluxo", duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: "chapeu", vantagens: 2, bonusFixo: 3, condicao: "Se ganhar: Passe Longo 3V/+3m e +3 Bônus Visão" }
    },
    porcentagensFluxo: [["Chapéu", 25], ["Passe Longo + Assistência", 10], ["Caneta", 5]]
  },
  {
    id: "vilao_sadico", nome: "Vilão Sádico",
    flavor: "Seu modo de jogo é focado em destruir os adversários psicologicamente e tecnicamente, um vilão que se alimenta do desespero alheio.",
    pericias: ["2 Vantagens em Chute Curvo", "1 Vantagem em Roubo"],
    comBola: {
      nome: "Destruição Total", frase: "Loser.",
      desc: "Chute Curvo com 1 Vantagem, andando +2m. +1 Vantagem adicional por inimigo em 3m² ou que tentar Interceptar.",
      distancia: "Distância de Chute", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "chute_curvo", vantagens: 1, bonusFixo: 0, condicao: "+1V por inimigo próximo/Interceptando" }
    },
    semBola: {
      nome: "Amalgamo Devorador", frase: "Você é apenas mais um fantoche.",
      desc: "Devorar com 2 Vantagens. Sucesso: todos em 6m² perdem 1 Token de Ego e você recupera 1 por alvo atingido.",
      distancia: "6 m²", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: null, vantagens: 2, bonusFixo: 0, condicao: "Devorar em área; +1 Token/alvo atingido" }
    },
    variavel: {
      nome: "Latrocínio", frase: "Você acha que merece ter essa bola?",
      desc: "Roubo com 2 Vantagens (3 se for Devorar). Ganhando: avança 3m e Chute Curvo com 2 Vantagens e +3 de Bônus. Gol: recarrega habilidade comum à escolha.",
      distancia: "3 m / Distância de Chute", cooldown: 6, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "fluxo",
      bonus: { jogadaAlvo: "roubo", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: Chute Curvo 2V/+3 e gol recarrega habilidade" }
    },
    fluxo: {
      nome: "Destruição de Pontos Fracos", frase: "Você tem um ponto fraco. Todo mundo tem.",
      desc: "1 Vantagem e +3 de Bônus em todas as Jogadas contra alvos do time adversário com Perícia Dupla, por 1D6+1 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+1",
      bonus: { jogadaAlvo: null, vantagens: 1, bonusFixo: 3, condicao: "Contra adversários com Perícia Dupla" }
    },
    porcentagensFluxo: [["Chute Curvo + Gol", 25], ["Roubo", 10], ["Driblar", 5]]
  },
  {
    id: "maestro_impecavel", nome: "Maestro Impecável",
    flavor: "Seu modo de jogo é focado em visão de jogo e análise perfeita, um maestro que dirige a sinfonia do campo.",
    pericias: ["2 Vantagens em Passe Alto", "1 Vantagem em Análise"],
    comBola: {
      nome: "Assistência Absoluta", frase: "Você vai marcar. Eu garanto.",
      desc: "Passe Alto com 2 Vantagens e +2m. Se ele Dominar, gaste Reação para obrigá-lo a Chutar (tipo à sua escolha) com 1 Vantagem.",
      distancia: "Distância de Passe + 2 m", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "passe_alto", vantagens: 2, bonusFixo: 0, condicao: "Se receptor Dominar: Chute obrigatório c/ 1V" }
    },
    semBola: {
      nome: "Diagnóstico Belo", frase: "Encontrei suas fraquezas.",
      desc: "Análise com 2 Vantagens. Sucesso: ele e todos em 6m² recebem 2 Desvantagens em 3 Jogadas escolhidas por 1D6 Rodadas.",
      distancia: "6 m²", cooldown: 5, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: "analise", vantagens: 2, bonusFixo: 0, condicao: "Se ganhar: alvo e área com 2Desv. em 3 Jogadas" }
    },
    variavel: {
      nome: "Oportunidade Perfeita", frase: "Agora! A janela está aberta!",
      desc: "Passe Alto com 3 Vantagens e +4m. Sucesso: receptor recebe 2 Vantagens no Domínio; dominando, 2 Vantagens em 3 Jogadas escolhidas (só se receptor tiver Perícia em Voleio).",
      distancia: "Distância de Passe + 4 m", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "quimica",
      bonus: { jogadaAlvo: "passe_alto", vantagens: 3, bonusFixo: 0, condicao: "Receptor c/ Perícia Voleio: 2V Domínio+3 Jogadas" }
    },
    fluxo: {
      nome: "Chance de Sinfonia", frase: "Que a sorte sorria para mim.",
      desc: "Role 1D100. Múltiplo de 10: +1 de Bônus em 3 Jogadas escolhidas por número (ex: 74 = +7). Múltiplo de 30: +1 Vantagem nas mesmas. Dura 1D6+1 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+1 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+1",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "1D100: mult.10=+Bônus, mult.30=+Vantagem em 3 Jogadas" }
    },
    porcentagensFluxo: [["Passe Alto + Assistência", 25], ["Análise", 10], ["Visão de Jogo", 5]]
  },
  {
    id: "serpente_final", nome: "Serpente Final",
    flavor: "Seu modo de jogo é focado em interceptações e contra-ataques precisos, uma serpente que aguarda o momento perfeito para atacar.",
    pericias: ["2 Vantagens em Interceptação", "1 Vantagem em Análise"],
    comBola: {
      nome: "Emboscada da Víbora", frase: "Armadilha perfeita.",
      desc: "Análise contra 3 alvos em 8m². Sucesso: escolhe 2 Jogadas J vs J para 2 Desvantagens contra você por 1D4+2 Rodadas.",
      distancia: "8 m²", cooldown: 4, duracao: "1D4+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D4+2",
      bonus: { jogadaAlvo: "analise", vantagens: 0, bonusFixo: 0, condicao: "Alvos: 2Desv. em 2 Jogadas J vs J contra você" }
    },
    semBola: {
      nome: "Mordida Venenosa", frase: "Senti o veneno entrar.",
      desc: "Interceptação com 2 Vantagens, +2 de Bônus e +2m de distância. Na área do goleiro sem ser goleiro: +1 Vantagem adicional.",
      distancia: "Distância de Interceptação + 2 m", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "interceptacao", vantagens: 2, bonusFixo: 2, condicao: "Na área do goleiro: +1V adicional" }
    },
    variavel: {
      nome: "Bote de Algoz", frase: "Não há como escapar.",
      desc: "Avança 3m, Roubo com 2 Vantagens e +3 de Bônus. Sucesso: Visão de Jogo DJ 18 com 2 Vantagens; sucesso, escolhe 2 Jogadas de Destreza/Visão de Jogo +3 de Bônus por 1D6 Rodadas.",
      distancia: "3 m / Pessoal", cooldown: 6, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "fluxo",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: "roubo", vantagens: 2, bonusFixo: 3, condicao: "Se ganhar Visão DJ18: +3 em 2 Jogadas Desv./Visão" }
    },
    fluxo: {
      nome: "...Ninguém Roubará Gols", frase: "Enquanto eu estiver aqui, não.",
      desc: "Por 1D4+1 Rodadas, todas suas Interceptações têm sucesso garantido.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: "interceptacao", vantagens: 0, bonusFixo: 0, condicao: "Interceptações garantidas durante duração" }
    },
    porcentagensFluxo: [["Interceptação", 25], ["Análise", 10], ["Roubo", 5]]
  },
  {
    id: "demonio_tarado", nome: "Demônio Tarado",
    flavor: "Seu modo de jogo é focado em voleios e cabeceios imprecisos mas devastadores, um demônio que completa tudo que chega até ele.",
    pericias: ["2 Vantagens em Voleio", "1 Vantagem em Passe Alto"],
    comBola: {
      nome: "Medidor de Ereção", frase: "Sinto a faísca chegando...",
      desc: "Escolhe aliado a 6m²+ de você. Cada 2m de proximidade por 1D6 Rodadas: +2 de Bônus em Destreza e +1 em Potência.",
      distancia: "6 m²+", cooldown: 5, duracao: "1D6 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 2, atributoAlvo: "destreza", condicao: "+2 Desv./+1 Pot. por 2m de proximidade" }
    },
    semBola: {
      nome: "Incubus", frase: "Venha até mim.",
      desc: "Voleio com 2 Vantagens e +2 de Bônus. Dentro da área de gol oponente: +1 Vantagem e +2 de Bônus adicional.",
      distancia: "Pessoal", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "voleio", vantagens: 2, bonusFixo: 2, condicao: "Dentro da área: +1V e +2 Bônus adicional" }
    },
    variavel: {
      nome: "Dragon Header", frase: "Esse cabeceio vai rachar o campo.",
      desc: "Ao receber Passe Longo/Alto, avança 4m e Voleio com 3 Vantagens e +2 de Bônus. Se tentarem Roubar, Destreza ao invés de Drible com 2 Vantagens (só se passador tiver Perícia em Passe Alto).",
      distancia: "4 m / Distância de Chute", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica",
      bonus: { jogadaAlvo: "voleio", vantagens: 3, bonusFixo: 2, condicao: "Reação de Passe (passador c/ Perícia Passe Alto)" }
    },
    fluxo: {
      nome: "Big Bang Drive", frase: "Essa é a explosão que vai mudar tudo.",
      desc: "Via Passe/Interceptação. Como Reação, avança 3m até a bola. Destreza com 3 Vantagens contra DJ do Passe/Interceptação (22 se aliado). Sucesso: Voleio com 3 Vantagens, +3m e +5 de Bônus.",
      distancia: "3 m / Distância de Chute + 3 m", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: null, vantagens: 3, bonusFixo: 5, condicao: "Reação de Passe/Interceptação; disputa Destreza 3V — se ganhar: Voleio 3V/+5" }
    },
    porcentagensFluxo: [["Voleio + Gol", 25], ["Passe Alto + Assistência", 10], ["Cabeceio", 5]]
  },
  {
    id: "imperador_renascido", nome: "Imperador Renascido",
    flavor: "Seu modo de jogo é focado em dominar o campo com presença absoluta, um imperador que impõe sua vontade a todos ao redor.",
    pericias: ["2 Vantagens em Knuckleball", "1 Vantagem em Jogo de Corpo"],
    comBola: {
      nome: "Auf der Knie", frase: "Ajoelhem-se diante do Imperador.",
      desc: "Todos em 5m² perdem Vantagens e Bônus extras. Você recebe 1 Vantagem em 3 Jogadas escolhidas. Ambos os modos duram 1D2+2 Rodadas.",
      distancia: "5 m²", cooldown: 4, duracao: "1D2+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D2+2",
      bonus: { jogadaAlvo: null, vantagens: 1, bonusFixo: 0, condicao: "3 Jogadas à escolha; area perde bônus extras" }
    },
    semBola: {
      nome: "Impact Beinschuss", frase: "Esse chute é o fim.",
      desc: "Após Domínio bem-sucedido, ative como Reação: avança 4m. Encontrando alvo, Destreza com 2 Vantagens ao invés de Drible. Ganhando, vai para trás do alvo e Knuckleball com 2 Vantagens e +3 de Bônus.",
      distancia: "4 m / Distância de Chute", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: null, vantagens: 2, bonusFixo: 3, condicao: "Reação de Domínio: disputa com Destreza 2V; se ganhar, Knuckleball 2V/+3" }
    },
    variavel: {
      nome: "A Rosa Azul Desabrocha", frase: "O verdadeiro poder do Imperador desperta.",
      desc: "Só com 3 Tokens de Ego ou menos. Recupera 1D4+2 Tokens (podendo atingir Ego Inflado) e duplica efeitos positivos extras por 1D4 Rodadas.",
      distancia: "Pessoal", cooldown: 6, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "fluxo",
      dadoDuracao: "1D4",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "Apenas c/ ≤3 Tokens; duplica efeitos positivos" }
    },
    fluxo: {
      nome: "Impact Magnus", frase: "Um chute que rasga o espaço-tempo.",
      desc: "Knuckleball que inicia com 4m para a direita/esquerda, depois trajeto comum. Role 1D2: resultado 1 = 1 Desvantagem e +2 de Bônus; resultado 2 = 4 Vantagens e +5 de Bônus.",
      distancia: "Distância de Chute", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "knuckleball", vantagens: 0, bonusFixo: 0, condicao: "1D2: (1) 1Desv.+2Bônus / (2) 4V+5Bônus" }
    },
    porcentagensFluxo: [["Knuckleball + Gol", 25], ["Jogo de Corpo", 10], ["Domínio", 5]]
  },
  {
    id: "feiticeiro_fluido", nome: "Feiticeiro Fluido",
    flavor: "Seu modo de jogo é focado em passes mágicos e controle de aliados, um feiticeiro que manipula o campo através de sua visão.",
    pericias: ["2 Vantagens em Passe Longo", "1 Vantagem em Visão de Jogo"],
    comBola: {
      nome: "Coelho na Cartola", frase: "Abracadabra.",
      desc: "Passe Longo com 2 Vantagens. Se o receptor dominar, todos em 4m² dele recebem +1 Rodada de Cooldown em todas as habilidades.",
      distancia: "Distância de Passe", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "passe_longo", vantagens: 2, bonusFixo: 0, condicao: "Receptor Domina: área +1 Cooldown todas habilidades" }
    },
    semBola: {
      nome: "Glória ao Rei", frase: "Eu serei sua magia.",
      desc: "Escolhe aliado. Por 1D6+2 Rodadas, Passes para ele recebem +1 Vantagem adicional, e ele recebe +4 de Bônus em Domínios de seus Passes.",
      distancia: "Pessoal", cooldown: 5, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+2",
      bonus: { jogadaAlvo: "passe_longo", vantagens: 1, bonusFixo: 4, condicao: "Passes pro aliado escolhido; ele +4 em Domínios" }
    },
    variavel: {
      nome: "Magnetismo Dependente", frase: "Você não consegue resistir à minha magia.",
      desc: "Escolhe aliado. Por 1D6+2 Rodadas, +2m e +2 Vantagens em Passes para ele; ele recebe Domínio garantido (só se o escolhido tiver 4+ Tokens de Ego que você).",
      distancia: "Distância de Passe + 2 m", cooldown: 7, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta", tipoVariavel: "quimica",
      dadoDuracao: "1D6+2",
      bonus: { jogadaAlvo: "passe_longo", vantagens: 2, bonusFixo: 0, condicao: "Aliado c/ 4+Tokens: Domínio garantido" }
    },
    fluxo: {
      nome: "Magia Negra", frase: "A magia negra não conhece limites.",
      desc: "Passe Longo com 3 Vantagens e +3m. Inimigos em 7m² do receptor perdem todas as Reações e recebem 1 Desvantagem em 2 Jogadas escolhidas pelo dominador por 1D2+1 Rodadas.",
      distancia: "Distância de Passe + 3 m", cooldown: "1 por Fluxo", duracao: "1D2+1 Rodadas", tipoAcao: "Ação Egoísta + Ação Comum",
      dadoDuracao: "1D2+1",
      bonus: { jogadaAlvo: "passe_longo", vantagens: 3, bonusFixo: 3, condicao: "Inimigos do receptor: sem Reações, 1Desv. em 2 Jogadas" }
    },
    porcentagensFluxo: [["Passe Longo + Assistência", 25], ["Visão de Jogo", 10], ["Domínio", 5]]
  },
  {
    id: "zumbi_devorador_as", nome: "Zumbi Devorador de Ás",
    flavor: "Seu modo de jogo é focado em roubar e dominar com chapéus e dribles, um zumbi que come as jogadas dos outros.",
    pericias: ["2 Vantagens em Chapéu", "1 Vantagem em Interceptação"],
    comBola: {
      nome: "Movimentação Estrábica", frase: "Minha visão é perfeita... à minha maneira.",
      desc: "Pelos próximos 8 Fôlegos gastos: 2 Vantagens em Chapéu e +3 de Bônus em Passe Curto.",
      distancia: "Pessoal", cooldown: 4, duracao: "8 Fôlegos", tipoAcao: "Ação Egoísta",
      bonus: { jogadaAlvo: "chapeu", vantagens: 2, bonusFixo: 3, condicao: "Dura enquanto gastar até 8 Fôlegos" }
    },
    semBola: {
      nome: "Corte Dourado", frase: "Esse foi o fim da sua jogada.",
      desc: "Como Reação de Chute/Passe inimigo, avança 4m. Entrando no caminho da bola, Interceptação com 3 Vantagens; sucesso, bola volta 4m.",
      distancia: "4 m", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "interceptacao", vantagens: 3, bonusFixo: 0, condicao: "Reação de Chute/Passe inimigo; bola volta 4m" }
    },
    variavel: {
      nome: "Lixo ao Luxo", frase: "Lixo para os fracos, luxo para os fortes.",
      desc: "Roubo com 3 Vantagens. Sucesso: avança 5m e, encontrando alvo, Chapéu com 2 Vantagens.",
      distancia: "5 m / Pessoal", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum", tipoVariavel: "fluxo",
      bonus: { jogadaAlvo: "roubo", vantagens: 3, bonusFixo: 0, condicao: "Se ganhar: avança 5m e Chapéu 2V" }
    },
    fluxo: {
      nome: "Cemitério de Atacantes", frase: "Bem-vindo ao meu cemitério.",
      desc: "Do seu lado do campo: +1 Vantagem e +2 de Bônus adicional em Roubo por jogador inimigo na área do seu time, por 1D6+2 Rodadas.",
      distancia: "Pessoal", cooldown: "1 por Fluxo", duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D6+2",
      bonus: { jogadaAlvo: "roubo", vantagens: 1, bonusFixo: 2, condicao: "+1V/+2 por inimigo no seu campo (acumulável)" }
    },
    porcentagensFluxo: [["Chapéu", 25], ["Interceptação", 10], ["Roubo", 5]]
  },
  {
    id: "diabinho_travesso", nome: "Diabinho Travesso",
    flavor: "Seu modo de jogo é focado em passes altos e dribles de caneta, um diabinho que cria caos com cada toque na bola.",
    pericias: ["2 Vantagens em Caneta", "1 Vantagem em Passe Alto"],
    comBola: {
      nome: "Rabona Cross (Foda >:) )", frase: "Essa foi de graça!",
      desc: "Após Caneta bem-sucedida, ative como Reação: Passe Alto com 2 Vantagens e +4 de Bônus em Voleio para o receptor.",
      distancia: "Distância de Passe", cooldown: 4, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "caneta", vantagens: 0, bonusFixo: 0, condicao: "Reação de Caneta: Passe Alto 2V e +4 Bônus Voleio pro receptor" }
    },
    semBola: {
      nome: "Rebote Irritante", frase: "Surprise!",
      desc: "Como Reação de Passe, em vez de Domínio/Voleio, faz Passe Alto com 2 Vantagens e +3 de Bônus para outro aliado (não o passador).",
      distancia: "Distância de Passe", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "passe_alto", vantagens: 2, bonusFixo: 3, condicao: "Reação de Passe; desvia para outro aliado" }
    },
    variavel: {
      nome: "Conexão Doentia", frase: "Nós dois somos imparáveis.",
      desc: "Após aliado Dominar seu Passe, ative como Reação: 2 Vantagens em Passes Altos e +2 de Bônus com ele; receptor ganha 2 Vantagens e +2m em Voleios. Dura 1D6+2 Rodadas (só se receptor tiver Perícia em Voleio).",
      distancia: "Pessoal", cooldown: 7, duracao: "1D6+2 Rodadas", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica",
      dadoDuracao: "1D6+2",
      bonus: { jogadaAlvo: "passe_alto", vantagens: 2, bonusFixo: 2, condicao: "Receptor c/ Perícia Voleio: 2V/+2m Voleios" }
    },
    fluxo: {
      nome: "Brincadeira Imprevisível", frase: "Você pensou que sabia o que ia acontecer.",
      desc: "Quando tentarem Dominar seu Passe, ative como Reação: torna-se Passe Alto para outro aliado à escolha, que deve fazer Voleio obrigatoriamente.",
      distancia: "Distância de Passe", cooldown: "1 por Fluxo", duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação",
      bonus: { jogadaAlvo: "passe_alto", vantagens: 0, bonusFixo: 0, condicao: "Reação de Domínio; vira Passe Alto obrigatório" }
    },
    porcentagensFluxo: [["Passe Alto + Assistência", 25], ["Caneta", 10], ["Voleio + Gol", 5]]
  },
  {
    id: "corvo_assassino", nome: "Corvo Assassino",
    flavor: "Seu modo de jogo é focado em trash talk e interceptações, um corvo que usa a mente e a língua para destruir os adversários.",
    pericias: ["2 Vantagens em Trash Talk", "1 Vantagem em Interceptação"],
    comBola: {
      nome: "TÃO Ordinários", frase: "Vocês são tão... ordinários.",
      desc: "Trash Talk com 2 Vantagens contra todos em 5m² (-1 por alvo extra). Ganhando: +1 Token de Ego por afetado (podendo atingir Ego Inflado).",
      distancia: "5 m²", cooldown: 5, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Ação Comum",
      bonus: { jogadaAlvo: "trash_talk", vantagens: 2, bonusFixo: 0, condicao: "+1 Token por alvo afetado (pode Ego Inflar)" }
    },
    semBola: {
      nome: "Ninho do Corvo", frase: "Entrou no meu território.",
      desc: "Cria área de 3m² a até 3m da linha central, dura 1D4 Rodadas. Dentro dela, Interceptações garantidas.",
      distancia: "3 m / 3 m²", cooldown: 6, duracao: "1D4 Rodadas", tipoAcao: "Ação Egoísta",
      dadoDuracao: "1D4",
      bonus: { jogadaAlvo: "interceptacao", vantagens: 0, bonusFixo: 0, condicao: "Interceptações garantidas na área criada" }
    },
    variavel: {
      nome: "Os Dois Babacas", frase: "Somos dois e você é apenas um.",
      desc: "Ao dominar um Passe, ative como Reação: você e o passador fazem Trash Talk em 2 alvos diferentes, 2 Vantagens e +3 de Bônus, ignorando distância (só se o passador tiver Perícia em Roubo).",
      distancia: "Qualquer Distância", cooldown: 7, duracao: "Instantâneo", tipoAcao: "Ação Egoísta + Reação", tipoVariavel: "quimica",
      bonus: { jogadaAlvo: "trash_talk", vantagens: 2, bonusFixo: 3, condicao: "Reação de Domínio; passador c/ Perícia Roubo" }
    },
    fluxo: {
      nome: "Ka-caw!", frase: "Ka-caw!",
      desc: "Após Interceptação bem-sucedida, ative como Reação: avança 4m. Ao fim, alvos em 7m² fazem Ego DJ 20; quem falhar tem 2 Atributos zerados por 1D4+1 Rodadas.",
      distancia: "4 m / 7 m²", cooldown: "1 por Fluxo", duracao: "1D4+1 Rodadas", tipoAcao: "Ação Egoísta + Reação",
      dadoDuracao: "1D4+1",
      bonus: { jogadaAlvo: null, vantagens: 0, bonusFixo: 0, condicao: "Reação de Interceptação; área: Ego DJ20 ou 2 Attr. zerados" }
    },
    porcentagensFluxo: [["Trash Talk", 25], ["Interceptação", 10], ["Análise", 5]]
  }
];

const CLASSES = [...CLASSES_PARTE1, ...CLASSES_PARTE2];

export { CLASSES_PARTE2, CLASSES };
