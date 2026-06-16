// WAgenda - Content Script Initialization

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
      injetarModalEstilos();
      observarGavetaNativa();
      inicializarTooltipDelegation();
      inicializado = true;
    }
    injetarBotaoHeader(header);
  }
});
observer.observe(document.body, { childList: true, subtree: true });
