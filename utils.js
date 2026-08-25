// Helper utility functions for WAgenda

function svgNativo() {
  return `<div class="sa-item-avatar-default" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; border-radius: 50%; background: #103529; color: #25d366;"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"></path></svg></div>`;
}

function simularClique(elemento, nomeElemento = "elemento") {
  if (!elemento) return;
  try {
    elemento.focus?.();

    const rect = elemento.getBoundingClientRect?.() || {
      left: 100,
      top: 100,
      width: 20,
      height: 20,
    };
    const x = rect.left + Math.max(1, rect.width / 2);
    const y = rect.top + Math.max(1, rect.height / 2);

    const eventProps = {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: 1,
      button: 0,
      buttons: 1,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
    };

    // 1. Pointer events
    try {
      elemento.dispatchEvent(new PointerEvent("pointerdown", eventProps));
    } catch (e) {}

    // 2. Mouse events
    try {
      elemento.dispatchEvent(new MouseEvent("mousedown", eventProps));
    } catch (e) {}

    try {
      elemento.dispatchEvent(
        new PointerEvent("pointerup", { ...eventProps, buttons: 0 }),
      );
    } catch (e) {}

    try {
      elemento.dispatchEvent(
        new MouseEvent("mouseup", { ...eventProps, buttons: 0 }),
      );
    } catch (e) {}

    // 3. Clique nativo e evento de clique com bubbling
    if (typeof elemento.click === "function") {
      elemento.click();
    }
    try {
      elemento.dispatchEvent(
        new MouseEvent("click", { ...eventProps, buttons: 0 }),
      );
    } catch (e) {}
  } catch (e) {
    console.error(`[WAgenda] Erro ao disparar clique em ${nomeElemento}:`, elemento, e);
  }
}

function simularDigitacao(el, text) {
  if (!el) return;
  el.focus();
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    try {
      el.select();
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);
    } catch (e) {}

    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    if (setter) setter.call(el, text);
    else el.value = text;

    el.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: text,
      }),
    );
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    el.focus();
    try {
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);
      document.execCommand("insertText", false, text);
    } catch (e) {}
    el.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: text,
      }),
    );
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
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
      const pureMsgEl = msgEl.querySelector(".wa-msg-texto-puro");
      tooltipText = pureMsgEl
        ? pureMsgEl.textContent || pureMsgEl.innerText
        : msgEl.textContent || msgEl.innerText;
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
