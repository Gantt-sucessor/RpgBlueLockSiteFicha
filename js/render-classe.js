// ============================================================
// FÓRMULA DO EGO — Renderização: Classe, Essência, Habilidades
// ============================================================

function metaHabilidade(h) {
  const partes = [];
  if (h.distancia) partes.push(`<span><strong>Distância:</strong> ${h.distancia}</span>`);
  if (h.cooldown !== undefined) partes.push(`<span><strong>Cooldown:</strong> ${h.cooldown === "1 por Fluxo" ? "1 por Fluxo" : h.cooldown + " Rodadas"}</span>`);
  if (h.duracao) partes.push(`<span><strong>Duração:</strong> ${h.duracao}</span>`);
  if (h.tipoAcao) partes.push(`<span><strong>Ação:</strong> ${h.tipoAcao}</span>`);
  return partes.join("");
}

function simboloVariavel(tipo) {
  if (tipo === "fluxo") return ' <span title="Variação de Fluxo">✳️</span>';
  if (tipo === "quimica") return ' <span title="Reação Química">⚛️</span>';
  return "";
}

function renderizarHabilidade(h, tituloPrefixo = "") {
  return `
    <div class="detalhe-habilidade">
      <div class="detalhe-habilidade-titulo">
        <h4>${tituloPrefixo}${h.nome}${simboloVariavel(h.tipoVariavel)}</h4>
      </div>
      ${h.frase ? `<p class="detalhe-habilidade-frase">"${h.frase}"</p>` : ""}
      <p class="detalhe-habilidade-desc">${h.desc}</p>
      <div class="detalhe-habilidade-meta">${metaHabilidade(h)}</div>
    </div>
  `;
}

function renderizarDetalheClasse(container, classe) {
  if (!classe) { container.innerHTML = ""; return; }
  const porcentagens = (classe.porcentagensFluxo || [])
    .map(([nome, pct]) => `<span class="tag-pericia">${nome} = +${pct}%</span>`).join("");

  container.innerHTML = `
    <p class="flavor-classe">"${classe.flavor}"</p>
    <div style="margin-bottom:14px;">
      ${classe.pericias.map(p => `<span class="tag-pericia">${p}</span>`).join("")}
    </div>
    ${renderizarHabilidade(classe.comBola, "Com a bola: ")}
    ${renderizarHabilidade(classe.semBola, "Sem a bola: ")}
    ${renderizarHabilidade(classe.variavel, "Variável: ")}
    ${renderizarHabilidade(classe.fluxo, "Fluxo: ")}
    <div class="detalhe-habilidade">
      <h4>Porcentagens para o Fluxo</h4>
      <div>${porcentagens}</div>
    </div>
  `;
}

function renderizarDetalheEssencia(container, essencia) {
  if (!essencia) { container.innerHTML = ""; return; }
  container.innerHTML = `
    <p class="flavor-classe">"${essencia.flavor}"</p>
    <div class="detalhe-habilidade">
      <h4>✅ ${essencia.capacidade.nome} <span class="texto-discreto">(Capacidade Estática)</span></h4>
      <p class="detalhe-habilidade-desc">${essencia.capacidade.desc}</p>
    </div>
    <div class="detalhe-habilidade">
      <h4>⚠️ ${essencia.incapacidade.nome} <span class="texto-discreto">(Incapacidade Inerte)</span></h4>
      <p class="detalhe-habilidade-desc">${essencia.incapacidade.desc}</p>
    </div>
  `;
}

function renderizarDetalheCategoria(container, categoriaObj, subcategoriaEscolhidaId) {
  if (!categoriaObj) { container.innerHTML = ""; return; }
  const subEscolhida = (categoriaObj.subcategorias || []).find(s => s.id === subcategoriaEscolhidaId);
  container.innerHTML = `
    <p class="flavor-classe">"${categoriaObj.flavor}"</p>
    ${renderizarHabilidade(categoriaObj.habilidade)}
    ${subEscolhida ? `
      <div class="detalhe-habilidade">
        <h4>${subEscolhida.nome} <span class="texto-discreto">(Sub-Categoria)</span></h4>
        <p class="detalhe-habilidade-desc">${subEscolhida.desc}</p>
      </div>
    ` : ""}
  `;
}

function renderizarDetalheSingularidade(container, sing) {
  if (!sing) { container.innerHTML = ""; return; }
  container.innerHTML = `
    <p class="flavor-classe">"${sing.flavor}"</p>
    ${sing.habilidades.map(h => renderizarHabilidade(h)).join("")}
  `;
}

function renderizarDetalheTalentoNivel(talento, nivel) {
  const dadosNivel = talento.niveis.find(n => n.nivel === nivel);
  if (!dadosNivel) return "";
  return renderizarHabilidade({ ...dadosNivel, nome: `${talento.nome} — Nível ${nivel}` });
}

export {
  renderizarHabilidade, renderizarDetalheClasse, renderizarDetalheEssencia,
  renderizarDetalheCategoria, renderizarDetalheSingularidade, renderizarDetalheTalentoNivel
};
