// WAgenda User Interface functions and templates

const SVG_BOLT = `<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none" style="color: var(--icon, #8696a0); transition: color 0.2s;"><title>bolt</title><path d="M10.55 18.2L15.725 12H11.725L12.45 6.32503L7.82497 13H11.3L10.55 18.2ZM8.99997 15H5.89997C5.49997 15 5.20414 14.8209 5.01247 14.4625C4.8208 14.1042 4.84164 13.7584 5.07497 13.425L12.55 2.67503C12.7166 2.44169 12.9333 2.27919 13.2 2.18753C13.4666 2.09586 13.7416 2.10003 14.025 2.20003C14.3083 2.30003 14.5166 2.47503 14.65 2.72503C14.7833 2.97503 14.8333 3.24169 14.8 3.52503L14 10H17.875C18.3083 10 18.6125 10.1917 18.7875 10.575C18.9625 10.9584 18.9083 11.3167 18.625 11.65L10.4 21.5C10.2166 21.7167 9.99164 21.8584 9.72497 21.925C9.4583 21.9917 9.19997 21.9667 8.94997 21.85C8.69997 21.7334 8.50414 21.5542 8.36247 21.3125C8.2208 21.0709 8.16664 20.8084 8.19997 20.525L8.99997 15Z" fill="currentColor"></path></svg>`;
const SVG_EDIT_RR = `<svg viewBox="0 0 24 24" height="18" width="18" fill="currentColor"><path d="M5 18.9999H6.4L16.2 9.22488L14.775 7.79988L5 17.5999V18.9999ZM4 20.9999C3.71667 20.9999 3.47917 20.904 3.2875 20.7124C3.09583 20.5207 3 20.2832 3 19.9999V17.5749C3 17.3082 3.05 17.054 3.15 16.8124C3.25 16.5707 3.39167 16.3582 3.575 16.1749L16.2 3.57488C16.3833 3.39154 16.6 3.24988 16.85 3.14988C17.1 3.04988 17.3583 2.99988 17.625 2.99988C17.8917 2.99988 18.1458 3.04988 18.3875 3.14988C18.6292 3.24988 18.85 3.39988 19.05 3.59988L20.425 4.99988C20.625 5.18321 20.7708 5.39571 20.8625 5.63738C20.9542 5.87904 21 6.13321 21 6.39988C21 6.64988 20.9542 6.89988 20.8625 7.14988C20.7708 7.39988 20.625 7.62488 20.425 7.82488L7.825 20.4249C7.64167 20.6082 7.42917 20.7499 7.1875 20.8499C6.94583 20.9499 6.69167 20.9999 6.425 20.9999H4Z"/></svg>`;
const SVG_DELETE_RR = `<svg viewBox="0 0 24 24" height="18" width="18" fill="currentColor"><path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.44772 6 4 5.55228 4 5C4 4.44772 4.44772 4 5 4H9V3.5C9 3.22386 9.22386 3 9.5 3H14.5C14.7761 3 15 3.22386 15 3.5V4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 16.5C9 16.7761 9.22386 17 9.5 17H10.5C10.7761 17 11 16.7761 11 16.5V8.5C11 8.22386 10.7761 8 10.5 8H9.5C9.22386 8 9 8.22386 9 8.5V16.5ZM13 16.5C13 16.7761 13.2239 17 13.5 17H14.5C14.7761 17 15 16.7761 15 16.5V8.5C15 8.22386 14.7761 8 14.5 8H13.5C13.2239 8 13 8.22386 13 8.5V16.5Z"/></svg>`;
const SVG_CLOSE_RR = `<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 13.4L7.09999 18.3C6.91665 18.4834 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4834 5.69999 18.3C5.51665 18.1167 5.42499 17.8834 5.42499 17.6C5.42499 17.3167 5.51665 17.0834 5.69999 16.9L10.6 12L5.69999 7.10005C5.51665 6.91672 5.42499 6.68338 5.42499 6.40005C5.42499 6.11672 5.51665 5.88338 5.69999 5.70005C5.88332 5.51672 6.11665 5.42505 6.39999 5.42505C6.68332 5.42505 6.91665 5.51672 7.09999 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z"/></svg>`;

let rrPopoverAtivo = false;
let rrIndiceAtivo = -1;
let rrItensAtuais = [];

let bloqueadorTeclado = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

function carregarRespostasRapidas(callback) {
  chrome.storage.local.get({ respostasRapidas: [] }, (res) => {
    callback(res.respostasRapidas || []);
  });
}

function salvarRespostasRapidas(lista, callback) {
  chrome.storage.local.set({ respostasRapidas: lista }, () => {
    if (callback) callback();
  });
}

function atualizarListaEtiquetasExistentes() {
  chrome.storage.local.get(
    { mensagensPendentes: [], historicoMensagens: [] },
    (res) => {
      const pendentes = res.mensagensPendentes || [];
      const historico = res.historicoMensagens || [];

      // Mapear etiqueta -> cor
      const mapaEtiquetas = new Map();

      pendentes.forEach((item) => {
        if (item.etiqueta) {
          mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
        }
      });
      historico.forEach((item) => {
        if (item.etiqueta) {
          mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
        }
      });

      const container = document.getElementById(
        "wa-modal-etiquetas-existentes",
      );
      if (!container) return;

      const btnNova = document.getElementById("wa-modal-btn-nova-etiqueta");

      // Remove todas as pílulas existentes
      container
        .querySelectorAll(".wa-modal-etiqueta-pill-click")
        .forEach((p) => p.remove());

      mapaEtiquetas.forEach((cor, nome) => {
        const pill = document.createElement("span");
        pill.className = "wa-item-etiqueta-badge wa-modal-etiqueta-pill-click";
        pill.innerHTML = `<svg viewBox="0 0 24 24" fill="none" style="color: ${cor}; width: 14px; height: 14px;"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path></svg> <strong>${nome}</strong>`;
        pill.style.cursor = "pointer";
        pill.style.padding = "4px 10px";
        pill.style.borderRadius = "20px";
        pill.style.fontSize = "11px";
        pill.style.marginLeft = "0";

        pill.addEventListener("click", () => {
          container
            .querySelectorAll(".wa-modal-etiqueta-pill-click")
            .forEach((p) => {
              p.classList.remove("selecionada");
              p.style.outline = "none";
            });

          const criador = document.getElementById("wa-modal-criador-etiqueta");
          if (criador) criador.style.display = "none";

          pill.classList.add("selecionada");
          pill.style.outline = `2px solid ${cor}`;
          pill.style.outlineOffset = "1.5px";

          document.getElementById("wa-modal-etiqueta-valor").value = nome;
          document.getElementById("wa-modal-etiqueta-cor-valor").value = cor;
        });

        container.insertBefore(pill, btnNova);
      });
    },
  );
}

function inicializarEventosEtiquetasModal() {
  const btnNova = document.getElementById("wa-modal-btn-nova-etiqueta");
  const criador = document.getElementById("wa-modal-criador-etiqueta");
  const inputEscrita = document.getElementById(
    "wa-modal-etiqueta-input-escrita",
  );
  const picker = document.getElementById("wa-modal-etiqueta-cor-picker");
  const preview = document.getElementById("wa-modal-etiqueta-preview");
  const trigger = document.getElementById("wa-modal-etiqueta-cor-trigger");

  if (!btnNova || !criador || !inputEscrita || !picker || !preview || !trigger)
    return;

  btnNova.addEventListener("click", () => {
    document.querySelectorAll(".wa-modal-etiqueta-pill-click").forEach((p) => {
      p.classList.remove("selecionada");
      p.style.outline = "none";
    });

    document.getElementById("wa-modal-etiqueta-valor").value = "";
    document.getElementById("wa-modal-etiqueta-cor-valor").value = "";

    criador.style.display = "flex";

    inputEscrita.value = "";
    picker.value = "#00a884";
    if (preview) {
      preview.textContent = "Nova";
      preview.style.color = "#00a884";
      preview.style.backgroundColor = "#00a8841f";
      preview.style.borderColor = "#00a88440";
    }
    if (trigger) {
      trigger.style.backgroundColor = "rgba(0, 168, 132, 0.2)";
      const iconSpan = trigger.querySelector('[data-testid="label-filled"]');
      if (iconSpan) iconSpan.style.color = "#00a884";
    }

    inputEscrita.focus();
  });

  function atualizarPreview() {
    const nome = inputEscrita.value.trim() || "Nova";
    const cor = picker.value;

    if (preview) {
      preview.textContent = nome;
      preview.style.color = cor;
      preview.style.backgroundColor = cor + "1f";
      preview.style.borderColor = cor + "40";
    }

    if (trigger) {
      trigger.style.backgroundColor = cor + "33"; // 20% opacidade
      const iconSpan = trigger.querySelector('[data-testid="label-filled"]');
      if (iconSpan) {
        iconSpan.style.color = cor;
      }
    }

    document.getElementById("wa-modal-etiqueta-valor").value =
      inputEscrita.value.trim();
    document.getElementById("wa-modal-etiqueta-cor-valor").value = cor;
  }

  inputEscrita.addEventListener("input", atualizarPreview);
  picker.addEventListener("input", atualizarPreview);
}

function atualizarEstiloBotaoFiltro(btnFiltro) {
  if (!btnFiltro) btnFiltro = document.getElementById("wa-btn-filtro");
  if (!btnFiltro) return;

  const svg = btnFiltro.querySelector("svg");
  if (filtroAtivo) {
    svg.style.color = "var(--WDS-content-action-default, #00a884)";
    btnFiltro.classList.add("ativo");
  } else {
    svg.style.color = "var(--icon, #8696a0)";
    btnFiltro.classList.remove("ativo");
  }
}

function abrirPopoverFiltro(btnFiltro) {
  let popover = document.getElementById("wa-filtro-popover");
  if (popover) {
    popover.remove();
    return;
  }

  popover = document.createElement("div");
  popover.id = "wa-filtro-popover";

  chrome.storage.local.get(
    { mensagensPendentes: [], historicoMensagens: [] },
    (res) => {
      const pendentes = res.mensagensPendentes || [];
      const historico = res.historicoMensagens || [];

      const etiquetas = new Set();
      const agendadores = new Set();
      const mapaEtiquetas = new Map();

      pendentes.forEach((item) => {
        if (item.etiqueta) {
          etiquetas.add(item.etiqueta);
          mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
        }
        if (item.agendador) agendadores.add(item.agendador);
      });
      historico.forEach((item) => {
        if (item.etiqueta) {
          etiquetas.add(item.etiqueta);
          mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
        }
        if (item.agendador) agendadores.add(item.agendador);
      });

      const etiquetasHtml = Array.from(etiquetas)
        .map((et) => {
          const cor = mapaEtiquetas.get(et) || "#00a884";
          return `<div class="wa-filtro-opcao" data-tipo="etiqueta" data-valor="${et}" style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="none" style="color: ${cor}; width: 14px; height: 14px; flex-shrink: 0;"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path></svg>
            <span>${et}</span>
          </div>`;
        })
        .join("");

      const agendadoresHtml = Array.from(agendadores)
        .map(
          (ag) =>
            `<div class="wa-filtro-opcao" data-tipo="agendador" data-valor="${ag}">${ag}</div>`,
        )
        .join("");

      popover.innerHTML = `
      <div class="wa-filtro-popover-header">
        <span>Filtros</span>
        <button class="wa-filtro-limpar-btn" id="wa-filtro-limpar-btn">Limpar</button>
      </div>
      <div class="wa-filtro-secao">
        <div class="wa-filtro-secao-titulo">Etiquetas</div>
        <div class="wa-filtro-opcoes-list">
          ${etiquetasHtml || '<div class="wa-filtro-vazio">Nenhuma etiqueta</div>'}
        </div>
      </div>
      <div class="wa-filtro-secao">
        <div class="wa-filtro-secao-titulo">Agendado por</div>
        <div class="wa-filtro-opcoes-list">
          ${agendadoresHtml || '<div class="wa-filtro-vazio">Nenhum agendador</div>'}
        </div>
      </div>
    `;

      document.body.appendChild(popover);

      const rect = btnFiltro.getBoundingClientRect();
      popover.style.top = `${rect.bottom + 8}px`;
      popover.style.left = `${rect.right - popover.offsetWidth}px`;

      setTimeout(() => popover.classList.add("visivel"), 10);

      popover.querySelectorAll(".wa-filtro-opcao").forEach((opcao) => {
        const tipo = opcao.getAttribute("data-tipo");
        const valor = opcao.getAttribute("data-valor");

        if (
          filtroAtivo &&
          filtroAtivo.tipo === tipo &&
          filtroAtivo.valor === valor
        ) {
          opcao.classList.add("selecionado");
        }

        opcao.addEventListener("click", () => {
          if (
            filtroAtivo &&
            filtroAtivo.tipo === tipo &&
            filtroAtivo.valor === valor
          ) {
            filtroAtivo = null;
          } else {
            filtroAtivo = { tipo, valor };
          }
          popover.remove();
          renderizarLista();
          renderizarHistorico();
          atualizarEstiloBotaoFiltro(btnFiltro);
        });
      });

      document
        .getElementById("wa-filtro-limpar-btn")
        .addEventListener("click", () => {
          filtroAtivo = null;
          popover.remove();
          renderizarLista();
          renderizarHistorico();
          atualizarEstiloBotaoFiltro(btnFiltro);
        });
    },
  );
}

