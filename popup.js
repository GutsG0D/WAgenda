document.addEventListener("DOMContentLoaded", renderList);

document.getElementById("scheduleBtn").addEventListener("click", () => {
  const phone = document.getElementById("phone").value.replace(/\D/g, "");
  const message = document.getElementById("message").value;
  const datetime = document.getElementById("datetime").value;

  if (!phone || !message || !datetime) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const scheduleTime = new Date(datetime).getTime();
  if (scheduleTime <= Date.now()) {
    alert("A data e hora devem ser no futuro.");
    return;
  }

  // Criamos um ID exclusivo usando o prefixo 'msg_' + timestamp
  const msgId = `msg_${Date.now()}`;
  const newMsg = {
    id: msgId,
    phone,
    message,
    scheduleTime,
    datetimeString: datetime.replace("T", " "),
  };

  // Recupera a lista atual, adiciona o novo e salva de volta
  chrome.storage.local.get({ scheduledMessages: [] }, (result) => {
    const list = result.scheduledMessages;
    list.push(newMsg);

    chrome.storage.local.set({ scheduledMessages: list }, () => {
      // Cria o alarme no Chrome usando o ID exclusivo como nome
      chrome.alarms.create(msgId, { when: scheduleTime });

      alert("Mensagem agendada!");
      // Limpa o formulário e atualiza a lista visual
      document.getElementById("phone").value = "";
      document.getElementById("message").value = "";
      document.getElementById("datetime").value = "";
      renderList();
    });
  });
});

// Função responsável por desenhar a lista no HTML
function renderList() {
  const container = document.getElementById("listContainer");
  container.innerHTML = "";

  chrome.storage.local.get({ scheduledMessages: [] }, (result) => {
    const list = result.scheduledMessages;

    if (list.length === 0) {
      container.innerHTML =
        '<div class="no-msgs">Nenhuma mensagem agendada.</div>';
      return;
    }

    // Ordena a lista pela data de envio mais próxima
    list.sort((a, b) => a.scheduleTime - b.scheduleTime);

    list.forEach((item) => {
      const card = document.createElement("div");
      card.className = "msg-item";
      card.innerHTML = `
                <p><strong>Para:</strong> +${item.phone}</p>
                <p><strong>Quando:</strong> ${item.datetimeString}</p>
                <p class="msg-text">"${item.message.substring(0, 30)}${item.message.length > 30 ? "..." : ""}"</p>
                <button class="cancel-btn" data-id="${item.id}">Cancelar</button>
            `;

      // Adiciona o evento de clique no botão Cancelar
      card.querySelector(".cancel-btn").addEventListener("click", (e) => {
        const idParaRemover = e.target.getAttribute("data-id");
        cancelarAgendamento(idParaRemover);
      });

      container.appendChild(card);
    });
  });
}

// Remove do Storage e desativa o Alarme do Chrome simultaneamente
function cancelarAgendamento(id) {
  chrome.storage.local.get({ scheduledMessages: [] }, (result) => {
    const list = result.scheduledMessages.filter((item) => item.id !== id);

    chrome.storage.local.set({ scheduledMessages: list }, () => {
      // Cancela o alarme em segundo plano para não disparar
      chrome.alarms.clear(id, (wasCleared) => {
        if (wasCleared) {
          renderList();
        }
      });
    });
  });
}
