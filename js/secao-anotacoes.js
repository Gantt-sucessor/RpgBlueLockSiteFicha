// ============================================================
// FÓRMULA DO EGO — Seção: Anotações Livres
// ============================================================

import { estado, salvarCampo, registrarListenerAtualizacao } from "./ficha-core.js";

function montarAnotacoes() {
  const campo = document.getElementById("campo-anotacoes");
  campo.value = estado.ficha.anotacoes || "";
  campo.addEventListener("input", () => {
    salvarCampo({ anotacoes: campo.value });
  });
}

function atualizarAnotacoesRemoto() {
  const campo = document.getElementById("campo-anotacoes");
  if (document.activeElement === campo) return; // não sobrescreve enquanto o usuário digita
  campo.value = estado.ficha.anotacoes || "";
}

document.addEventListener("fichaapp:pronta", () => {
  montarAnotacoes();
  registrarListenerAtualizacao(atualizarAnotacoesRemoto);
});
