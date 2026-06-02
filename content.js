let abertoPeloAgendador = false;
let modoAgendamento = false;
let gavetaEstavaAberta = false;
let roboTrabalhando = false;
let timerAgrupamento = null;
let imgUrl = "";
let contatosSelecionados = [];
let tempMsgText = "";
let tempScheduleDate = "";
let pularPainelEIrDiretoParaBusca = false;
let filtroAtivo = null;

let inicializado = false;
const observer = new MutationObserver((mutations) => {
  // Mantém a currentTab atualizada
  const btnAtivo =
    document.querySelector('button[data-navbar-item-selected="true"]') ||
    document.querySelector('button[aria-pressed="true"]');
  if (btnAtivo) {
    const label = btnAtivo.getAttribute("aria-label");
    if (label) currentTab = label;
  }

  const header =
    document.querySelector('header[data-testid="chatlist-header"]') ||
    document.querySelector("#side header") ||
    document.querySelector("header");
  if (header && !document.getElementById("btn-agenda-wa")) {
    if (!inicializado) {
      injetarEstilosOcultacao();
      injetarModalEstilos();
      observarGavetaNativa();
      inicializarTooltipDelegation();
      inicializado = true;
    }
    injetarBotaoHeader(header);
  }
});
observer.observe(document.body, { childList: true, subtree: true });

function injetarEstilosOcultacao() {
  const style = document.createElement("style");
  style.innerHTML = `
        .wa-gaveta-sequestrada > :not(header):not(#wa-painel-injetado) { display: none !important; }
        .wa-gaveta-sequestrada button[aria-label="Número de telefone"],
        .wa-gaveta-sequestrada button:has(path[d^="M12 23"]) {
          display: none !important;
        }
        #wa-agenda-badge { position: absolute; top: -6px; right: -6px; pointer-events: none; background-color: var(--WDS-persistent-always-branded, #25D366); border: 2px solid var(--WDS-surface-emphasized, #111b21); border-radius: 9999px; height: 16px; min-width: 16px; padding: 2px; display: none; align-items: center; justify-content: center; color: var(--WDS-content-on-accent, #ffffff); font-size: 0.75rem; font-weight: 545; line-height: 1; font-family: inherit; z-index: 5; animation: popBadge 0.2s ease-out; }
        @keyframes popBadge { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        #btn-agenda-wa:hover, body.agendador-ativo #btn-agenda-wa { background-color: var(--background-default-hover, rgba(134, 150, 160, 0.15)) !important; }
        .rel-fundo { display: none; }
        .rel-borda, .rel-ponteiros { fill: var(--WDS-content-deemphasized, #aebac1); transition: fill 0.2s; }
        body.agendador-ativo .rel-fundo { display: block; fill: var(--WDS-content-action-default, #00a884); }
        body.agendador-ativo .rel-borda { display: none; }
        body.agendador-ativo .rel-ponteiros { fill: var(--panel-header-background, #202c33); }
        #wa-painel-injetado { position: relative; flex: 1; overflow: hidden; background-color: var(--drawer-background, #111b21); display: flex; flex-direction: column; height: 100%; }
        #wa-painel-conteudo-scroll { flex: 1; overflow-y: auto; padding: 15px; padding-bottom: 60px; display: flex; flex-direction: column; }
        .sa-btn-nova { background: var(--WDS-accent-deemphasized); color: var(--WDS-content-default, #ffffff); border: none; padding: 14px; width: 100%; border-radius: 4px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 13px; margin-bottom: 25px; transition: filter 0.2s; }
        .sa-btn-nova:hover { filter: brightness(0.9); }
        .sa-item { display: flex; flex-direction: row; align-items: center; min-height: 72px; height: auto; margin-inline-start: 10px; margin-inline-end: 10px; margin-bottom: 2px; padding: 10px 12px; border-radius: var(--xb871un, 8px); background-color: transparent; cursor: pointer; transition: background-color 0.2s; }
        .sa-item:hover { background-color: var(--WDS-surface-highlight, rgba(134,150,160,0.05)); }
        .sa-item-avatar { width: 49px; height: 49px; border-radius: 50%; overflow: hidden; flex-shrink: 0; margin-right: 15px; display: flex; align-items: center; justify-content: center; }
        .sa-item-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .sa-default-avatar { width: 100%; height: 100%; border-radius: 50%; background-color: var(--xx1f98k, #dfe5e7); outline: 1px solid var(--progress-background, rgba(0,0,0,0.05)); outline-offset: -1px; }
        .sa-item-content { display: flex; flex-direction: column; flex-grow: 1; min-width: 0; justify-content: center; }
        .sa-item-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .sa-item-nome { font-weight: 400; font-size: 17px; color: var(--primary-title, #e9edef); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; margin-right: 8px;}
        .sa-item-data { font-size: 12px; color: var(--secondary, #8696a0); flex-shrink: 0; }
        .sa-item-msg { font-size: 14px; color: var(--secondary-lighter, #aebac1); font-style: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; margin-top: 2px;}
        .sa-item-del { box-sizing: border-box; height: 26px; padding: 0 12px; margin-left: 8px; margin-top: 2px; background-color: var(--WDS-danger-deemphasized, rgba(234, 0, 56, 0.1)); color: var(--WDS-danger-emphasized, #ea0038); border: 1px solid var(--WDS-lines-outline-deemphasized, rgba(255,255,255,0.1)); border-radius: var(--x1lh8xxe, 24px); display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 545; font-family: inherit; cursor: pointer; transition: filter 0.2s; flex-shrink: 0; }
        .sa-item-del:hover { filter: brightness(1.2); }

        #wa-historico-drawer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 48px;
          background-color: var(--drawer-background, #111b21);
          border-top: 1px solid var(--border-default, rgba(134,150,160,0.15));
          display: flex;
          flex-direction: column;
          transition: height 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 100;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.35);
          overflow: hidden;
        }
        #wa-historico-drawer.aberto {
          height: 75%;
        }
        .wa-historico-header {
          height: 48px;
          min-height: 48px;
          background-color: var(--panel-header-background, #202c33);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s;
          border-bottom: 1px solid rgba(134,150,160,0.1);
        }
        .wa-historico-header:hover {
          background-color: var(--background-default-hover, rgba(134, 150, 160, 0.15));
        }
        .wa-historico-titulo-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wa-historico-titulo {
          font-size: 14px;
          font-weight: 545;
          color: var(--primary, #e9edef);
        }
        .wa-historico-badge {
        display: flex;
        align-items: center;
        justify-content: center;
          background-color: var(--WDS-persistent-always-branded, #25D366);
          color: var(--WDS-content-on-accent, #ffffff);
          border-radius: 9999px;
          font-size: 0.75rem;
          padding: 2px;
          font-weight: bold;
          line-height: 1;
          min-width: 16px;
          height: 16px;
        }
        .wa-historico-seta {
          color: var(--icon, #8696a0);
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #wa-historico-drawer.aberto .wa-historico-seta {
          transform: rotate(180deg);
        }
        .wa-historico-conteudo {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .wa-historico-limpar {
          align-self: flex-end;
          font-size: 12px;
          color: var(--WDS-danger-emphasized, #ea0038);
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 6px 12px;
          margin-top: 10px;
          margin-right: 15px;
          margin-bottom: 5px;
          font-weight: 545;
          transition: opacity 0.2s;
        }
        .wa-historico-limpar:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        .wa-historico-item {
          border-left: 3px solid var(--WDS-content-external-link, #21c063);
          margin-inline-start: 10px;
          margin-inline-end: 10px;
          margin-bottom: 4px;
          border-radius: 8px;
        }

        #wa-bloqueador-interacao {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 20, 26, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e9edef;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          user-select: none;
          pointer-events: all;
          animation: waFadeIn 0.3s ease;
        }
        @keyframes waFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .wa-bloqueador-conteudo {
          background: #1f2c34;
          border-radius: 16px;
          padding: 30px 40px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          max-width: 420px;
          width: 90%;
          animation: waScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes waScaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .wa-loading-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px auto;
          display: block;
        }
        .wa-bloqueador-logo {
          width: 50px;
          height: 50px;
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 1;
          border-radius: 50%;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
        }
        .wa-spinner {
          width: 80px;
          height: 80px;
          border: 4px solid rgba(0, 168, 132, 0.15);
          border-left-color: #00a884;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          box-sizing: border-box;
          animation: waSpin 1.2s linear infinite;
        }
        @keyframes waSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .wa-bloqueador-titulo {
          font-size: 20px;
          font-weight: 600;
          color: #00a884;
          margin-bottom: 10px;
        }
        .wa-bloqueador-subtitulo {
          font-size: 15px;
          color: #e9edef;
          line-height: 1.4;
          margin-bottom: 15px;
        }
        .wa-bloqueador-aviso {
          font-size: 12px;
          color: #8696a0;
          background: rgba(134, 150, 160, 0.08);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px dashed rgba(134, 150, 160, 0.2);
        }

        #wa-custom-tooltip {
          position: fixed;
          background-color: var(--WDS-surface-inverse, #111b21);
          color: var(--WDS-content-inverse, #e9edef);
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          line-height: 1.4;
          max-width: 880px;
          word-break: break-word;
          white-space: pre-wrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 100000;
          pointer-events: none;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          font-family: var(--font-family, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif);
        }
        #wa-custom-tooltip.visivel {
          opacity: 1;
          transform: translateY(0);
        }
        #wa-custom-tooltip.wa-tooltip-instantaneo {
          transition: none !important;
          transform: none !important;
        }

        .wa-item-etiqueta-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--primary, #e9edef);
          font-size: 11px;
          margin-left: 6px;
          vertical-align: middle;
          box-sizing: border-box;
        }
        .wa-item-etiqueta-badge svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          display: inline-block;
          vertical-align: middle;
        }
        .wa-item-etiqueta-badge strong {
          font-weight: 700;
          color: var(--primary, #e9edef);
        }

        #wa-btn-filtro, #wa-btn-gerenciar-etiquetas {
          background: none;
          border: none;
          cursor: pointer;
          height: 40px;
          width: 40px;
          padding: 8px;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
          margin-left: 8px;
        }
        #wa-btn-filtro:hover, #wa-btn-gerenciar-etiquetas:hover {
          background-color: var(--background-default-hover, rgba(134, 150, 160, 0.15)) !important;
        }
        #wa-btn-filtro.ativo, #wa-btn-gerenciar-etiquetas.ativo {
          background-color: rgba(0, 168, 132, 0.12) !important;
        }
        #wa-btn-filtro.ativo:hover, #wa-btn-gerenciar-etiquetas.ativo:hover {
          background-color: rgba(0, 168, 132, 0.22) !important;
        }

        #wa-modal-etiqueta-input-escrita {
          width: 100%;
          height: 32px;
          font-size: 14px;
          padding: 4px 0;
          border: none !important;
          border-bottom: 2px solid var(--border-default, rgba(134, 150, 160, 0.25)) !important;
          background: transparent !important;
          color: var(--primary, #e9edef) !important;
          outline: none !important;
          box-sizing: border-box;
          transition: border-bottom-color 0.2s ease;
        }
        #wa-modal-etiqueta-input-escrita:focus {
          border-bottom-color: var(--WDS-persistent-always-branded, var(--input-border-active, #00a884)) !important;
        }
        #wa-modal-etiqueta-btn-emoji:hover {
          color: var(--primary-strong, var(--primary, #d1d7db)) !important;
        }

        #wa-filtro-popover {
          position: fixed;
          background-color: var(--dropdown-background, #233138);
          border: 1px solid var(--border-default, rgba(134,150,160,0.15));
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          width: 220px;
          z-index: 100002;
          overflow: hidden;
          padding: 10px 0;
          font-family: var(--font-family, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif);
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          pointer-events: all;
        }
        #wa-filtro-popover.visivel {
          opacity: 1;
          transform: translateY(0);
        }
        .wa-filtro-popover-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 14px 10px 14px;
          border-bottom: 1px solid rgba(134, 150, 160, 0.1);
          font-size: 13px;
          font-weight: 600;
          color: var(--primary, #e9edef);
        }
        .wa-filtro-limpar-btn {
          background: transparent;
          border: none;
          color: var(--WDS-content-action-default, #00a884);
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .wa-filtro-limpar-btn:hover {
          background-color: var(--background-default-hover, rgba(134, 150, 160, 0.15));
        }
        .wa-filtro-secao {
          padding: 8px 0;
        }
        .wa-filtro-secao-titulo {
          font-size: 11px;
          color: var(--secondary, #8696a0);
          padding: 4px 14px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .wa-filtro-opcoes-list {
          max-height: 120px;
          overflow-y: auto;
        }
        .wa-filtro-opcao {
          padding: 8px 14px;
          font-size: 13px;
          color: var(--primary-strong, var(--primary, #e9edef));
          cursor: pointer;
          transition: background-color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wa-filtro-opcao:hover {
          background-color: var(--background-default-hover, rgba(134, 150, 160, 0.15));
        }
        .wa-filtro-opcao.selecionado {
          color: var(--WDS-content-action-default, #00a884);
          background-color: rgba(0, 168, 132, 0.08);
          font-weight: 600;
        }
        .wa-filtro-vazio {
          font-size: 12px;
          color: var(--secondary, #8696a0);
          padding: 6px 14px;
          font-style: italic;
        }

        #wa-gerenciar-etiquetas-popover {
          position: fixed;
          background-color: var(--dropdown-background, #233138);
          border: 1px solid var(--border-default, rgba(134,150,160,0.15));
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          width: 280px;
          z-index: 100002;
          overflow: hidden;
          padding: 10px 0;
          font-family: var(--font-family, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif);
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          pointer-events: all;
        }
        #wa-gerenciar-etiquetas-popover.visivel {
          opacity: 1;
          transform: translateY(0);
        }

        #wa-adicionar-etiqueta-popover {
          position: fixed;
          background-color: var(--dropdown-background, #233138);
          border: 1px solid var(--border-default, rgba(134,150,160,0.15));
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          width: 200px;
          z-index: 100003;
          overflow: hidden;
          padding: 10px 0;
          font-family: var(--font-family, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif);
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          pointer-events: all;
        }
        #wa-adicionar-etiqueta-popover.visivel {
          opacity: 1;
          transform: translateY(0);
        }
        .wa-btn-adicionar-etiqueta-card:hover {
          color: var(--WDS-content-action-default, #00a884) !important;
        }
        .wa-gerenciar-etiquetas-opcao {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          font-size: 13px;
          color: var(--primary-strong, var(--primary, #e9edef));
          transition: background-color 0.2s;
        }
        .wa-gerenciar-etiquetas-opcao:hover {
          background-color: var(--background-default-hover, rgba(134, 150, 160, 0.15));
        }
        .wa-gerenciar-etiquetas-left {
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 140px;
          overflow: hidden;
        }
        .wa-gerenciar-etiquetas-left span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }
        .wa-gerenciar-etiquetas-acoes {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wa-gerenciar-etiquetas-btn {
          background: transparent;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: var(--icon, #8696a0);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s, color 0.2s;
        }
        .wa-gerenciar-etiquetas-btn:hover {
          background-color: var(--background-default-hover, rgba(134, 150, 160, 0.15));
          color: var(--primary-strong, var(--primary, #e9edef));
        }
        .wa-gerenciar-etiquetas-btn.delete:hover {
          color: #ea0038;
          background-color: rgba(234, 0, 56, 0.1);
        }
        .wa-gerenciar-edit-nome-input {
          flex: 1;
          font-size: 13px;
          padding: 4px 6px;
          border: none;
          border-bottom: 2px solid var(--border-default, rgba(134,150,160,0.25));
          background: transparent;
          color: var(--primary);
          outline: none;
          transition: border-color 0.2s;
        }
        .wa-gerenciar-edit-nome-input:focus {
          border-bottom-color: var(--WDS-persistent-always-branded, var(--input-border-active, #00a884)) !important;
        }
    `;
  document.head.appendChild(style);
}