function abrirPopoverGerenciarEtiquetas(btnGerenciar) {
  let popover = document.getElementById("wa-gerenciar-etiquetas-popover");
  if (popover) {
    popover.remove();
    return;
  }

  // Fechar o popover de filtro se estiver aberto
  const popoverFiltro = document.getElementById("wa-filtro-popover");
  if (popoverFiltro) popoverFiltro.remove();

  popover = document.createElement("div");
  popover.id = "wa-gerenciar-etiquetas-popover";

  function renderizarListaGerenciamento() {
    chrome.storage.local.get(
      { mensagensPendentes: [], historicoMensagens: [] },
      (res) => {
        const pendentes = res.mensagensPendentes || [];
        const historico = res.historicoMensagens || [];

        const mapaEtiquetas = new Map();

        pendentes.forEach((item) => {
          if (item.etiqueta) {
            mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
          }
        });
        historico.forEach((item) => {
          if (item.etiqueta) {
            mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
          }
        });

        if (mapaEtiquetas.size === 0) {
          popover.innerHTML = `
            <div class="wa-filtro-popover-header">
              <span>Gerenciar Etiquetas</span>
            </div>
            <div class="wa-filtro-secao">
              <div class="wa-filtro-vazio">Nenhuma etiqueta cadastrada</div>
            </div>
          `;
          return;
        }

        const listHtml = Array.from(mapaEtiquetas.entries())
          .map(([nome, cor]) => {
            const nomeSafe = nome.replace(/["']/g, "");
            return `
              <div class="wa-gerenciar-etiquetas-opcao" data-nome="${nomeSafe}" data-cor="${cor}">
                <div class="wa-gerenciar-etiquetas-left">
                  <svg viewBox="0 0 24 24" fill="none" style="color: ${cor}; width: 14px; height: 14px; flex-shrink: 0;">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path>
                  </svg>
                  <span>${nome}</span>
                </div>
                <div class="wa-gerenciar-etiquetas-acoes">
                  <button class="wa-gerenciar-etiquetas-btn edit" data-nome="${nomeSafe}" data-cor="${cor}" title="Editar">
                    <svg viewBox="0 0 24 24" height="16" width="16" fill="currentColor"><title>pencil-refreshed</title><path d="M5 18.9999H6.4L16.2 9.22488L14.775 7.79988L5 17.5999V18.9999ZM4 20.9999C3.71667 20.9999 3.47917 20.904 3.2875 20.7124C3.09583 20.5207 3 20.2832 3 19.9999V17.5749C3 17.3082 3.05 17.054 3.15 16.8124C3.25 16.5707 3.39167 16.3582 3.575 16.1749L16.2 3.57488C16.3833 3.39154 16.6 3.24988 16.85 3.14988C17.1 3.04988 17.3583 2.99988 17.625 2.99988C17.8917 2.99988 18.1458 3.04988 18.3875 3.14988C18.6292 3.24988 18.85 3.39988 19.05 3.59988L20.425 4.99988C20.625 5.18321 20.7708 5.39571 20.8625 5.63738C20.9542 5.87904 21 6.13321 21 6.39988C21 6.64988 20.9542 6.89988 20.8625 7.14988C20.7708 7.39988 20.625 7.62488 20.425 7.82488L7.825 20.4249C7.64167 20.6082 7.42917 20.7499 7.1875 20.8499C6.94583 20.9499 6.69167 20.9999 6.425 20.9999H4Z"></path></svg>
                  </button>
                  <button class="wa-gerenciar-etiquetas-btn delete" data-nome="${nomeSafe}" title="Excluir">
                    <svg viewBox="0 0 24 24" height="16" width="16" fill="currentColor"><title>delete-refreshed</title><path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.44772 6 4 5.55228 4 5C4 4.44772 4.44772 4 5 4H9V3.5C9 3.22386 9.22386 3 9.5 3H14.5C14.7761 3 15 3.22386 15 3.5V4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 16.5C9 16.7761 9.22386 17 9.5 17H10.5C10.7761 17 11 16.7761 11 16.5V8.5C11 8.22386 10.7761 8 10.5 8H9.5C9.22386 8 9 8.22386 9 8.5V16.5ZM13 16.5C13 16.7761 13.2239 17 13.5 17H14.5C14.7761 17 15 16.7761 15 16.5V8.5C15 8.22386 14.7761 8 14.5 8H13.5C13.2239 8 13 8.22386 13 8.5V16.5Z"></path></svg>
                  </button>
                </div>
              </div>
            `;
          })
          .join("");

        popover.innerHTML = `
          <div class="wa-filtro-popover-header">
            <span>Gerenciar Etiquetas</span>
          </div>
          <div class="wa-filtro-secao" style="max-height: 250px; overflow-y: auto;">
            ${listHtml}
          </div>
        `;

        // Adicionar eventos aos botões
        popover
          .querySelectorAll(".wa-gerenciar-etiquetas-btn.edit")
          .forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              const oldNome = btn.getAttribute("data-nome");
              const oldCor = btn.getAttribute("data-cor");
              const row = btn.closest(".wa-gerenciar-etiquetas-opcao");
              if (!row) return;

              // Substituir por formulário de edição inline
              row.className = "wa-gerenciar-etiquetas-opcao-edit";
              row.style.display = "flex";
              row.style.alignItems = "center";
              row.style.justifyContent = "space-between";
              row.style.padding = "6px 14px";
              row.style.gap = "8px";
              row.style.backgroundColor =
                "var(--WDS-surface-highlight, rgba(134,150,160,0.08))";

              row.innerHTML = `
              <div style="display: flex; align-items: center; gap: 12px; width: 100%; box-sizing: border-box; padding: 4px 0;">
                <!-- Lado Esquerdo: Ícone da Etiqueta Colorido que abre o Color Picker (estilo WhatsApp) -->
                <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <input type="color" class="wa-gerenciar-edit-cor-picker" value="${oldCor}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: none; padding: 0; z-index: 2;">
                  <div class="wa-gerenciar-edit-cor-trigger" style="width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1; background-color: ${oldCor}33; color: ${oldCor}; transition: background-color 0.2s, color 0.2s;">
                    <span style="display: flex; align-items: center; justify-content: center;">
                      <svg viewBox="0 0 24 24" height="20" width="20" fill="none">
                        <title>label-filled</title>
                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path>
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Lado Direito: Texto "Etiqueta" e Campo de Escrita com Botões -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0;">
                  <span style="font-size: 11px; color: var(--secondary, #8696a0); font-weight: 500;">Etiqueta</span>
                  <div style="display: flex; align-items: center; gap: 4px; width: 100%;">
                    <input type="text" class="wa-gerenciar-edit-nome-input" value="${oldNome}" style="flex: 1; min-width: 0;">
                    
                    <button class="wa-gerenciar-edit-salvar wa-gerenciar-etiquetas-btn" style="color: var(--WDS-content-action-default, #00a884); padding: 2px;" title="Salvar">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                    </button>
                    <button class="wa-gerenciar-edit-cancelar wa-gerenciar-etiquetas-btn" style="color: #ea0038; padding: 2px;" title="Cancelar">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            `;

              const inputNome = row.querySelector(
                ".wa-gerenciar-edit-nome-input",
              );
              const inputCor = row.querySelector(
                ".wa-gerenciar-edit-cor-picker",
              );
              const trigger = row.querySelector(
                ".wa-gerenciar-edit-cor-trigger",
              );

              inputNome.focus();

              inputCor.addEventListener("input", (evt) => {
                const newCor = evt.target.value;
                if (trigger) {
                  trigger.style.backgroundColor = newCor + "33";
                  trigger.style.color = newCor;
                }
              });

              // Botão Cancelar
              row
                .querySelector(".wa-gerenciar-edit-cancelar")
                .addEventListener("click", (evt) => {
                  evt.stopPropagation();
                  renderizarListaGerenciamento();
                });

              // Botão Salvar
              row
                .querySelector(".wa-gerenciar-edit-salvar")
                .addEventListener("click", (evt) => {
                  evt.stopPropagation();
                  const newNome = inputNome.value.trim();
                  const newCor = inputCor.value;

                  if (!newNome) {
                    alert("O nome da etiqueta não pode ser vazio!");
                    return;
                  }

                  chrome.storage.local.get(
                    { mensagensPendentes: [], historicoMensagens: [] },
                    (data) => {
                      const pList = data.mensagensPendentes || [];
                      const hList = data.historicoMensagens || [];

                      if (
                        filtroAtivo &&
                        filtroAtivo.tipo === "etiqueta" &&
                        filtroAtivo.valor === oldNome
                      ) {
                        filtroAtivo.valor = newNome;
                      }

                      pList.forEach((item) => {
                        if (item.etiqueta === oldNome) {
                          item.etiqueta = newNome;
                          item.etiquetaCor = newCor;
                        }
                      });

                      hList.forEach((item) => {
                        if (item.etiqueta === oldNome) {
                          item.etiqueta = newNome;
                          item.etiquetaCor = newCor;
                        }
                      });

                      chrome.storage.local.set(
                        {
                          mensagensPendentes: pList,
                          historicoMensagens: hList,
                        },
                        () => {
                          renderizarLista();
                          atualizarListaEtiquetasExistentes();
                          renderizarListaGerenciamento();
                        },
                      );
                    },
                  );
                });
            });
          });

        // Botão Deletar
        popover
          .querySelectorAll(".wa-gerenciar-etiquetas-btn.delete")
          .forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              const nome = btn.getAttribute("data-nome");

              if (confirm(`Deseja realmente excluir a etiqueta "${nome}"?`)) {
                chrome.storage.local.get(
                  { mensagensPendentes: [], historicoMensagens: [] },
                  (data) => {
                    const pList = data.mensagensPendentes || [];
                    const hList = data.historicoMensagens || [];

                    if (
                      filtroAtivo &&
                      filtroAtivo.tipo === "etiqueta" &&
                      filtroAtivo.valor === nome
                    ) {
                      filtroAtivo = null;
                      const btnFiltroEl =
                        document.getElementById("wa-btn-filtro");
                      if (btnFiltroEl) btnFiltroEl.classList.remove("ativo");
                    }

                    pList.forEach((item) => {
                      if (item.etiqueta === nome) {
                        item.etiqueta = "";
                        item.etiquetaCor = "";
                      }
                    });

                    hList.forEach((item) => {
                      if (item.etiqueta === nome) {
                        item.etiqueta = "";
                        item.etiquetaCor = "";
                      }
                    });

                    chrome.storage.local.set(
                      { mensagensPendentes: pList, historicoMensagens: hList },
                      () => {
                        renderizarLista();
                        atualizarListaEtiquetasExistentes();
                        renderizarListaGerenciamento();
                      },
                    );
                  },
                );
              }
            });
          });
      },
    );
  }

  renderizarListaGerenciamento();

  document.body.appendChild(popover);

  const rect = btnGerenciar.getBoundingClientRect();
  popover.style.top = `${rect.bottom + 8}px`;
  popover.style.left = `${rect.right - popover.offsetWidth}px`;

  setTimeout(() => popover.classList.add("visivel"), 10);
}

function abrirPopoverAdicionarEtiqueta(btn, targetId, type) {
  let popover = document.getElementById("wa-adicionar-etiqueta-popover");
  if (popover) {
    const activeId = popover.getAttribute("data-target-id");
    popover.remove();
    if (activeId === String(targetId)) {
      return;
    }
  }

  popover = document.createElement("div");
  popover.id = "wa-adicionar-etiqueta-popover";
  popover.setAttribute("data-target-id", targetId);
  popover.style.width = "220px";

  chrome.storage.local.get(
    { mensagensPendentes: [], historicoMensagens: [] },
    (res) => {
      const pendentes = res.mensagensPendentes || [];
      const historico = res.historicoMensagens || [];

      const mapaEtiquetas = new Map();
      pendentes.forEach((item) => {
        if (item.etiqueta) {
          mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
        }
      });
      historico.forEach((item) => {
        if (item.etiqueta) {
          mapaEtiquetas.set(item.etiqueta, item.etiquetaCor || "#00a884");
        }
      });

      const criadorFormHtml = `
        <div class="wa-popover-criador-etiqueta" style="display: none; flex-direction: column; gap: 8px; padding: 10px 14px; box-sizing: border-box; width: 100%; border-top: 1px solid var(--WDS-lines-outline-default, rgba(134,150,160,0.15));">
          <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <input type="color" class="wa-popover-etiqueta-cor-picker" value="#00a884" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: none; padding: 0; z-index: 2;">
              <div class="wa-popover-etiqueta-cor-trigger" style="width: 100%; height: 100%; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1; background-color: rgba(0, 168, 132, 0.2); transition: background-color 0.2s;">
                <span style="color: rgb(0, 168, 132); display: flex; align-items: center; justify-content: center;">
                  <svg viewBox="0 0 24 24" height="18" width="18" fill="currentColor">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
              <input type="text" class="wa-popover-etiqueta-input-escrita" placeholder="Nome..." style="width: 100%; box-sizing: border-box; background: var(--WDS-surface-highlight, #202c33); color: var(--primary, #e9edef); border: 1px solid var(--WDS-lines-outline-default, rgba(134,150,160,0.15)); border-radius: 4px; padding: 4px 8px; font-size: 12px; outline: none;">
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 6px; width: 100%;">
            <button type="button" class="wa-popover-btn-cancelar" style="background: none; border: none; color: var(--secondary, #8696a0); font-size: 11px; font-weight: 600; cursor: pointer; padding: 4px 8px; outline: none;">
              Cancelar
            </button>
            <button type="button" class="wa-popover-btn-salvar" style="background: var(--WDS-persistent-always-branded, #00a884); border: none; color: #fff; font-size: 11px; font-weight: 600; cursor: pointer; padding: 4px 10px; border-radius: 4px; outline: none;">
              Salvar
            </button>
          </div>
        </div>
      `;

      if (mapaEtiquetas.size === 0) {
        popover.innerHTML = `
          <div class="wa-filtro-popover-header" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-bottom: 1px solid var(--WDS-lines-outline-default, rgba(134,150,160,0.15));">
            <span style="font-weight: 600;">Etiquetar Mensagem</span>
            <button type="button" class="wa-popover-btn-nova-etiqueta" style="background: none; border: 1px dashed var(--WDS-persistent-always-branded, #00a884); color: var(--WDS-persistent-always-branded, #00a884); padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; cursor: pointer; outline: none;">
              + Nova
            </button>
          </div>
          <div class="wa-filtro-secao">
            <div class="wa-filtro-vazio" style="padding: 6px 14px; font-size: 12px; line-height: 1.4;">
              Nenhuma etiqueta cadastrada.
            </div>
          </div>
          ${criadorFormHtml}
        `;
      } else {
        const opcoesHtml = Array.from(mapaEtiquetas.entries())
          .map(([nome, cor]) => {
            return `
              <div class="wa-filtro-opcao wa-adicionar-etiqueta-opcao" data-nome="${nome}" data-cor="${cor}">
                <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${cor}; margin-right:8px; vertical-align:middle;"></span>
                <span style="vertical-align:middle;">${nome}</span>
              </div>
            `;
          })
          .join("");

        popover.innerHTML = `
          <div class="wa-filtro-popover-header" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-bottom: 1px solid var(--WDS-lines-outline-default, rgba(134,150,160,0.15));">
            <span style="font-weight: 600;">Etiquetar Mensagem</span>
            <button type="button" class="wa-popover-btn-nova-etiqueta" style="background: none; border: 1px dashed var(--WDS-persistent-always-branded, #00a884); color: var(--WDS-persistent-always-branded, #00a884); padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; cursor: pointer; outline: none;">
              + Nova
            </button>
          </div>
          <div class="wa-filtro-opcoes-list" style="max-height: 180px;">
            ${opcoesHtml}
          </div>
          ${criadorFormHtml}
        `;
      }

      document.body.appendChild(popover);

      const rect = btn.getBoundingClientRect();
      popover.style.top = `${rect.bottom + 4}px`;

      const leftPos = rect.left;
      if (leftPos + 220 > window.innerWidth) {
        popover.style.left = `${window.innerWidth - 230}px`;
      } else {
        popover.style.left = `${leftPos}px`;
      }

      setTimeout(() => popover.classList.add("visivel"), 10);

      const btnNova = popover.querySelector(".wa-popover-btn-nova-etiqueta");
      const listContainer =
        popover.querySelector(".wa-filtro-opcoes-list") ||
        popover.querySelector(".wa-filtro-secao");
      const formContainer = popover.querySelector(
        ".wa-popover-criador-etiqueta",
      );
      const btnCancelar = popover.querySelector(".wa-popover-btn-cancelar");
      const btnSalvar = popover.querySelector(".wa-popover-btn-salvar");
      const picker = popover.querySelector(".wa-popover-etiqueta-cor-picker");
      const trigger = popover.querySelector(".wa-popover-etiqueta-cor-trigger");
      const inputEscrita = popover.querySelector(
        ".wa-popover-etiqueta-input-escrita",
      );

      btnNova.addEventListener("click", (e) => {
        e.stopPropagation();
        listContainer.style.display = "none";
        formContainer.style.display = "flex";
        btnNova.style.display = "none";
        inputEscrita.value = "";
        picker.value = "#00a884";
        trigger.style.backgroundColor = "rgba(0, 168, 132, 0.2)";
        const svg = trigger.querySelector("svg");
        if (svg) svg.style.color = "#00a884";
        inputEscrita.focus();
      });

      btnCancelar.addEventListener("click", (e) => {
        e.stopPropagation();
        formContainer.style.display = "none";
        listContainer.style.display = "";
        btnNova.style.display = "";
      });

      picker.addEventListener("input", () => {
        const cor = picker.value;
        trigger.style.backgroundColor = cor + "33"; // 20% opacity
        const svg = trigger.querySelector("svg");
        if (svg) svg.style.color = cor;
      });

      btnSalvar.addEventListener("click", (e) => {
        e.stopPropagation();
        const nome = inputEscrita.value.trim();
        const cor = picker.value;
        if (!nome) {
          inputEscrita.focus();
          return;
        }

        chrome.storage.local.get(
          { mensagensPendentes: [], historicoMensagens: [] },
          (data) => {
            const pList = data.mensagensPendentes || [];
            const hList = data.historicoMensagens || [];

            if (type === "agendado") {
              pList.forEach((item) => {
                if (String(item.id) === String(targetId)) {
                  item.etiqueta = nome;
                  item.etiquetaCor = cor;
                }
              });
            } else if (type === "historico") {
              hList.forEach((item) => {
                if (String(item.id) === String(targetId)) {
                  item.etiqueta = nome;
                  item.etiquetaCor = cor;
                }
              });
            }

            chrome.storage.local.set(
              { mensagensPendentes: pList, historicoMensagens: hList },
              () => {
                renderizarLista();
                renderizarHistorico();
                popover.remove();
              },
            );
          },
        );
      });

      popover
        .querySelectorAll(".wa-adicionar-etiqueta-opcao")
        .forEach((opcao) => {
          opcao.addEventListener("click", () => {
            const nome = opcao.getAttribute("data-nome");
            const cor = opcao.getAttribute("data-cor");

            chrome.storage.local.get(
              { mensagensPendentes: [], historicoMensagens: [] },
              (data) => {
                const pList = data.mensagensPendentes || [];
                const hList = data.historicoMensagens || [];

                if (type === "agendado") {
                  pList.forEach((item) => {
                    if (String(item.id) === String(targetId)) {
                      item.etiqueta = nome;
                      item.etiquetaCor = cor;
                    }
                  });
                } else if (type === "historico") {
                  hList.forEach((item) => {
                    if (String(item.id) === String(targetId)) {
                      item.etiqueta = nome;
                      item.etiquetaCor = cor;
                    }
                  });
                }

                chrome.storage.local.set(
                  { mensagensPendentes: pList, historicoMensagens: hList },
                  () => {
                    renderizarLista();
                    renderizarHistorico();
                    popover.remove();
                  },
                );
              },
            );
          });
        });
    },
  );
}

