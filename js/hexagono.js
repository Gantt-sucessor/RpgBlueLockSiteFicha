// ============================================================
// FÓRMULA DO EGO — Roda de Atributos (estilo selo Blue Lock)
// 6 círculos de atributo dispostos em hexágono ao redor de um
// círculo central, conectados por linhas, com anel decorativo
// pontilhado (estilo "dado") em volta de cada círculo.
// Cada círculo é clicável e dispara a rolagem daquele atributo.
// ============================================================

import { ATRIBUTOS } from "./data/regras-base.js";

const ORDEM_ATRIBUTOS = ["potencia", "destreza", "robustez", "visao", "drible", "ego"];

// Gera o ponto (x,y) de um vértice do hexágono dado o índice (0-5),
// ângulo inicial -90° (ponta para cima), raio e centro.
function pontoHexagono(indice, raio, cx, cy, deslocAngulo = -90) {
  const angulo = (deslocAngulo + indice * 60) * (Math.PI / 180);
  return { x: cx + raio * Math.cos(angulo), y: cy + raio * Math.sin(angulo) };
}

const svgNS = "http://www.w3.org/2000/svg";

// Desenha o anel decorativo pontilhado (estilo dado/runa) em volta de um círculo
function criarAnelDecorativo(cx, cy, raio, qtdMarcas = 20) {
  const grupo = document.createElementNS(svgNS, "g");
  grupo.classList.add("roda-anel-decorativo");
  for (let i = 0; i < qtdMarcas; i++) {
    const angulo = (i * (360 / qtdMarcas)) * (Math.PI / 180);
    const x1 = cx + raio * Math.cos(angulo);
    const y1 = cy + raio * Math.sin(angulo);
    const x2 = cx + (raio - 5) * Math.cos(angulo);
    const y2 = cy + (raio - 5) * Math.sin(angulo);
    const linha = document.createElementNS(svgNS, "line");
    linha.setAttribute("x1", x1.toFixed(2));
    linha.setAttribute("y1", y1.toFixed(2));
    linha.setAttribute("x2", x2.toFixed(2));
    linha.setAttribute("y2", y2.toFixed(2));
    linha.classList.add("roda-marca-decorativa");
    grupo.appendChild(linha);
  }
  const circuloBase = document.createElementNS(svgNS, "circle");
  circuloBase.setAttribute("cx", cx);
  circuloBase.setAttribute("cy", cy);
  circuloBase.setAttribute("r", raio);
  circuloBase.classList.add("roda-anel-base");
  grupo.insertBefore(circuloBase, grupo.firstChild);
  return grupo;
}