let waTooltipTimeout = null;

function inicializarTooltipDelegation() {
  document.addEventListener("mouseover", (e) => {
    const msgEl = e.target.closest(".sa-item-msg");
    const customTooltipEl = e.target.closest("[data-wa-tooltip]");

    if (!msgEl && !customTooltipEl) return;

    let tooltipText = "";
    let targetEl = null;
    let isCustomButton = false;

    if (customTooltipEl) {
      tooltipText = customTooltipEl.getAttribute("data-wa-tooltip");
      targetEl = customTooltipEl;
      isCustomButton = true;
    } else if (msgEl) {
      tooltipText = msgEl.textContent || msgEl.innerText;
      targetEl = msgEl;
    }

    if (!tooltipText) return;

    clearTimeout(waTooltipTimeout);

    waTooltipTimeout = setTimeout(
      () => {
        let tooltip = document.getElementById("wa-custom-tooltip");
        if (!tooltip) {
          tooltip = document.createElement("div");
          tooltip.id = "wa-custom-tooltip";
          document.body.appendChild(tooltip);
        }

        tooltip.textContent = tooltipText;

        const rect = targetEl.getBoundingClientRect();

        // Abre temporariamente o tooltip fora da tela para capturar as dimensões corretas
        tooltip.style.left = "-9999px";
        tooltip.style.top = "-9999px";

        if (isCustomButton) {
          tooltip.classList.add("wa-tooltip-instantaneo");
        } else {
          tooltip.classList.remove("wa-tooltip-instantaneo");
        }

        tooltip.classList.add("visivel");

        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;

        const position = targetEl.getAttribute("data-wa-tooltip-position");
        let top, left;

        if (position === "right") {
          top = rect.top + (rect.height - tooltipHeight) / 2;
          left = rect.right + 8;
          if (top < 10) top = 10;
          if (top + tooltipHeight > window.innerHeight - 10) {
            top = window.innerHeight - tooltipHeight - 10;
          }
        } else {
          top = rect.top - tooltipHeight - 6; // Posicionamento padrão (acima)

          if (isCustomButton) {
            top = rect.bottom + 6; // Para botões geralmente fica abaixo
            if (top + tooltipHeight > window.innerHeight - 10) {
              top = rect.top - tooltipHeight - 6;
            }
          } else {
            if (top < 10) {
              top = rect.bottom + 6;
            }
          }

          left = rect.left + (rect.width - tooltipWidth) / 2;
          if (left < 10) left = 10;
          if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10;
          }
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      },
      isCustomButton ? 350 : 250,
    );
  });

  document.addEventListener("mouseout", (e) => {
    const msgEl = e.target.closest(".sa-item-msg");
    const customTooltipEl = e.target.closest("[data-wa-tooltip]");
    if (!msgEl && !customTooltipEl) return;

    clearTimeout(waTooltipTimeout);
    const tooltip = document.getElementById("wa-custom-tooltip");
    if (tooltip) {
      tooltip.classList.remove("visivel");
    }
  });

  // Oculta ao rolar qualquer painel
  document.addEventListener(
    "scroll",
    () => {
      clearTimeout(waTooltipTimeout);
      const tooltip = document.getElementById("wa-custom-tooltip");
      if (tooltip) {
        tooltip.classList.remove("visivel");
      }
    },
    { capture: true, passive: true },
  );
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
                "var(--background-default-hover, rgba(134,150,160,0.08))";

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
        <div class="wa-popover-criador-etiqueta" style="display: none; flex-direction: column; gap: 8px; padding: 10px 14px; box-sizing: border-box; width: 100%; border-top: 1px solid var(--border-default, rgba(134,150,160,0.15));">
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
              <input type="text" class="wa-popover-etiqueta-input-escrita" placeholder="Nome..." style="width: 100%; box-sizing: border-box; background: var(--search-input-background, #202c33); color: var(--primary, #e9edef); border: 1px solid var(--border-default, rgba(134,150,160,0.15)); border-radius: 4px; padding: 4px 8px; font-size: 12px; outline: none;">
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
          <div class="wa-filtro-popover-header" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-bottom: 1px solid var(--border-default, rgba(134,150,160,0.15));">
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
          <div class="wa-filtro-popover-header" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-bottom: 1px solid var(--border-default, rgba(134,150,160,0.15));">
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

// Fechar popover ao clicar fora
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
});

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

function simularClique(elemento, nomeElemento = "elemento") {
  if (!elemento) return;

  const disparar = (el) => {
    if (!el) return;
    try {
      // PointerEvents para o React/Web
      el.dispatchEvent?.(
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
        }),
      );
      el.dispatchEvent?.(
        new PointerEvent("pointerup", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
        }),
      );

      // MouseEvents clássicos
      el.dispatchEvent?.(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
        }),
      );
      el.dispatchEvent?.(
        new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
        }),
      );

      el.click?.();

      el.dispatchEvent?.(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
        }),
      );
    } catch (e) {
      console.error(`[WAgenda] Erro ao disparar clique em el:`, el, e);
    }
  };

  // Dispara em cascata subindo a árvore DOM (pais)
  let atual = elemento;
  for (let i = 0; i < 4; i++) {
    if (!atual) break;
    disparar(atual);
    atual = atual.parentElement;
  }

  // Dispara em cascata descendo a árvore DOM (filhos)
  elemento
    .querySelectorAll("div, span, svg, path")
    .forEach((child) => disparar(child));
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

    btnFiltro.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirPopoverFiltro(btnFiltro);
    });

    btnGerenciar.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirPopoverGerenciarEtiquetas(btnGerenciar);
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

      const svgNativo = () =>
        `<svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" class="sa-default-avatar" fill="none"><path d="M24 23q-1.857 0-3.178-1.322Q19.5 20.357 19.5 18.5t1.322-3.178T24 14t3.178 1.322Q28.5 16.643 28.5 18.5t-1.322 3.178T24 23m-6.75 10q-.928 0-1.59-.66-.66-.662-.66-1.59v-.9q0-.956.492-1.758A3.3 3.3 0 0 1 16.8 26.87a16.7 16.7 0 0 1 3.544-1.308q1.8-.435 3.656-.436 1.856 0 3.656.436T31.2 26.87q.816.422 1.308 1.223T33 29.85v.9q0 .928-.66 1.59-.662.66-1.59.66z" fill="#21c063"></path></svg>`;

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

      card.innerHTML = `
        <div class="sa-item-avatar">${imgHtml}</div>
        <div class="sa-item-content">
          <div class="sa-item-row">
            <div class="sa-item-nome">${item.nome}</div>
            <div class="sa-item-data" style="color: var(--WDS-content-external-link, #21c063); font-weight: 500;">Enviado</div>
          </div>
          <div class="sa-item-row" style="margin-top: 2px;">
            <div class="sa-item-msg">${item.mensagem}</div>
            <div class="sa-item-del" data-id="${item.id}">Excluir</div>
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
        // Simulamos o clique no botão "Voltar" nativo do WhatsApp Web (suportando múltiplas versões de ícones e atributos de acessibilidade).
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

        // PASSO 3: Aguardar o fechamento visual da gaveta lateral (400ms) e buscar o input global de pesquisa de conversas do WhatsApp Web.
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
            // Dar foco e selecionar qualquer texto antigo presente no campo de busca
            searchInput.focus();
            searchInput.select();

            // PASSO 3.1: Inserir a mensagem como termo de busca e disparar um evento nativo 'input' com bubbles=true.
            // Isso é CRÍTICO para que o React (framework interno do WhatsApp Web) perceba a mudança de estado e processe a pesquisa.
            searchInput.value = item.mensagem;
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));

            // PASSO 4: Aguardar 1000ms para o carregamento assíncrono dos resultados no DOM e buscar a linha correta.
            setTimeout(() => {
              const rows = document.querySelectorAll(
                '[data-testid="chat-list"] [role="row"], #pane-side [role="row"], [data-testid="cell-frame-container"]',
              );

              let targetResult = null;
              for (const row of rows) {
                // PASSO 4.1: Ignorar os cabeçalhos de seção gerados pela busca (Ex: o texto estático "Mensagens")
                if (row.querySelector('[data-testid="section-header"]')) {
                  continue;
                }

                // PASSO 4.2: Localizar o elemento que contém o nome do contato correspondente
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

                  // PASSO 4.3: Se o nome exibido na linha coincidir com o destinatário original do histórico, elegemos esta linha
                  if (
                    nameInRow &&
                    nameInRow.toLowerCase().includes(item.nome.toLowerCase())
                  ) {
                    targetResult = row;
                    break;
                  }
                }
              }

              // PASSO 4.4: Fallback caso não encontremos o contato correspondente pelo nome (pega o primeiro resultado de mensagem válido)
              if (!targetResult && rows.length > 0) {
                targetResult = Array.from(rows).find(
                  (row) => !row.querySelector('[data-testid="section-header"]'),
                );
              }

              // PASSO 5: Simular o clique com eventos nativos de mouse e ponteiro no elemento interativo correto da linha
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
      const svgNativo = () =>
        `<svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" class="sa-default-avatar" fill="none"><path d="M24 23q-1.857 0-3.178-1.322Q19.5 20.357 19.5 18.5t1.322-3.178T24 14t3.178 1.322Q28.5 16.643 28.5 18.5t-1.322 3.178T24 23m-6.75 10q-.928 0-1.59-.66-.66-.662-.66-1.59v-.9q0-.956.492-1.758A3.3 3.3 0 0 1 16.8 26.87a16.7 16.7 0 0 1 3.544-1.308q1.8-.435 3.656-.436 1.856 0 3.656.436T31.2 26.87q.816.422 1.308 1.223T33 29.85v.9q0 .928-.66 1.59-.662.66-1.59.66z" fill="#25D366"></path></svg>`;
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
      card.innerHTML = `<div class="sa-item-avatar">${imgHtml}</div><div class="sa-item-content"><div class="sa-item-row"><div class="sa-item-nome">${item.nome}</div><div class="sa-item-data">${dataFormatada}</div></div><div class="sa-item-row" style="margin-top: 2px;"><div class="sa-item-msg">${item.mensagem}</div><div class="sa-item-del" data-id="${item.id}">Excluir</div></div>${agendadorHtml}${criadoEmHtml}</div>`;

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

      // Se já existe contato na lista (porque veio do botão +), adiciona se não for duplicado
      if (contatosSelecionados.length > 0) {
        if (!contatosSelecionados.find((c) => c.nome === nome)) {
          contatosSelecionados.push({ nome: nome, imagem: clickedImgUrl });
        }
      } else {
        // Primeiro contato
        contatosSelecionados = [{ nome: nome, imagem: clickedImgUrl }];
      }

      abrirModalAgendamento();
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true,
);

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

    const svgNativo = () =>
      `<svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" class="sa-default-avatar" fill="none" style="width: 100%; height: 100%;"><path d="M24 23q-1.857 0-3.178-1.322Q19.5 20.357 19.5 18.5t1.322-3.178T24 14t3.178 1.322Q28.5 16.643 28.5 18.5t-1.322 3.178T24 23m-6.75 10q-.928 0-1.59-.66-.66-.662-.66-1.59v-.9q0-.956.492-1.758A3.3 3.3 0 0 1 16.8 26.87a16.7 16.7 0 0 1 3.544-1.308q1.8-.435 3.656-.436 1.856 0 3.656.436T31.2 26.87q.816.422 1.308 1.223T33 29.85v.9q0 .928-.66 1.59-.662.66-1.59.66z" fill="#25D366"></path></svg>`;

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