function renderizarGavetaRR() {
  const lista = document.getElementById("wa-rr-gaveta-lista");
  if (!lista) return;
  carregarRespostasRapidas((itens) => {
    if (itens.length === 0) {
      lista.innerHTML = `
        <div class="wa-rr-gaveta-vazio">
          <div style="margin-bottom:12px;opacity:0.5;">${SVG_BOLT}</div>
          <div style="font-weight:600;margin-bottom:6px;color:var(--primary,#e9edef);">Nenhuma resposta rápida</div>
          <div>Crie respostas para agilizar o envio de mensagens repetitivas.</div>
        </div>`;
      return;
    }
    lista.innerHTML = itens
      .map(
        (item) => `
      <div class="wa-rr-gaveta-item" data-id="${item.id}">
        <div class="wa-rr-gaveta-item-info">
          <div class="wa-rr-gaveta-item-atalho">/${item.atalho}</div>
          <div class="wa-rr-gaveta-item-msg">${item.mensagem.replace(/\n/g, " ")}</div>
        </div>
        <div class="wa-rr-gaveta-item-acoes">
          <button class="wa-rr-gaveta-item-btn edit" data-id="${item.id}" title="Editar">${SVG_EDIT_RR}</button>
          <button class="wa-rr-gaveta-item-btn delete" data-id="${item.id}" title="Excluir">${SVG_DELETE_RR}</button>
        </div>
      </div>`,
      )
      .join("");

    lista.querySelectorAll(".wa-rr-gaveta-item-btn.edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        carregarRespostasRapidas((itens) => {
          const item = itens.find((i) => i.id === id);
          if (item) abrirModalRespostaRapida(item);
        });
      });
    });

    lista.querySelectorAll(".wa-rr-gaveta-item-btn.delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        carregarRespostasRapidas((itens) => {
          salvarRespostasRapidas(
            itens.filter((i) => i.id !== id),
            () => renderizarGavetaRR(),
          );
        });
      });
    });
  });
}

function abrirGavetaRespostasRapidas() {
  const painel = document.getElementById("wa-painel-injetado");
  if (!painel) return;

  // toggle
  const gavetaExistente = document.getElementById("wa-rr-gaveta");
  if (gavetaExistente) {
    fecharGavetaRespostasRapidas();
    return;
  }

  const btnBolt = document.getElementById("wa-btn-respostas-rapidas");
  if (btnBolt) btnBolt.classList.add("ativo");

  const gaveta = document.createElement("div");
  gaveta.id = "wa-rr-gaveta";
  gaveta.innerHTML = `
    <div id="wa-rr-gaveta-header">
      <button class="wa-rr-gaveta-btn-back" id="wa-rr-gaveta-fechar">${SVG_CLOSE_RR}</button>
      <span class="wa-rr-gaveta-titulo">Respostas rápidas</span>
    </div>
    <div id="wa-rr-gaveta-lista"></div>
    <div id="wa-rr-gaveta-footer">
      <button class="wa-rr-btn-nova" id="wa-rr-btn-nova">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Nova Resposta Rápida
      </button>
    </div>`;

  painel.appendChild(gaveta);
  renderizarGavetaRR();

  // Anima entrada
  requestAnimationFrame(() => gaveta.classList.add("aberta"));

  gaveta
    .querySelector("#wa-rr-gaveta-fechar")
    .addEventListener("click", fecharGavetaRespostasRapidas);
  gaveta
    .querySelector("#wa-rr-btn-nova")
    .addEventListener("click", () => abrirModalRespostaRapida(null));
}

function fecharGavetaRespostasRapidas() {
  const gaveta = document.getElementById("wa-rr-gaveta");
  if (!gaveta) return;
  const btnBolt = document.getElementById("wa-btn-respostas-rapidas");
  if (btnBolt) btnBolt.classList.remove("ativo");
  gaveta.classList.remove("aberta");
  gaveta.addEventListener("transitionend", () => gaveta.remove(), {
    once: true,
  });
}

function abrirModalRespostaRapida(item) {
  // Remove overlay anterior se existir
  const anterior = document.getElementById("wa-rr-modal-overlay");
  if (anterior) anterior.remove();

  const edicao = item !== null;
  const overlay = document.createElement("div");
  overlay.id = "wa-rr-modal-overlay";
  overlay.innerHTML = `
    <div id="wa-rr-modal">
      <div id="wa-rr-modal-header">
        <button class="wa-rr-modal-btn-fechar" id="wa-rr-modal-fechar">${SVG_CLOSE_RR}</button>
        <span class="wa-rr-modal-titulo">${edicao ? "Editar resposta rápida" : "Adicionar resposta rápida"}</span>
      </div>
      <div id="wa-rr-modal-body">
        <div class="wa-rr-modal-campo">
          <span class="wa-rr-modal-label">Atalho</span>
          <div class="wa-rr-modal-input-container">
            <span class="wa-rr-modal-slash">/</span>
            <input type="text" id="wa-rr-input-atalho" placeholder="atalho" maxlength="25" value="${edicao ? item.atalho.replace(/"/g, "&quot;") : ""}" autocomplete="off" spellcheck="false">
            <span class="wa-rr-modal-contador" id="wa-rr-contador-atalho">25</span>
          </div>
          <div class="wa-rr-modal-erro" id="wa-rr-erro-atalho">O atalho não pode ficar em branco.</div>
        </div>
        <div class="wa-rr-modal-campo">
          <span class="wa-rr-modal-label">Mensagem da resposta</span>
          <div class="wa-rr-modal-input-container">
            <textarea id="wa-rr-input-mensagem" placeholder="Digite a mensagem..." rows="1">${edicao ? item.mensagem.replace(/</g, "&lt;") : ""}</textarea>
            <button class="wa-rr-modal-emoji-btn" id="wa-rr-modal-emoji-btn" title="Abrir o painel de emojis">
              <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none"><title>ic-mood</title><path fill="currentColor" d="M15.5 11c.42 0 .77-.15 1.06-.44.3-.29.44-.64.44-1.06 0-.42-.15-.77-.44-1.06-.29-.3-.64-.44-1.06-.44-.42 0-.77.15-1.06.44-.3.29-.44.64-.44 1.06 0 .42.15.77.44 1.06.29.3.64.44 1.06.44ZM-7 0c.42 0 .77-.15 1.06-.44.3-.29.44-.64.44-1.06 0-.42-.15-.77-.44-1.06C9.27 8.14 8.92 8 8.5 8c-.42 0-.77.15-1.06.44-.3.29-.44.64-.44 1.06 0 .42.15.77.44 1.06.29.3.64.44 1.06.44ZM12 22a10.1 10.1 0 0 1-9.21-6.1A9.74 9.74 0 0 1 2 12a10.1 10.1 0 0 1 6.1-9.21A9.74 9.74 0 0 1 12 2a10.1 10.1 0 0 1 9.21 6.1c.53 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9a10.1 10.1 0 0 1-5.31 5.31A9.74 9.74 0 0 1 12 22Zm0-2c2.23 0 4.13-.77 5.68-2.32A7.72 7.72 0 0 0 20 12c0-2.23-.77-4.13-2.32-5.67A7.72 7.72 0 0 0 12 4c-2.23 0-4.13.78-5.67 2.33A7.72 7.72 0 0 0 4 12c0 2.23.78 4.13 2.33 5.68A7.72 7.72 0 0 0 12 20Zm0-2.5a5.53 5.53 0 0 0 4.65-2.6c.1-.2.1-.4-.02-.6a.57.57 0 0 0-.53-.3H7.9c-.23 0-.4.1-.53.3a.6.6 0 0 0-.02.6A5.5 5.5 0 0 0 12 17.5Z"></path></svg>
            </button>
          </div>
          <div class="wa-rr-modal-erro" id="wa-rr-erro-mensagem">Adicione uma mensagem antes de salvar.</div>
        </div>
      </div>
      <div id="wa-rr-modal-footer">
        <button class="wa-rr-modal-btn wa-rr-modal-btn-cancelar" id="wa-rr-modal-cancelar">Cancelar</button>
        <button class="wa-rr-modal-btn wa-rr-modal-btn-salvar" id="wa-rr-modal-salvar" disabled>Salvar</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("visivel"));

  const inputAtalho = overlay.querySelector("#wa-rr-input-atalho");
  const inputMensagem = overlay.querySelector("#wa-rr-input-mensagem");
  const btnSalvar = overlay.querySelector("#wa-rr-modal-salvar");
  const contadorAtalho = overlay.querySelector("#wa-rr-contador-atalho");

  // Auto-resize textarea
  function resizeTextarea() {
    inputMensagem.style.height = "auto";
    inputMensagem.style.height = inputMensagem.scrollHeight + "px";
  }
  inputMensagem.addEventListener("input", resizeTextarea);
  if (edicao) {
    setTimeout(resizeTextarea, 10);
  }

  let atalhoInteragido = false;
  let mensagemInteragida = false;

  // Validação em tempo real
  function validar() {
    const atalho = inputAtalho.value.trim().replace(/\s/g, "");
    const msg = inputMensagem.value.trim();
    contadorAtalho.textContent = 25 - atalho.length;

    if (atalhoInteragido) {
      const atalhoContainer = inputAtalho.closest(
        ".wa-rr-modal-input-container",
      );
      const errorAtalho = overlay.querySelector("#wa-rr-erro-atalho");
      if (!atalho) {
        if (atalhoContainer) atalhoContainer.classList.add("wa-erro");
        if (errorAtalho) errorAtalho.classList.add("visivel");
      } else {
        if (atalhoContainer) atalhoContainer.classList.remove("wa-erro");
        if (errorAtalho) errorAtalho.classList.remove("visivel");
      }
    }

    if (mensagemInteragida) {
      const msgContainer = inputMensagem.closest(
        ".wa-rr-modal-input-container",
      );
      const errorMsg = overlay.querySelector("#wa-rr-erro-mensagem");
      if (!msg) {
        if (msgContainer) msgContainer.classList.add("wa-erro");
        if (errorMsg) errorMsg.classList.add("visivel");
      } else {
        if (msgContainer) msgContainer.classList.remove("wa-erro");
        if (errorMsg) errorMsg.classList.remove("visivel");
      }
    }

    btnSalvar.disabled = !(atalho && msg);
  }

  inputAtalho.addEventListener("input", () => {
    atalhoInteragido = true;
    inputAtalho.value = inputAtalho.value.replace(/\s/g, "");
    validar();
  });
  inputAtalho.addEventListener("blur", () => {
    atalhoInteragido = true;
    validar();
  });

  inputMensagem.addEventListener("input", () => {
    mensagemInteragida = true;
    validar();
  });
  inputMensagem.addEventListener("blur", () => {
    mensagemInteragida = true;
    validar();
  });

  if (edicao) {
    atalhoInteragido = true;
    mensagemInteragida = true;
  }
  validar();

  // Emoji do modal de agendamento redireciona para textarea de mensagem RR
  const rrEmojiBtn = overlay.querySelector("#wa-rr-modal-emoji-btn");
  if (rrEmojiBtn) {
    rrEmojiBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const emojiPicker = document.getElementById("wa-emoji-picker");
      const rrModal = document.getElementById("wa-rr-modal");
      if (emojiPicker && rrModal) {
        if (emojiPicker.parentNode !== rrModal) {
          rrModal.appendChild(emojiPicker);
        }
        const isVisible = emojiPicker.style.display === "flex";
        if (isVisible) {
          emojiPicker.style.display = "none";
          rrModal.classList.remove("wa-emoji-open");
          emojiPicker._rrTarget = null;
        } else {
          // Limpa busca anterior
          const emojiSearch = emojiPicker.querySelector(".wa-emoji-search");
          if (emojiSearch) emojiSearch.value = "";

          emojiPicker.style.display = "flex";
          rrModal.classList.add("wa-emoji-open");
          emojiPicker._rrTarget = inputMensagem;

          // Reseta visualização das categorias e itens do emoji picker
          const headers = emojiPicker.querySelectorAll(
            ".wa-emoji-category-header",
          );
          const items = emojiPicker.querySelectorAll(".wa-emoji-item");
          const sections = emojiPicker.querySelectorAll(
            ".wa-emoji-category-section",
          );
          headers.forEach((h) => (h.style.display = "block"));
          items.forEach((item) => (item.style.display = "block"));
          sections.forEach((s) => (s.style.display = "block"));

          const emojiTabs = emojiPicker.querySelectorAll(".wa-emoji-tab");
          emojiTabs.forEach((t) => t.classList.remove("active"));
          const firstTab = Array.from(emojiTabs).find(
            (t) => t.style.display !== "none",
          );
          if (firstTab) firstTab.classList.add("active");

          if (emojiSearch) emojiSearch.focus();
        }
      }
    });
  }

  function fecharModal() {
    const emojiPicker = document.getElementById("wa-emoji-picker");
    const rrModal = document.getElementById("wa-rr-modal");
    if (emojiPicker) {
      emojiPicker.style.display = "none";
      emojiPicker._rrTarget = null;
      // Move de volta para o modal principal para não ser destruído
      const mainModal = document.querySelector("#wa-modal-overlay .wa-modal");
      if (mainModal && emojiPicker.parentNode !== mainModal) {
        mainModal.appendChild(emojiPicker);
      }
    }
    if (rrModal) {
      rrModal.classList.remove("wa-emoji-open");
    }
    overlay.classList.remove("visivel");
    setTimeout(() => overlay.remove(), 200);
  }

  overlay
    .querySelector("#wa-rr-modal-fechar")
    .addEventListener("click", fecharModal);
  overlay
    .querySelector("#wa-rr-modal-cancelar")
    .addEventListener("click", fecharModal);

  // Fechar clicando no backdrop
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fecharModal();
  });

  btnSalvar.addEventListener("click", () => {
    const atalho = inputAtalho.value.trim();
    const mensagem = inputMensagem.value.trim();
    if (!atalho || !mensagem) return;

    carregarRespostasRapidas((lista) => {
      if (edicao) {
        const idx = lista.findIndex((i) => i.id === item.id);
        if (idx !== -1) {
          lista[idx].atalho = atalho;
          lista[idx].mensagem = mensagem;
        }
      } else {
        lista.push({ id: `rr_${Date.now()}`, atalho, mensagem });
      }
      salvarRespostasRapidas(lista, () => {
        renderizarGavetaRR();
        fecharModal();
      });
    });
  });

  // Enter no campo atalho vai para mensagem
  inputAtalho.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputMensagem.focus();
    }
  });

  setTimeout(() => inputAtalho.focus(), 100);
}

function fecharPopoverRR() {
  const pop = document.getElementById("wa-rr-popover");
  if (pop) pop.remove();
  rrPopoverAtivo = false;
  rrIndiceAtivo = -1;
  rrItensAtuais = [];
}

function selecionarRespostaRapida(mensagem) {
  const textarea = document.getElementById("wa-modal-msg");
  if (!textarea) {
    fecharPopoverRR();
    return;
  }

  const val = textarea.value;
  const cursor = textarea.selectionStart;

  // Encontra a posição do '/' que iniciou o comando
  let inicioSlash = cursor - 1;
  while (inicioSlash >= 0 && val[inicioSlash] !== "/") inicioSlash--;

  // Verifica que o '/' é o começo do atalho (sem espaço antes na mesma palavra)
  const antes = inicioSlash > 0 ? val[inicioSlash - 1] : "\n";
  if (
    inicioSlash >= 0 &&
    (antes === "\n" || antes === " " || inicioSlash === 0)
  ) {
    textarea.value =
      val.substring(0, inicioSlash) + mensagem + val.substring(cursor);
    textarea.selectionStart = textarea.selectionEnd =
      inicioSlash + mensagem.length;
  } else {
    textarea.value =
      val.substring(0, cursor) + mensagem + val.substring(cursor);
    textarea.selectionStart = textarea.selectionEnd = cursor + mensagem.length;
  }

  textarea.dispatchEvent(new Event("input"));
  textarea.focus();
  fecharPopoverRR();
}

function mostrarPopoverRR(filtro) {
  const composeBar = document.querySelector(".wa-modal-compose-bar");
  if (!composeBar) return;

  carregarRespostasRapidas((itens) => {
    const filtrados = filtro
      ? itens.filter((i) =>
          i.atalho.toLowerCase().startsWith(filtro.toLowerCase()),
        )
      : itens;

    rrItensAtuais = filtrados;
    rrIndiceAtivo = filtrados.length > 0 ? 0 : -1;

    // Remove popover existente e recria
    const anterior = document.getElementById("wa-rr-popover");
    if (anterior) anterior.remove();

    const pop = document.createElement("div");
    pop.id = "wa-rr-popover";

    const listaHtml =
      filtrados.length > 0
        ? filtrados
            .map(
              (item, idx) => `
          <div class="wa-rr-popover-item${idx === 0 ? " ativo" : ""}" data-idx="${idx}">
            <div class="wa-rr-popover-item-atalho">/${item.atalho}</div>
            <div class="wa-rr-popover-item-msg">${item.mensagem.replace(/\n/g, " ")}</div>
          </div>`,
            )
            .join("")
        : `<div class="wa-rr-popover-vazio">Nenhuma resposta rápida encontrada.</div>`;

    pop.innerHTML = `
      <div id="wa-rr-popover-header">
        <span class="wa-rr-popover-titulo">Respostas rápidas</span>
        <button class="wa-rr-popover-btn-gerenciar" id="wa-rr-popover-btn-gerenciar" title="Gerenciar respostas rápidas">${SVG_EDIT_RR}</button>
      </div>
      <div id="wa-rr-popover-lista">${listaHtml}</div>`;

    // Posiciona relativo ao composeBar
    composeBar.style.position = composeBar.style.position || "relative";
    composeBar.appendChild(pop);
    rrPopoverAtivo = true;

    // Eventos de clique nos itens
    pop.querySelectorAll(".wa-rr-popover-item").forEach((el) => {
      el.addEventListener("mousedown", (e) => {
        e.preventDefault(); // Evita blur do textarea
        const idx = parseInt(el.getAttribute("data-idx"));
        selecionarRespostaRapida(rrItensAtuais[idx].mensagem);
      });
    });

    // Botão gerenciar
    const btnGerenciar = pop.querySelector("#wa-rr-popover-btn-gerenciar");
    if (btnGerenciar) {
      btnGerenciar.addEventListener("mousedown", (e) => {
        e.preventDefault();
        fecharPopoverRR();
        // Fecha o modal de agendamento e abre a gaveta
        const fecharBtn = document.getElementById("wa-fechar-modal");
        if (fecharBtn) fecharBtn.click();
        const btnBolt = document.getElementById("wa-btn-respostas-rapidas");
        if (btnBolt) btnBolt.click();
      });
    }
  });
}

function atualizarDestaquePorOverRR() {
  const pop = document.getElementById("wa-rr-popover");
  if (!pop) return;
  pop.querySelectorAll(".wa-rr-popover-item").forEach((el, idx) => {
    el.classList.toggle("ativo", idx === rrIndiceAtivo);
  });
}

function injetarBotaoHeader(header) {
  if (!header)
    header =
      document.querySelector('header[data-testid="chatlist-header"]') ||
      document.querySelector("#side header") ||
      document.querySelector("header");
  if (!header) return;
  const botoesContainer = header.querySelector("div");
  const btnAgenda = document.createElement("div");
  btnAgenda.id = "btn-agenda-wa";
  btnAgenda.setAttribute("data-wa-tooltip", "Agendador de Mensagens");
  btnAgenda.setAttribute("data-wa-tooltip-position", "right");
  btnAgenda.style.cssText =
    "position: relative; cursor: pointer; padding: 8px; margin-bottom: 4px; margin-right: 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s ease;";
  btnAgenda.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><path class="rel-fundo" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path class="rel-borda" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path class="rel-ponteiros" d="M12.5 7H11v6l5.2 3.2l.8-1.3l-4.5-2.7V7z"/></svg><div id="wa-agenda-badge">0</div>`;
  botoesContainer.prepend(btnAgenda);
  atualizarContadorBadge();
  btnAgenda.addEventListener("click", () => {
    abertoPeloAgendador = true;

    // Garante leitura em tempo real da aba ativa antes de decidir a ação
    const btnAtivo =
      document.querySelector('button[data-navbar-item-selected="true"]') ||
      document.querySelector('button[aria-pressed="true"]');
    if (btnAtivo) {
      const label = btnAtivo.getAttribute("aria-label");
      if (label) currentTab = label;
    }

    if (currentTab && currentTab !== "Conversas") {
      const btnConversas = document.querySelector(
        'button[aria-label="Conversas"]',
      );
      if (btnConversas) {
        simularClique(btnConversas, "Aba Conversas");
        setTimeout(() => {
          abrirNovaConversa();
        }, 600);
      } else {
        console.error("[WAgenda] ERRO: Botão da aba Conversas não encontrado.");
      }
    } else {
      abrirNovaConversa();
    }
  });
}

