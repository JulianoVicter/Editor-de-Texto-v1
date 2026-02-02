(() => {
  const textarea = document.getElementById("content") || document.getElementById("editor");
  if (!textarea) return;

  const greekLower = {
    a: "α",
    b: "β",
    g: "γ",
    d: "δ",
    e: "ε",
    o: "ο"
  };

  const greekUpper = {
    a: "Α",
    b: "Β",
    g: "Γ",
    d: "Δ",
    e: "Ε",
    o: "Ο"
  };

  function insertAtCursor(el, text) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;
    el.value = value.slice(0, start) + text + value.slice(end);
    const cursor = start + text.length;
    el.selectionStart = el.selectionEnd = cursor;
    el.focus();
  }

  const codeMap = {
    KeyA: "a",
    KeyB: "b",
    KeyG: "g",
    KeyD: "d",
    KeyE: "e",
    KeyO: "o"
  };

  let suppressDeadKey = false;

  textarea.addEventListener("keydown", (event) => {
    if (!event.altKey || event.metaKey || event.ctrlKey) return;

    const base = codeMap[event.code];
    if (!base) return;

    const map = event.shiftKey ? greekUpper : greekLower;
    const symbol = map[base];
    if (!symbol) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    suppressDeadKey = true;
    insertAtCursor(textarea, symbol);
  });

  textarea.addEventListener("beforeinput", (event) => {
    if (!suppressDeadKey) return;

    if (event.inputType === "insertCompositionText" || event.inputType === "insertText") {
      event.preventDefault();
      suppressDeadKey = false;
    }
  });

  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Dead" && event.altKey) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      suppressDeadKey = true;
    }
  });

  textarea.addEventListener("input", () => {
    if (!suppressDeadKey) return;

    const value = textarea.value;
    if (!value) return;
    const last = value.slice(-1);
    if (last === "´" || last === "\u0301") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = value.slice(0, -1);
      const cursor = Math.max(0, Math.min(start - 1, textarea.value.length));
      textarea.selectionStart = textarea.selectionEnd = cursor;
      suppressDeadKey = false;
    }
  });
})();