// Cria o SVG completo da roda de atributos.
// valores: { potencia: 4, destreza: 3, ... }
// onClickAtributo: callback(atributoId)
function criarHexagonoAtributos(valores, onClickAtributo) {
  const tamanho = 380;
  const cx = tamanho / 2, cy = tamanho / 2;
  const raioPosicao = 132;   // distância do centro até cada círculo de atributo
  const raioCirculo = 46;    // raio de cada círculo de atributo
  const raioAnel = 56;       // raio do anel decorativo (um pouco maior que o círculo)
  const raioCentro = 58;     // raio do círculo central "ATRIBUTOS"

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${tamanho} ${tamanho}`);
  svg.classList.add("hexagono-atributos");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Roda de Atributos");

  const pontos = ORDEM_ATRIBUTOS.map((_, i) => pontoHexagono(i, raioPosicao, cx, cy));

  // --- Linhas de conexão do centro até cada círculo (desenhadas primeiro, ficam por baixo) ---
  const grupoLinhas = document.createElementNS(svgNS, "g");
  grupoLinhas.classList.add("roda-linhas");
  pontos.forEach((p) => {
    const dx = p.x - cx, dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const inicioX = cx + (dx / dist) * raioCentro;
    const inicioY = cy + (dy / dist) * raioCentro;
    const fimX = p.x - (dx / dist) * raioAnel;
    const fimY = p.y - (dy / dist) * raioAnel;
    const linha = document.createElementNS(svgNS, "line");
    linha.setAttribute("x1", inicioX.toFixed(2));
    linha.setAttribute("y1", inicioY.toFixed(2));
    linha.setAttribute("x2", fimX.toFixed(2));
    linha.setAttribute("y2", fimY.toFixed(2));
    linha.classList.add("roda-linha-conexao");
    grupoLinhas.appendChild(linha);
  });
  svg.appendChild(grupoLinhas);

  // --- Círculo central decorativo com "ATRIBUTOS" ---
  const grupoCentro = document.createElementNS(svgNS, "g");
  grupoCentro.classList.add("roda-centro-grupo");

  const anelCentro = criarAnelDecorativo(cx, cy, raioCentro + 8, 28);
  grupoCentro.appendChild(anelCentro);

  const circuloCentro = document.createElementNS(svgNS, "circle");
  circuloCentro.setAttribute("cx", cx);
  circuloCentro.setAttribute("cy", cy);
  circuloCentro.setAttribute("r", raioCentro);
  circuloCentro.classList.add("roda-centro-circulo");
  grupoCentro.appendChild(circuloCentro);

  const textoCentro1 = document.createElementNS(svgNS, "text");
  textoCentro1.setAttribute("x", cx);
  textoCentro1.setAttribute("y", cy + 5);
  textoCentro1.setAttribute("text-anchor", "middle");
  textoCentro1.classList.add("roda-centro-texto");
  textoCentro1.textContent = "ATRIBUTOS";
  grupoCentro.appendChild(textoCentro1);

  svg.appendChild(grupoCentro);

  // --- Um círculo por atributo, com anel decorativo, número grande e nome abaixo ---
  ORDEM_ATRIBUTOS.forEach((atrId, i) => {
    const p = pontos[i];

    const grupoAtributo = document.createElementNS(svgNS, "g");
    grupoAtributo.classList.add("roda-atributo-grupo");
    grupoAtributo.dataset.atributo = atrId;
    grupoAtributo.setAttribute("tabindex", "0");
    grupoAtributo.setAttribute("role", "button");
    const valor = valores[atrId];
    grupoAtributo.setAttribute("aria-label", `${ATRIBUTOS[atrId].nome}: ${formatarValorAtributo(valor)}. Clique para rolar.`);

    // anel decorativo (estilo dado/runa)
    const anel = criarAnelDecorativo(p.x, p.y, raioAnel, 22);
    grupoAtributo.appendChild(anel);

    // círculo principal preenchido
    const circulo = document.createElementNS(svgNS, "circle");
    circulo.setAttribute("cx", p.x);
    circulo.setAttribute("cy", p.y);
    circulo.setAttribute("r", raioCirculo);
    circulo.classList.add("roda-atributo-circulo");
    grupoAtributo.appendChild(circulo);

    // número do valor (grande, centrado)
    const textoValor = document.createElementNS(svgNS, "text");
    textoValor.setAttribute("x", p.x);
    textoValor.setAttribute("y", p.y - 4);
    textoValor.setAttribute("text-anchor", "middle");
    textoValor.classList.add("roda-atributo-valor");
    textoValor.dataset.atributoValor = atrId;
    textoValor.textContent = formatarValorAtributo(valor);
    grupoAtributo.appendChild(textoValor);

    // nome abreviado (embaixo do número, dentro do círculo)
    const textoNome = document.createElementNS(svgNS, "text");
    textoNome.setAttribute("x", p.x);
    textoNome.setAttribute("y", p.y + 18);
    textoNome.setAttribute("text-anchor", "middle");
    textoNome.classList.add("roda-atributo-nome");
    textoNome.textContent = abreviarAtributo(atrId);
    grupoAtributo.appendChild(textoNome);

    grupoAtributo.addEventListener("click", () => onClickAtributo && onClickAtributo(atrId));
    grupoAtributo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClickAtributo && onClickAtributo(atrId); }
    });

    svg.appendChild(grupoAtributo);
  });

  return svg;
}

function formatarValorAtributo(v) {
  if (v === undefined || v === null) return "0";
  return v > 0 ? `+${v}` : `${v}`;
}

function abreviarAtributo(id) {
  const abrev = {
    potencia: "POT", destreza: "DES", robustez: "ROB",
    visao: "VIS", drible: "DRI", ego: "EGO"
  };
  return abrev[id] || id.toUpperCase().slice(0, 3);
}

// Atualiza apenas os valores numéricos exibidos (sem recriar todo o SVG)
function atualizarValoresHexagono(svgEl, valores) {
  ORDEM_ATRIBUTOS.forEach((atrId) => {
    const textEl = svgEl.querySelector(`text[data-atributo-valor="${atrId}"]`);
    if (textEl) textEl.textContent = formatarValorAtributo(valores[atrId]);
    const grupo = svgEl.querySelector(`g[data-atributo="${atrId}"]`);
    if (grupo) {
      grupo.setAttribute("aria-label", `${ATRIBUTOS[atrId].nome}: ${formatarValorAtributo(valores[atrId])}. Clique para rolar.`);
    }
  });
}

export { criarHexagonoAtributos, atualizarValoresHexagono, ORDEM_ATRIBUTOS, formatarValorAtributo, abreviarAtributo };
