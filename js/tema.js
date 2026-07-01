// ============================================================
// FÓRMULA DO EGO — Modo Noturno
// Aplica/remove o tema escuro em todo o site via atributo
// data-tema="escuro" no <html>. Persiste no localStorage.
// ============================================================

const CHAVE = "fe_tema";

function getTemaAtual() {
  return localStorage.getItem(CHAVE) || "claro";
}

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-tema", tema);
  localStorage.setItem(CHAVE, tema);
  const btn = document.getElementById("btn-tema-global");
  if (btn) btn.textContent = tema === "escuro" ? "☀️" : "🌙";
}

function alternarTema() {
  const atual = getTemaAtual();
  aplicarTema(atual === "escuro" ? "claro" : "escuro");
}

function iniciarTema() {
  // Aplica o tema salvo imediatamente (antes do paint) para evitar flash
  aplicarTema(getTemaAtual());

  // Cria o botão flutuante de lua/sol em todas as páginas
  const btn = document.createElement("button");
  btn.id = "btn-tema-global";
  btn.className = "btn-tema";
  btn.setAttribute("aria-label", "Alternar modo noturno");
  btn.textContent = getTemaAtual() === "escuro" ? "☀️" : "🌙";
  btn.addEventListener("click", alternarTema);
  document.body.appendChild(btn);
}

// Executa assim que o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarTema);
} else {
  iniciarTema();
}

export { alternarTema, getTemaAtual };
