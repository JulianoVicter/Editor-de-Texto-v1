function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const csrftoken = getCookie('csrftoken');
  
  const titleEl = document.getElementById("title");
  const contentEl = document.getElementById("content");
  const statusEl = document.getElementById("status");
  const saveBtn = document.getElementById("saveBtn");
  
  async function save() {
    statusEl.textContent = "Salvando...";
  
    const payload = {
      title: titleEl.value,
      content: contentEl.value
    };
  
    const resp = await fetch(SAVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      body: JSON.stringify(payload)
    });
  
    if (!resp.ok) {
      statusEl.textContent = "Erro ao salvar.";
      return;
    }
    statusEl.textContent = "Salvo ✓";
  }
  
  saveBtn.addEventListener("click", save);
  
  // autosave simples
  let t = null;
  contentEl.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(save, 1200);
  });
  titleEl.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(save, 1200);
  });
  