function abrirNovaConversa() {
  const btnNovaConversa =
    document.querySelector('button[aria-label="Nova conversa"]') ||
    document
      .querySelector('span[data-icon="new-chat-outline"]')
      ?.closest("button");

  const estaVisivel =
    btnNovaConversa &&
    (btnNovaConversa.offsetWidth > 0 || btnNovaConversa.offsetHeight > 0);

  if (btnNovaConversa && estaVisivel) {
    simularClique(btnNovaConversa, "Nova Conversa");
    return true;
  }
  return false;
}

function atualizarContadorBadge() {
  chrome.storage.local.get({ mensagensPendentes: [] }, (result) => {
    const badge = document.getElementById("wa-agenda-badge");
    if (!badge) return;
    const quantidade = result.mensagensPendentes.length;
    badge.innerText = quantidade;
    badge.style.display = quantidade > 0 ? "flex" : "none";
  });
}

function observarGavetaNativa() {
  new MutationObserver((mutations) => {
    const drawer = document.querySelector('div[data-testid="new-chat-drawer"]');
    if (drawer) {
      gavetaEstavaAberta = true;
      if (
        abertoPeloAgendador &&
        !document.getElementById("wa-painel-injetado")
      ) {
        document.body.classList.add("agendador-ativo");
        injetarPainelNaGaveta(drawer);
      } else if (!abertoPeloAgendador) {
        const btnFiltro = drawer.querySelector("#wa-btn-filtro");
        if (btnFiltro) btnFiltro.remove();
        const btnGerenciar = drawer.querySelector(
          "#wa-btn-gerenciar-etiquetas",
        );
        if (btnGerenciar) btnGerenciar.remove();
        drawer.classList.remove("wa-gaveta-sequestrada");
      }
    } else if (gavetaEstavaAberta) {
      abertoPeloAgendador = false;
      modoAgendamento = false;
      gavetaEstavaAberta = false;
      document.body.classList.remove("agendador-ativo");
      const btn = document.getElementById("btn-agenda-wa");
      if (btn) btn.style.backgroundColor = "transparent";
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function injetarPainelNaGaveta(drawer) {
  drawer.classList.add("wa-gaveta-sequestrada");
  mudarTituloGaveta(drawer, "Mensagens Agendadas");

  // Interceptar e remover instantaneamente qualquer tooltip nativo do WhatsApp dentro da nossa gaveta
  const tooltipObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        const target = mutation.target;
        if (target && target.hasAttribute("aria-describedby")) {
          const tooltipId = target.getAttribute("aria-describedby");
          target.removeAttribute("aria-describedby");
          if (tooltipId) {
            const nativeTooltip = document.getElementById(tooltipId);
            if (nativeTooltip) {
              nativeTooltip.remove();
            }
          }
        }
      }
    });
  });

  tooltipObserver.observe(drawer, {
    attributes: true,
    subtree: true,
    attributeFilter: ["aria-describedby"],
  });

  // Injetar botão de filtro no Header
  const header = drawer.querySelector("header");
  if (header) {
    const antigoBtn = header.querySelector("#wa-btn-filtro");
    if (antigoBtn) antigoBtn.remove();

    const btnFiltro = document.createElement("button");
    btnFiltro.id = "wa-btn-filtro";
    btnFiltro.setAttribute("data-wa-tooltip", "Filtrar mensagens");
    btnFiltro.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: var(--icon, #8696a0); transition: color 0.2s;">
        <path d="M3 8H11M15 8H21M18 11V5M6 13H15M10 18H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const antigoBtnGerenciar = header.querySelector(
      "#wa-btn-gerenciar-etiquetas",
    );
    if (antigoBtnGerenciar) antigoBtnGerenciar.remove();

    const btnGerenciar = document.createElement("button");
    btnGerenciar.id = "wa-btn-gerenciar-etiquetas";
    btnGerenciar.setAttribute("data-wa-tooltip", "Gerenciar etiquetas");
    btnGerenciar.innerHTML = `
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.25 13.71" width="20" height="20" style="color: var(--icon, #8696a0); transition: color 0.2s;">
        <path d="M14.25,8.47l-3.28,4.62c-.27.38-.72.63-1.22.62H1.49c-.82,0-1.49-.67-1.49-1.49v-7.49c0-.82.68-1.5,1.5-1.51h3.97c.41,0,.75.34.75.75s-.34.75-.75.75H1.5v7.5h8.25l2.66-3.75-.61-.88s-.01-.02-.02-.03c0,0-.01-.02-.01-.03-.07-.1-.1-.23-.1-.36,0-.41.34-.75.75-.75.25,0,.46.12.6.3.01.01.02.02.02.03l1.21,1.72Z" fill="currentColor"/>
        <path d="M11.78,7.56l-.02-.02h.01s.01.01.01.02Z" fill="currentColor"/>
        <path d="M6.33,9.21l.71-.12,4.19-5.79-.84-.61-4.18,5.8.12.71h0ZM5.99,10.31c-.14.02-.27,0-.39-.09-.11-.08-.18-.2-.21-.34l-.2-1.24c-.02-.14-.02-.27.01-.4.03-.13.09-.25.16-.36L10.77.42c.08-.11.18-.2.3-.27.12-.07.25-.12.38-.14s.27-.02.4,0c.13.03.26.09.37.17l.82.6c.12.08.21.17.28.29s.11.24.13.38c.02.13.02.26,0,.39-.03.13-.08.26-.17.38l-5.38,7.46c-.08.11-.17.2-.29.27-.11.07-.24.12-.38.14l-1.24.2h0Z" fill="currentColor"/>
      </svg>
    `;

    let containerBotoes = null;
    const telBtn =
      header.querySelector('button[aria-label="Número de telefone"]') ||
      header.querySelector('button:has(path[d^="M12 23"])') ||
      header.querySelector('span:has(button[aria-label="Número de telefone"])');
    if (telBtn) {
      containerBotoes = telBtn.closest("div");

      // Remover tooltips nativos do WhatsApp do contêiner e do botão original
      telBtn.removeAttribute("aria-label");
      telBtn.removeAttribute("title");
      telBtn.removeAttribute("data-tooltip");
      const parentSpan = telBtn.closest("span");
      if (parentSpan) {
        parentSpan.removeAttribute("aria-label");
        parentSpan.removeAttribute("title");
        parentSpan.removeAttribute("data-tooltip");
      }
    }
    if (!containerBotoes) {
      containerBotoes = header.querySelector("div:last-child") || header;
    }

    containerBotoes.appendChild(btnFiltro);
    containerBotoes.appendChild(btnGerenciar);
    atualizarEstiloBotaoFiltro(btnFiltro);

    // Botão Respostas Rápidas (bolt)
    const antigoBtnRR = header.querySelector("#wa-btn-respostas-rapidas");
    if (antigoBtnRR) antigoBtnRR.remove();
    const btnRR = document.createElement("button");
    btnRR.id = "wa-btn-respostas-rapidas";
    btnRR.setAttribute("data-wa-tooltip", "Respostas rápidas");
    btnRR.innerHTML = SVG_BOLT;
    containerBotoes.appendChild(btnRR);

    btnFiltro.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirPopoverFiltro(btnFiltro);
    });

    btnGerenciar.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirPopoverGerenciarEtiquetas(btnGerenciar);
    });

    btnRR.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirGavetaRespostasRapidas();
    });
  }

  const painel = document.createElement("div");
  painel.id = "wa-painel-injetado";
  painel.innerHTML = `
    <div id="wa-painel-conteudo-scroll">
      <button class="sa-btn-nova" id="wa-btn-chamar-busca">Agendar Nova Mensagem</button>
      <div id="wa-lista-agendamentos"></div>
    </div>
    <div id="wa-historico-drawer">
      <div class="wa-historico-header" id="wa-historico-header-btn">
        <div class="wa-historico-titulo-wrapper">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color: var(--icon, #8696a0);"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 7 7 7 7 0 0 1-5.03-2.13l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
          <span class="wa-historico-titulo">Histórico de Envios</span>
          <span class="wa-historico-badge" id="wa-historico-contador">0</span>
        </div>
        <div class="wa-historico-seta">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 8.5L6 14.5L7.4 15.9L12 11.3L16.6 15.9L18 14.5L12 8.5Z"/></svg>
        </div>
      </div>
      <div class="wa-historico-conteudo" id="wa-historico-conteudo-lista"></div>
    </div>
  `;
  drawer.appendChild(painel);
  renderizarLista();
  renderizarHistorico();

  if (pularPainelEIrDiretoParaBusca) {
    painel.style.display = "none";
    drawer.classList.remove("wa-gaveta-sequestrada");
    const btnFiltro = drawer.querySelector("#wa-btn-filtro");
    if (btnFiltro) btnFiltro.style.setProperty("display", "none", "important");
    const btnGerenciar = drawer.querySelector("#wa-btn-gerenciar-etiquetas");
    if (btnGerenciar)
      btnGerenciar.style.setProperty("display", "none", "important");
    const btnRR = drawer.querySelector("#wa-btn-respostas-rapidas");
    if (btnRR) btnRR.style.setProperty("display", "none", "important");
    mudarTituloGaveta(drawer, "Agendar nova mensagem");
    modoAgendamento = true;
    pularPainelEIrDiretoParaBusca = false;
  }

  document
    .getElementById("wa-historico-header-btn")
    .addEventListener("click", () => {
      const dr = document.getElementById("wa-historico-drawer");
      dr.classList.toggle("aberto");
    });

  document
    .getElementById("wa-btn-chamar-busca")
    .addEventListener("click", () => {
      painel.style.display = "none";
      drawer.classList.remove("wa-gaveta-sequestrada");
      const btnFiltro = drawer.querySelector("#wa-btn-filtro");
      if (btnFiltro)
        btnFiltro.style.setProperty("display", "none", "important");
      const btnGerenciar = drawer.querySelector("#wa-btn-gerenciar-etiquetas");
      if (btnGerenciar)
        btnGerenciar.style.setProperty("display", "none", "important");
      const btnRR = drawer.querySelector("#wa-btn-respostas-rapidas");
      if (btnRR) btnRR.style.setProperty("display", "none", "important");
      mudarTituloGaveta(drawer, "Agendar nova mensagem");
      modoAgendamento = true;

      // Reseta contatos selecionados e estados temporários
      contatosSelecionados = [];
      tempMsgText = "";
      tempScheduleDate = "";
    });
}

