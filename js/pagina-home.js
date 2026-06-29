// ============================================================
// FÓRMULA DO EGO — Lógica da página inicial (Home)
// ============================================================

import { auth, garantirLogin, updateProfile } from "./firebase-config.js";
import {
  criarCampanha, buscarCampanhaPorCodigo, entrarNaCampanha,
  listarFichasDoUsuario, salvarFicha, listarCampanhasDoMestre
} from "./store.js";
import { criarFichaVazia } from "./modelo-ficha.js";
import { mostrarToast, escaparHtml } from "./ui-utils.js";

const telaLoading = document.getElementById("tela-loading");
const areaLogado = document.getElementById("area-logado");
const areaDeslogado = document.getElementById("area-deslogado");

function getNomeLocal() {
  return localStorage.getItem("fe_nomeUsuario") || "";
}
function setNomeLocal(nome) {
  localStorage.setItem("fe_nomeUsuario", nome);
}

async function iniciar() {
  const user = await garantirLogin();
  const nomeSalvo = getNomeLocal();

  telaLoading.hidden = true;

  if (!nomeSalvo) {
    areaDeslogado.hidden = false;
    configurarTelaEntrada(user);
  } else {
    areaLogado.hidden = false;
    configurarTelaLogada(user, nomeSalvo);
  }
}

function configurarTelaEntrada(user) {
  const input = document.getElementById("input-nome-usuario");
  const btn = document.getElementById("btn-comecar");

  function confirmar() {
    const nome = input.value.trim();
    if (!nome) { mostrarToast("Digite um nome para continuar.", "erro"); return; }
    setNomeLocal(nome);
    updateProfile(user, { displayName: nome }).catch(() => {});
    areaDeslogado.hidden = true;
    areaLogado.hidden = false;
    configurarTelaLogada(user, nome);
  }

  btn.addEventListener("click", confirmar);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") confirmar(); });
  input.focus();
}

async function configurarTelaLogada(user, nome) {
  carregarFichasDoUsuario(user.uid);
  carregarCampanhasDoUsuario(user.uid);

  document.getElementById("btn-criar-campanha").addEventListener("click", async () => {
    const nomeInput = document.getElementById("input-nome-campanha");
    const nomeCampanha = nomeInput.value.trim() || "Nova Campanha";
    const btn = document.getElementById("btn-criar-campanha");
    btn.disabled = true;
    btn.textContent = "Criando...";
    try {
      const campanha = await criarCampanha({ nome: nomeCampanha, uidMestre: user.uid, nomeMestre: nome });
      mostrarToast(`Campanha criada! Código: ${campanha.codigoConvite}`, "sucesso");
      window.location.href = `mestre.html?campanha=${campanha.id}`;
    } catch (err) {
      console.error(err);
      mostrarToast("Não foi possível criar a campanha. Veja o console.", "erro");
      btn.disabled = false;
      btn.textContent = "Criar campanha";
    }
  });

  document.getElementById("btn-entrar-campanha").addEventListener("click", async () => {
    const codigoInput = document.getElementById("input-codigo-campanha");
    const codigo = codigoInput.value.trim().toUpperCase();
    if (!codigo) { mostrarToast("Digite o código de convite.", "erro"); return; }
    const btn = document.getElementById("btn-entrar-campanha");
    btn.disabled = true;
    btn.textContent = "Procurando...";
    try {
      const campanha = await buscarCampanhaPorCodigo(codigo);
      if (!campanha) {
        mostrarToast("Código não encontrado. Confira com o Mestre.", "erro");
        btn.disabled = false; btn.textContent = "Entrar";
        return;
      }
      window.location.href = `entrar-campanha.html?campanha=${campanha.id}`;
    } catch (err) {
      console.error(err);
      mostrarToast("Erro ao buscar a campanha.", "erro");
      btn.disabled = false; btn.textContent = "Entrar";
    }
  });

  document.getElementById("btn-nova-ficha-livre").addEventListener("click", async () => {
    const ficha = criarFichaVazia({ uid: user.uid, nomeJogador: nome });
    await salvarFicha(ficha);
    window.location.href = `ficha.html?id=${ficha.id}`;
  });
}

async function carregarFichasDoUsuario(uid) {
  const container = document.getElementById("lista-fichas-usuario");
  try {
    const fichas = await listarFichasDoUsuario(uid);
    if (fichas.length === 0) {
      container.innerHTML = `<p class="texto-discreto">Você ainda não tem nenhuma ficha. Crie uma campanha ou comece uma ficha livre.</p>`;
      return;
    }
    container.innerHTML = "";
    fichas
      .sort((a, b) => (b.atualizadoEm?.seconds || 0) - (a.atualizadoEm?.seconds || 0))
      .forEach((ficha) => {
        const a = document.createElement("a");
        a.href = `ficha.html?id=${ficha.id}`;
        a.className = "item-ficha-usuario";
        a.innerHTML = `
          <span>
            <span class="item-ficha-usuario-nome">${escaparHtml(ficha.nomePersonagem || "Sem nome")}</span><br>
            <span class="item-ficha-usuario-meta">${escaparHtml(ficha.classe ? classeNome(ficha.classe) : "Classe não definida")}</span>
          </span>
          <span class="pill">${escaparHtml(estagioNome(ficha.estagio))}</span>
        `;
        container.appendChild(a);
      });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="texto-discreto">Não foi possível carregar suas fichas.</p>`;
  }
}

async function carregarCampanhasDoUsuario(uid) {
  const container = document.getElementById("lista-campanhas-usuario");
  try {
    const campanhas = await listarCampanhasDoMestre(uid);
    if (campanhas.length === 0) {
      container.innerHTML = `<p class="texto-discreto">Você ainda não é Mestre de nenhuma campanha. Crie uma campanha acima.</p>`;
      return;
    }
    container.innerHTML = "";
    campanhas
      .sort((a, b) => (b.atualizadoEm?.seconds || 0) - (a.atualizadoEm?.seconds || 0))
      .forEach((campanha) => {
        const a = document.createElement("a");
        a.href = `mestre.html?campanha=${campanha.id}`;
        a.className = "item-ficha-usuario";
        const qtdMembros = (campanha.membros || []).length;
        a.innerHTML = `
          <span>
            <span class="item-ficha-usuario-nome">${escaparHtml(campanha.nome)}</span><br>
            <span class="item-ficha-usuario-meta">${qtdMembros} jogador${qtdMembros === 1 ? "" : "es"} · código ${escaparHtml(campanha.codigoConvite)}</span>
          </span>
          <span class="pill">Rodada ${campanha.rodadaAtual || 1}</span>
        `;
        container.appendChild(a);
      });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="texto-discreto">Não foi possível carregar suas campanhas.</p>`;
  }
}

function estagioNome(id) {
  const map = { iniciante: "Iniciante", intermediario: "Intermediário", profissional: "Profissional", mestre: "Mestre" };
  return map[id] || "Iniciante";
}

function classeNome(id) {
  // import leve sem carregar o módulo inteiro de classes aqui;
  // será exibido corretamente dentro da própria ficha. Aqui é só um preview.
  return id.replace(/_/g, " ");
}

iniciar();
