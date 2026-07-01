// ============================================================
// FÓRMULA DO EGO — Store (camada de acesso ao Firestore)
// Funções para criar, ler, atualizar e escutar campanhas e fichas.
// ============================================================

import {
  db, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot,
  collection, query, where, serverTimestamp, getDocs
} from "./firebase-config.js";
import { gerarCodigoConvite } from "./ui-utils.js";

const COL_CAMPANHAS = "campanhas";
const COL_FICHAS = "fichas";

// --- Campanhas ---

async function criarCampanha({ nome, uidMestre, nomeMestre }) {
  let codigo;
  let tentativas = 0;
  // gera código único (checa colisão; muito raro, mas garante)
  do {
    codigo = gerarCodigoConvite(6);
    tentativas++;
    const existente = await buscarCampanhaPorCodigo(codigo);
    if (!existente) break;
  } while (tentativas < 5);

  const ref = doc(collection(db, COL_CAMPANHAS));
  const campanha = {
    id: ref.id,
    nome: nome || "Nova Campanha",
    uidMestre,
    nomeMestre,
    codigoConvite: codigo,
    membros: [],
    rodadaAtual: 1,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp()
  };
  await setDoc(ref, campanha);
  return { ...campanha, id: ref.id };
}

async function buscarCampanhaPorCodigo(codigo) {
  const q = query(collection(db, COL_CAMPANHAS), where("codigoConvite", "==", codigo.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { ...d.data(), id: d.id };
}

async function obterCampanha(campanhaId) {
  const ref = doc(db, COL_CAMPANHAS, campanhaId);
  const snap = await getDoc(ref);
  return snap.exists() ? { ...snap.data(), id: snap.id } : null;
}

function escutarCampanha(campanhaId, callback) {
  const ref = doc(db, COL_CAMPANHAS, campanhaId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback({ ...snap.data(), id: snap.id });
    else callback(null);
  });
}

async function entrarNaCampanha({ campanhaId, uid, nome, fichaId }) {
  const ref = doc(db, COL_CAMPANHAS, campanhaId);
  const campanha = await obterCampanha(campanhaId);
  if (!campanha) throw new Error("Campanha não encontrada.");

  const membros = campanha.membros || [];
  const jaEsta = membros.some(m => m.uid === uid);
  const novosMembros = jaEsta
    ? membros.map(m => m.uid === uid ? { ...m, fichaId, nome } : m)
    : [...membros, { uid, nome, fichaId }];

  await updateDoc(ref, { membros: novosMembros, atualizadoEm: serverTimestamp() });
  return novosMembros;
}

async function removerMembroCampanha({ campanhaId, uid }) {
  const campanha = await obterCampanha(campanhaId);
  if (!campanha) return;
  const novosMembros = (campanha.membros || []).filter(m => m.uid !== uid);
  await updateDoc(doc(db, COL_CAMPANHAS, campanhaId), { membros: novosMembros, atualizadoEm: serverTimestamp() });
}

async function passarRodada(campanhaId) {
  const campanha = await obterCampanha(campanhaId);
  if (!campanha) return;
  const novaRodada = (campanha.rodadaAtual || 1) + 1;
  await updateDoc(doc(db, COL_CAMPANHAS, campanhaId), {
    rodadaAtual: novaRodada,
    atualizadoEm: serverTimestamp()
  });
  return novaRodada;
}

async function voltarRodada(campanhaId) {
  const campanha = await obterCampanha(campanhaId);
  if (!campanha) return;
  const rodadaAtual = campanha.rodadaAtual || 1;
  if (rodadaAtual <= 1) return 1; // não vai abaixo de 1
  const novaRodada = rodadaAtual - 1;
  await updateDoc(doc(db, COL_CAMPANHAS, campanhaId), {
    rodadaAtual: novaRodada,
    atualizadoEm: serverTimestamp()
  });
  return novaRodada;
}

async function resetarRodadas(campanhaId) {
  await updateDoc(doc(db, COL_CAMPANHAS, campanhaId), {
    rodadaAtual: 1,
    atualizadoEm: serverTimestamp()
  });
  return 1;
}

// --- Iniciativa e Turnos ---

// Inicia o combate: monta a fila de turnos ordenada por iniciativa (desc)
// players: [{ uid, fichaId, nome, iniciativa }]
// npcs: [{ id, nome, iniciativa }]
async function iniciarCombate(campanhaId, players, npcs) {
  const fila = [
    ...players.map(p => ({ ...p, tipo: "player" })),
    ...npcs.map(n => ({ ...n, uid: `npc_${n.id}`, fichaId: null, tipo: "npc" }))
  ].sort((a, b) => b.iniciativa - a.iniciativa);

  await updateDoc(doc(db, COL_CAMPANHAS, campanhaId), {
    combateAtivo: true,
    filaTurnos: fila,
    turnoAtualIndex: 0,
    npcsIniciativa: npcs,
    atualizadoEm: serverTimestamp()
  });
}

// Avança para o próximo turno na fila.
// Quando passa do último, começa nova rodada e volta ao primeiro.
// Também desconta o cooldown do personagem cujo turno acabou.
async function proximoTurno(campanhaId, campanha, fichasMap, atualizarCampoFichaFn, passarTurnoDoCooldownFn) {
  const fila = campanha.filaTurnos || [];
  if (fila.length === 0) return;

  const indexAtual = campanha.turnoAtualIndex || 0;
  const personagemAtual = fila[indexAtual];

  // Desconta cooldown do personagem que acabou de ter o turno
  if (personagemAtual?.tipo === "player" && personagemAtual.fichaId) {
    const fichaRaw = fichasMap[personagemAtual.fichaId];
    if (fichaRaw) {
      const novoCooldown = passarTurnoDoCooldownFn(fichaRaw.cooldowns || []);
      await atualizarCampoFichaFn(personagemAtual.fichaId, { cooldowns: novoCooldown });
    }
  }

  const proximoIndex = indexAtual + 1;
  const novaRodada = proximoIndex >= fila.length;
  const novoIndex = novaRodada ? 0 : proximoIndex;

  await updateDoc(doc(db, COL_CAMPANHAS, campanhaId), {
    turnoAtualIndex: novoIndex,
    rodadaAtual: novaRodada ? (campanha.rodadaAtual || 1) + 1 : (campanha.rodadaAtual || 1),
    atualizadoEm: serverTimestamp()
  });
}

// Encerra o combate e limpa a fila de turnos
async function encerrarCombate(campanhaId) {
  await updateDoc(doc(db, COL_CAMPANHAS, campanhaId), {
    combateAtivo: false,
    filaTurnos: [],
    turnoAtualIndex: 0,
    atualizadoEm: serverTimestamp()
  });
}

async function listarCampanhasDoMestre(uid) {
  const q = query(collection(db, COL_CAMPANHAS), where("uidMestre", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

// --- Fichas ---

async function salvarFicha(ficha) {
  const ref = doc(db, COL_FICHAS, ficha.id);
  await setDoc(ref, { ...ficha, atualizadoEm: serverTimestamp() }, { merge: true });
  return ficha;
}

async function atualizarCampoFicha(fichaId, campos) {
  const ref = doc(db, COL_FICHAS, fichaId);
  await updateDoc(ref, { ...campos, atualizadoEm: serverTimestamp() });
}

async function obterFicha(fichaId) {
  const ref = doc(db, COL_FICHAS, fichaId);
  const snap = await getDoc(ref);
  return snap.exists() ? { ...snap.data(), id: snap.id } : null;
}

function escutarFicha(fichaId, callback) {
  const ref = doc(db, COL_FICHAS, fichaId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback({ ...snap.data(), id: snap.id });
    else callback(null);
  });
}

async function listarFichasDoUsuario(uid) {
  const q = query(collection(db, COL_FICHAS), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

// Escuta múltiplas fichas por uma lista de IDs (usado na visão de campanha,
// onde todo mundo vê a ficha de todo mundo). Firestore não tem "onSnapshot"
// nativo para "where id in [...]" com mais de 30 itens, então escutamos cada
// uma individualmente e agregamos no callback.
function escutarFichasMultiplas(fichaIds, callback) {
  const unsubs = [];
  const estado = {};
  fichaIds.forEach((id) => {
    const ref = doc(db, COL_FICHAS, id);
    const unsub = onSnapshot(ref, (snap) => {
      estado[id] = snap.exists() ? { ...snap.data(), id: snap.id } : null;
      callback({ ...estado });
    });
    unsubs.push(unsub);
  });
  return () => unsubs.forEach(u => u());
}

async function excluirFicha(fichaId) {
  await deleteDoc(doc(db, COL_FICHAS, fichaId));
}

export {
  criarCampanha, buscarCampanhaPorCodigo, obterCampanha, escutarCampanha,
  entrarNaCampanha, removerMembroCampanha, passarRodada, voltarRodada, resetarRodadas,
  iniciarCombate, proximoTurno, encerrarCombate,
  listarCampanhasDoMestre, salvarFicha, atualizarCampoFicha, obterFicha, escutarFicha,
  listarFichasDoUsuario, escutarFichasMultiplas, excluirFicha
};