function mudarTituloGaveta(drawer, novoTexto) {
  const tituloContainer = drawer.querySelector(
    'div[data-testid="drawer-title-body"]',
  );
  if (tituloContainer) {
    const span = tituloContainer.querySelector("span");
    if (span) span.textContent = novoTexto;
  }
}

function abrirConversaEInfoContato(nomeContato) {
  if (!nomeContato) return;

  // PASSO 1: Fechar a gaveta do Histórico se aberta
  const dr = document.getElementById("wa-historico-drawer");
  if (dr) dr.classList.remove("aberto");

  // Fechar o painel lateral sequestrado clicando no botão Voltar nativo
  const btnVoltar =
    document
      .querySelector('span[data-icon="back-refreshed"]')
      ?.closest("button") ||
    document.querySelector('span[data-icon="back"]')?.closest("button") ||
    document.querySelector('span[data-icon="x-viewer"]')?.closest("button") ||
    document.querySelector('button[aria-label="Fechar"]');
  if (btnVoltar) btnVoltar.click();

  // PASSO 2: Aguardar o fechamento visual da gaveta lateral (400ms)
  setTimeout(() => {
    const searchInput =
      document.querySelector(
        'input[placeholder="Pesquisar ou começar uma nova conversa"]',
      ) ||
      document.querySelector(
        'input[aria-label="Pesquisar ou começar uma nova conversa"]',
      ) ||
      document.getElementById("_r_a_") ||
      document.querySelector('input[role="textbox"]');

    if (searchInput) {
      searchInput.focus();
      searchInput.select();

      // Inserir o nome do contato e disparar o evento input
      searchInput.value = nomeContato;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));

      // PASSO 3: Aguardar 1000ms para carregar os resultados da busca
      setTimeout(() => {
        const rows = document.querySelectorAll(
          '[data-testid="chat-list"] [role="row"], #pane-side [role="row"], [data-testid="cell-frame-container"]',
        );

        let targetResult = null;
        for (const row of rows) {
          if (row.querySelector('[data-testid="section-header"]')) {
            continue;
          }

          const titleEl =
            row.querySelector('[data-testid="cell-frame-title"] span[title]') ||
            row.querySelector('[data-testid="cell-frame-title"] span') ||
            row.querySelector('[data-testid="cell-frame-title"]') ||
            row.querySelector("span[title]");
          if (titleEl) {
            const nameInRow =
              titleEl.getAttribute("title") || titleEl.textContent.trim();

            if (
              nameInRow &&
              nameInRow.toLowerCase().includes(nomeContato.toLowerCase())
            ) {
              targetResult = row;
              break;
            }
          }
        }

        // Fallback: se não achar com exact match, pega o primeiro resultado
        if (!targetResult && rows.length > 0) {
          targetResult = Array.from(rows).find(
            (row) => !row.querySelector('[data-testid="section-header"]'),
          );
        }

        // PASSO 4: Simular o clique para abrir o chat
        if (targetResult) {
          const clickTarget =
            targetResult.querySelector('[role="gridcell"]') ||
            targetResult.querySelector('[data-testid^="chatlist-message-"]') ||
            targetResult;
          simularClique(clickTarget);

          // PASSO 5: Aguardar a conversa abrir (1000ms) e então clicar no header para abrir os dados do contato
          setTimeout(() => {
            const activeHeader = document.querySelector("#main header");
            if (activeHeader) {
              const headerClickTarget =
                activeHeader.querySelector('[role="button"]') ||
                activeHeader.querySelector(
                  '[data-testid="conversation-info-header"]',
                ) ||
                activeHeader.querySelector("span[title]") ||
                activeHeader;
              simularClique(headerClickTarget);
            } else {
              console.log(
                "[WAgenda] Cabeçalho da conversa ativa não encontrado.",
              );
            }
          }, 1000);
        } else {
          console.log(
            "[WAgenda] Contato não encontrado nos resultados da busca.",
          );
        }
      }, 1000);
    }
  }, 400);
}

function renderizarHistorico() {
  const container = document.getElementById("wa-historico-conteudo-lista");
  const contador = document.getElementById("wa-historico-contador");
  if (!container) return;

  chrome.storage.local.get({ historicoMensagens: [] }, (result) => {
    let lista = result.historicoMensagens || [];
    if (contador)
      contador.innerText = result.historicoMensagens
        ? result.historicoMensagens.length
        : 0;

    // Aplicar Filtro se ativo
    if (filtroAtivo) {
      if (filtroAtivo.tipo === "etiqueta") {
        lista = lista.filter((item) => item.etiqueta === filtroAtivo.valor);
      } else if (filtroAtivo.tipo === "agendador") {
        lista = lista.filter((item) => item.agendador === filtroAtivo.valor);
      }
    }

    if (lista.length === 0) {
      const msgVazia = filtroAtivo
        ? "Nenhuma mensagem corresponde ao filtro."
        : "Nenhuma mensagem enviada ainda.";
      container.innerHTML = `
        <div style="text-align: center; color: #8696a0; font-size: 13px; margin-top: 30px; margin-bottom: 30px;">
          ${msgVazia}
        </div>
      `;
      return;
    }

    // ORDENAÇÃO: Descendente (Mais recente primeiro no histórico)
    lista.sort((a, b) => b.enviadoEm - a.enviadoEm);

    let html = `
      <button class="wa-historico-limpar" id="wa-btn-limpar-historico">Limpar Histórico</button>
      <div id="wa-historico-lista-itens"></div>
    `;
    container.innerHTML = html;

    document
      .getElementById("wa-btn-limpar-historico")
      .addEventListener("click", () => {
        if (confirm("Deseja realmente limpar todo o histórico de envios?")) {
          chrome.storage.local.set({ historicoMensagens: [] }, () => {
            renderizarHistorico();
          });
        }
      });

    const itensContainer = document.getElementById("wa-historico-lista-itens");

    lista.forEach((item) => {
      const dataObjeto = new Date(item.enviadoEm || item.tempo);
      const dataFormatada =
        dataObjeto.toLocaleDateString("pt-BR") +
        " às " +
        dataObjeto.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

      const card = document.createElement("div");
      card.className = "sa-item wa-historico-item";

      const imgHtml =
        item.imagem && item.imagem.trim() !== ""
          ? `<img src="${item.imagem}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
          : svgNativo();

      const cor = item.etiquetaCor || "#00a884";
      const btnAdicionarHtml = `
        <button class="wa-btn-adicionar-etiqueta-card" data-id="${item.id}" data-type="historico" data-wa-tooltip="Adicionar etiqueta" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: var(--icon, #8696a0); transition: color 0.2s; vertical-align: middle; margin-left: 6px;">
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.25 12.69" width="16" height="16">
            <path d="M14.25,7.44l-3.28,4.62c-.27.38-.72.63-1.22.63H1.5c-.82-.01-1.5-.67-1.5-1.5V3.69c0-.82.68-1.49,1.5-1.49h2.84c.15-.01.3.03.44.12.34.23.43.7.2,1.04-.15.22-.39.33-.64.33H1.5v7.5h8.25l.99-1.4.61-.86.39-.55.53-.74.14-.2-.14-.2-.49-.69s-.03-.04-.04-.06c-.19-.25-.21-.6-.03-.87.24-.34.7-.44,1.04-.2.08.05.14.11.19.18h.01l1.3,1.84Z" fill="currentColor"/>
            <path d="M13.17,3.5c0,.2-.08.39-.22.53s-.32.22-.53.22h-2v2c0,.2-.08.39-.22.53s-.32.22-.53.22-.39-.09-.53-.22-.22-.32-.22-.53v-2h-1.99c-.21,0-.4-.09-.53-.22s-.22-.32-.22-.53.08-.39.22-.53.32-.22.53-.22h1.99V.75c0-.21.09-.39.22-.53s.32-.22.53-.22.4.08.53.22.22.32.22.53v2h2c.21,0,.39.08.53.22s.22.32.22.53Z" fill="currentColor"/>
          </svg>
        </button>
      `;

      const etiquetaHtml = item.etiqueta
        ? `<span class="wa-item-etiqueta-badge" title="Etiqueta"><svg viewBox="0 0 24 24" fill="none" style="color: ${cor};"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path></svg><strong>${item.etiqueta}</strong></span>`
        : btnAdicionarHtml;

      const agendadorHtml = item.agendador
        ? `<div style="font-size: 11px; color: var(--secondary, #8696a0); margin-top: 1px; display: flex; align-items: center; gap: 4px;">Agendado por: ${item.agendador} ${etiquetaHtml}</div>`
        : `<div style="font-size: 11px; margin-top: 1px; display: flex; align-items: center; gap: 4px;">${etiquetaHtml}</div>`;

      const anexoBadge = item.anexo
        ? `<span style="display: inline-flex; align-items: center; gap: 3px; color: var(--icon, #8696a0); margin-bottom: 2px; font-weight: 550; font-size: 10px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.anexo.nome}">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="flex-shrink: 0;"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9c0 1.66 1.34 3 3 3s3-1.34 3-3V5c0-2.21-1.79-4-4-4S8 2.79 8 5v12.5c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5V6h-1.5z"></path></svg>
            ${item.anexo.nome}
           </span>`
        : "";
      card.innerHTML = `
        <div class="sa-item-avatar">${imgHtml}</div>
        <div class="sa-item-content">
          <div class="sa-item-row">
            <div class="sa-item-nome">${item.nome}</div>
            <div class="sa-item-data" style="color: var(--WDS-content-external-link, #21c063); font-weight: 500;">Enviado</div>
          </div>
          <div class="sa-item-row" style="margin-top: 2px; align-items: flex-start;">
            <div class="sa-item-msg" style="display: flex; flex-direction: column; align-items: flex-start; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><div style="display: flex; flex-direction: column; width: 100%; overflow: hidden;">${anexoBadge}<span class="wa-msg-texto-puro" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; display: block;">${item.mensagem}</span></div></div>
            <div class="sa-item-del" data-id="${item.id}" style="align-self: center;">Excluir</div>
          </div>
          ${agendadorHtml}
          <div style="font-size: 11px; color: var(--secondary, #8696a0); margin-top: 1px; opacity: 0.8;">Enviado em: ${dataFormatada}</div>
        </div>
      `;

      card.addEventListener("click", () => {
        // PASSO 1: Fechar a gaveta do Histórico de Envios para não obstruir a tela
        const dr = document.getElementById("wa-historico-drawer");
        if (dr) dr.classList.remove("aberto");

        // PASSO 2: Ocultar/fechar o painel lateral sequestrado do WAgenda.
        const btnVoltar =
          document
            .querySelector('span[data-icon="back-refreshed"]')
            ?.closest("button") ||
          document.querySelector('span[data-icon="back"]')?.closest("button") ||
          document
            .querySelector('span[data-icon="x-viewer"]')
            ?.closest("button") ||
          document.querySelector('button[aria-label="Fechar"]');
        if (btnVoltar) btnVoltar.click();

        // PASSO 3: Buscar o input de pesquisa
        setTimeout(() => {
          const searchInput =
            document.querySelector(
              'input[placeholder="Pesquisar ou começar uma nova conversa"]',
            ) ||
            document.querySelector(
              'input[aria-label="Pesquisar ou começar uma nova conversa"]',
            ) ||
            document.getElementById("_r_a_") ||
            document.querySelector('input[role="textbox"]');

          if (searchInput) {
            searchInput.focus();
            searchInput.select();

            searchInput.value = item.mensagem;
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));

            setTimeout(() => {
              const rows = document.querySelectorAll(
                '[data-testid="chat-list"] [role="row"], #pane-side [role="row"], [data-testid="cell-frame-container"]',
              );

              let targetResult = null;
              for (const row of rows) {
                if (row.querySelector('[data-testid="section-header"]')) {
                  continue;
                }

                const titleEl =
                  row.querySelector(
                    '[data-testid="cell-frame-title"] span[title]',
                  ) ||
                  row.querySelector('[data-testid="cell-frame-title"] span') ||
                  row.querySelector('[data-testid="cell-frame-title"]') ||
                  row.querySelector("span[title]");
                if (titleEl) {
                  const nameInRow =
                    titleEl.getAttribute("title") || titleEl.textContent.trim();

                  if (
                    nameInRow &&
                    nameInRow.toLowerCase().includes(item.nome.toLowerCase())
                  ) {
                    targetResult = row;
                    break;
                  }
                }
              }

              if (!targetResult && rows.length > 0) {
                targetResult = Array.from(rows).find(
                  (row) => !row.querySelector('[data-testid="section-header"]'),
                );
              }

              if (targetResult) {
                const clickTarget =
                  targetResult.querySelector('[role="gridcell"]') ||
                  targetResult.querySelector(
                    '[data-testid^="chatlist-message-"]',
                  ) ||
                  targetResult;
                simularClique(clickTarget);
              } else {
                console.log("[WAgenda] Nenhum resultado de busca encontrado.");
              }
            }, 1000);
          }
        }, 400);
      });

      const btnAddEtiqueta = card.querySelector(
        ".wa-btn-adicionar-etiqueta-card",
      );
      if (btnAddEtiqueta) {
        btnAddEtiqueta.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          abrirPopoverAdicionarEtiqueta(btnAddEtiqueta, item.id, "historico");
        });
      }

      card.querySelector(".sa-item-del").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        chrome.storage.local.get({ historicoMensagens: [] }, (res) => {
          const nova = (res.historicoMensagens || []).filter(
            (i) => i.id !== id,
          );
          chrome.storage.local.set({ historicoMensagens: nova }, () => {
            renderizarHistorico();
          });
        });
      });

      itensContainer.appendChild(card);
    });
  });
}

function renderizarLista() {
  const container = document.getElementById("wa-lista-agendamentos");
  if (!container) return;
  container.innerHTML = "";
  chrome.storage.local.get({ mensagensPendentes: [] }, (result) => {
    let lista = result.mensagensPendentes || [];

    // Aplicar Filtro se ativo
    if (filtroAtivo) {
      if (filtroAtivo.tipo === "etiqueta") {
        lista = lista.filter((item) => item.etiqueta === filtroAtivo.valor);
      } else if (filtroAtivo.tipo === "agendador") {
        lista = lista.filter((item) => item.agendador === filtroAtivo.valor);
      }
    }

    if (lista.length === 0) {
      const msgVazia = filtroAtivo
        ? "Nenhuma mensagem corresponde ao filtro."
        : "Nenhuma mensagem na fila.";
      container.innerHTML = `<div style="text-align: center; color: #8696a0; font-size: 13px; margin-top: 20px;">${msgVazia}</div>`;
      return;
    }
    // ORDENAÇÃO: Ascendente (Antigo -> Novo)
    lista.sort((a, b) => a.tempo - b.tempo);
    lista.forEach((item) => {
      const dataObjeto = new Date(item.tempo);
      const dataFormatada =
        dataObjeto.toLocaleDateString("pt-BR") +
        " às " +
        dataObjeto.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      const card = document.createElement("div");
      card.className = "sa-item";

      const imgHtml =
        item.imagem && item.imagem.trim() !== ""
          ? `<img src="${item.imagem}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
          : svgNativo();
      const cor = item.etiquetaCor || "#00a884";
      const btnAdicionarHtml = `
        <button class="wa-btn-adicionar-etiqueta-card" data-id="${item.id}" data-type="agendado" data-wa-tooltip="Adicionar etiqueta" style="background: none; border: none; padding: 0; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: var(--icon, #8696a0); transition: color 0.2s; vertical-align: middle; margin-left: 6px;">
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.25 12.69" width="16" height="16">
            <path d="M14.25,7.44l-3.28,4.62c-.27.38-.72.63-1.22.63H1.5c-.82-.01-1.5-.67-1.5-1.5V3.69c0-.82.68-1.49,1.5-1.49h2.84c.15-.01.3.03.44.12.34.23.43.7.2,1.04-.15.22-.39.33-.64.33H1.5v7.5h8.25l.99-1.4.61-.86.39-.55.53-.74.14-.2-.14-.2-.49-.69s-.03-.04-.04-.06c-.19-.25-.21-.6-.03-.87.24-.34.7-.44,1.04-.2.08.05.14.11.19.18h.01l1.3,1.84Z" fill="currentColor"/>
            <path d="M13.17,3.5c0,.2-.08.39-.22.53s-.32.22-.53.22h-2v2c0,.2-.08.39-.22.53s-.32.22-.53.22-.39-.09-.53-.22-.22-.32-.22-.53v-2h-1.99c-.21,0-.4-.09-.53-.22s-.22-.32-.22-.53.08-.39.22-.53.32-.22.53-.22h1.99V.75c0-.21.09-.39.22-.53s.32-.22.53-.22.4.08.53.22.22.32.22.53v2h2c.21,0,.39.08.53.22s.22.32.22.53Z" fill="currentColor"/>
          </svg>
        </button>
      `;

      const etiquetaHtml = item.etiqueta
        ? `<span class="wa-item-etiqueta-badge" title="Etiqueta"><svg viewBox="0 0 24 24" fill="none" style="color: ${cor};"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path></svg><strong>${item.etiqueta}</strong></span>`
        : btnAdicionarHtml;

      const agendadorHtml = item.agendador
        ? `<div style="font-size: 11px; color: var(--WDS-accent-emphasized, #d9fdd3); margin-top: 1px; display: flex; align-items: center; gap: 4px;">Agendado por: ${item.agendador} ${etiquetaHtml}</div>`
        : `<div style="font-size: 11px; margin-top: 1px; display: flex; align-items: center; gap: 4px;">${etiquetaHtml}</div>`;

      const criadoEmHtml = item.criadoEm
        ? `<div style="font-size: 11px; color: var(--WDS-content-external-link, #21c063); margin-top: 1px; opacity: 0.85;">${new Date(item.criadoEm).toLocaleDateString("pt-BR")} às ${new Date(item.criadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>`
        : "";
      const anexoBadge = item.anexo
        ? `<span style="display: inline-flex; align-items: center; gap: 3px; color: var(--icon, #8696a0); margin-bottom: 2px; font-weight: 550; font-size: 10px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.anexo.nome}">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="flex-shrink: 0;"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9c0 1.66 1.34 3 3 3s3-1.34 3-3V5c0-2.21-1.79-4-4-4S8 2.79 8 5v12.5c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5V6h-1.5z"></path></svg>
            ${item.anexo.nome}
           </span>`
        : "";
      card.innerHTML = `<div class="sa-item-avatar">${imgHtml}</div><div class="sa-item-content"><div class="sa-item-row"><div class="sa-item-nome">${item.nome}</div><div class="sa-item-data">${dataFormatada}</div></div><div class="sa-item-row" style="margin-top: 2px; align-items: flex-start;"><div class="sa-item-msg" style="display: flex; flex-direction: column; align-items: flex-start; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><div style="display: flex; flex-direction: column; width: 100%; overflow: hidden;">${anexoBadge}<span class="wa-msg-texto-puro" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; display: block;">${item.mensagem}</span></div></div><div class="sa-item-edit" data-id="${item.id}" style="align-self: center;">Editar</div><div class="sa-item-del" data-id="${item.id}" style="align-self: center;">Excluir</div></div>${agendadorHtml}${criadoEmHtml}</div>`;

      card.querySelector(".sa-item-edit").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        abrirModalEdicaoAgendamento(id);
      });

      card.querySelector(".sa-item-del").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        chrome.runtime.sendMessage(
          { action: "cancelar_agendamento", id: id },
          () => {
            chrome.storage.local.get({ mensagensPendentes: [] }, (res) => {
              const nova = res.mensagensPendentes.filter((i) => i.id !== id);
              chrome.storage.local.set({ mensagensPendentes: nova }, () => {
                renderizarLista();
                atualizarContadorBadge();
              });
            });
          },
        );
      });

      const btnAddEtiqueta = card.querySelector(
        ".wa-btn-adicionar-etiqueta-card",
      );
      if (btnAddEtiqueta) {
        btnAddEtiqueta.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          abrirPopoverAdicionarEtiqueta(btnAddEtiqueta, item.id, "agendado");
        });
      }

      card.addEventListener("click", () => {
        abrirConversaEInfoContato(item.nome);
      });
      container.appendChild(card);
    });
  });
}

