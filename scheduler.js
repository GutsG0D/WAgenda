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
    const devidas = result.mensagensPendentes.filter(
      (item) => item.tempo <= agora + 5000,
    );

    if (devidas.length === 0) {
      roboTrabalhando = false;
      return;
    }

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
          historico.push({ ...tarefaAtual, enviadoEm: Date.now() });

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
  const { nome, telefone, mensagem, anexo } = tarefa;

  // Garante aba principal de conversas
  const btnConversas = document.querySelector('button[aria-label="Conversas"]');
  if (btnConversas) simularClique(btnConversas);

  setTimeout(() => {
    // Abre painel "Nova conversa"
    const btn =
      document.querySelector('button[aria-label="Nova conversa"]') ||
      document.querySelector('button[aria-label="New chat"]') ||
      document
        .querySelector('span[data-icon="new-chat-outline"]')
        ?.closest("button") ||
      document.querySelector('span[data-icon="chat"]')?.closest("button");
    if (btn) btn.click();

    setTimeout(() => {
      // Localiza o painel Nova Conversa (drawer) aberto
      const drawer =
        document.querySelector('div[data-testid="new-chat-drawer"]') ||
        document.querySelector('div[data-testid="chat-list-search-container"]')?.closest('div[tabindex="-1"]') ||
        document;

      // Campo de busca específico do drawer de Nova Conversa
      const search =
        drawer.querySelector('div[data-testid="chat-list-search-container"] input') ||
        drawer.querySelector('input[data-tab="3"]') ||
        drawer.querySelector('input[role="textbox"]') ||
        document.querySelector('div[data-testid="new-chat-drawer"] input');

      if (!search) {
        console.warn("[WAgenda] Campo de busca não encontrado.");
        return finalizar();
      }

      // Digita o termo de busca (prioriza TELEFONE com dígitos limpos para achar a conversa/número exato)
      const telDigitos = (telefone || "").replace(/\D/g, "");
      const ddiDigitos =
        telDigitos.length === 10 || telDigitos.length === 11
          ? `55${telDigitos}`
          : telDigitos;
      const nomeLower = (nome || "").toLowerCase();

      // Prioridade: busca por telefone se houver (mínimo 8 dígitos), senão busca por nome
      const termoBusca =
        telDigitos && telDigitos.length >= 8 ? telDigitos : nome || "";
      simularDigitacao(search, termoBusca);

      // Aguarda 1s para o WhatsApp filtrar a lista com os termos digitados
      setTimeout(() => {
        let tentativas = 0;
        const polling = setInterval(() => {
          tentativas++;
          const currentDrawer =
            document.querySelector('div[data-testid="new-chat-drawer"]') ||
            document;
          const listItems = currentDrawer.querySelectorAll(
            'div[data-testid^="list-item"]',
          );
          console.log(
            `[WAgenda] Busca "${termoBusca}" tentativa ${tentativas}: ${listItems.length} resultados filtrados`,
          );

          if (listItems.length === 0 && tentativas < 15) return;

          clearInterval(polling);

          // Função auxiliar: clica no elemento interativo dentro do card
          function clicarCard(card) {
            const spanTitle = card.querySelector("span[title]") || card.querySelector('span[dir="auto"]');
            const cellFrame = card.querySelector('div[data-testid="cell-frame-container"]');
            const roleBtn = card.querySelector('div[role="button"]') || card.querySelector('[role="gridcell"]');

            // Dispara no span de título (onde o texto do nome/número está)
            if (spanTitle) simularClique(spanTitle, "Contato Span");
            // Dispara no container do card
            if (cellFrame) simularClique(cellFrame, "Contato Frame");
            // Dispara no wrapper de botão / listitem
            if (roleBtn && roleBtn !== cellFrame) simularClique(roleBtn, "Contato Btn");
            simularClique(card, "Contato Card");
          }

          // Tenta encontrar o contato nos resultados da busca
          let encontrado = null;

          for (const item of listItems) {
            const cardText = (item.textContent || "").toLowerCase();
            if (cardText.includes("arquivadas") || cardText.includes("archived"))
              continue;
            if (item.querySelector('[data-testid="section-header"]')) continue;

            const span =
              item.querySelector("span[title]") ||
              item.querySelector('span[dir="auto"]');
            const titleText = (
              span?.getAttribute("title") ||
              span?.textContent ||
              ""
            ).trim();

            console.log(`[WAgenda]   → Resultado encontrado: "${titleText}"`);

            // Se buscou pelo telefone: o primeiro resultado retornado pelo WhatsApp é o contato correto!
            if (termoBusca === telDigitos) {
              encontrado = item;
              break;
            }

            // Se buscou pelo nome: valida se o nome confere
            const matchNome =
              nomeLower &&
              (titleText.toLowerCase().includes(nomeLower) ||
                cardText.includes(nomeLower));

            if (matchNome) {
              encontrado = item;
              break;
            }
          }

          if (encontrado) {
            console.log("[WAgenda] Contato encontrado! Abrindo chat...");
            clicarCard(encontrado);
            // Aguarda 2s para o chat abrir completamente antes de tentar escrever
            setTimeout(() => executarEnvioMensagem(), 2000);
            return;
          }

          // Fallback: se buscou por telefone e não achou, tenta pelo nome
          const termoFallback =
            termoBusca === telDigitos && nome ? nome : null;

          if (termoFallback) {
            console.log(
              `[WAgenda] Não encontrado por "${termoBusca}". Tentando fallback por nome: "${termoFallback}"`,
            );
            simularDigitacao(search, termoFallback);

            setTimeout(() => {
              const currentDrawer2 =
                document.querySelector('div[data-testid="new-chat-drawer"]') ||
                document;
              const items2 = currentDrawer2.querySelectorAll(
                'div[data-testid^="list-item"]',
              );
              let encontrado2 = null;
              for (const item of items2) {
                const cardText = (item.textContent || "").toLowerCase();
                if (
                  cardText.includes("arquivadas") ||
                  cardText.includes("archived")
                )
                  continue;
                const span =
                  item.querySelector("span[title]") ||
                  item.querySelector('span[dir="auto"]');
                const titleText = (
                  span?.getAttribute("title") ||
                  span?.textContent ||
                  ""
                ).trim();

                if (
                  nomeLower &&
                  (titleText.toLowerCase().includes(nomeLower) ||
                    cardText.includes(nomeLower))
                ) {
                  encontrado2 = item;
                  break;
                }
              }

              if (encontrado2) {
                clicarCard(encontrado2);
                setTimeout(() => executarEnvioMensagem(), 2000);
              } else {
                falhaContato();
              }
            }, 1000);
          } else {
            falhaContato();
          }
        }, 200);
      }, 1000);

      // --- Funções auxiliares (acessam closure: nome, telefone, mensagem, anexo, finalizar) ---

      function falhaContato() {
        console.warn(
          `[WAgenda] Contato não localizado: "${nome || telefone}". Pulando.`,
        );
        const back =
          document.querySelector('div[data-testid="new-chat-drawer"] button[aria-label="Voltar"]') ||
          document.querySelector('button[aria-label="Voltar"]') ||
          document
            .querySelector('span[data-icon="back-refreshed"]')
            ?.closest("button") ||
          document.querySelector('span[data-icon="back"]')?.closest("button");
        if (back) simularClique(back);
        finalizar();
      }

      function executarEnvioMensagem() {
        let tentativasCaixa = 0;
        const intervalCaixa = setInterval(() => {
          const caixa =
            document.querySelector(
              'div[data-testid="conversation-compose-box-input"]',
            ) ||
            document.querySelector(
              '#main footer div[contenteditable="true"]',
            ) ||
            document.querySelector(
              '#main div[contenteditable="true"][data-tab="10"]',
            ) ||
            document.querySelector(
              'footer div[contenteditable="true"]',
            ) ||
            document.querySelector(
              '#main div[contenteditable="true"][role="textbox"]',
            ) ||
            document.querySelector('#main div[contenteditable="true"]');

          tentativasCaixa++;
          if (caixa) {
            console.log("[WAgenda] Caixa de mensagem encontrada com sucesso!");
            clearInterval(intervalCaixa);

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
                    document.querySelector(
                      'div[data-testid="media-caption-input-container"] div[contenteditable="true"]',
                    ) ||
                    document.querySelector(
                      'div[data-testid="media-caption-input-container"] [role="textbox"]',
                    ) ||
                    document.querySelector(
                      'div[data-testid="media-caption-input-container"]',
                    ) ||
                    document.querySelector('div[title="Adicionar legenda"]');

                  tentativasLegenda++;
                  if (caixaLegenda) {
                    clearInterval(intervalLegenda);
                    if (mensagem) simularDigitacao(caixaLegenda, mensagem);

                    let tentativasEnviar = 0;
                    const intervalEnviar = setInterval(() => {
                      const enviar =
                        document.querySelector(
                          'div[role="button"][aria-label^="Enviar"]',
                        ) ||
                        document.querySelector(
                          'button[aria-label^="Enviar"]',
                        ) ||
                        document
                          .querySelector(
                            'span[data-testid="wds-ic-send-filled"]',
                          )
                          ?.closest('div[role="button"], button') ||
                        document
                          .querySelector('span[data-icon="send"]')
                          ?.closest('div[role="button"], button');

                      tentativasEnviar++;
                      if (
                        enviar &&
                        enviar.getAttribute("aria-disabled") !== "true"
                      ) {
                        clearInterval(intervalEnviar);
                        enviar.click();
                        setTimeout(finalizar, 2500);
                      } else if (tentativasEnviar > 30) {
                        clearInterval(intervalEnviar);
                        if (enviar) enviar.click();
                        setTimeout(finalizar, 2500);
                      }
                    }, 200);
                  } else if (tentativasLegenda > 25) {
                    clearInterval(intervalLegenda);
                    finalizar();
                  }
                }, 200);
              } catch (err) {
                console.error("Erro ao processar anexo:", err);
                digitarEEnviarTexto(caixa, mensagem);
              }
            } else {
              digitarEEnviarTexto(caixa, mensagem);
            }
          } else if (tentativasCaixa > 35) {
            clearInterval(intervalCaixa);
            falhaContato();
          }
        }, 200);
      }

      function digitarEEnviarTexto(caixaInput, texto) {
        caixaInput.focus();

        try {
          const dataTransfer = new DataTransfer();
          dataTransfer.setData("text/plain", texto);
          const pasteEvent = new ClipboardEvent("paste", {
            bubbles: true,
            cancelable: true,
            clipboardData: dataTransfer,
          });
          caixaInput.dispatchEvent(pasteEvent);
        } catch (e) {
          console.error("[WAgenda] Erro no evento paste:", e);
        }

        setTimeout(() => {
          if (
            !caixaInput.textContent ||
            caixaInput.textContent.trim().length === 0
          ) {
            caixaInput.focus();
            document.execCommand("selectAll", false, null);
            document.execCommand("insertText", false, texto);
            caixaInput.dispatchEvent(new Event("input", { bubbles: true }));
          }

          setTimeout(() => {
            const enviar =
              document.querySelector('#main footer button[aria-label="Enviar"]') ||
              document.querySelector('#main footer button[aria-label="Send"]') ||
              document.querySelector('#main footer button[data-tab="11"]') ||
              document.querySelector('#main footer div[role="button"][aria-label^="Enviar"]') ||
              document.querySelector('#main footer div[role="button"][aria-label^="Send"]') ||
              document
                .querySelector(
                  '#main footer span[data-testid="wds-ic-send-filled"]',
                )
                ?.closest('button, div[role="button"]') ||
              document
                .querySelector(
                  '#main footer span[data-icon="wds-ic-send-filled"]',
                )
                ?.closest('button, div[role="button"]') ||
              document
                .querySelector('#main footer span[data-icon="send"]')
                ?.closest('button, div[role="button"]');

            if (enviar) {
              enviar.click();
            } else {
              caixaInput.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "Enter",
                  code: "Enter",
                  keyCode: 13,
                  which: 13,
                  bubbles: true,
                  cancelable: true,
                }),
              );
            }

            setTimeout(finalizar, 1200);
          }, 500);
        }, 250);
      }
    }, 1500);
  }, 400);
}
