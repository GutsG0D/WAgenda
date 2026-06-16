// WAgenda Scheduler for processing the messaging queue

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "executar_robo") {
    if (!roboTrabalhando) {
      clearTimeout(timerAgrupamento);
      timerAgrupamento = setTimeout(() => processarFila(), 500);
    }
  }
});

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

    iniciarFluxoDeEnvio(tarefaAtual, () => {
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

function iniciarFluxoDeEnvio(tarefa, finalizar) {
  const { nome, mensagem, anexo } = tarefa;

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
              if (anexo) {
                try {
                  const byteCharacters = atob(anexo.base64.split(",")[1]);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: anexo.tipo });
                  
                  const file = new File([blob], anexo.nome, { type: anexo.tipo });
                  
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  const pasteEvent = new ClipboardEvent("paste", {
                    bubbles: true,
                    cancelable: true,
                    clipboardData: dataTransfer,
                  });
                  caixa.dispatchEvent(pasteEvent);

                  let tentativasLegenda = 0;
                  const intervalLegenda = setInterval(() => {
                    const caixaLegenda =
                      document.querySelector('div[data-testid="media-caption-input-container"]') ||
                      document.querySelector('div[title="Adicionar legenda"]');
                    
                    tentativasLegenda++;
                    if (caixaLegenda) {
                      clearInterval(intervalLegenda);
                      
                      if (mensagem) {
                        simularDigitacao(caixaLegenda, mensagem);
                      }
                      
                      let tentativasEnviar = 0;
                      const intervalEnviar = setInterval(() => {
                        const enviar =
                          document.querySelector('div[role="button"][aria-label^="Enviar"]') ||
                          document.querySelector('button[aria-label^="Enviar"]') ||
                          document
                            .querySelector('span[data-testid="wds-ic-send-filled"]')
                            ?.closest('div[role="button"], button') ||
                          document
                            .querySelector('span[data-icon="send"]')
                            ?.closest('div[role="button"], button');
                            
                        tentativasEnviar++;
                        
                        if (enviar && enviar.getAttribute("aria-disabled") !== "true") {
                          clearInterval(intervalEnviar);
                          enviar.click();
                          setTimeout(finalizar, 2500); // 2.5s para garantir conclusão do upload
                        } else if (tentativasEnviar > 30) { // limite de 6 segundos
                          clearInterval(intervalEnviar);
                          if (enviar) enviar.click();
                          setTimeout(finalizar, 2500);
                        }
                      }, 200);
                      
                    } else if (tentativasLegenda > 25) { // limite de 5 segundos
                      clearInterval(intervalLegenda);
                      finalizar();
                    }
                  }, 200);
                } catch (err) {
                  console.error("Erro ao processar anexo:", err);
                  simularDigitacao(caixa, mensagem);
                  setTimeout(() => {
                    const enviar =
                      document.querySelector('div[role="button"][aria-label^="Enviar"]') ||
                      document.querySelector('button[aria-label^="Enviar"]') ||
                      document
                        .querySelector('span[data-testid="wds-ic-send-filled"]')
                        ?.closest('div[role="button"], button') ||
                      document
                        .querySelector('span[data-icon="send"]')
                        ?.closest('div[role="button"], button');
                    if (enviar) enviar.click();
                    setTimeout(finalizar, 1000);
                  }, 500);
                }
              } else {
                simularDigitacao(caixa, mensagem);
                setTimeout(() => {
                  const enviar =
                    document.querySelector('div[role="button"][aria-label^="Enviar"]') ||
                    document.querySelector('button[aria-label^="Enviar"]') ||
                    document
                      .querySelector('span[data-testid="wds-ic-send-filled"]')
                      ?.closest('div[role="button"], button') ||
                    document
                      .querySelector('span[data-icon="send"]')
                      ?.closest('div[role="button"], button');
                  if (enviar) enviar.click();
                  setTimeout(finalizar, 1000);
                }, 500);
              }
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