function abrirModalAgendamento() {
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

function injetarModalEstilos() {
  const EMOJI_CATEGORIES = {
    smileys: {
      icon: "😀",
      name: "Smileys & Pessoas",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "🙃",
        "😉",
        "😌",
        "😍",
        "🥰",
        "😘",
        "😗",
        "😙",
        "😚",
        "😋",
        "😛",
        "😝",
        "😜",
        "🤪",
        "🤨",
        "🧐",
        "🤓",
        "😎",
        "🥸",
        "🤩",
        "🥳",
        "😏",
        "😒",
        "😞",
        "😔",
        "😟",
        "😕",
        "🙁",
        "☹️",
        "😣",
        "😖",
        "😫",
        "😩",
        "🥺",
        "😢",
        "😭",
        "😤",
        "😠",
        "😡",
        "🤬",
        "🤯",
        "😳",
        "🥵",
        "🥶",
        "😱",
        "😨",
        "😰",
        "😥",
        "😓",
        "🤗",
        "🤔",
        "🫣",
        "🤭",
        "🫢",
        "🫡",
        "🤫",
        "🫠",
        "🤥",
        "😶",
        "😐",
        "😑",
        "😬",
        "🙄",
        "😯",
        "😦",
        "😧",
        "😮",
        "😲",
        "🥱",
        "😴",
        "🤤",
        "😪",
        "😵",
        "🤐",
        "🥴",
        "🤢",
        "🤮",
        "🤧",
        "😷",
        "🤒",
        "🤕",
        "🤑",
        "🤠",
        "😈",
        "👿",
        "👹",
        "👺",
        "🤡",
        "💩",
        "👻",
        "💀",
        "☠️",
        "👽",
        "👾",
        "🤖",
        "🎃",
        "😺",
        "😸",
        "😹",
        "😻",
        "😼",
        "😽",
        "🙀",
        "😿",
        "👋",
        "🤚",
        "🖐️",
        "✋",
        "🖖",
        "👌",
        "🤌",
        "🤏",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "🤙",
        "👈",
        "👉",
        "👆",
        "🖕",
        "👇",
        "☝️",
        "👍",
        "👎",
        "✊",
        "👊",
        "🤛",
        "🤜",
        "👏",
        "🙌",
        "👐",
        "🤲",
        "🤝",
        "🙏",
        "✍️",
        "💅",
        "🤳",
        "💪",
        "🦾",
        "🦿",
        "🦵",
        "🦶",
        "👂",
        "🦻",
        "👃",
        "🧠",
        "🫀",
        "🫁",
        "🦷",
        "🦴",
        "👀",
        "👁️",
        "👅",
        "👄",
        "💋",
        "🩸",
        "👶",
        "👧",
        "🧒",
        "👦",
        "👩",
        "🧑",
        "👨",
        "👵",
        "🧓",
        "👴",
        "👲",
        "🧕",
      ],
    },
    animals: {
      icon: "🐱",
      name: "Animais & Natureza",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐽",
        "🐸",
        "🐵",
        "🙈",
        "🙉",
        "🙊",
        "🐒",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🐣",
        "🐥",
        "🦆",
        "🦅",
        "🦉",
        "🦇",
        "🐺",
        "🐗",
        "🐴",
        "🦄",
        "🐝",
        "🪱",
        "🐛",
        "🦋",
        "🐌",
        "🐞",
        "🐜",
        "🪰",
        "🪲",
        "🪳",
        "🦂",
        "🕸️",
        "🕷️",
        "🐢",
        "🐍",
        "🦎",
        "🦖",
        "🦕",
        "🐙",
        "🦑",
        "🦐",
        "🦞",
        "🦀",
        "🐡",
        "🐠",
        "🐟",
        "🐬",
        "🐳",
        "🐋",
        "🦈",
        "🐊",
        "🐅",
        "🐆",
        "🐘",
        "🦣",
        "🦏",
        "🐪",
        "🐫",
        "🦒",
        "🦘",
        "🦬",
        "🐃",
        "🐂",
        "🐄",
        "🐎",
        "🐖",
        "🐏",
        "🐑",
        "🐐",
        "🐕",
        "🐩",
        "🐈",
        "🐓",
        "🦃",
        "🦚",
        "🦜",
        "🪶",
        "🦢",
        "🦩",
        "🕊️",
        "🦡",
        "🦫",
        "🦦",
        "🦥",
        "🦧",
        "🦍",
        "🐒",
        "🌵",
        "🎄",
        "🌲",
        "🌳",
        "🌴",
        "🌱",
        "🌿",
        "☘️",
        "🍀",
        "🎍",
        "🎋",
        "🍃",
        "🍂",
        "🍁",
        "🍄",
        "🐚",
        "🌾",
        "💐",
        "🌷",
        "🌹",
        "🥀",
        "🌺",
        "🌸",
        "🌼",
        "🌻",
        "☀️",
        "🌤️",
        "⛅",
        "🌥️",
        "☁️",
        "🌦️",
        "🌧️",
        "⛈️",
        "🌩️",
        "🌨️",
        "❄️",
        "☃️",
        "⛄",
        "🌬️",
        "💨",
        "🌪️",
        "🌫️",
        "☔",
        "☂️",
        "🌊",
        "💧",
        "⚡",
        "🔥",
      ],
    },
    food: {
      icon: "🍏",
      name: "Comida & Bebida",
      emojis: [
        "🍏",
        "🍎",
        "🍐",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🫐",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🍆",
        "🥑",
        "🥦",
        "🥬",
        "🥒",
        "🌶️",
        "🫑",
        "🌽",
        "🥕",
        "🫒",
        "🥔",
        "🍠",
        "🥐",
        "🥯",
        "🍞",
        "🥖",
        "🥨",
        "🧀",
        "🥚",
        "🍳",
        "🥞",
        "🧇",
        "🥓",
        "🥩",
        "🍗",
        "🍖",
        "🌭",
        "🍔",
        "🍟",
        "🍕",
        "🥪",
        "🥙",
        "🌮",
        "🌯",
        "🫔",
        "🥗",
        "🥘",
        "🍲",
        "🥫",
        "🍝",
        "🍜",
        "🍛",
        "🍣",
        "🍱",
        "🥟",
        "🍤",
        "🍙",
        "🍚",
        "🍘",
        "🍢",
        "🍡",
        "🍧",
        "🍨",
        "🍦",
        "🥧",
        "🍰",
        "🎂",
        "🧁",
        "🍮",
        "🍭",
        "🍬",
        "🍫",
        "🍿",
        "🍩",
        "🍪",
        "🌰",
        "🥜",
        "🍯",
        "🥛",
        "☕",
        "🫖",
        "🍵",
        "🍶",
        "🍺",
        "🍻",
        "🥂",
        "🍷",
        "🥃",
        "🍸",
        "🍹",
        "🧉",
        "🥤",
        "🧃",
        "🧊",
        "🥢",
      ],
    },
    activity: {
      icon: "⚽",
      name: "Atividades & Esportes",
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🥎",
        "🎾",
        "🏐",
        "🎱",
        "🪀",
        "🏹",
        "🎣",
        "🤿",
        "🥊",
        "🥋",
        "⛸️",
        "🎿",
        "🛷",
        "🏂",
        "🪂",
        "🏋️‍♀️",
        "🏋️",
        "🏋️‍♂️",
        "🤸‍♀️",
        "🤸",
        "🤸‍♂️",
        "⛹️‍♀️",
        "⛹️",
        "⛹️‍♂️",
        "🧗‍♀️",
        "🧗",
        "🧗‍♂️",
        "🚴‍♀️",
        "🚴",
        "🚴‍♂️",
        "🚵‍♀️",
        "🚵",
        "🚵‍♂️",
        "🏇",
        "🏆",
        "🥇",
        "🥈",
        "🥉",
        "🏅",
        "🎖️",
        "🎟️",
        "🎪",
        "🎭",
        "🎨",
        "🎬",
        "🎤",
        "🎧",
        "🎼",
        "🎹",
        "🥁",
        "🎷",
        "🎺",
        "🎸",
        "🎻",
        "🪕",
        "🎮",
        "👾",
        "🎯",
        "🎲",
        "🧩",
        "🎳",
      ],
    },
    travel: {
      icon: "🚗",
      name: "Viagens & Lugares",
      emojis: [
        "🚗",
        "🚕",
        "🚙",
        "🚌",
        "🚎",
        "🏎️",
        "🚓",
        "🚑",
        "🚒",
        "🚐",
        "🛻",
        "🚚",
        "🚛",
        "🚜",
        "🛵",
        "🏍️",
        "🛺",
        "🚲",
        "🛴",
        "🛹",
        "🚏",
        "🚂",
        "🚆",
        "🚇",
        "🚊",
        "🚉",
        "🚁",
        "🛩️",
        "✈️",
        "🛫",
        "🛬",
        "🚀",
        "🛸",
        "🛰️",
        "⛵",
        "🛶",
        "🚤",
        "🚢",
        "⚓",
        "🛟",
        "🗺️",
        "🧭",
        "🌋",
        "⛰️",
        "🏔️",
        "🗻",
        "🏕️",
        "🏖️",
        "🏜️",
        "🏝️",
        "🏞️",
        "🏟️",
        "🏛️",
        "🏠",
        "🏡",
        "🏢",
        "🏣",
        "🏤",
        "🗼",
        "🗽",
        "⛪",
        "🕌",
        "🕍",
        "🛕",
        "⛩️",
        "🕋",
        "⛲",
        "⛺",
        "🌅",
        "🌄",
        "🌇",
        "🌆",
        "🌃",
        "🌉",
        "🌌",
        "🎠",
        "🎡",
        "🎢",
      ],
    },
    objects: {
      icon: "💡",
      name: "Objetos",
      emojis: [
        "💡",
        "🔦",
        "🕯️",
        "🪔",
        "🔌",
        "🔋",
        "💻",
        "🖥️",
        "🖨️",
        "⌨️",
        "🖱️",
        "💾",
        "💿",
        "📷",
        "📹",
        "📽️",
        "📺",
        "📻",
        "🎤",
        "🎧",
        "🔊",
        "☎️",
        "📱",
        "📟",
        "📠",
        "✉️",
        "📦",
        "📫",
        "📮",
        "📅",
        "📇",
        "📊",
        "⏳",
        "⌚",
        "⏰",
        "🕰️",
        "🔑",
        "🗝️",
        "🔨",
        "🪓",
        "⛏️",
        "🪚",
        "🔧",
        "🪛",
        "⚙️",
        "🗜️",
        "⚖️",
        "🔗",
        "⛓️",
        "🧰",
        "🧲",
        "🔫",
        "💣",
        "🔪",
        "🗡️",
        "🛡️",
        "🏹",
        "⚔️",
        "🚬",
        "⚰️",
        "⚱️",
        "🔮",
        "🛍️",
        "🎁",
        "🎈",
        "🧨",
        "🎀",
        "📨",
        "📩",
        "📖",
        "📓",
        "📒",
        "🔖",
        "🏷️",
        "📎",
        "📐",
        "✂️",
        "🗑️",
        "🔒",
        "🔓",
        "✒️",
        "✏️",
        "🖌️",
        "🖍️",
        "🖊️",
        "🎨",
        "💉",
        "💊",
        "🩺",
        "🔬",
        "🔭",
        "📡",
        "🚽",
        "🚿",
        "🛁",
        "🪞",
        "🧼",
        "🧽",
        "🧹",
        "🧺",
      ],
    },
    symbols: {
      icon: "❤️",
      name: "Símbolos",
      emojis: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "🤍",
        "🤎",
        "💔",
        "❤️‍🔥",
        "❤️‍🩹",
        "❣️",
        "💕",
        "💞",
        "💓",
        "💗",
        "💖",
        "💘",
        "💝",
        "💟",
        "☮️",
        "✝️",
        "☪️",
        "🕉️",
        "☸️",
        "✡️",
        "☯️",
        "☦️",
        "🛐",
        "⛎",
        "♈",
        "♉",
        "♊",
        "♋",
        "♌",
        "♍",
        "♎",
        "♏",
        "♐",
        "♑",
        "♒",
        "♓",
        "📳",
        "📴",
        "⚠️",
        "🔞",
        "⛔",
        "🚫",
        "🚳",
        "🚭",
        "🚯",
        "🚰",
        "🚷",
        "🚸",
        "📶",
        "🎬",
        "🎵",
        "🎶",
        "➕",
        "➖",
        "✖️",
        "➗",
        "♾️",
        "❓",
        "❔",
        "❕",
        "❗️",
        "〰️",
        "💱",
        "💲",
        "♻️",
        "⚜️",
        "🔰",
        "🔱",
        "⭕",
        "✅",
        "☑️",
        "✔️",
        "❌",
        "❎",
      ],
    },
    flags: {
      icon: "🇧🇷",
      name: "Bandeiras",
      emojis: [
        "🇧🇷",
        "🇵🇹",
        "🇺🇸",
        "🇬🇧",
        "🇪🇸",
        "🇫🇷",
        "🇩🇪",
        "🇮🇹",
        "🇯🇵",
        "🇨🇳",
        "🇷🇺",
        "🇨🇦",
        "🇦🇺",
        "🇦🇷",
        "🇨🇱",
        "🇨🇴",
        "🇲🇽",
        "🇺🇾",
        "🇵🇾",
        "🇧🇴",
        "🇵🇪",
        "🇪🇨",
        "🇻🇪",
        "🇦🇩",
        "🇦🇪",
        "🇦🇫",
        "🇦🇬",
        "🇦🇮",
        "🇦🇱",
        "🇦🇲",
        "🇦🇴",
        "🇦🇹",
        "🇦🇼",
        "🇦🇿",
        "🇧🇦",
        "🇧🇧",
        "🇧🇩",
        "🇧🇪",
        "🇧🇫",
        "🇧🇬",
        "🇧🇭",
        "🇧🇮",
        "🇧🇯",
        "🇧🇲",
        "🇧🇳",
        "🇧🇸",
        "🇧🇹",
        "🇧🇼",
        "🇧🇾",
        "🇧🇿",
        "🇨🇭",
        "🇨🇮",
        "🇨🇲",
        "🇨🇷",
        "🇨🇺",
        "🇨🇻",
        "🇨🇾",
        "🇨🇿",
        "🇩🇰",
        "🇩🇲",
      ],
    },
  };

  const EMOJI_NAMES = {
    "😀": "sorriso smile feliz happy alegre riso",
    "😃": "sorriso smile feliz happy alegre riso grande",
    "😄": "sorriso smile feliz happy alegre riso olhos",
    "😁": "sorriso smile feliz happy alegre dentes",
    "😆": "sorriso smile feliz happy alegre gargalhada",
    "😅": "suor sorriso feliz happy alegre tenso",
    "😂": "chorar rir chorando de rir risada lol graça gracado",
    "🤣": "rolar de rir risada lol rindo",
    "😊": "feliz happy alegre bochecha",
    "😇": "anjo angel inocente",
    "🙂": "sorriso leve simples",
    "🙃": "de ponta cabeca invertido ironia",
    "😉": "piscadela piscar wink olho",
    "😌": "aliviado calmo paz",
    "😍": "coracao amor love apaixonado olhos",
    "🥰": "coracoes amor love apaixonado carinho",
    "😘": "beijo kiss amor love apaixonado sopro",
    "😗": "beijo kiss bico",
    "😙": "beijo kiss sorrindo",
    "😚": "beijo kiss fechados",
    "😋": "delicia gostoso nham hum lingua saboroso",
    "😛": "lingua careta brincalhao",
    "😝": "lingua piscando careta brincalhao",
    "😜": "lingua piscando careta brincalhao piscada",
    "🤪": "louco crazy divertido demente",
    "🤨": "desconfiado sobrolho questionador",
    "🧐": "monoculo investigador intelectual detetive",
    "🤓": "nerd intelectual oculos inteligente",
    "😎": "oculos sol legal style boss chique marrento",
    "🥸": "disfarce mascara bigode oculos",
    "🤩": "estrela star empolgado brilho deslumbramento",
    "🥳": "festa party comemoracao aniversario confete",
    "😏": "safado malicioso ironico desconfiado",
    "😒": "descontente chateado tedio",
    "😞": "triste chateado sad decepcionado",
    "😔": "triste pensativo sad cabisbaixo",
    "😟": "preocupado tenso aflito",
    "😕": "confuso duvida incerto",
    "🙁": "triste leve desapontado",
    "☹️": "triste chateado cara",
    "😣": "perseverante sofrendo tenso",
    "😖": "confundido frustrado agonia",
    "😫": "cansado tired fadiga exausto",
    "😩": "cansado esgotado tired lamento",
    "🥺": "por favor pedindo carinha triste pidão caridade gato de botas",
    "😢": "triste chorando choro sad cry lagrima",
    "😭": "triste chorando choro muito sad cry berro escandalo",
    "😤": "bravo triunfo orgulho vapor",
    "😠": "bravo com raiva angry chateado irritado",
    "😡": "bravo com muita raiva angry puto vermelho raivoso",
    "🤬": "xingando xingamento bravo puto angry palavrao",
    "🤯": "cabeca explodindo surpreso mind blown choque",
    "😳": "vergonha envergonhado corado espantado",
    "🥵": "calor quente hot verao suor",
    "🥶": "frio gelado cold inverno congelado",
    "😱": "medo assustado grito panico horror",
    "😨": "medo assustado pavor",
    "😰": "medo suor azul desespero",
    "😥": "triste aliviado sad cansado",
    "😓": "suor cansado esforco",
    "🤗": "abraco carinho bem vindo",
    "🤔": "pensando duvida reflexao questionamento",
    "🫣": "espiando olho espiada espiar medo",
    "🤭": "risinho mao boca segredo riso",
    "🫢": "surpreso assustado boca aberta",
    "🫡": "continencia respeito ordem sim senhor soldado militar",
    "🤫": "silencio shh quiet calado segredo",
    "🫠": "derretendo derreter calor vergonha",
    "🤥": "mentira mentiroso pinocquio pinóquio",
    "😶": "sem boca calado silencio",
    "😐": "neutro serio sem emocao",
    "😑": "neutro serio sem emocao olhos fechados",
    "😬": "careta tenso dentes nervoso",
    "🙄": "olhos revirando tedio tédio desdém saco cheio",
    "😯": "surpreso boca pequena espanto",
    "😦": "surpreso chocado boca aberta",
    "😧": "angustiado aflito",
    "😮": "surpreso espantado oh",
    "😲": "surpreso chocado boquiaberto",
    "🥱": "bocejo sono bocejar cansado",
    "😴": "dormindo sono zzz sleep sonolento",
    "🤤": "babando babar gostoso desejo",
    "😪": "sono rinite resfriado cansado",
    "😵": "tonto confuso espanto morte",
    "🤐": "boca fechada segredo zíper calado",
    "🥴": "bebado tonto grogue ressaca",
    "🤢": "enjoado nojo eca vomit nauseado",
    "🤮": "vomitando vomito eca vomit nauseado doente",
    "🤧": "espirro resfriado doente lenco gripado",
    "😷": "mascara doente protecao virus hospital",
    "🤒": "termometro doente febre doenca",
    "🤕": "machucado atadura doente cabeca machucada",
    "🤑": "dinheiro rico cash money din din",
    "🤠": "cowboy fazenda rodeio",
    "😈": "diabo devil demonio chifre roxo travesso",
    "👿": "diabo devil bravo angry roxo malvado",
    "👹": "ogro mascara vermelho monstro",
    "👺": "fantasma japones vermelho narigudo",
    "🤡": "palhaco joker clown circo risada zoacao",
    "💩": "coco bosta poop merda bosta feliz",
    "👻": "fantasma ghost halloween susto",
    "💀": "caveira morte skull dead perigo",
    "☠️": "caveira morte perigo pirate veneno",
    "👽": "alien extraterrestre ovni ufo space",
    "👾": "monster monstro game retro space invader",
    "🤖": "robo robot metal tecnologia",
    "🎃": "abobora pumpkin halloween dia das bruxas",
    "😺": "gato cat feliz sorrindo",
    "😸": "gato cat sorrindo dentes",
    "😹": "gato cat chorando de rir risada",
    "😻": "gato cat apaixonado love amor",
    "😼": "gato cat malicioso sorriso",
    "😽": "gato cat beijo olhos fechados",
    "🙀": "gato cat assustado medo surpreso",
    "😿": "gato cat triste choro chateado",
    "👋": "tchau aceno hello bye ola oi",
    "🤚": "mao levantada costas",
    "🖐️": "mao aberta dedos espalmados",
    "✋": "pare stop mao chega alto",
    "🖖": "vulcano spock star trek vida longa prospera",
    "👌": "ok perfeito perfect correto entendi",
    "🤌": "italiano que e isso cala a boca pergunta",
    "🤏": "pouco pequeno minúsculo pitada",
    "✌️": "paz peace vitoria dois numero",
    "🤞": "boa sorte sorte cruzados figas promessa",
    "🤟": "te amo rock metal love",
    "🤘": "metal rock chifre show",
    "🤙": "me liga telefone call hang loose surfista",
    "👈": "aponta esquerda lado",
    "👉": "aponta direita lado",
    "👆": "aponta cima indicador alto",
    "🖕": "dedo meio fodase foda-se ofensa insulto obsceno",
    "👇": "aponta baixo indicador",
    "☝️": "um aponta cima indicador atencao",
    "👍": "like joinha sim ok concordar top bom excelente",
    "👎": "dislike joinha nao ruim recusar reprovado",
    "✊": "punho levantado luta resistencia forca",
    "👊": "soco punch cumprimento bater",
    "🤛": "soco esquerda luta",
    "🤜": "soco direita luta",
    "👏": "palmas bater palmas parabens clap aplausos",
    "🙌": "comemorando maos para cima aleluia amem gracas deus",
    "👐": "maos abertas acolhimento",
    "🤲": "rezando maos juntas pedir oracao livro",
    "🤝": "aperto de mao acordo parceria negócios fechado",
    "🙏": "por favor obrigado rezar gratidao oracao amem namaste",
    "✍️": "escrevendo escrever caneta mao",
    "💅": "esmalte unha style vaidade beleza manicure",
    "🤳": "selfie foto celular camera",
    "💪": "forca biceps forte academia musculacao power",
    "🦾": "braco robotico robo cibernetico protese",
    "🦿": "perna robotica robo protese",
    "🦵": "perna coxa membro",
    "🦶": "pe foot pisar calcanhar",
    "👂": "ouvido escutar ear som escuta",
    "🦻": "aparelho auditivo surdo",
    "👃": "nariz cheiro nose respirar",
    "🧠": "cerebro inteligencia brain mente inteligência pensamentos",
    "🫀": "coracao organo anatomico vida saude",
    "🫁": "pulmao ar respirar oxigenio",
    "🦷": "dente tooth dentista sorriso",
    "🦴": "ossos bone esqueleto arqueologia",
    "👀": "olhos de olho vendo visualizado fofoca espiando curiando",
    "👁️": "olho visao ver assistir ocular",
    "👅": "lingua tongue lamber",
    "👄": "boca lips beijo falar",
    "💋": "beijo kiss marca batom amor love apaixonado",
    "🩸": "sangue blood doacao menstruacao ferimento",
    "❤️": "coracao vermelho amor love apaixonado coracao",
    "🧡": "coracao laranja carinho amizade",
    "💛": "coracao amarelo amizade sincero",
    "💚": "coracao verde esperanca natureza inveja",
    "💙": "coracao azul confianca lealdade",
    "💜": "coracao roxo nobreza luxo",
    "🖤": "coracao preto luto dor tristeza",
    "🤍": "coracao branco paz caridade pura",
    "🤎": "coracao marrom chocolate terra",
    "💔": "coracao partido triste fim chateado desamor magoa",
    "❤️‍🔥": "coracao fogo ardente paixao fervor",
    "❤️‍🩹": "coracao curando machucado recuperando melhora",
    "❣️": "exclamacao coracao amor exclamacao",
    "💕": "dois coracoes amor love apaixonados carinho",
    "💞": "coracoes giratorios amor apaixonado",
    "💓": "coracao batendo amor paixao pulsar",
    "💗": "coracao crescendo amor vibrante",
    "💖": "coracao brilhante amor estrelas",
    "💘": "coracao cupido flecha amor paixao romântico",
    "💝": "coracao presente fita amor namorados surpresa",
    "💟": "decoracao coracao estampa",
    "🐶": "cachorro cao dog pet filhote animal",
    "🐱": "gato cat felino pet animal miau",
    "🐭": "rato mouse roedor queijo animal",
    "🐹": "hamster roedor pet fofo",
    "🐰": "coelho rabbit pascoa fofo",
    "🦊": "raposa fox esperta animal",
    "🐻": "urso bear animal floresta",
    "🐼": "panda urso fofo china",
    "🐨": "koala urso eucalipto australia",
    "🐯": "tigre tiger felino listras animal",
    "🦁": "leao lion rei selva felino animal",
    "🐮": "vaca cow fazenda leite animal",
    "🐷": "porco pig fazenda bacon animal",
    "🐽": "nariz porco focinho",
    "🐸": "sapo frog anfibio lago",
    "🐵": "macaco monkey primata banana",
    "🙈": "macaco nao vejo cego segredo",
    "🙉": "macaco nao ouco surdo silencio",
    "🙊": "macaco nao falo mudo calado",
    "🐒": "macaco monkey corpo inteiro",
    "🐔": "galinha chicken fazenda ovo pena",
    "🐧": "pinguim penguin gelo polo",
    "🐦": "passaro bird voar pena cantar",
    "🐤": "pintinho pintinho amarelo voar",
    "🐣": "pintinho chocado nascendo casca",
    "🐥": "pintinho frente amarelo",
    "🦆": "pato duck lago lagoa",
    "🦅": "aguia eagle soberana voar caca",
    "🦉": "coruja owl sabedoria noite caca",
    "🦂": "escorpiao veneno deserto perigo",
    "🕸️": "teia aranha aranha teia",
    "🕷️": "aranha spider inseto veneno",
    "🐢": "tartaruga turtle devagar casco mar",
    "🐍": "cobra snake veneno perigo rastejar",
    "🦎": "lagarto lagartixa reptil",
    "🦖": "tiranossauro dino dinossauro dinossaur jurassic",
    "🦕": "sauropode dino dinossauro dinossaur gigante",
    "🐙": "polvo octopus mar molusco tentaculo",
    "🦑": "lula squid mar molusco",
    "🦐": "camarao shrimp comida frutos mar",
    "🦞": "lagosta lobster frutos mar vermelho",
    "🦀": "caranguejo crab praia mar pinça",
    "🐡": "baiacu pufferfish peixe mar espinho",
    "🐠": "peixe tropical peixe colorido aquario",
    "🐟": "peixe fish pescaria mar rio comida",
    "🐬": "golfinho dolphin mar inteligente fofo",
    "🐳": "baleia whale mar gigante esguicho",
    "🐋": "baleia baleia azul gigante mar",
    "🦈": "tubarao shark mar perigo caca dentes",
    "🐊": "jacare jacaré jacare-de-papo-amarelo reptil pantano",
    "🐅": "tigre tigre de bengala listras",
    "🐆": "leopardo onca pintada felino caca",
    "🐘": "elefante elephant tromba marfim gigante",
    "🐫": "camelo dromedario deserto areia",
    "🦒": "girafa giraffe pescoco alto savana",
    "🦘": "canguru kangaroo australia bolsa salto",
    "🐂": "boi ox fazenda chifre",
    "🐄": "vaca cow leite fazenda",
    "🐎": "cavalo horse corrida fazenda andar",
    "🐖": "porco pig corpo inteiro fazenda",
    "🐏": "carneiro ram chifre fazenda",
    "🐑": "ovelha sheep lã fazenda",
    "🐐": "cabra goat chifre fazenda",
    "🐕": "cachorro dog cao pet amigo",
    "🐩": "poodle cachorro pet chique",
    "🐈": "gato cat pet felino miau",
    "🐓": "galo rooster fazenda acordar pena",
    "🦃": "peru turkey acao gracas natal comida",
    "🦚": "pavao peacock colorido penas chique",
    "🦜": "papagaio parrot voar falar penas colorido",
    "🦩": "flamingo rosa lagoa elegante",
    "🌳": "arvore tree natureza verde folha",
    "🌴": "palmeira coqueiro praia calor sol",
    "🌱": "broto planta crescer semente terra",
    "🍀": "trevo quatro folhas sorte trevo",
    "🍁": "folha outono maple canada folha",
    "🍄": "cogumelo mushroom mario natureza floresta",
    "🌾": "arroz trigo agricultura colheita",
    "💐": "buque flores presente amor romance",
    "🌷": "tulipa flor holanda primavera",
    "🌹": "rosa flor rose amor romance namorados",
    "🥀": "flor murcha triste fim morte",
    "🌺": "hibisco flor praia havaiana",
    "🌸": "cerejeira flor sakura japao primavera",
    "🌻": "girassol flower sol amarelo semente",
    "☀️": "sol sun calor quente verao luz dia",
    "🌤️": "sol com nuvens tempo clima limpo",
    "☁️": "nuvem cloud nublado tempo cinza",
    "🌧️": "chuva rain chovendo agua guarda-chuva",
    "⛈️": "chuva raio tempestade temporal vento",
    "❄️": "neve snow frio gelo inverno",
    "🔥": "fogo fire quente chama calor queimar ardente",
    "🍏": "maca verde green apple saude fruta",
    "🍎": "maca vermelha red apple fruta pecado",
    "🍐": "pera pear fruta verde doce",
    "🍊": "laranja orange mexerica fruta suco",
    "🍋": "limao lemon azedo suco limonada",
    "🍌": "banana banana fruta macaco amarelo",
    "🍉": "melancia watermelon fruta gigante verao doce",
    "🍇": "uva grape fruta vinho passas doce",
    "🍓": "morango strawberry fruta vermelho sobremesa",
    "🍒": "cereja cherry fruta vermelho bolo docinho",
    "🍑": "pessego peach fruta doce bumbum",
    "🥭": "manga mango fruta doce amarela",
    "🍍": "abacaxi pineapple fruta azeda coroa caipirinha",
    "🥥": "coco coconut praia agua mar",
    "🥝": "kiwi kiwi verde azedo fruta",
    "🍅": "tomate tomato salada molho vermelho legumes",
    "🍆": "berinjela beringela legume roxo emoji-safado",
    "🥑": "abacate avocado legume saude guacamole",
    "🌽": "milho corn pipoca pamonha espiga fazenda",
    "🥕": "cenoura carrot legumes coelho bolo",
    "🥔": "batata potato batata frita purê carboidrato",
    "🥐": "croissant pão padaria cafe da manha frances",
    "🧀": "queijo cheese rato comida pizza",
    "🥚": "ovo egg frito gema galinha cafe",
    "🍳": "ovo frito frigideira cozinhar fritar",
    "🥓": "bacon porco defumado cafe da manha carne",
    "🍔": "hamburguer burger fast food sanduiche cheddar",
    "🍟": "batata frita fries fast food batatinha",
    "🍕": "pizza queijo calabresa fast food italia",
    "🥪": "sanduiche sandwich lanche pao queijo",
    "🥗": "salada salad saude alface legumes fitness",
    "🍝": "espaguete macarrao massas italia jantar",
    "🍣": "sushi peixe cru japao comida japonesa",
    "🍰": "bolo cake fatia doce sobremesa aniversario",
    "🧁": "cupcake docinho sobremesa granulado",
    "🍫": "chocolate barra doce cacau bombom sobremesa",
    "🍿": "pipoca popcorn cinema filme salgado manteiga",
    "🍩": "donut rosquinha doce sobremesa homer",
    "🍪": "cookie biscoito doce chocolate gotas",
    "🍯": "mel honey abelha doce pote urso",
    "🥛": "leite milk copo fazenda cafe",
    "☕": "cafe coffee quente xicara cappuccino despertador expresso",
    "🍺": "cerveja beer chopp bar copo brinde gelada",
    "🍻": "cervejas chopp brinde comemoracao bar brinde",
    "🥂": "champanhe taca brinde casamento festa comemoracao",
    "🍷": "vinho wine taca uva alcool adega",
    "🍹": "drink tropical coquetel bar praia canudo alcool",
    "⚽": "futebol soccer bola gol pelada jogo esporte",
    "🏀": "basquete basketball bola cesta jogo esporte nba",
    "🏈": "futebol americano rugby bola nfl esporte",
    "🎾": "tenis tennis bola raquete quadra esporte",
    "🎱": "sinuca bilhar bola preta 8 jogo bar",
    "🏓": "ping pong tenis mesa raquete bolinha jogo",
    "🏸": "peteca badminton raquete pena jogo",
    "🏹": "arco e flecha arqueiro mira caçador",
    "🎣": "pesca peixe pescaria vara anzol",
    "🥊": "boxe luva soco luta nocaute ufc",
    "🎿": "esqui neve frio ski esporte",
    "🏂": "snowboard prancha neve frio esporte",
    "🏆": "trofeu taca campeao vitoria primeiro prêmio ouro",
    "🥇": "medalha ouro ouro primeiro vencedor topo",
    "🥈": "medalha prata prata segundo vice",
    "🥉": "medalha bronze bronze terceiro",
    "🏅": "medalha esporte premio vitoria honoraria",
    "🎫": "ingresso ticket cinema show teatro evento bilhete",
    "🎭": "teatro mascara drama comedia arte ator",
    "🎨": "paleta pintura arte tinta pincel desenhar quadro",
    "🎬": "claquete cinema filme diretor gravando hollywood",
    "🎤": "microfone cantor cantar karaoke musica show voz",
    "🎧": "fone ouvido headphone musica som dj podcast escutar",
    "🎹": "piano teclado musica classico compositor",
    "🥁": "bateria drum baqueta musica ritmo rock",
    "🎸": "guitarra violao rock musica show solo",
    "🎻": "violino musica classico orquestra",
    "🎮": "videogame controle game playstation xbox nitendo jogo",
    "👾": "monster monstro game retro space invader alien",
    "🎯": "alvo dardo acerto centro pontaria precisao",
    "🎲": "dado dice jogo cassino tabuleiro sorte",
    "🧩": "quebra cabeca puzzle peca montar inteligência",
    "🎳": "boliche bowling pinos bola strikes pista jogo",
    "🚗": "carro vermelho carro viagem transito auto estrada",
    "🚕": "taxi carro amarelo transito corrida passageiro",
    "🚙": "suv jipe carro viagem 4x4",
    "🚌": "onibus bus transporte publico rodoviaria viagem",
    "🚑": "ambulancia socorro hospital medico saude emergência",
    "🚒": "bombeiro caminhao fogo incendio emergencia agua",
    "🚚": "caminhao truck carga frete estrada transporte",
    "🏍️": "moto motorcycle velocidade duas rodas transito",
    "🚲": "bicicleta bike pedal esporte saudavel ciclismo",
    "✈️": "aviao plane voar viagem aeroporto ferias turismo",
    "🚀": "foguete rocket space nasa lua decolar astros",
    "⛵": "barco boat veleiro mar navegar rio agua",
    "🚢": "navio cruzeiro transatlantico mar porto viagem",
    "⚓": "ancora anchor navio porto mar seguranca firme",
    "🗺️": "mapa rota direcao viagem bússola gps",
    "🧭": "bussola direcao norte agulha trilha viagem",
    "🌋": "vulcao erupcao lava fogo magma desastre",
    "🏠": "casa lar morada teto residencia familia",
    "🏰": "castelo medieval rei rainha princesa fortaleza",
    "⛪": "igreja rezar fe deus culto catolico capela",
    "🕌": "mesquita islamismo cultur islamica reza",
    "⛺": "barraca acampamento camping floresta noite",
    "🌅": "amanhecer sol nascente dia amanha acordar",
    "🌄": "sol nascendo montanha amanhecer dia",
    "🌇": "por do sol cidade sunset predios entardecer",
    "🌆": "cidade anoitecer predios crepusculo",
    "🌃": "noite estrelada cidade predios escuro lua",
    "🌉": "ponte bridge noite cidade agua",
    "🌌": "via lactea galaxia estrelas espaco constelacao",
    "💡": "lampada ideia luz brilho eletricidade clarear invencao",
    "🔦": "lanterna luz escuro bateria trilha acampamento",
    "🕯️": "vela luz fogo parafina ritual oracao escuro",
    "🔌": "tomada plugue tomada eletricidade energia conectar carregador",
    "🔋": "bateria battery pilha energia carga celular eletricidade",
    "💻": "computador notebook laptop pc escritorio internet home office",
    "⌨️": "teclado computador pc digitar escrever",
    "🖱️": "mouse controle pc computador seta clique",
    "💾": "disquete disk memoria retro antigo computador salvar",
    "💿": "cd dvd disco musica filme retro antigo",
    "📷": "camera foto fotografia lentes recordacao flash",
    "☎️": "telefone fixo antigo chamada disco",
    "📱": "celular smartphone telefone ligação zap whatsapp internet",
    "✉️": "envelope carta correio mensagem papel selo postal",
    "📦": "caixa pacote entrega correios encomenda correio compra",
    "📅": "calendario data dia mes ano agenda compromisso",
    "⌚": "relogio pulso hora tempo cronometro atrativo",
    "⏰": "relogio parede hora tempo despertador pontualidade",
    "🔑": "chave key abrir fechar trancar segredo fechadura porta",
    "🔨": "martelo hammer ferramenta prego construir reforma",
    "🪓": "machado ferramenta cortar lenha madeira floresta",
    "🪚": "serrote serra cortar madeira metal ferramenta",
    "🔧": "chave inglesa ferramenta aperto conserto reforma mecânico",
    "🪛": "chave fenda ferramenta parafuso conserto desmontar",
    "⚙️": "engrenagem engrenagem mecânica sistema processo roda motor",
    "🧲": "ima magnet atrair ferro metal polo atracao",
    "🔫": "pistola arma revólver perigo tiro bala fogo",
    "💣": "bomba bomb explosao pavio perigo guerra detonar",
    "🔪": "faca knife cortar carne cozinha afiada perigo",
    "🛡️": "escudo shield defesa protecao cavaleiro seguranca",
    "🚬": "charuto fumo tabaco fumaça cinzas chique",
    "⚰️": "caixao morte enterro cemiterio funeral luto triste",
    "🎁": "presente surpresa fita lacinho aniversario natal amizade",
    "🎈": "balao bexiga festa aniversario comemoracao colorido",
    "📖": "livro ler leitura estudo biblioteca saber cultura pagina",
    "🏷️": "etiqueta tag preço identificacao",
    "📎": "clipes papel prender escritorio papelaria",
    "📐": "regua medir cm comprimento matematica escola papelaria",
    "✂️": "tesoura cortar papel tecido papelaria costura",
    "🗑️": "lixo trash lixeira limpar sujeira reciclar descarte",
    "🔒": "cadeado trancado seguro seguranca privacidade fechar",
    "🔓": "cadeado aberto destrancado livre acesso seguro",
    "✒️": "caneta azul preta escrever assinatura papelaria",
    "✏️": "lapis grafite desenhar escrever escola papelaria",
    "💉": "seringa vacina injecao sangue hospital doenca saude",
    "💊": "pilula remedio comprimido farmacia doente saude medicina",
    "🩺": "estetoscopio medico coracao escuta saude hospital doutor",
    "🔬": "microscopio ciencia laboratorio bacteria celulas pesquisa",
    "🔭": "telescopio astronomia estrelas planetas espaco ceu olhar",
    "🚽": "privada banheiro descarga higiene numero dois",
    "🚿": "chuveiro banho agua higiene banheira calor",
    "🪞": "espelho reflexo vidro vaidade eu look",
    "🧼": "sabonete espuma banho lavar mao higiene cheiroso",
    "🧹": "vassoura varrer limpar casa sujeira faxina",
    "🧺": "cesta compras piquenique mercado basquete palha",
    "☮️": "paz peace pomba circulo harmonia",
    "✝️": "cruz cristo jesus fe religiao catolico",
    "✡️": "estrela davi judeu israel judaísmo religiao",
    "☯️": "yin yang equilibrio taoismo oriente filosofia",
    "♈": "aries carneiro signo zodiaco horoscopo",
    "♉": "touro taurus signo zodiaco horoscopo",
    "♊": "gemeos gemini signo zodiaco horoscopo",
    "♋": "cancer caranguejo signo zodiaco horoscopo",
    "♌": "leao leo signo zodiaco horoscopo",
    "♍": "virgem virgo signo zodiaco horoscopo",
    "♎": "libra balanca signo zodiaco horoscopo",
    "♏": "escorpiao scorpio signo zodiaco horoscopo",
    "♐": "sagitario sagittarius signo zodiaco horoscopo",
    "♑": "capricornio capricorn signo zodiaco horoscopo",
    "♒": "aquario aquarius signo zodiaco horoscopo",
    "♓": "peixes pisces signo zodiaco horoscopo",
    "⚠️": "atencao aviso perigo exclamacao triangulo amarelo alerta",
    "⛔": "proibido entrada restrito vermelho pare",
    "🎵": "musica nota nota musical som ritmo melodia",
    "➕": "mais somar positivo adicao",
    "➖": "menos subtrair negativo subtracao",
    "✖️": "multiplicar vezes multiplicacao conta matematica",
    "➗": "dividir divisao conta matematica",
    "❓": "pergunta interrogacao duvida incerteza que",
    "✔️": "concluido check correto sim verificado aprovado ok",
    "❌": "erro incorreto nao falso reprovado recusado x",
    "🇧🇷": "bandeira brasil brazil verde amarelo patriota nacional",
    "🇵🇹": "bandeira portugal lisboa europa terra",
    "🇺🇸": "bandeira eua usa estados unidos america dollar",
    "🇬🇧": "bandeira inglaterra uk reino unido london rainha",
    "🇪🇸": "bandeira espanha madrid touro europa",
    "🇫🇷": "bandeira franca paris torre eiffel europa",
    "🇩🇪": "bandeira alemanha berlim europa cerveja",
    "🇮🇹": "bandeira italia roma pizza massas europa",
    "🇯🇵": "bandeira japao toquio sushi oriental",
    "🇨🇳": "bandeira china pequim muralha oriente",
    "🇷🇺": "bandeira russia moscou frio",
    "🇨🇦": "bandeira canada maple frio neve folha",
    "🇦🇺": "bandeira australia canguru sydney",
    "🇦🇷": "bandeira argentina buenos aires obelisco hermanos messi",
    "🇨🇱": "bandeira chile santiago cordilheira",
    "🇨🇴": "bandeira colombia bogota cafe",
    "🇲🇽": "bandeira mexico taco sombrero tequila",
    "🇺🇾": "bandeira uruguai montevideo mate churrasco",
    "🇵🇾": "bandeira paraguai assuncao compras",
    "🇧🇴": "bandeira bolivia la paz altitude",
    "🇵🇪": "bandeira peru lima machu picchu",
    "🇪🇨": "bandeira equador quito galapagos",
    "🇻🇪": "bandeira venezuela caracas petroleo",
  };

  const style = document.createElement("style");
  style.innerHTML = `
        #wa-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--modal-backdrop, var(--overlay, rgba(11,20,26,0.85)));
          z-index: 10001;
          display: none;
          justify-content: center;
          align-items: center;
        }
        .wa-modal {
          background: var(--modal-background, var(--drawer-background, #111b21));
          border-top: 4px solid var(--WDS-persistent-always-branded, var(--icon-primary, #00a884));
          width: 440px;
          padding: 24px;
          border-radius: 8px;
          color: var(--primary-title, var(--primary, #d1d7db));
          font-family: var(--x1rl2gpv, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
          position: relative;
        }
        #wa-contatos-selecionados-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
          margin-bottom: 4px;
          max-height: 160px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .wa-contato-selecionado-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--search-input-background, var(--compose-input-background, #2a3942));
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-default, rgba(134,150,160,0.15));
        }
        .wa-contato-selecionado-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .wa-contato-selecionado-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-contato-selecionado-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wa-contato-selecionado-nome {
          font-size: 14px;
          color: var(--primary-strong, var(--primary, #e9edef));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }
        .wa-contato-selecionado-remover {
          color: var(--WDS-danger-emphasized, #ea0038);
          background: transparent;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }
        .wa-contato-selecionado-remover:hover {
          opacity: 0.7;
        }
        .wa-btn-adicionar-contato {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--WDS-persistent-always-branded, #25D366);
          border: 1px dashed var(--WDS-persistent-always-branded, #25D366);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 4px;
          margin-bottom: 12px;
          transition: background-color 0.2s;
          width: fit-content;
        }
        .wa-btn-adicionar-contato:hover {
          background-color: rgba(37, 211, 102, 0.08);
        }
        .wa-modal h2 {
          margin-top: 0;
          font-size: 18px;
          color: var(--modal-title, var(--primary, #e9edef));
          font-weight: normal;
        }
        .wa-modal label {
          display: block;
          font-size: 12px;
          color: var(--secondary, #8696a0);
          margin-top: 15px;
          margin-bottom: 5px;
        }
        .wa-modal input {
          background: var(--search-input-background, var(--compose-input-background, #2a3942));
          border: 1px solid var(--border-default, rgba(134,150,160,0.15));
          color: var(--primary-strong, var(--primary, #e9edef));
          padding: 10px;
          width: 100%;
          box-sizing: border-box;
          border-radius: 4px;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .wa-modal input:focus {
          border: 1px solid var(--WDS-persistent-always-branded, var(--input-border-active, #00a884));
        }
        .wa-modal input[type="datetime-local"] {
          position: relative;
        }
        .wa-modal input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 40px;
          height: 100%;
          opacity: 0 !important;
          cursor: pointer;
          z-index: 2;
          background: none;
        }
        .wa-modal-data-container:hover .wa-calendar-icon-wrapper {
          color: var(--primary-strong, var(--primary, #d1d7db)) !important;
        }
        .wa-modal-data-container:focus-within .wa-calendar-icon-wrapper {
          color: var(--primary-strong, var(--primary, #d1d7db)) !important;
        }
        .wa-btn {
          background: var(--WDS-persistent-always-branded, var(--icon-primary, #00a884));
          color: var(--WDS-content-on-accent, var(--white, #ffffff));
          border: none;
          padding: 12px;
          width: 100%;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
          font-size: 14px;
          text-transform: uppercase;
          transition: filter 0.2s;
        }
        .wa-btn:hover {
          filter: brightness(0.9);
        }
        .wa-close {
          color: var(--secondary, #8696a0);
          float: right;
          cursor: pointer;
          font-size: 20px;
        }
        .wa-close:hover {
          color: var(--primary, #e9edef);
        }

        .wa-modal-compose-bar {
          display: flex;
          align-items: flex-end;
          box-sizing: border-box;
          width: 100%;
          min-height: 62px;
          padding: 10px 16px;
          background-color: var(--WDS-systems-chat-surface-composer, var(--compose-panel-background, var(--panel-background-colored-deemphasized, #111b21)));
          border-top: 1px solid var(--border-default, rgba(134,150,160,0.15));
          margin-top: 10px;
          margin-bottom: 15px;
          border-radius: 8px;
        }
        .wa-compose-btn {
          background: transparent;
          border: none;
          color: var(--icon, #8696a0);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s, color 0.2s;
          flex-shrink: 0;
          margin-bottom: 4px;
        }
        .wa-compose-btn:hover {
          background-color: var(--background-default-hover, rgba(255,255,255,0.05));
          color: var(--primary-strong, var(--primary, #d1d7db));
        }
        .wa-compose-input-wrapper {
          flex: 1;
          background: var(--rich-text-panel-background, var(--compose-input-background, #2a3942));
          border-radius: 8px;
          margin: 0 10px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          min-height: 40px;
          box-sizing: border-box;
          border: 1px solid var(--compose-input-border, transparent);
        }
        .wa-modal textarea#wa-modal-msg {
          width: 100%;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          color: var(--compose-input-color, var(--primary, #e9edef)) !important;
          font-size: 15px;
          padding: 4px 0;
          resize: none;
          max-height: 120px;
          line-height: 1.4;
          box-sizing: border-box;
          min-height: 24px;
          font-family: inherit;
        }
        .wa-modal textarea#wa-modal-msg::placeholder {
          color: var(--input-placeholder, #8696a0);
        }

        #wa-emoji-picker {
          position: absolute;
          bottom: 110px;
          left: 24px;
          right: 24px;
          height: 380px;
          background: var(--dropdown-background, var(--background-default, #233138)) !important;
          border-radius: 8px;
          border: 1px solid var(--border-default, rgba(134,150,160,0.15)) !important;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.5);
          display: none;
          flex-direction: column;
          z-index: 10002;
          overflow: hidden;
          font-family: inherit;
        }
        .wa-emoji-search-wrapper {
          padding: 8px 12px;
          background: var(--dropdown-background, var(--background-default, #233138));
          flex-shrink: 0;
          display: flex;
          align-items: center;
          position: relative;
        }
        .wa-emoji-search-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          background: var(--search-input-background, var(--compose-input-background, #2a3942));
          border-radius: 8px;
          padding: 0 10px;
          height: 34px;
        }
        .wa-emoji-search-icon {
          color: var(--WDS-content-deemphasized, var(--icon-lighter, #8696a0));
          margin-right: 8px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .wa-emoji-search {
          width: 100%;
          background: transparent !important;
          border: none !important;
          color: var(--primary, #e9edef) !important;
          font-size: 14px !important;
          padding: 4px 0 !important;
          outline: none !important;
          box-sizing: border-box !important;
        }
        .wa-emoji-search:focus {
          border-color: transparent !important;
        }
        .wa-emoji-grid {
          overflow-y: auto;
          flex: 1;
          padding: 4px 8px;
        }
        .wa-emoji-grid::-webkit-scrollbar {
          width: 6px;
        }
        .wa-emoji-grid::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-thumb, rgba(255,255,255,0.15));
          border-radius: 3px;
        }
        .wa-emoji-tab {
          cursor: pointer;
          min-width: 44px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          color: var(--WDS-content-deemphasized, var(--icon-lighter, #8696a0));
          position: relative;
          flex-shrink: 0;
        }
        .wa-emoji-tab:hover, .wa-emoji-tab.active {
          color: var(--WDS-content-default, var(--icon-ack, #00a884));
        }
        .wa-emoji-tab.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 3px;
          background-color: var(--WDS-persistent-always-branded, var(--icon-primary, #00a884));
          border-radius: 3px 3px 0 0;
        }
        .wa-emoji-tab svg {
          width: 20px;
          height: 20px;
        }

        .wa-expressions-selector-bar {
          display: flex;
          height: 48px;
          background: var(--panel-header-background, var(--panel-background-colored, #1f2c34));
          border-top: 1px solid var(--border-default, rgba(134,150,160,0.15));
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wa-expression-selector-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          cursor: pointer;
          color: var(--WDS-content-deemphasized, var(--icon, #8696a0));
          transition: color 0.2s, background-color 0.2s;
        }
        .wa-expression-selector-tab:hover {
          background-color: var(--background-default-hover, rgba(255,255,255,0.05));
          color: var(--WDS-content-default, var(--icon-ack, #00a884));
        }
        .wa-expression-selector-tab.active {
          color: var(--WDS-content-default, var(--icon-ack, #00a884));
          border-top: 3px solid var(--WDS-persistent-always-branded, var(--icon-primary, #00a884));
        }
        .wa-expression-selector-tab.disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .wa-emoji-category-section {
          margin-bottom: 12px;
        }
        .wa-emoji-category-header {
          font-size: 11px;
          color: var(--secondary, #8696a0);
          padding: 6px 4px 4px 4px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .wa-emoji-category-grid-inner {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 4px;
        }
        .wa-emoji-item {
          font-size: 22px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 6px;
          user-select: none;
          transition: background-color 0.15s;
          box-sizing: border-box;
        }
        .wa-emoji-item:hover {
          background-color: var(--background-default-hover, rgba(255,255,255,0.08));
        }
        .wa-emoji-tabs {
          display: flex;
          background: var(--dropdown-background, var(--background-default, #233138));
          border-bottom: 1px solid var(--border-default, rgba(134,150,160,0.15));
          height: 46px;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          padding: 0 4px;
        }
        .wa-emoji-tabs::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome/Safari */
        }
    `;
  document.head.appendChild(style);

  const CATEGORY_SVGS = {
    recent: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M13 11.6V8C13 7.71667 12.9042 7.47917 12.7125 7.2875C12.5208 7.09583 12.2833 7 12 7C11.7167 7 11.4792 7.09583 11.2875 7.2875C11.0958 7.47917 11 7.71667 11 8V11.975C11 12.1083 11.025 12.2375 11.075 12.3625C11.125 12.4875 11.2 12.6 11.3 12.7L14.6 16C14.7833 16.1833 15.0167 16.275 15.3 16.275C15.5833 16.275 15.8167 16.1833 16 16C16.1833 15.8167 16.275 15.5833 16.275 15.3C16.275 15.0167 16.1833 14.7833 16 14.6L13 11.6ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.76667 4 12C4 14.2167 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"></path></svg>`,
    smileys: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M15.5 11C15.9167 11 16.2708 10.8542 16.5625 10.5625C16.8542 10.2708 17 9.91667 17 9.5C17 9.08333 16.8542 8.72917 16.5625 8.4375C16.2708 8.14583 15.9167 8 15.5 8C15.0833 8 14.7292 8.14583 14.4375 8.4375C14.1458 8.72917 14 9.08333 14 9.5C14 9.91667 14.1458 10.2708 14.4375 10.5625C14.7292 10.8542 15.0833 11 15.5 11ZM8.5 11C8.91667 11 9.27083 10.8542 9.5625 10.5625C9.85417 10.2708 10 9.91667 10 9.5C10 9.08333 9.85417 8.72917 9.5625 8.4375C9.27083 8.14583 8.91667 8 8.5 8C8.08333 8 7.72917 8.14583 7.4375 8.4375C7.14583 8.72917 7 9.08333 7 9.5C7 9.91667 7.14583 10.2708 7.4375 10.5625C7.72917 10.8542 8.08333 11 8.5 11ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20ZM12 17.5C12.9667 17.5 13.8583 17.2667 14.675 16.8C15.4917 16.3333 16.15 15.7 16.65 14.9C16.75 14.7 16.7417 14.5 16.625 14.3C16.5083 14.1 16.3333 14 16.1 14H7.9C7.66667 14 7.49167 14.1 7.375 14.3C7.25833 14.5 7.25 14.7 7.35 14.9C7.85 15.7 8.5125 16.3333 9.3375 16.8C10.1625 17.2667 11.05 17.5 12 17.5Z"></path></svg>`,
    animals: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M18 9L17.2 9.7C16.9667 9.91667 16.6917 10.025 16.375 10.025C16.0583 10.025 15.7833 9.93333 15.55 9.75C15.3167 9.56667 15.1583 9.33333 15.075 9.05C14.9917 8.76667 15 8.46667 15.1 8.15L15.5 6.9L14.65 6.4C14.3833 6.25 14.1958 6.03333 14.0875 5.75C13.9792 5.46667 13.9667 5.18333 14.05 4.9C14.1333 4.61667 14.3 4.39583 14.55 4.2375C14.8 4.07917 15.0833 4 15.4 4H16.4L16.7 3.05C16.8 2.73333 16.9708 2.47917 17.2125 2.2875C17.4542 2.09583 17.7167 2 18 2C18.2833 2 18.5458 2.09583 18.7875 2.2875C19.0292 2.47917 19.2 2.73333 19.3 3.05L19.6 4H20.6C20.9167 4 21.1958 4.07917 21.4375 4.2375C21.6792 4.39583 21.85 4.61667 21.95 4.9C22.0667 5.2 22.0667 5.49167 21.95 5.775C21.8333 6.05833 21.65 6.26667 21.4 6.4L20.5 6.9L20.9 8.15C21 8.46667 21.0083 8.77083 20.925 9.0625C20.8417 9.35417 20.6833 9.58333 20.45 9.75C20.2 9.93333 19.9208 10.025 19.6125 10.025C19.3042 10.025 19.0333 9.91667 18.8 9.7L18 9ZM18 7C18.2833 7 18.5208 6.90417 18.7125 6.7125C18.9042 6.52083 19 6.28333 19 6C19 5.71667 18.9042 5.47917 18.7125 5.2875C18.5208 5.09583 18.2833 5 18 5C17.7167 5 17.4792 5.09583 17.2875 5.2875C17.0958 5.47917 17 5.71667 17 6C17 6.28333 17.0958 6.52083 17.2875 6.7125C17.4792 6.90417 17.7167 7 18 7ZM13.8 17.9C14.1833 18.9 14.0583 19.8333 13.425 20.7C12.7917 21.5667 11.9 22 10.75 22C10.2 22 9.67917 21.8583 9.1875 21.575C8.69583 21.2917 8.33333 20.9167 8.1 20.45C6.71667 20.65 5.57083 20.2958 4.6625 19.3875C3.75417 18.4792 3.38333 17.3167 3.55 15.9C3.05 15.6167 2.66667 15.2292 2.4 14.7375C2.13333 14.2458 2 13.6833 2 13.05C2 12.0333 2.4625 11.2125 3.3875 10.5875C4.3125 9.9625 5.21667 9.83333 6.1 10.2L7.65 10.85C7.98333 10.3333 8.425 9.9125 8.975 9.5875C9.525 9.2625 10.1167 9.08333 10.75 9.05V7.75C10.75 7.53333 10.8208 7.35417 10.9625 7.2125C11.1042 7.07083 11.2833 7 11.5 7C11.7167 7 11.8958 7.07083 12.0375 7.2125C12.1792 7.35417 12.25 7.53333 12.25 7.75V9.25C12.8667 9.43333 13.375 9.72083 13.775 10.1125C14.175 10.5042 14.5167 11.05 14.8 11.75H16.25C16.4667 11.75 16.6458 11.8208 16.7875 11.9625C16.9292 12.1042 17 12.2833 17 12.5C17 12.7167 16.9292 12.8958 16.7875 13.0375C16.6458 13.1792 16.4667 13.25 16.25 13.25H14.95C14.9167 13.8833 14.7458 14.475 14.4375 15.025C14.1292 15.575 13.7167 16.0167 13.2 16.35L13.8 17.9ZM7.6 18.5C7.6 18.05 7.6375 17.6125 7.7125 17.1875C7.7875 16.7625 7.9 16.35 8.05 15.95C7.66667 16.1333 7.25417 16.2625 6.8125 16.3375C6.37083 16.4125 5.93333 16.4333 5.5 16.4C5.5 17.05 5.6875 17.5625 6.0625 17.9375C6.4375 18.3125 6.95 18.5 7.6 18.5ZM5.75 14.4C6.28333 14.4 6.75417 14.3333 7.1625 14.2C7.57083 14.0667 8.1 13.8 8.75 13.4L5.75 12.15C5.26667 11.95 4.85417 11.9542 4.5125 12.1625C4.17083 12.3708 4 12.7 4 13.15C4 13.5833 4.14167 13.9 4.425 14.1C4.70833 14.3 5.15 14.4 5.75 14.4ZM10.75 20C11.1667 20 11.5042 19.8542 11.7625 19.5625C12.0208 19.2708 12.0833 18.9667 11.95 18.65L10.6 15.25C10.2833 15.7833 10.0375 16.3167 9.8625 16.85C9.6875 17.3833 9.6 17.8667 9.6 18.3C9.6 18.85 9.69583 19.2708 9.8875 19.5625C10.0792 19.8542 10.3667 20 10.75 20ZM12.4 14.45C12.5667 14.2833 12.7 14.0625 12.8 13.7875C12.9 13.5125 12.95 13.225 12.95 12.925C12.95 12.3917 12.775 11.9417 12.425 11.575C12.075 11.2083 11.6417 11.025 11.125 11.025C10.825 11.025 10.5417 11.075 10.275 11.175C10.0083 11.275 9.78333 11.4167 9.6 11.6L11.55 12.5L12.4 14.45Z"></path></svg>`,
    food: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M5 21C4.71667 21 4.47917 20.9042 4.2875 20.7125C4.09583 20.5208 4 20.2833 4 20C4 19.7167 4.09583 19.4792 4.2875 19.2875C4.47917 19.0958 4.71667 19 5 19H19C19.2833 19 19.5208 19.0958 19.7125 19.2875C19.9042 19.4792 20 19.7167 20 20C20 20.2833 19.9042 20.5208 19.7125 20.7125C19.5208 20.9042 19.2833 21 19 21H5ZM8 17C6.9 17 5.95833 16.6083 5.175 15.825C4.39167 15.0417 4 14.1 4 13V5.225C4 4.60833 4.21667 4.08333 4.65 3.65C5.08333 3.21667 5.60833 3 6.225 3H20C20.55 3 21.0208 3.19583 21.4125 3.5875C21.8042 3.97917 22 4.45 22 5V8C22 8.55 21.8042 9.02083 21.4125 9.4125C21.0208 9.80417 20.55 10 20 10H18V13C18 14.1 17.6083 15.0417 16.825 15.825C16.0417 16.6083 15.1 17 14 17H8ZM18 8H20V5H18V8ZM14 15C14.55 15 15.0208 14.8042 15.4125 14.4125C15.8042 14.0208 16 13.55 16 13V5H10V5.4L11.8 6.85C11.8333 6.88333 11.9 7.01667 12 7.25V11.5C12 11.6333 11.95 11.75 11.85 11.85C11.75 11.95 11.6333 12 11.5 12H7.5C7.36667 12 7.25 11.95 7.15 11.85C7.05 11.75 7 11.6333 7 11.5V7.25C7 7.21667 7.06667 7.08333 7.2 6.85L9 5.4V5H6V13C6 13.55 6.19583 14.0208 6.5875 14.4125C6.97917 14.8042 7.45 15 8 15H14Z"></path></svg>`,
    activity: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M4.05 11H6.9a5.84 5.84 0 0 0-1.65-3.25q-.45.725-.763 1.537A7.7 7.7 0 0 0 4.05 11m13.05 0h2.85q-.125-.9-.437-1.713a9 9 0 0 0-.763-1.537A5.84 5.84 0 0 0 17.1 11M5.25 16.25A5.84 5.84 0 0 0 6.9 13H4.05q.125.9.438 1.713.312.812.762 1.537m13.5 0q.45-.725.762-1.537A7.7 7.7 0 0 0 19.95 13H17.1a5.84 5.84 0 0 0 1.65 3.25M8.95 11H11V4.05a8.8 8.8 0 0 0-2.463.737A7.5 7.5 0 0 0 6.5 6.2a8.6 8.6 0 0 1 1.613 2.163Q8.75 9.575 8.95 11M13 11h2.05q.2-1.426.837-2.637A8.6 8.6 0 0 1 17.5 6.2a7.5 7.5 0 0 0-2.037-1.413A8.8 8.8 0 0 0 13 4.05zm-2 8.95V13H8.95a8 8 0 0 1-.837 2.637A8.6 8.6 0 0 1 6.5 17.8q.9.875 2.037 1.412 1.138.539 2.463.738m2 0a8.8 8.8 0 0 0 2.463-.738A7.5 7.5 0 0 0 17.5 17.8a8.6 8.6 0 0 1-1.613-2.163A8 8 0 0 1 15.05 13H13zM12 22a9.7 9.7 0 0 1-3.9-.788 10.1 10.1 0 0 1-3.175-2.137q-1.35-1.35-2.137-3.175A9.7 9.7 0 0 1 2 12q0-2.075.788-3.9a10.1 10.1 0 0 1 2.137-3.175q1.35-1.35 3.175-2.137A9.7 9.7 0 0 1 12 2q2.075 0 3.9.788a10.1 10.1 0 0 1 3.175 2.137q1.35 1.35 2.137 3.175A9.7 9.7 0 0 1 22 12a9.7 9.7 0 0 1-.788 3.9 10.1 10.1 0 0 1-2.137 3.175q-1.35 1.35-3.175 2.137A9.7 9.7 0 0 1 12 22" fill="currentColor"></path></svg>`,
    travel: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M6 19V19.5C6 19.9167 5.85417 20.2708 5.5625 20.5625C5.27083 20.8542 4.91667 21 4.5 21C4.08333 21 3.72917 20.8542 3.4375 20.5625C3.14583 20.2708 3 19.9167 3 19.5V12.35C3 12.2333 3.00833 12.1167 3.025 12C3.04167 11.8833 3.06667 11.775 3.1 11.675L4.975 6.35C5.10833 5.95 5.35 5.625 5.7 5.375C6.05 5.125 6.44167 5 6.875 5H17.125C17.5583 5 17.95 5.125 18.3 5.375C18.65 5.625 18.8917 5.95 19.025 6.35L20.9 11.675C20.9333 11.775 20.9583 11.8833 20.975 12C20.9917 12.1167 21 12.2333 21 12.35V19.5C21 19.9167 20.8542 20.2708 20.5625 20.5625C20.2708 20.8542 19.9167 21 19.5 21C19.0833 21 18.7292 20.8542 18.4375 20.5625C18.1458 20.2708 18 19.9167 18 19.5V19H6ZM5.8 10H18.2L17.15 7H6.85L5.8 10ZM7.5 16C7.91667 16 8.27083 15.8542 8.5625 15.5625C8.85417 15.2708 9 14.9167 9 14.5C9 14.0833 8.85417 13.7292 8.5625 13.4375C8.27083 13.1458 7.91667 13 7.5 13C7.08333 13 6.72917 13.1458 6.4375 13.4375C6.14583 13.7292 6 14.0833 6 14.5C6 14.9167 6.14583 15.2708 6.4375 15.5625C6.72917 15.8542 7.08333 16 7.5 16ZM16.5 16C16.9167 16 17.2708 15.8542 17.5625 15.5625C17.8542 15.2708 18 14.9167 18 14.5C18 14.0833 17.8542 13.7292 17.5625 13.4375C17.2708 13.1458 16.9167 13 16.5 13C16.0833 13 15.7292 13.1458 15.4375 13.4375C15.1458 13.7292 15 14.0833 15 14.5C15 14.9167 15.1458 15.2708 15.4375 15.5625C15.7292 15.8542 16.0833 16 16.5 16ZM5 17H19V12H5V17Z"></path></svg>`,
    objects: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M12 22C11.5667 22 11.175 21.8958 10.825 21.6875C10.475 21.4792 10.2 21.2 10 20.85C9.45 20.85 8.97917 20.6542 8.5875 20.2625C8.19583 19.8708 8 19.4 8 18.85V15.3C7.01667 14.65 6.22917 13.7917 5.6375 12.725C5.04583 11.6583 4.75 10.5 4.75 9.25C4.75 7.23333 5.45417 5.52083 6.8625 4.1125C8.27083 2.70417 9.98333 2 12 2C14.0167 2 15.7292 2.70417 17.1375 4.1125C18.5458 5.52083 19.25 7.23333 19.25 9.25C19.25 10.5333 18.9542 11.7 18.3625 12.75C17.7708 13.8 16.9833 14.65 16 15.3V18.85C16 19.4 15.8042 19.8708 15.4125 20.2625C15.0208 20.6542 14.55 20.85 14 20.85C13.8 21.2 13.525 21.4792 13.175 21.6875C12.825 21.8958 12.4333 22 12 22ZM10 18.85H14V17.95H10V18.85ZM10 16.95H14V16H10V16.95ZM9.8 14H11.25V11.3L9.575 9.625C9.425 9.475 9.35 9.3 9.35 9.1C9.35 8.9 9.425 8.725 9.575 8.575C9.725 8.425 9.9 8.35 10.1 8.35C10.3 8.35 10.475 8.425 10.625 8.575L12 9.95L13.375 8.575C13.525 8.425 13.7 8.35 13.9 8.35C14.1 8.35 14.275 8.425 14.425 8.575C14.575 8.725 14.65 8.9 14.65 9.1C14.65 9.3 14.575 9.475 14.425 9.625L12.75 11.3V14H14.2C15.1 13.5667 15.8333 12.9292 16.4 12.0875C16.9667 11.2458 17.25 10.3 17.25 9.25C17.25 7.78333 16.7417 6.54167 15.725 5.525C14.7083 4.50833 13.4667 4 12 4C10.5333 4 9.29167 4.50833 8.275 5.525C7.25833 6.54167 6.75 7.78333 6.75 9.25C6.75 10.3 7.03333 11.2458 7.6 12.0875C8.16667 12.9292 8.9 13.5667 9.8 14Z"></path></svg>`,
    symbols: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M10 4H4C3.71667 4 3.47917 3.90417 3.2875 3.7125C3.09583 3.52083 3 3.28333 3 3C3 2.71667 3.09583 2.47917 3.2875 2.2875C3.47917 2.09583 3.71667 2 4 2H10C10.2833 2 10.5208 2.09583 10.7125 2.2875C10.9042 2.47917 11 2.71667 11 3C11 3.28333 10.9042 3.52083 10.7125 3.7125C10.5208 3.90417 10.2833 4 10 4ZM6 7H4C3.71667 7 3.47917 6.90417 3.2875 6.7125C3.09583 6.52083 3 6.28333 3 6C3 5.71667 3.09583 5.47917 3.2875 5.2875C3.47917 5.09583 3.71667 5 4 5H10C10.2833 5 10.5208 5.09583 10.7125 5.2875C10.9042 5.47917 11 5.71667 11 6C11 6.28333 10.9042 6.52083 10.7125 6.7125C10.5208 6.90417 10.2833 7 10 7H8V10C8 10.2833 7.90417 10.5208 7.7125 10.7125C7.52083 10.9042 7.28333 11 7 11C6.71667 11 6.47917 10.9042 6.2875 10.7125C6.09583 10.5208 6 10.2833 6 10V7ZM14.4 20.9C14.2167 21.0833 13.9833 21.175 13.7 21.175C13.4167 21.175 13.1833 21.0833 13 20.9C12.8167 20.7167 12.725 20.4833 12.725 20.2C12.725 19.9167 12.8167 19.6833 13 19.5L19.4 13.1C19.5833 12.9167 19.8167 12.825 20.1 12.825C20.3833 12.825 20.6167 12.9167 20.8 13.1C20.9833 13.2833 21.075 13.5167 21.075 13.8C21.075 14.0833 20.9833 14.3167 20.8 14.5L14.4 20.9ZM14.5 16C14.0667 16 13.7083 15.8583 13.425 15.575C13.1417 15.2917 13 14.9333 13 14.5C13 14.0667 13.1417 13.7083 13.425 13.425C13.7083 13.1417 14.0667 13 14.5 13C14.9333 13 15.2917 13.1417 15.575 13.425C15.8583 13.7083 16 14.0667 16 14.5C16 14.9333 15.8583 15.2917 15.575 15.575C15.2917 15.8583 14.9333 16 14.5 16ZM19.5 21C19.0667 21 18.7083 20.8583 18.425 20.575C18.1417 20.2917 18 19.9333 18 19.5C18 19.0667 18.1417 18.7083 18.425 18.425C18.7083 18.1417 19.0667 18 19.5 18C19.9333 18 20.2917 18.1417 20.575 18.425C20.8583 18.7083 21 19.0667 21 19.5C21 19.9333 20.8583 20.2917 20.575 20.575C20.2917 20.8583 19.9333 21 19.5 21ZM15.5 11C14.8167 11 14.2292 10.7542 13.7375 10.2625C13.2458 9.77083 13 9.18333 13 8.5C13 7.81667 13.2458 7.22083 13.7375 6.7125C14.2292 6.20417 14.8167 5.95 15.5 5.95C15.7 5.95 15.8792 5.9625 16.0375 5.9875C16.1958 6.0125 16.35 6.05 16.5 6.1V3C16.5 2.71667 16.5958 2.47917 16.7875 2.2875C16.9792 2.09583 17.2167 2 17.5 2H20C20.2833 2 20.5208 2.09583 20.7125 2.2875C20.9042 2.47917 21 2.71667 21 3C21 3.28333 20.9042 3.52083 20.7125 3.7125C20.5208 3.90417 20.2833 4 20 4H18V8.5C18 9.18333 17.7542 9.77083 17.2625 10.2625C16.7708 10.7542 16.1833 11 15.5 11ZM5.5 22C4.81667 22 4.22917 21.7458 3.7375 21.2375C3.24583 20.7292 3 20.1333 3 19.45C3 19.15 3.0625 18.8458 3.1875 18.5375C3.3125 18.2292 3.5 17.95 3.75 17.7L4.8 16.65L4.45 16.3C4.2 16.05 4.0125 15.7792 3.8875 15.4875C3.7625 15.1958 3.7 14.8833 3.7 14.55C3.7 13.8667 3.94583 13.2792 4.4375 12.7875C4.92917 12.2958 5.51667 12.05 6.2 12.05C6.88333 12.05 7.47083 12.2958 7.9625 12.7875C8.45417 13.2792 8.7 13.8667 8.7 14.55C8.7 14.8833 8.64583 15.1958 8.5375 15.4875C8.42917 15.7792 8.25 16.05 8 16.3L7.65 16.65L8.35 17.35L9.025 16.675C9.225 16.475 9.4625 16.3792 9.7375 16.3875C10.0125 16.3958 10.25 16.5 10.45 16.7C10.6333 16.9 10.7292 17.1333 10.7375 17.4C10.7458 17.6667 10.65 17.9 10.45 18.1L9.75 18.8L10.45 19.5C10.6333 19.6833 10.725 19.9167 10.725 20.2C10.725 20.4833 10.6333 20.7167 10.45 20.9C10.2667 21.0833 10.0333 21.175 9.75 21.175C9.46667 21.175 9.23333 21.0833 9.05 20.9L8.35 20.2L7.3 21.25C7.05 21.5 6.77083 21.6875 6.4625 21.8125C6.15417 21.9375 5.83333 22 5.5 22ZM6.2 15.25L6.55 14.9C6.6 14.85 6.6375 14.8 6.6625 14.75C6.6875 14.7 6.7 14.6333 6.7 14.55C6.7 14.4 6.65 14.2792 6.55 14.1875C6.45 14.0958 6.33333 14.05 6.2 14.05C6.06667 14.05 5.95 14.0958 5.85 14.1875C5.75 14.2792 5.7 14.4 5.7 14.55C5.7 14.6 5.7125 14.6583 5.7375 14.725C5.7625 14.7917 5.8 14.85 5.85 14.9L6.2 15.25ZM5.45 20C5.5 20 5.56667 19.9875 5.65 19.9625C5.73333 19.9625 5.8 19.9 5.85 19.85L6.95 18.8L6.25 18.1L5.15 19.15C5.1 19.2 5.0625 19.2583 5.0375 19.325C5.0125 19.3917 5 19.4667 5 19.55C5 19.6833 5.04167 19.7917 5.125 19.875C5.20833 19.9583 5.31667 20 5.45 20Z"></path></svg>`,
    flags: `<svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M7 14V20C7 20.2833 6.90417 20.5208 6.7125 20.7125C6.52083 20.9042 6.28333 21 6 21C5.71667 21 5.47917 20.9042 5.2875 20.7125C5.09583 20.5208 5 20.2833 5 20V5C5 4.71667 5.09583 4.47917 5.2875 4.2875C5.47917 4.09583 5.71667 4 6 4H13.175C13.4083 4 13.6167 4.075 13.8 4.225C13.9833 4.375 14.1 4.56667 14.15 4.8L14.4 6H19C19.2833 6 19.5208 6.09583 19.7125 6.2875C19.9042 6.47917 20 6.71667 20 7V15C20 15.2833 19.9042 15.5208 19.7125 15.7125C19.5208 15.9042 19.2833 16 19 16H13.825C13.5917 16 13.3833 15.925 13.2 15.775C13.0167 15.625 12.9 15.4333 12.85 15.2L12.6 14H7ZM14.65 14H18V8H13.575C13.3417 8 13.1333 7.925 12.95 7.775C12.7667 7.625 12.65 7.43333 12.6 7.2L12.35 6H7V12H13.425C13.6583 12 13.8667 12.075 14.05 12.225C14.2333 12.375 14.35 12.5667 14.4 12.8L14.65 14Z"></path></svg>`,
  };

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
        <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z"></path><path d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z"></path></svg>
      </div>
      <div class="wa-expression-selector-tab disabled" title="GIFs (Desativado)">
        <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M19 10.5H21V9H19V7.5H21V6H17.5V12H19V10.5ZM13 12H14.5V6H13V12ZM9.5 9H11.5V10.5H9.5V12H8V6H11.5V7.5H9.5V9ZM2 4H22C23.1 4 24 4.9 24 6V18C24 19.1 23.1 20 22 20H2C0.9 20 0 19.1 0 18V6C0 4.9 0.9 4 2 4ZM2 6V18H22V6H2Z"></path></svg>
      </div>
      <div class="wa-expression-selector-tab disabled" title="Figurinhas (Desativado)">
        <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M18.5 2H5.5C4.12 2 3 3.12 3 4.5V19.5C3 20.88 4.12 22 5.5 22H14L21 15V4.5C21 3.12 19.88 2 18.5 2ZM5.5 20C5.22 20 5 19.78 5 19.5V4.5C5 4.22 5.22 4 5.5 4H18.5C18.78 4 19 4.22 19 4.5V14H15V18H5.5V20ZM17 18V16H19L17 18Z"></path></svg>
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
          <!-- Preview oculto para compatibilidade com o JS legível -->
          <span id="wa-modal-etiqueta-preview" style="display: none !important;"></span>
          
          <!-- Lado Esquerdo: Ícone da Etiqueta Colorido que abre o Color Picker (estilo WhatsApp) -->
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
          
          <!-- Lado Direito: Texto "Etiqueta" e Input de Linha de Texto -->
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
      <div class="wa-modal-compose-bar">
        <button type="button" class="wa-compose-btn" title="Anexar">
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

  // Funcionalidade do Emoji Picker
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
        // Se a seção passou da metade superior ou está no topo
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
    emojiTargetInput = modalMsg; // Direciona emoji para o campo de mensagem
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
  const labelInputEscrita = overlay.querySelector(
    "#wa-modal-etiqueta-input-escrita",
  );

  if (labelEmojiTrigger && labelInputEscrita) {
    labelEmojiTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      emojiTargetInput = labelInputEscrita; // Direciona emoji para o campo da etiqueta
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
      const target = emojiTargetInput || modalMsg;
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
    if (
      emojiPicker.style.display === "flex" &&
      !emojiPicker.contains(e.target) &&
      e.target !== emojiTrigger &&
      !emojiTrigger.contains(e.target) &&
      e.target !== labelEmojiTrigger &&
      !(labelEmojiTrigger && labelEmojiTrigger.contains(e.target))
    ) {
      emojiPicker.style.display = "none";
    }
  });

  document.getElementById("wa-fechar-modal").addEventListener("click", () => {
    document.getElementById("wa-modal-overlay").style.display = "none";
    emojiPicker.style.display = "none";
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
  });

  document
    .getElementById("wa-btn-adicionar-contato")
    .addEventListener("click", () => {
      // PASSO 1: Salvar o estado dos inputs de texto e data do modal atual em variáveis temporárias.
      // Isso impede que o usuário perca o que já digitou ao fechar o modal para buscar mais contatos.
      tempMsgText = document.getElementById("wa-modal-msg").value;
      tempScheduleDate = document.getElementById("wa-modal-data").value;

      // PASSO 2: Ocultar visualmente o modal de agendamento e o seletor de emojis.
      document.getElementById("wa-modal-overlay").style.display = "none";
      emojiPicker.style.display = "none";

      const drawer = document.querySelector(
        'div[data-testid="new-chat-drawer"]',
      );
      const painel = document.getElementById("wa-painel-injetado");
      if (drawer && painel) {
        // PASSO 3: Se a gaveta de Nova Conversa já está aberta e o painel WAgenda está injetado nela:
        // Apenas ocultamos o nosso painel WAgenda (`painel.style.display = "none"`) e removemos a estilização 'sequestrada'
        // para revelar de forma instantânea a lista e barra de busca nativas do WhatsApp Web, sem fechar/reabrir nada.
        painel.style.display = "none";
        drawer.classList.remove("wa-gaveta-sequestrada");
        const btnFiltro = drawer.querySelector("#wa-btn-filtro");
        if (btnFiltro)
          btnFiltro.style.setProperty("display", "none", "important");
        mudarTituloGaveta(drawer, "Agendar nova mensagem");
        modoAgendamento = true;
      } else {
        // PASSO 4: Se a gaveta não estava aberta, ativamos o fluxo padrão.
        // Habilitamos a flag `pularPainelEIrDiretoParaBusca` para que, ao carregar a gaveta, ela vá direto para a busca nativa.
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

    // Cria a lista de agendamentos para cada contato selecionado
    const dataList = contatosSelecionados.map((contato, idx) => {
      // Usamos IDs ligeiramente diferentes para que os alarmes funcionem de forma única
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
      };
    });

    chrome.runtime.sendMessage(
      {
        action: "agendar_mensagem_multipla",
        dataList: dataList,
      },
      () => {
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
        imgUrl = "";

        document.getElementById("btn-agenda-wa").click();
        atualizarContadorBadge();
      },
    );
  });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "executar_robo") {
    if (!roboTrabalhando) {
      clearTimeout(timerAgrupamento);
      timerAgrupamento = setTimeout(() => processarFila(), 500);
    }
  }
});

