// ============================================================
// FÓRMULA DO EGO — Hexágono de Atributos (estilo selo Blue Lock)
// Desenha um hexágono recortado em 6 "fatias" (uma por atributo),
// imitando o pentágono de status do anime/mangá, mas com 6 pontas.
// Cada fatia é clicável e dispara a rolagem daquele atributo.
// ============================================================

import { ATRIBUTOS } from "./data/regras-base.js";

const ORDEM_ATRIBUTOS = ["potencia", "destreza", "robustez", "visao", "drible", "ego"];

// Gera o ponto (x,y) de um vértice do hexágono dado o índice (0-5),
// ângulo inicial -90° (ponta para cima), raio e centro.
function pontoHexagono(indice, raio, cx, cy, deslocAngulo = -90) {
  const angulo = (deslocAngulo + indice * 60) * (Math.PI / 180);
  return { x: cx + raio * Math.cos(angulo), y: cy + raio * Math.sin(angulo) };
}

// Cria o SVG completo do hexágono de atributos.
// valores: { potencia: 4, destreza: 3, ... }
// onClickAtributo: callback(atributoId)
function criarHexagonoAtributos(valores, onClickAtributo) {
  const tamanho = 340;
  const cx = tamanho / 2, cy = tamanho / 2;
  const raioExterno = 140;
  const raioInterno = 54;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${tamanho} ${tamanho}`);
  svg.classList.add("hexagono-atributos");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Hexágono de Atributos");

  // pontos externos (vértices das pontas) e internos (vértices do pentágono central)
  const pontosExt = ORDEM_ATRIBUTOS.map((_, i) => pontoHexagono(i, raioExterno, cx, cy));
  const pontosInt = ORDEM_ATRIBUTOS.map((_, i) => pontoHexagono(i, raioInterno, cx, cy));

  // Para cada atributo, desenha uma "fatia" (triângulo/quadrilátero) que vai
  // do ponto interno[i] -> externo[i] -> externo do meio entre i e i+1 (pico) -> interno[i+1]
  // Estética: cada ponta é um polígono com pico saindo do centro vazado.
  ORDEM_ATRIBUTOS.forEach((atrId, i) => {
    const next = (i + 1) % 6;
    const pInt1 = pontosInt[i];
    const pExt1 = pontosExt[i];
    const pExt2 = pontosExt[next];
    const pInt2 = pontosInt[next];

    // ponto médio entre os dois pontos internos (para fechar a fatia suavemente)
    const meioInt = { x: (pInt1.x + pInt2.x) / 2, y: (pInt1.y + pInt2.y) / 2 };

    const path = document.createElementNS(svgNS, "path");
    const d = `M ${pInt1.x} ${pInt1.y} L ${pExt1.x} ${pExt1.y} L ${pExt2.x} ${pExt2.y} L ${pInt2.x} ${pInt2.y} L ${meioInt.x} ${meioInt.y} Z`;
    path.setAttribute("d", d);
    path.classList.add("hexagono-fatia");
    path.dataset.atributo = atrId;
    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "button");
    const valor = valores[atrId];
    path.setAttribute("aria-label", `${ATRIBUTOS[atrId].nome}: ${formatarValorAtributo(valor)}. Clique para rolar.`);

    path.addEventListener("click", () => onClickAtributo && onClickAtributo(atrId));
    path.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClickAtributo && onClickAtributo(atrId); }
    });

    svg.appendChild(path);
  });

  // Pentágono/hexágono central vazado (decorativo, como no logo)
  const centroPath = document.createElementNS(svgNS, "path");
  const dCentro = pontosInt.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  centroPath.setAttribute("d", dCentro);
  centroPath.classList.add("hexagono-centro");
  svg.appendChild(centroPath);

  // Labels + valores em cada ponta
  ORDEM_ATRIBUTOS.forEach((atrId, i) => {
    const pExt = pontosExt[i];
    const pInt = pontosInt[i];
    // posição do texto: um pouco além do ponto externo, na mesma direção radial
    const dx = pExt.x - cx, dy = pExt.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const labelX = cx + (dx / dist) * (raioExterno + 26);
    const labelY = cy + (dy / dist) * (raioExterno + 26);

    const textNome = document.createElementNS(svgNS, "text");
    textNome.setAttribute("x", labelX);
    textNome.setAttribute("y", labelY - 4);
    textNome.classList.add("hexagono-label-nome");
    textNome.setAttribute("text-anchor", "middle");
    textNome.textContent = abreviarAtributo(atrId);
    svg.appendChild(textNome);

    // valor no meio da fatia (entre interno e externo)
    const valX = cx + (dx / dist) * (raioExterno - 32);
    const valY = cy + (dy / dist) * (raioExterno - 32);
    const textValor = document.createElementNS(svgNS, "text");
    textValor.setAttribute("x", valX);
    textValor.setAttribute("y", valY + 6);
    textValor.classList.add("hexagono-label-valor");
    textValor.setAttribute("text-anchor", "middle");
    textValor.dataset.atributoValor = atrId;
    textValor.textContent = formatarValorAtributo(valores[atrId]);
    svg.appendChild(textValor);
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
    const fatia = svgEl.querySelector(`path[data-atributo="${atrId}"]`);
    if (fatia) {
      fatia.setAttribute("aria-label", `${ATRIBUTOS[atrId].nome}: ${formatarValorAtributo(valores[atrId])}. Clique para rolar.`);
    }
  });
}

export { criarHexagonoAtributos, atualizarValoresHexagono, ORDEM_ATRIBUTOS, formatarValorAtributo, abreviarAtributo };
