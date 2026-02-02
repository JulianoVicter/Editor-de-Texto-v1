(() => {
  const textarea = document.getElementById("content") || document.getElementById("editor");
  if (!textarea) return;

  const greekLower = {
    a: "α", b: "β", g: "γ", d: "δ", e: "ε", z: "ζ",
    h: "η", i: "ι", o: "ο", u: "υ", w: "ω",
    k: "κ", l: "λ", m: "μ", n: "ν", x: "ξ",
    p: "π", r: "ρ", s: "σ", t: "τ", y: "ψ",
    f: "φ", q: "θ", c: "χ", v: "ς"
  };

  const greekUpper = {
    a: "Α", b: "Β", g: "Γ", d: "Δ", e: "Ε", z: "Ζ",
    h: "Η", i: "Ι", o: "Ο", u: "Υ", w: "Ω",
    k: "Κ", l: "Λ", m: "Μ", n: "Ν", x: "Ξ",
    p: "Π", r: "Ρ", s: "Σ", t: "Τ", y: "Ψ",
    f: "Φ", q: "Θ", c: "Χ", v: "Σ"
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

  let suppressDeadKey = false;

  textarea.addEventListener("keydown", (event) => {
    if (!event.altKey || event.metaKey || event.ctrlKey) return;

    if (!event.code.startsWith("Key")) return;
    const base = event.code.slice(3).toLowerCase();
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

    const data = event.data || "";
    const code = data ? data.codePointAt(0) : null;
    const isCombining = code !== null && code >= 0x0300 && code <= 0x036F;
    const isAcute = data === "´" || data === "ʼ" || data === "’";

    if (event.inputType === "insertCompositionText" || event.inputType === "insertText") {
      if (isCombining || isAcute || data === "") {
        event.preventDefault();
        suppressDeadKey = false;
      }
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

  textarea.addEventListener("compositionstart", () => {
    if (suppressDeadKey) {
      suppressDeadKey = false;
    }
  });
})();