let bloqueadorTeclado = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

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

function processarFila() {
  if (roboTrabalhando) return;
  roboTrabalhando = true;

  chrome.storage.local.get({ mensagensPendentes: [] }, (result) => {
    const agora = Date.now();
    // Filtra mensagens que já venceram (ou vencem nos próximos 5 segundos para tolerância de sincronia)
    const devidas = result.mensagensPendentes.filter(
      (item) => item.tempo <= agora + 5000,
    );

    if (devidas.length === 0) {
      roboTrabalhando = false;
      return;
    }

    // ORDENAÇÃO: Ascendente (Antigo -> Novo)
    devidas.sort((a, b) => a.tempo - b.tempo);

    const tarefaAtual = devidas[0];
    mostrarBloqueador(
      tarefaAtual.nome,
      tarefaAtual.agendador,
      tarefaAtual.criadoEm,
    );

    iniciarFluxoDeEnvio(tarefaAtual.nome, tarefaAtual.mensagem, () => {
      removerBloqueador();
      chrome.storage.local.get(
        { mensagensPendentes: [], historicoMensagens: [] },
        (res) => {
          const historico = res.historicoMensagens || [];
          historico.push({
            ...tarefaAtual,
            enviadoEm: Date.now(),
          });

          chrome.storage.local.set(
            {
              historicoMensagens: historico,
              mensagensPendentes: res.mensagensPendentes.filter(
                (i) => i.id !== tarefaAtual.id,
              ),
            },
            () => {
              renderizarLista();
              renderizarHistorico();
              atualizarContadorBadge();
              roboTrabalhando = false;
              setTimeout(() => processarFila(), 1000);
            },
          );
        },
      );
    });
  });
}

