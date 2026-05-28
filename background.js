chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "agendar_mensagem") {
    const msgData = request.data;
    chrome.storage.local.get({ mensagensPendentes: [] }, (result) => {
      const lista = result.mensagensPendentes;
      lista.push(msgData);
      chrome.storage.local.set({ mensagensPendentes: lista }, () => {
        chrome.alarms.create(msgData.id, { when: msgData.tempo });
        sendResponse({ status: "ok" });
      });
    });
    return true;
  }
  if (request.action === "agendar_mensagem_multipla") {
    const msgsData = request.dataList;
    chrome.storage.local.get({ mensagensPendentes: [] }, (result) => {
      const lista = result.mensagensPendentes;
      msgsData.forEach((msg) => {
        lista.push(msg);
      });
      chrome.storage.local.set({ mensagensPendentes: lista }, () => {
        msgsData.forEach((msg) => {
          chrome.alarms.create(msg.id, { when: msg.tempo });
        });
        sendResponse({ status: "ok" });
      });
    });
    return true;
  }
  if (request.action === "cancelar_agendamento") {
    chrome.alarms.clear(request.id, (wasCleared) => {
      sendResponse({ status: "ok", wasCleared });
    });
    return true;
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith("msg_")) {
    chrome.storage.local.get({ mensagensPendentes: [] }, (result) => {
      const msgData = result.mensagensPendentes.find(
        (item) => item.id === alarm.name,
      );

      if (msgData) {
        chrome.tabs.query({ url: "*://web.whatsapp.com/*" }, (tabs) => {
          if (tabs.length > 0) {
            // Apenas manda a ordem de execução. O content.js cuidará da limpeza!
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "executar_robo",
              data: msgData,
            });
          }
        });
      }
    });
  }
});