function atualizarContatosSelecionadosModal() {
  const container = document.getElementById(
    "wa-contatos-selecionados-container",
  );
  if (!container) return;
  container.innerHTML = "";

  if (contatosSelecionados.length === 0) {
    container.innerHTML = `<div style="color: #8696a0; font-size: 13px; font-style: italic; padding: 4px 0;">Nenhum contato selecionado. Adicione clicando no botão abaixo.</div>`;
    const salvarBtn = document.getElementById("wa-salvar-btn");
    if (salvarBtn) {
      salvarBtn.disabled = true;
      salvarBtn.style.opacity = "0.5";
      salvarBtn.style.cursor = "not-allowed";
    }
    return;
  }

  const salvarBtn = document.getElementById("wa-salvar-btn");
  if (salvarBtn) {
    salvarBtn.disabled = false;
    salvarBtn.style.opacity = "1";
    salvarBtn.style.cursor = "pointer";
  }

  contatosSelecionados.forEach((contato, index) => {
    const item = document.createElement("div");
    item.className = "wa-contato-selecionado-item";

    const imgHtml =
      contato.imagem && contato.imagem.trim() !== ""
        ? `<img src="${contato.imagem}">`
        : svgNativo();

    item.innerHTML = `
      <div class="wa-contato-selecionado-info">
        <div class="wa-contato-selecionado-avatar">${imgHtml}</div>
        <div class="wa-contato-selecionado-nome" title="${contato.nome}">${contato.nome}</div>
      </div>
      <button type="button" class="wa-contato-selecionado-remover" data-index="${index}" title="Remover contato">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      </button>
    `;

    item
      .querySelector(".wa-contato-selecionado-remover")
      .addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-index"));
        contatosSelecionados.splice(idx, 1);
        atualizarContatosSelecionadosModal();
      });

    container.appendChild(item);
  });
}

function resetarModalEstado() {
  editingMessageId = null;
  const overlay = document.getElementById("wa-modal-overlay");
  if (overlay) {
    const titleEl = overlay.querySelector("h2");
    if (titleEl) titleEl.textContent = "Agendar Envio";
  }
  const salvarBtn = document.getElementById("wa-salvar-btn");
  if (salvarBtn) {
    salvarBtn.textContent = "Confirmar Agendamento";
    salvarBtn.setAttribute("data-wa-tooltip", "Confirmar Agendamento");
  }
  const btnAddContato = document.getElementById("wa-btn-adicionar-contato");
  if (btnAddContato) {
    btnAddContato.style.display = "";
  }
}

function abrirModalAgendamento() {
  resetarModalEstado();
  document.getElementById("wa-modal-overlay").style.display = "flex";

  const msgInput = document.getElementById("wa-modal-msg");
  if (tempMsgText && msgInput) {
    msgInput.value = tempMsgText;
    msgInput.dispatchEvent(new Event("input"));
  }

  const dateInput = document.getElementById("wa-modal-data");
  if (tempScheduleDate && dateInput) {
    dateInput.value = tempScheduleDate;
  }

  const hiddenEtiqueta = document.getElementById("wa-modal-etiqueta-valor");
  const hiddenCor = document.getElementById("wa-modal-etiqueta-cor-valor");
  if (hiddenEtiqueta) hiddenEtiqueta.value = "";
  if (hiddenCor) hiddenCor.value = "";

  const criador = document.getElementById("wa-modal-criador-etiqueta");
  if (criador) criador.style.display = "none";

  atualizarContatosSelecionadosModal();
  atualizarListaEtiquetasExistentes();
}

function abrirModalEdicaoAgendamento(id) {
  chrome.storage.local.get({ mensagensPendentes: [] }, (res) => {
    const pendentes = res.mensagensPendentes || [];
    const item = pendentes.find((i) => String(i.id) === String(id));
    if (!item) return;

    editingMessageId = item.id;

    contatosSelecionados = [{ nome: item.nome, imagem: item.imagem || "" }];

    tempMsgText = item.mensagem || "";

    const dateObj = new Date(item.tempo);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    tempScheduleDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    tempAnexo = item.anexo || null;

    const overlay = document.getElementById("wa-modal-overlay");
    if (overlay) {
      overlay.style.display = "flex";

      const titleEl = overlay.querySelector("h2");
      if (titleEl) titleEl.textContent = "Editar Mensagem Agendada";

      const salvarBtn = document.getElementById("wa-salvar-btn");
      if (salvarBtn) {
        salvarBtn.textContent = "Salvar Edição";
        salvarBtn.setAttribute("data-wa-tooltip", "Salvar alterações na mensagem agendada");
      }

      const agendadorInput = document.getElementById("wa-modal-agendador");
      if (agendadorInput) agendadorInput.value = item.agendador || "";

      const msgInput = document.getElementById("wa-modal-msg");
      if (msgInput) {
        msgInput.value = item.mensagem || "";
        msgInput.dispatchEvent(new Event("input"));
        msgInput.style.height = "auto";
        msgInput.style.height = msgInput.scrollHeight + "px";
      }

      const dateInput = document.getElementById("wa-modal-data");
      if (dateInput) dateInput.value = tempScheduleDate;

      const hiddenEtiqueta = document.getElementById("wa-modal-etiqueta-valor");
      const hiddenCor = document.getElementById("wa-modal-etiqueta-cor-valor");
      if (hiddenEtiqueta) hiddenEtiqueta.value = item.etiqueta || "";
      if (hiddenCor) hiddenCor.value = item.etiquetaCor || "";

      const preview = document.getElementById("wa-modal-anexo-preview");
      const nomeEl = document.getElementById("wa-modal-anexo-nome");
      const iconEl = preview ? preview.querySelector(".wa-attachment-icon") : null;
      if (tempAnexo && preview && nomeEl && iconEl) {
        nomeEl.textContent = tempAnexo.nome;
        if (tempAnexo.tipo && tempAnexo.tipo.startsWith("image/")) {
          iconEl.innerHTML = `<img src="${tempAnexo.base64}" style="width: 24px; height: 24px; object-fit: cover; border-radius: 4px;">`;
        } else {
          iconEl.innerHTML = `<svg viewBox="0 0 24 24" height="24" width="24" fill="#8696a0"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>`;
        }
        preview.style.display = "flex";
      } else if (preview) {
        preview.style.display = "none";
      }

      atualizarContatosSelecionadosModal();
      atualizarListaEtiquetasExistentes();

      if (item.etiqueta) {
        setTimeout(() => {
          const container = document.getElementById("wa-modal-etiquetas-existentes");
          if (container) {
            container.querySelectorAll(".wa-modal-etiqueta-pill-click").forEach((pill) => {
              if (pill.textContent.trim().includes(item.etiqueta)) {
                pill.classList.add("selecionada");
                pill.style.outline = `2px solid ${item.etiquetaCor || "#00a884"}`;
                pill.style.outlineOffset = "1.5px";
              }
            });
          }
        }, 50);
      }
    }
  });
}