function simularDigitacao(el, text) {
  el.focus();
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set;
    if (setter) setter.call(el, text);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    document.execCommand("insertText", false, text);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function iniciarFluxoDeEnvio(nome, msg, finalizar) {
  const btnConversas = document.querySelector('button[aria-label="Conversas"]');
  if (btnConversas) {
    simularClique(btnConversas);
  }

  setTimeout(() => {
    const btn =
      document.querySelector('button[aria-label="Nova conversa"]') ||
      document
        .querySelector('span[data-icon="new-chat-outline"]')
        ?.closest("button");
    if (btn) btn.click();
    setTimeout(() => {
      const search =
        document.querySelector('input[data-tab="3"]') ||
        document.querySelector('input[role="textbox"]');
      if (!search) return finalizar();
      simularDigitacao(search, nome);
      setTimeout(() => {
        const contato = document.querySelector(`span[title="${nome}"]`);
        if (contato) {
          const card =
            contato.closest('div[data-testid="cell-frame-container"]') ||
            contato.closest('div[role="listitem"]');
          card.dispatchEvent(
            new MouseEvent("click", { bubbles: true, cancelable: true }),
          );
          setTimeout(() => {
            const caixa =
              document.querySelector(
                'div[contenteditable="true"][data-tab="10"]',
              ) || document.querySelector('div[title="Mensagem"]');
            if (caixa) {
              simularDigitacao(caixa, msg);
              setTimeout(() => {
                const enviar =
                  document.querySelector('button[aria-label="Enviar"]') ||
                  document
                    .querySelector('span[data-testid="wds-ic-send-filled"]')
                    ?.closest("button") ||
                  document
                    .querySelector('span[data-icon="send"]')
                    ?.closest("button");
                if (enviar) enviar.click();
                setTimeout(finalizar, 1000);
              }, 500);
            } else finalizar();
          }, 1500);
        } else {
          const back =
            document.querySelector('button[aria-label="Voltar"]') ||
            document
              .querySelector('span[data-icon="back-refreshed"]')
              ?.closest("button");
          if (back) back.click();
          finalizar();
        }
      }, 1500);
    }, 1500);
  }, 400);
}
