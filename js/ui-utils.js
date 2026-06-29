// ============================================================
// FÓRMULA DO EGO — Utilitários de UI compartilhados
// ============================================================

function garantirToastContainer() {
  let c = document.querySelector(".toast-container");
  if (!c) {
    c = document.createElement("div");
    c.className = "toast-container";
    document.body.appendChild(c);
  }
  return c;
}

function mostrarToast(mensagem, tipo = "normal") {
  const container = garantirToastContainer();
  const el = document.createElement("div");
  el.className = `toast ${tipo === "erro" ? "erro" : tipo === "sucesso" ? "sucesso" : ""}`;
  el.textContent = mensagem;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// Gera um ID curto e legível (para códigos de convite de campanha)
function gerarCodigoConvite(tamanho = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem caracteres ambíguos
  let codigo = "";
  for (let i = 0; i < tamanho; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)];
  }
  return codigo;
}

function gerarIdAleatorio() {
  return "id_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
}

function escaparHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

// Cria um campo numérico editável: clique mostra input, blur/enter confirma.
// onChange recebe o novo valor numérico.
function criarCampoNumeroEditavel({ valor, min = -999, max = 999, onChange, classe = "" }) {
  const span = document.createElement("span");
  span.className = `editavel campo-numero ${classe}`;
  span.tabIndex = 0;
  span.textContent = valor;
  span.dataset.valor = valor;

  function ativarEdicao() {
    const atual = span.dataset.valor;
    const input = document.createElement("input");
    input.type = "number";
    input.value = atual;
    input.min = min;
    input.max = max;
    input.className = "input-edicao-numero";
    span.replaceWith(input);
    input.focus();
    input.select();

    function confirmar() {
      let novo = parseInt(input.value, 10);
      if (isNaN(novo)) novo = parseInt(atual, 10) || 0;
      novo = Math.max(min, Math.min(max, novo));
      span.textContent = novo;
      span.dataset.valor = novo;
      input.replaceWith(span);
      if (onChange) onChange(novo);
    }

    input.addEventListener("blur", confirmar);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); confirmar(); }
      if (e.key === "Escape") { input.value = atual; confirmar(); }
    });
  }

  span.addEventListener("click", ativarEdicao);
  span.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ativarEdicao(); }
  });

  return span;
}

// Botões de +/- ao lado de um valor, com clique e long-press para repetir
function criarStepper({ valor, min = 0, max = 999, onChange }) {
  const wrap = document.createElement("div");
  wrap.className = "stepper";

  const btnMenos = document.createElement("button");
  btnMenos.className = "btn btn-icone stepper-btn";
  btnMenos.type = "button";
  btnMenos.setAttribute("aria-label", "Diminuir");
  btnMenos.textContent = "–";

  const display = criarCampoNumeroEditavel({
    valor, min, max,
    onChange: (v) => onChange(v)
  });
  display.classList.add("stepper-valor");

  const btnMais = document.createElement("button");
  btnMais.className = "btn btn-icone stepper-btn";
  btnMais.type = "button";
  btnMais.setAttribute("aria-label", "Aumentar");
  btnMais.textContent = "+";

  function ajustar(delta) {
    let v = parseInt(display.dataset.valor, 10) || 0;
    v = Math.max(min, Math.min(max, v + delta));
    display.textContent = v;
    display.dataset.valor = v;
    onChange(v);
  }

  btnMenos.addEventListener("click", () => ajustar(-1));
  btnMais.addEventListener("click", () => ajustar(1));

  wrap.append(btnMenos, display, btnMais);
  return wrap;
}

function formatarData(timestamp) {
  if (!timestamp) return "";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function copiarParaClipboard(texto) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(texto);
  }
  // fallback
  const ta = document.createElement("textarea");
  ta.value = texto;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  return Promise.resolve();
}

function abrirModal({ titulo, conteudoEl, onFechar }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal-box";

  const header = document.createElement("div");
  header.className = "modal-header";
  const h = document.createElement("h3");
  h.textContent = titulo || "";
  const btnFechar = document.createElement("button");
  btnFechar.className = "btn btn-icone";
  btnFechar.setAttribute("aria-label", "Fechar");
  btnFechar.innerHTML = "&times;";
  header.append(h, btnFechar);

  const body = document.createElement("div");
  body.className = "modal-body";
  if (conteudoEl) body.appendChild(conteudoEl);

  modal.append(header, body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  function fechar() {
    overlay.remove();
    document.body.style.overflow = "";
    if (onFechar) onFechar();
  }

  btnFechar.addEventListener("click", fechar);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fechar(); });
  document.addEventListener("keydown", function escListener(e) {
    if (e.key === "Escape") { fechar(); document.removeEventListener("keydown", escListener); }
  });

  return { fechar, modal, body };
}

export {
  mostrarToast, gerarCodigoConvite, gerarIdAleatorio, escaparHtml,
  criarCampoNumeroEditavel, criarStepper, formatarData,
  copiarParaClipboard, abrirModal
};