function injetarModalEstilos() {
  const emojiSectionsHtml = Object.keys(EMOJI_CATEGORIES)
    .map((catKey) => {
      const cat = EMOJI_CATEGORIES[catKey];
      const itemsHtml = cat.emojis
        .map((emoji) => {
          const tags = EMOJI_NAMES[emoji] || "";
          return `<div class="wa-emoji-item" data-emoji="${emoji}" title="${tags}">${emoji}</div>`;
        })
        .join("");
      return `
      <div class="wa-emoji-category-section" id="wa-emoji-cat-${catKey}">
        <div class="wa-emoji-category-header">${cat.name}</div>
        <div class="wa-emoji-category-grid-inner">
          ${itemsHtml}
        </div>
      </div>
    `;
    })
    .join("");

  let emojiTabsHtml = `<div class="wa-emoji-tab" data-target="recent" title="Recentes" style="display: none;">${CATEGORY_SVGS.recent}</div>`;
  emojiTabsHtml += Object.keys(EMOJI_CATEGORIES)
    .map((catKey) => {
      const cat = EMOJI_CATEGORIES[catKey];
      const svg = CATEGORY_SVGS[catKey] || cat.icon;
      return `<div class="wa-emoji-tab" data-target="${catKey}" title="${cat.name}">${svg}</div>`;
    })
    .join("");

  const expressionsSelectorBarHtml = `
    <div class="wa-expressions-selector-bar">
      <div class="wa-expression-selector-tab active" title="Emojis">
        <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z"></path><path d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z"></path></svg>
      </div>
      <div class="wa-expression-selector-tab disabled" title="GIFs (Desativado)">
        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none"><title>gif-refreshed-new</title><path d="M4 18q-.824 0-1.412-.587A1.93 1.93 0 0 1 2 16V8q0-.824.587-1.412A1.93 1.93 0 0 1 4 6h5a1 1 0 0 1 0 2H4v8h4v-3H7a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1v4q0 .824-.588 1.413A1.93 1.93 0 0 1 8 18zm9 0a1 1 0 0 1-1-1V7a1 1 0 1 1 2 0v10a1 1 0 0 1-1 1m4 0a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-4v3h3a1 1 0 1 1 0 2h-3v4a1 1 0 0 1-1 1" fill="currentColor"></path></svg>
      </div>
      <div class="wa-expression-selector-tab disabled" title="Figurinhas (Desativado)">
        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none"><title>wds-ic-sticker</title><path fill="currentColor" fill-rule="evenodd" d="M12 22a6.97 6.97 0 0 0 4.82-2.02l3.03-3A7.27 7.27 0 0 0 22 11.8V9.27A7.27 7.27 0 0 0 14.73 2H9.27A7.27 7.27 0 0 0 2 9.27v5.46A7.27 7.27 0 0 0 9.27 22H12ZM9.27 4h5.46A5.27 5.27 0 0 1 20 9.08h-.01v2.04c0 .5-.4.91-.9.91h-2.27A4.81 4.81 0 0 0 12 16.85l.02 2.26a.9.9 0 0 1-.68.88H9.27A5.27 5.27 0 0 1 4 14.73V9.27A5.27 5.27 0 0 1 9.27 4Zm4.7 15.55c.03-.14.04-.29.04-.44l-.02-2.26a2.8 2.8 0 0 1 2.82-2.83l2.26.01c.16 0 .3-.01.46-.03-.26.57-.63 1.1-1.09 1.56l-3.03 3c-.42.42-.9.75-1.44 1Z" clip-rule="evenodd"></path></svg>
      </div>
    </div>
  `;

  const overlay = document.createElement("div");
  overlay.id = "wa-modal-overlay";
  overlay.innerHTML = `
    <div class="wa-modal">
      <span class="wa-close" id="wa-fechar-modal" data-wa-tooltip="Fechar">✖</span>
      <h2>Agendar Envio</h2>
      <label>Destinatário(s):</label>
      <div id="wa-contatos-selecionados-container"></div>
      <button type="button" class="wa-btn-adicionar-contato" id="wa-btn-adicionar-contato">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Adicionar Contato
      </button>
      <label>Agendado por:</label>
      <input type="text" id="wa-modal-agendador" placeholder="Digite seu nome">
      <label>Data e Hora:</label>
      <div class="wa-modal-data-container" style="position: relative; display: flex; align-items: center; width: 100%;">
        <input type="datetime-local" id="wa-modal-data" style="width: 100%; padding-right: 40px; box-sizing: border-box;">
        <span class="wa-calendar-icon-wrapper" style="position: absolute; right: 12px; pointer-events: none; display: flex; align-items: center; justify-content: center; z-index: 1; color: var(--icon, #8696a0); transition: color 0.2s;">
          <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path fill="currentColor" d="M17.25 23.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 17.462a2 2 0 112 2V20.5"/>
            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M5 8a2 2 0 012-2h18a2 2 0 012 2v18a2 2 0 01-2 2H7a2 2 0 01-2-2V8z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h22M21 8V4M11 8V4"/>
          </svg>
        </span>
      </div>
      <label>Etiqueta (opcional):</label>
      <div class="wa-modal-etiquetas-container" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
        <div id="wa-modal-etiquetas-existentes" style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
          <button type="button" id="wa-modal-btn-nova-etiqueta" data-wa-tooltip="Criar Nova Etiqueta" style="background: none; border: 1px dashed var(--WDS-persistent-always-branded, #00a884); color: var(--WDS-persistent-always-branded, #00a884); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; outline: none; transition: background-color 0.2s;">
            <span>+</span> Nova
          </button>
        </div>
        <div id="wa-modal-criador-etiqueta" class="wa-modal-nova-etiqueta-wrapper" style="display: none; align-items: center; gap: 12px; margin-top: 8px; padding: 10px 0; box-sizing: border-box; width: 100%;">
          <span id="wa-modal-etiqueta-preview" style="display: none !important;"></span>
          
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <input type="color" id="wa-modal-etiqueta-cor-picker" value="#00a884" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: none; padding: 0; z-index: 2;">
            <label for="wa-modal-etiqueta-cor-picker" id="wa-modal-etiqueta-cor-trigger" data-wa-tooltip="Escolher Cor" style="width: 100%; height: 100%; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1; background-color: rgba(0, 168, 132, 0.2); transition: background-color 0.2s;">
              <span data-testid="label-filled" aria-hidden="true" data-icon="label-filled" style="color: rgb(0, 168, 132); display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                  <title>label-filled</title>
                  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M15.393 5C16.314 5 17.167 5.447 17.685 6.182L21.812 12L21.346 12.657L17.686 17.816C17.166 18.553 16.314 19 15.393 19L5.81 18.992C4.262 18.992 3 17.738 3 16.19V7.81C3 6.261 4.262 5.008 5.809 5.008L15.393 5Z"></path>
                </svg>
              </span>
            </label>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 12px; color: var(--secondary, #8696a0); font-weight: 500;">Etiqueta</span>
            <div style="display: flex; align-items: center; gap: 6px; width: 100%;">
              <input type="text" id="wa-modal-etiqueta-input-escrita" placeholder="Nome da etiqueta..." style="flex: 1;">
              <button type="button" id="wa-modal-etiqueta-btn-emoji" data-wa-tooltip="Inserir Emoji" style="background: none; border: none; padding: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--icon, #8696a0); outline: none; transition: color 0.2s; flex-shrink: 0; margin-bottom: 2px;">
                <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor">
                  <path d="M12 22c5.522 0 10-4.477 10-10S17.522 2 12 2 2 6.477 2 12s4.478 10 10 10zm0-2a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3.5-9c.828 0 1.5-.672 1.5-1.5S9.328 8 8.5 8 7 8.672 7 9.5s.672 1.5 1.5 1.5zm7 0c.828 0 1.5-.672 1.5-1.5S15.328 8 14.5 8s-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.4 5.08-3.36h-10.16c.77 1.96 2.75 3.36 5.08 3.36z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <input type="hidden" id="wa-modal-etiqueta-valor" value="">
      <input type="hidden" id="wa-modal-etiqueta-cor-valor" value="">
      
      <div id="wa-emoji-picker">
        <div class="wa-emoji-tabs">
          ${emojiTabsHtml}
        </div>
        <div class="wa-emoji-search-wrapper">
          <div class="wa-emoji-search-container">
            <span class="wa-emoji-search-icon">
              <svg viewBox="0 0 24 24" height="18" width="18" fill="currentColor"><path d="M15.009 13.805h-.636l-.226-.217a5.216 5.216 0 0 0 1.265-3.41 5.234 5.234 0 1 0-5.234 5.233 5.216 5.216 0 0 0 3.41-1.265l.217.227v.635l4.022 4.01 1.2-1.2-4.022-4.023zm-4.831 0a3.626 3.626 0 1 1 0-7.253 3.626 3.626 0 0 1 0 7.253z"></path></svg>
            </span>
            <input type="text" class="wa-emoji-search" placeholder="Pesquisar emoji">
          </div>
        </div>
        <div class="wa-emoji-grid">
          <div class="wa-emoji-category-section" id="wa-emoji-cat-recent" style="display: none;">
            <div class="wa-emoji-category-header">Recentes</div>
            <div class="wa-emoji-category-grid-inner"></div>
          </div>
          ${emojiSectionsHtml}
        </div>
        ${expressionsSelectorBarHtml}
      </div>

      <label>Mensagem:</label>
      <div id="wa-modal-anexo-preview" class="wa-attachment-preview-container" style="display: none; align-items: center; padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px; color: var(--primary, #e9edef); font-size: 13px;">
          <span class="wa-attachment-icon" style="display: flex; align-items: center; justify-content: center;"></span>
          <span id="wa-modal-anexo-nome" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
        </div>
        <button type="button" id="wa-modal-anexo-remover" style="background: none; border: none; color: #8696a0; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;">
          <svg viewBox="0 0 24 24" height="18" width="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
        </button>
      </div>
      <div class="wa-modal-compose-bar">
        <input type="file" id="wa-modal-anexo-input" style="display: none;">
        <button type="button" class="wa-compose-btn" id="wa-modal-btn-anexar" title="Anexar">
          <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M11 13H5.5C4.94772 13 4.5 12.5523 4.5 12C4.5 11.4477 4.94772 11 5.5 11H11V5.5C11 4.94772 11.4477 4.5 12 4.5C12.5523 4.5 13 4.94772 13 5.5V11H18.5C19.0523 11 19.5 11.4477 19.5 12C19.5 12.5523 19.0523 13 18.5 13H13V18.5C13 19.0523 12.5523 19.5 12 19.5C11.4477 19.5 11 19.0523 11 18.5V13Z"></path></svg>
        </button>
        <button type="button" class="wa-compose-btn wa-btn-emoji-trigger" data-wa-tooltip="Emojis">
          <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z"></path><path d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z"></path></svg>
        </button>
        <div class="wa-compose-input-wrapper">
          <textarea id="wa-modal-msg" rows="1" placeholder="Digite uma mensagem" autocomplete="off" spellcheck="true"></textarea>
        </div>
        <button type="button" class="wa-compose-btn" title="Mensagem de voz">
          <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M12 14C11.1667 14 10.4583 13.7083 9.875 13.125C9.29167 12.5417 9 11.8333 9 11V5C9 4.16667 9.29167 3.45833 9.875 2.875C10.4583 2.29167 11.1667 2 12 2C12.8333 2 13.5417 2.29167 14.125 2.875C14.7083 3.45833 15 4.16667 15 5V11C15 11.8333 14.7083 12.5417 14.125 13.125C13.5417 13.7083 12.8333 14 12 14ZM12 21C11.4477 21 11 20.5523 11 20V17.925C9.26667 17.6917 7.83333 16.9167 6.7 15.6C5.78727 14.5396 5.24207 13.3387 5.06441 11.9973C4.9919 11.4498 5.44772 11 6 11C6.55228 11 6.98782 11.4518 7.0905 11.9945C7.27271 12.9574 7.73004 13.805 8.4625 14.5375C9.4375 15.5125 10.6167 16 12 16C13.3833 16 14.5625 15.5125 15.5375 14.5375C16.27 13.805 16.7273 12.9574 16.9095 11.9945C17.0122 11.4518 17.4477 11 18 11C18.5523 11 19.0081 11.4498 18.9356 11.9973C18.7579 13.3387 18.2127 14.5396 17.3 15.6C16.1667 16.9167 14.7333 17.6917 13 17.925V20C13 20.5523 12.5523 21 12 21ZM12 12C12.2833 12 12.5208 11.9042 12.7125 11.7125C12.9042 11.5208 13 11.2833 13 11V5C13 4.71667 12.9042 4.47917 12.7125 4.2875C12.5208 4.09583 12.2833 4 12 4C11.7167 4 11.4792 4.09583 11.2875 4.2875C11.0958 4.47917 11 4.71667 11 5V11C11 11.2833 11.0958 11.5208 11.2875 11.7125C11.4792 11.9042 11.7167 12 12 12Z"></path></svg></button>
      </div>
      <button class="wa-btn" id="wa-salvar-btn" data-wa-tooltip="Confirmar Agendamento">Confirmar Agendamento</button>
    </div>
  `;
  document.body.appendChild(overlay);

  inicializarEventosEtiquetasModal();

  // Inicializa Eventos de Anexo
  const anexoInput = document.getElementById("wa-modal-anexo-input");
  const btnAnexar = document.getElementById("wa-modal-btn-anexar");
  if (btnAnexar && anexoInput) {
    btnAnexar.addEventListener("click", () => {
      anexoInput.click();
    });
    anexoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 4 * 1024 * 1024) {
        alert("O tamanho do arquivo deve ser de no máximo 4MB.");
        anexoInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        tempAnexo = {
          nome: file.name,
          tipo: file.type,
          base64: event.target.result,
        };

        const preview = document.getElementById("wa-modal-anexo-preview");
        const nomeEl = document.getElementById("wa-modal-anexo-nome");
        const iconEl = preview.querySelector(".wa-attachment-icon");

        nomeEl.textContent = file.name;

        if (file.type.startsWith("image/")) {
          iconEl.innerHTML = `<img src="${event.target.result}" style="width: 24px; height: 24px; object-fit: cover; border-radius: 4px;">`;
        } else {
          iconEl.innerHTML = `<svg viewBox="0 0 24 24" height="24" width="24" fill="#8696a0"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>`;
        }

        preview.style.display = "flex";
      };
      reader.readAsDataURL(file);
    });
  }

  const btnRemoverAnexo = document.getElementById("wa-modal-anexo-remover");
  if (btnRemoverAnexo) {
    btnRemoverAnexo.addEventListener("click", () => {
      tempAnexo = null;
      if (anexoInput) anexoInput.value = "";
      document.getElementById("wa-modal-anexo-preview").style.display = "none";
    });
  }

  // Funcionalidade de Emojis Recentes
  function renderRecentEmojis() {
    chrome.storage.local.get({ waRecentEmojis: [] }, (res) => {
      const recents = res.waRecentEmojis || [];
      const section = document.getElementById("wa-emoji-cat-recent");
      const tabButton = overlay.querySelector(
        '.wa-emoji-tab[data-target="recent"]',
      );
      if (!section) return;
      if (recents.length === 0) {
        section.style.display = "none";
        if (tabButton) tabButton.style.display = "none";
      } else {
        section.style.display = "block";
        if (tabButton) tabButton.style.display = "flex";
        const gridInner = section.querySelector(
          ".wa-emoji-category-grid-inner",
        );
        gridInner.innerHTML = recents
          .map((emoji) => {
            const tags = EMOJI_NAMES[emoji] || "";
            return `<div class="wa-emoji-item" data-emoji="${emoji}" title="${tags}">${emoji}</div>`;
          })
          .join("");
      }
    });
  }

  function saveRecentEmoji(emoji) {
    chrome.storage.local.get({ waRecentEmojis: [] }, (res) => {
      let recents = res.waRecentEmojis || [];
      recents = recents.filter((e) => e !== emoji);
      recents.unshift(emoji);
      recents = recents.slice(0, 24); // Limita a 24 emojis (3 linhas de 8)
      chrome.storage.local.set({ waRecentEmojis: recents }, () => {
        renderRecentEmojis();
      });
    });
  }

  // Prepara os recentes ao carregar
  renderRecentEmojis();

  // Auto-resize do Textarea similar ao WhatsApp compose box
  const modalMsg = overlay.querySelector("#wa-modal-msg");
  modalMsg.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // ---- Listener para Respostas Rápidas (/) ----
  modalMsg.addEventListener("input", () => {
    const val = modalMsg.value;
    const cursor = modalMsg.selectionStart;

    // Busca um '/' antes do cursor que inicie a sequência de atalho
    let i = cursor - 1;
    let found = false;
    while (i >= 0) {
      if (val[i] === "/") {
        const antes = i > 0 ? val[i - 1] : "\n";
        if (antes === "\n" || antes === " " || i === 0) {
          found = true;
          break;
        } else {
          break;
        }
      }
      if (val[i] === " " || val[i] === "\n") break;
      i--;
    }

    if (found) {
      const filtro = val.substring(i + 1, cursor);
      mostrarPopoverRR(filtro);
    } else {
      fecharPopoverRR();
    }
  });

  modalMsg.addEventListener("keydown", (e) => {
    const pop = document.getElementById("wa-rr-popover");
    if (!pop) return;

    if (e.key === "Escape") {
      e.preventDefault();
      fecharPopoverRR();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (rrIndiceAtivo >= 0 && rrItensAtuais.length > 0) {
        selecionarRespostaRapida(rrItensAtuais[rrIndiceAtivo].mensagem);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (rrItensAtuais.length > 0) {
        rrIndiceAtivo = (rrIndiceAtivo + 1) % rrItensAtuais.length;
        atualizarDestaquePorOverRR();
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (rrItensAtuais.length > 0) {
        rrIndiceAtivo =
          (rrIndiceAtivo - 1 + rrItensAtuais.length) % rrItensAtuais.length;
        atualizarDestaquePorOverRR();
      }
      return;
    }
  });

  const emojiTrigger = overlay.querySelector(".wa-btn-emoji-trigger");
  const emojiPicker = overlay.querySelector("#wa-emoji-picker");
  const emojiSearch = overlay.querySelector(".wa-emoji-search");
  const emojiGrid = overlay.querySelector(".wa-emoji-grid");
  const emojiTabs = overlay.querySelectorAll(".wa-emoji-tab");

  // Rastreamento de qual input deve receber o emoji inserido
  let emojiTargetInput = modalMsg;

  // Navegação ao clicar nos tabs
  emojiTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetKey = tab.getAttribute("data-target");
      const section = emojiGrid.querySelector(`#wa-emoji-cat-${targetKey}`);
      if (section) {
        emojiTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Destaque dinâmico dos tabs ao rolar o grid
  emojiGrid.addEventListener("scroll", () => {
    const sections = emojiGrid.querySelectorAll(".wa-emoji-category-section");
    let activeCat = null;
    const gridTop = emojiGrid.getBoundingClientRect().top;

    sections.forEach((section) => {
      if (section.style.display !== "none") {
        const rect = section.getBoundingClientRect();
        if (rect.top - gridTop <= 50) {
          activeCat = section.id.replace("wa-emoji-cat-", "");
        }
      }
    });

    if (activeCat) {
      emojiTabs.forEach((tab) => {
        if (tab.getAttribute("data-target") === activeCat) {
          tab.classList.add("active");
          tab.scrollIntoView({
            behavior: "auto",
            block: "nearest",
            inline: "nearest",
          });
        } else {
          tab.classList.remove("active");
        }
      });
    }
  });

  emojiTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    emojiTargetInput = modalMsg;
    const isVisible = emojiPicker.style.display === "flex";
    emojiPicker.style.display = isVisible ? "none" : "flex";
    if (!isVisible) {
      emojiSearch.value = "";
      const headers = emojiGrid.querySelectorAll(".wa-emoji-category-header");
      const items = emojiGrid.querySelectorAll(".wa-emoji-item");
      const sections = emojiGrid.querySelectorAll(".wa-emoji-category-section");
      headers.forEach((h) => (h.style.display = "block"));
      items.forEach((item) => (item.style.display = "block"));
      sections.forEach((s) => (s.style.display = "block"));
      emojiTabs.forEach((t) => t.classList.remove("active"));

      const firstTab = Array.from(emojiTabs).find(
        (t) => t.style.display !== "none",
      );
      if (firstTab) firstTab.classList.add("active");

      emojiSearch.focus();
      renderRecentEmojis();
    }
  });

  // Gatilho do Emoji para a Etiqueta
  const labelEmojiTrigger = overlay.querySelector(
    "#wa-modal-etiqueta-btn-emoji",
  );
  const labelInputEscrita =
    overlay.querySelector("#wa-modal-etiqueta-input-focus") ||
    overlay.querySelector("#wa-modal-etiqueta-input-escrita");

  if (labelEmojiTrigger && labelInputEscrita) {
    labelEmojiTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      emojiTargetInput = labelInputEscrita;
      const isVisible = emojiPicker.style.display === "flex";
      emojiPicker.style.display = isVisible ? "none" : "flex";
      if (!isVisible) {
        emojiSearch.value = "";
        const headers = emojiGrid.querySelectorAll(".wa-emoji-category-header");
        const items = emojiGrid.querySelectorAll(".wa-emoji-item");
        const sections = emojiGrid.querySelectorAll(
          ".wa-emoji-category-section",
        );
        headers.forEach((h) => (h.style.display = "block"));
        items.forEach((item) => (item.style.display = "block"));
        sections.forEach((s) => (s.style.display = "block"));
        emojiTabs.forEach((t) => t.classList.remove("active"));

        const firstTab = Array.from(emojiTabs).find(
          (t) => t.style.display !== "none",
        );
        if (firstTab) firstTab.classList.add("active");

        emojiSearch.focus();
        renderRecentEmojis();
      }
    });
  }

  // Clique nos emojis para inserir no campo ativo mantendo a posição do cursor
  emojiGrid.addEventListener("click", (e) => {
    const item = e.target.closest(".wa-emoji-item");
    if (item) {
      const emoji = item.getAttribute("data-emoji");
      const target =
        (emojiPicker && emojiPicker._rrTarget) || emojiTargetInput || modalMsg;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const text = target.value || "";
      target.value = text.substring(0, start) + emoji + text.substring(end);
      target.focus();
      target.selectionStart = target.selectionEnd = start + emoji.length;
      target.dispatchEvent(new Event("input"));
      saveRecentEmoji(emoji);
    }
  });

  // Filtro de pesquisa de emojis instantâneo
  emojiSearch.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    const headers = emojiGrid.querySelectorAll(".wa-emoji-category-header");
    const items = emojiGrid.querySelectorAll(".wa-emoji-item");
    const sections = emojiGrid.querySelectorAll(".wa-emoji-category-section");

    if (query) {
      headers.forEach((h) => (h.style.display = "none"));
      sections.forEach((s) => (s.style.display = "contents"));
      items.forEach((item) => {
        const tags = item.getAttribute("title") || "";
        if (tags.includes(query)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    } else {
      headers.forEach((h) => (h.style.display = "block"));
      sections.forEach((s) => (s.style.display = "block"));
      items.forEach((item) => (item.style.display = "block"));
      emojiTabs.forEach((t) => t.classList.remove("active"));
      const firstTab = Array.from(emojiTabs).find(
        (t) => t.style.display !== "none",
      );
      if (firstTab) firstTab.classList.add("active");
    }
  });

  // Fecha o picker ao clicar fora dele
  document.addEventListener("click", (e) => {
    const labelEmojiTrigger = document.getElementById(
      "wa-modal-etiqueta-btn-emoji",
    );
    const rrEmojiTrigger = document.getElementById("wa-rr-modal-emoji-btn");
    const rrModal = document.getElementById("wa-rr-modal");
    if (
      emojiPicker.style.display === "flex" &&
      !emojiPicker.contains(e.target) &&
      e.target !== emojiTrigger &&
      !emojiTrigger.contains(e.target) &&
      e.target !== labelEmojiTrigger &&
      !(labelEmojiTrigger && labelEmojiTrigger.contains(e.target)) &&
      e.target !== rrEmojiTrigger &&
      !(rrEmojiTrigger && rrEmojiTrigger.contains(e.target))
    ) {
      emojiPicker.style.display = "none";
      if (rrModal) {
        rrModal.classList.remove("wa-emoji-open");
      }
      emojiPicker._rrTarget = null;
    }
  });

  document.getElementById("wa-fechar-modal").addEventListener("click", () => {
    document.getElementById("wa-modal-overlay").style.display = "none";
    emojiPicker.style.display = "none";
    fecharPopoverRR();

    const msgInput = document.getElementById("wa-modal-msg");
    msgInput.value = "";
    msgInput.style.height = "auto";
    const agendadorInput = document.getElementById("wa-modal-agendador");
    if (agendadorInput) agendadorInput.value = "";
    const hiddenEtiqueta = document.getElementById("wa-modal-etiqueta-valor");
    const hiddenCor = document.getElementById("wa-modal-etiqueta-cor-valor");
    if (hiddenEtiqueta) hiddenEtiqueta.value = "";
    if (hiddenCor) hiddenCor.value = "";
    const criador = document.getElementById("wa-modal-criador-etiqueta");
    if (criador) criador.style.display = "none";

    // Reseta contatos e estados temporários
    contatosSelecionados = [];
    tempMsgText = "";
    tempScheduleDate = "";
    tempAnexo = null;
    const anexoInput = document.getElementById("wa-modal-anexo-input");
    if (anexoInput) anexoInput.value = "";
    const preview = document.getElementById("wa-modal-anexo-preview");
    if (preview) preview.style.display = "none";
    resetarModalEstado();
  });

  document
    .getElementById("wa-btn-adicionar-contato")
    .addEventListener("click", () => {
      // Salvar o estado dos inputs de texto e data do modal atual em variáveis temporárias.
      tempMsgText = document.getElementById("wa-modal-msg").value;
      tempScheduleDate = document.getElementById("wa-modal-data").value;

      // Ocultar visualmente o modal de agendamento e o seletor de emojis.
      document.getElementById("wa-modal-overlay").style.display = "none";
      emojiPicker.style.display = "none";

      const drawer = document.querySelector(
        'div[data-testid="new-chat-drawer"]',
      );
      const painel = document.getElementById("wa-painel-injetado");
      if (drawer && painel) {
        painel.style.display = "none";
        drawer.classList.remove("wa-gaveta-sequestrada");
        const btnFiltro = drawer.querySelector("#wa-btn-filtro");
        if (btnFiltro)
          btnFiltro.style.setProperty("display", "none", "important");
        mudarTituloGaveta(drawer, "Agendar nova mensagem");
        modoAgendamento = true;
      } else {
        modoAgendamento = true;
        abertoPeloAgendador = true;
        pularPainelEIrDiretoParaBusca = true;
        abrirNovaConversa();
      }
    });

  document.getElementById("wa-salvar-btn").addEventListener("click", () => {
    if (contatosSelecionados.length === 0) {
      alert("Adicione pelo menos um destinatário.");
      return;
    }
    const agendador = document
      .getElementById("wa-modal-agendador")
      .value.trim();
    const data = document.getElementById("wa-modal-data").value;
    const msg = document.getElementById("wa-modal-msg").value;
    const etiqueta = document
      .getElementById("wa-modal-etiqueta-valor")
      .value.trim();
    const etiquetaCor = document
      .getElementById("wa-modal-etiqueta-cor-valor")
      .value.trim();
    if (!agendador) {
      alert("Preencha o campo 'Agendado por:'.");
      return;
    }
    if (!data || !msg) {
      alert("Preencha a data e a mensagem.");
      return;
    }
    const scheduleTime = new Date(data).getTime();
    if (scheduleTime <= Date.now()) {
      alert("A data deve ser no futuro.");
      return;
    }

    if (editingMessageId) {
      const contato = contatosSelecionados[0] || { nome: "", imagem: "" };
      const updatedData = {
        id: editingMessageId,
        nome: contato.nome,
        agendador: agendador,
        criadoEm: Date.now(),
        imagem: contato.imagem,
        mensagem: msg,
        tempo: scheduleTime,
        etiqueta: etiqueta,
        etiquetaCor: etiquetaCor,
        anexo: tempAnexo,
      };

      chrome.runtime.sendMessage(
        {
          action: "atualizar_agendamento",
          data: updatedData,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Erro WAgenda:", chrome.runtime.lastError.message);
            alert(
              "Conexão perdida com a extensão. Por favor, atualize a extensão no chrome://extensions e recarregue a página do WhatsApp Web.",
            );
            return;
          }
          document.getElementById("wa-modal-overlay").style.display = "none";
          emojiPicker.style.display = "none";
          document.getElementById("wa-modal-data").value = "";
          const agendadorInput = document.getElementById("wa-modal-agendador");
          if (agendadorInput) agendadorInput.value = "";
          const hiddenEtiqueta = document.getElementById(
            "wa-modal-etiqueta-valor",
          );
          const hiddenCor = document.getElementById(
            "wa-modal-etiqueta-cor-valor",
          );
          if (hiddenEtiqueta) hiddenEtiqueta.value = "";
          if (hiddenCor) hiddenCor.value = "";
          const criador = document.getElementById("wa-modal-criador-etiqueta");
          if (criador) criador.style.display = "none";
          const msgInput = document.getElementById("wa-modal-msg");
          msgInput.value = "";
          msgInput.style.height = "auto";

          // Limpa estado global
          contatosSelecionados = [];
          tempMsgText = "";
          tempScheduleDate = "";
          tempAnexo = null;
          const anexoInput = document.getElementById("wa-modal-anexo-input");
          if (anexoInput) anexoInput.value = "";
          const preview = document.getElementById("wa-modal-anexo-preview");
          if (preview) preview.style.display = "none";
          imgUrl = "";
          resetarModalEstado();

          renderizarLista();
          atualizarContadorBadge();
        },
      );
      return;
    }

    const dataList = contatosSelecionados.map((contato, idx) => {
      return {
        id: `msg_${Date.now()}_${idx}`,
        nome: contato.nome,
        agendador: agendador,
        criadoEm: Date.now(),
        imagem: contato.imagem,
        mensagem: msg,
        tempo: scheduleTime,
        etiqueta: etiqueta,
        etiquetaCor: etiquetaCor,
        anexo: tempAnexo,
      };
    });

    chrome.runtime.sendMessage(
      {
        action: "agendar_mensagem_multipla",
        dataList: dataList,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Erro WAgenda:", chrome.runtime.lastError.message);
          alert(
            "Conexão perdida com a extensão. Por favor, atualize a extensão no chrome://extensions e recarregue a página do WhatsApp Web.",
          );
          return;
        }
        document.getElementById("wa-modal-overlay").style.display = "none";
        emojiPicker.style.display = "none";
        document.getElementById("wa-modal-data").value = "";
        const agendadorInput = document.getElementById("wa-modal-agendador");
        if (agendadorInput) agendadorInput.value = "";
        const hiddenEtiqueta = document.getElementById(
          "wa-modal-etiqueta-valor",
        );
        const hiddenCor = document.getElementById(
          "wa-modal-etiqueta-cor-valor",
        );
        if (hiddenEtiqueta) hiddenEtiqueta.value = "";
        if (hiddenCor) hiddenCor.value = "";
        const criador = document.getElementById("wa-modal-criador-etiqueta");
        if (criador) criador.style.display = "none";
        const msgInput = document.getElementById("wa-modal-msg");
        msgInput.value = "";
        msgInput.style.height = "auto";

        // Limpa estado global
        contatosSelecionados = [];
        tempMsgText = "";
        tempScheduleDate = "";
        tempAnexo = null;
        const anexoInput = document.getElementById("wa-modal-anexo-input");
        if (anexoInput) anexoInput.value = "";
        const preview = document.getElementById("wa-modal-anexo-preview");
        if (preview) preview.style.display = "none";
        imgUrl = "";
        resetarModalEstado();

        document.getElementById("btn-agenda-wa").click();
        atualizarContadorBadge();
      },
    );
  });
}

