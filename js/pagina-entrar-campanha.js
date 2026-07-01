// ============================================================
// FÓRMULA DO EGO — Lógica da página "Entrar na Campanha"
// ============================================================

import { garantirLogin } from "./firebase-config.js";
import { obterCampanha, entrarNaCampanha, salvarFicha } from "./store.js";
import { listarFichasDoUsuario } from "./store.js";
import { criarFichaVazia } from "./modelo-ficha.js";
import { mostrarToast, escaparHtml } from "./ui-utils.js";
import "./tema.js";

const params = new URLSearchParams(window.location.search);
const campanhaId = params.get("campanha");

const telaLoading = document.getElementById("tela-loading");
const conteudoEntrada = document.getElementById("conteudo-entrada");
const erroEntrada = document.getElementById("erro-entrada");

function getNomeLocal() {
  return localStorage.getItem("fe_nomeUsuario") || "";
}
function setNomeLocal(nome) { localStorage.setItem("fe_nomeUsuario", nome); }

async function iniciar() {
  if (!campanhaId) {
    mostrarErro();
    return;
  }

  const user = await garantirLogin();
  let nome = getNomeLocal();
  if (!nome) {
    nome = window.prompt("Como você quer ser chamado nesta campanha?") || "Jogador";
    setNomeLocal(nome);
  }

  try {
    const campanha = await obterCampanha(campanhaId);
    if (!campanha) { mostrarErro(); return; }

    telaLoading.hidden = true;
    conteudoEntrada.hidden = false;
    document.getElementById("pill-nome-campanha").textContent = campanha.nome;

    const jaEhMembro = (campanha.membros || []).find(m => m.uid === user.uid);
    if (jaEhMembro && jaEhMembro.fichaId) {
      // já está na campanha com uma ficha vinculada — vai direto pra ficha
      window.location.href = `ficha.html?id=${jaEhMembro.fichaId}&campanha=${campanhaId}`;
      return;
    }

    await carregarFichasExistentes(user.uid, campanhaId, nome);

    document.getElementById("btn-criar-nova-ficha").addEventListener("click", async () => {
      const ficha = criarFichaVazia({ uid: user.uid, nomeJogador: nome });
      await salvarFicha(ficha);
      await entrarNaCampanha({ campanhaId, uid: user.uid, nome, fichaId: ficha.id });
      window.location.href = `ficha.html?id=${ficha.id}&campanha=${campanhaId}`;
    });

  } catch (err) {
    console.error(err);
    mostrarErro();
  }
}

async function carregarFichasExistentes(uid, campanhaId, nome) {
  const container = document.getElementById("lista-fichas-existentes");
  const fichas = await listarFichasDoUsuario(uid);
  if (fichas.length === 0) {
    container.innerHTML = `<p class="texto-discreto">Você ainda não tem fichas salvas.</p>`;
    return;
  }
  container.innerHTML = "";
  fichas.forEach((ficha) => {
    const btn = document.createElement("button");
    btn.className = "item-ficha-usuario";
    btn.style.width = "100%";
    btn.style.border = "none";
    btn.innerHTML = `
      <span>
        <span class="item-ficha-usuario-nome">${escaparHtml(ficha.nomePersonagem || "Sem nome")}</span><br>
        <span class="item-ficha-usuario-meta">Usar esta ficha</span>
      </span>
      <span>→</span>
    `;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      await entrarNaCampanha({ campanhaId, uid, nome, fichaId: ficha.id });
      window.location.href = `ficha.html?id=${ficha.id}&campanha=${campanhaId}`;
    });
    container.appendChild(btn);
  });
}

function mostrarErro() {
  telaLoading.hidden = true;
  conteudoEntrada.hidden = true;
  erroEntrada.hidden = false;
}

iniciar();