function mostrarBloqueador(nome, agendador, criadoEm) {
  if (document.getElementById("wa-bloqueador-interacao")) return;

  const manifest = chrome.runtime.getManifest();
  const nomeExtensao = manifest.name || "WAgenda";
  const logoUrl = chrome.runtime.getURL("icons/icon128.png");

  const agendadorTexto = agendador
    ? `<div class="wa-bloqueador-agendador" style="font-size: 13px; color: #8696a0; margin-top: 5px;">Agendado por: <strong>${agendador}</strong></div>`
    : "";

  const criadoEmTexto = criadoEm
    ? `<div class="wa-bloqueador-criado" style="font-size: 12px; color: #8696a0; opacity: 0.85; margin-top: 3px; margin-bottom: 12px;">Criado em: ${new Date(criadoEm).toLocaleDateString("pt-BR")} às ${new Date(criadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>`
    : "";

  const bloqueador = document.createElement("div");
  bloqueador.id = "wa-bloqueador-interacao";
  bloqueador.innerHTML = `
    <div class="wa-bloqueador-conteudo">
      <div class="wa-loading-wrapper">
        <img src="${logoUrl}" class="wa-bloqueador-logo" alt="WAgenda">
        <div class="wa-spinner"></div>
      </div>
      <div class="wa-bloqueador-titulo">${nomeExtensao} Ativo</div>
      <div class="wa-bloqueador-subtitulo">Enviando mensagem agendada para <strong>${nome}</strong>...</div>
      ${agendadorTexto}
      ${criadoEmTexto}
      <div class="wa-bloqueador-aviso">Por favor, não digite ou clique para não interferir na automação.</div>
    </div>
  `;
  document.body.appendChild(bloqueador);

  window.addEventListener("keydown", bloqueadorTeclado, true);
  window.addEventListener("keypress", bloqueadorTeclado, true);
  window.addEventListener("keyup", bloqueadorTeclado, true);
}

function removerBloqueador() {
  const bloqueador = document.getElementById("wa-bloqueador-interacao");
  if (bloqueador) {
    bloqueador.remove();
  }
  window.removeEventListener("keydown", bloqueadorTeclado, true);
  window.removeEventListener("keypress", bloqueadorTeclado, true);
  window.removeEventListener("keyup", bloqueadorTeclado, true);
}

// Global click event handlers for closing popovers and modals
document.addEventListener("click", (e) => {
  const popover = document.getElementById("wa-filtro-popover");
  const btnFiltro = document.getElementById("wa-btn-filtro");
  if (
    popover &&
    !popover.contains(e.target) &&
    e.target !== btnFiltro &&
    !btnFiltro?.contains(e.target)
  ) {
    popover.remove();
  }

  const popoverGerenciar = document.getElementById(
    "wa-gerenciar-etiquetas-popover",
  );
  const btnGerenciar = document.getElementById("wa-btn-gerenciar-etiquetas");
  if (
    popoverGerenciar &&
    !popoverGerenciar.contains(e.target) &&
    e.target !== btnGerenciar &&
    !btnGerenciar?.contains(e.target)
  ) {
    if (
      !e.target.closest(".wa-gerenciar-edit-cor-picker") &&
      !e.target.closest(".wa-gerenciar-edit-nome-input")
    ) {
      popoverGerenciar.remove();
    }
  }

  const popoverAdicionar = document.getElementById(
    "wa-adicionar-etiqueta-popover",
  );
  if (
    popoverAdicionar &&
    !popoverAdicionar.contains(e.target) &&
    !e.target.closest(".wa-btn-adicionar-etiqueta-card")
  ) {
    popoverAdicionar.remove();
  }

  // Fecha popover de Respostas Rápidas ao clicar fora
  const popRR = document.getElementById("wa-rr-popover");
  if (
    popRR &&
    !popRR.contains(e.target) &&
    !e.target.closest("#wa-modal-msg")
  ) {
    fecharPopoverRR();
  }
});

// Listener for contact list clicking during scheduling mode
document.addEventListener(
  "click",
  (e) => {
    if (!modoAgendamento) return;
    const cardContato = e.target.closest(
      'div[data-testid="cell-frame-container"]',
    );
    if (!cardContato) return;
    const spanNome = cardContato.querySelector("span[title]");
    if (spanNome) {
      const nome = spanNome.getAttribute("title");
      const imgElement = cardContato.querySelector('img[src*="whatsapp.net"]');
      const clickedImgUrl = imgElement ? imgElement.src : "";
      const btnVoltar =
        document
          .querySelector('span[data-icon="back-refreshed"]')
          ?.closest("button") ||
        document.querySelector('span[data-icon="back"]')?.closest("button");
      if (btnVoltar) btnVoltar.click();
      modoAgendamento = false;
      abertoPeloAgendador = false;

      if (contatosSelecionados.length > 0) {
        if (!contatosSelecionados.find((c) => c.nome === nome)) {
          contatosSelecionados.push({ nome: nome, imagem: clickedImgUrl });
        }
      } else {
        contatosSelecionados = [{ nome: nome, imagem: clickedImgUrl }];
      }

      abrirModalAgendamento();
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true,
);
