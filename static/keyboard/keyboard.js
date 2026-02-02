const state = {
  layout: "greek",
  shift: false,
  pendingDiacritics: []
};

const editor = document.getElementById("editor") || document.getElementById("content");
const keyboard = document.getElementById("keyboard");
const toggleLayoutBtn = document.getElementById("toggleLayout");

const greekMap = {
  a: "α", b: "β", g: "γ", d: "δ", e: "ε", z: "ζ",
  h: "η", q: "θ", i: "ι", k: "κ", l: "λ", m: "μ",
  n: "ν", x: "ξ", o: "ο", p: "π", r: "ρ", s: "σ",
  t: "τ", u: "υ", f: "φ", c: "χ", y: "ψ", w: "ω",
  v: "ς"
};

const latinMap = {
  a: "a", b: "b", c: "c", d: "d", e: "e", f: "f",
  g: "g", h: "h", i: "i", j: "j", k: "k", l: "l",
  m: "m", n: "n", o: "o", p: "p", q: "q", r: "r",
  s: "s", t: "t", u: "u", v: "v", w: "w", x: "x",
  y: "y", z: "z"
};

const rows = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"]
];

const specialKeys = [
  { key: "Shift", label: "Shift", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Macron", label: "Macron (ˉ)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Breve", label: "Breve (˘)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Acute", label: "Agudo (´)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Grave", label: "Grave (`)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Circumflex", label: "Circunflexo (ˆ)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Smooth", label: "Espírito brando (᾿)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Rough", label: "Espírito áspero (῾)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "IotaSub", label: "Iota subscrito (ͅ)", className: "kbd-btn-ghost kbd-btn-wide" },
  { key: "Backspace", label: "Backspace", className: "kbd-btn-wide" },
  { key: "Space", label: "Espaço", className: "kbd-btn-xwide" },
  { key: "Enter", label: "Enter", className: "kbd-btn-wide kbd-btn-accent" }
];

const extraGreekKeys = [
  { key: "digamma", label: "ϝ" },
  { key: "koppa", label: "ϙ" },
  { key: "sampi", label: "ϡ" }
];

function getMap() {
  return state.layout === "greek" ? greekMap : latinMap;
}

function toUpperSymbol(symbol) {
  return symbol.toUpperCase();
}

function insertText(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  textarea.value = value.slice(0, start) + text + value.slice(end);
  const cursor = start + text.length;
  textarea.selectionStart = textarea.selectionEnd = cursor;
  textarea.focus();
}

function backspace(textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (start !== end) {
    insertText(textarea, "");
    return;
  }
  if (start === 0) return;

  const value = textarea.value;
  const prevChar = value.slice(start - 1, start);
  const prevCode = prevChar.codePointAt(0);

  if (prevCode >= 0x0300 && prevCode <= 0x036F && start >= 2) {
    textarea.value = value.slice(0, start - 2) + value.slice(start);
    const cursor = start - 2;
    textarea.selectionStart = textarea.selectionEnd = cursor;
    return;
  }

  textarea.value = value.slice(0, start - 1) + value.slice(start);
  const cursor = start - 1;
  textarea.selectionStart = textarea.selectionEnd = cursor;
}

function applyPendingDiacritics(symbol) {
  if (!state.pendingDiacritics.length) return symbol;
  const combined = symbol + state.pendingDiacritics.join("");
  state.pendingDiacritics = [];
  return combined;
}

function toggleDiacritic(codePoint) {
  const idx = state.pendingDiacritics.indexOf(codePoint);
  if (idx >= 0) {
    state.pendingDiacritics.splice(idx, 1);
  } else {
    state.pendingDiacritics.push(codePoint);
  }
}

function renderKeyboard() {
  if (!keyboard || !editor) return;
  keyboard.innerHTML = "";

  rows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "kbd-row";

    row.forEach((key) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "kbd-btn";
      btn.dataset.key = key;

      const map = getMap();
      const symbol = map[key] || key;
      btn.textContent = state.shift ? toUpperSymbol(symbol) : symbol;

      rowEl.appendChild(btn);
    });

    keyboard.appendChild(rowEl);
  });

  if (state.layout === "greek") {
    const extraRow = document.createElement("div");
    extraRow.className = "kbd-row";
    extraGreekKeys.forEach((ek) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "kbd-btn";
      btn.dataset.key = ek.key;
      btn.textContent = state.shift ? toUpperSymbol(ek.label) : ek.label;
      extraRow.appendChild(btn);
    });
    keyboard.appendChild(extraRow);
  }

  const specialRow = document.createElement("div");
  specialRow.className = "kbd-row";

  specialKeys.forEach((s) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `kbd-btn ${s.className || ""}`.trim();
    btn.dataset.key = s.key;
    btn.textContent = s.label;

    const diacriticMap = {
      Macron: "\u0304",
      Breve: "\u0306",
      Acute: "\u0301",
      Grave: "\u0300",
      Circumflex: "\u0342",
      Smooth: "\u0313",
      Rough: "\u0314",
      IotaSub: "\u0345"
    };

    if (diacriticMap[s.key] && state.pendingDiacritics.includes(diacriticMap[s.key])) {
      btn.classList.add("kbd-btn-armed");
    }
    if (s.key === "Shift" && state.shift) {
      btn.classList.add("kbd-btn-armed");
    }

    specialRow.appendChild(btn);
  });

  keyboard.appendChild(specialRow);
}

if (keyboard && editor) {
  keyboard.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

  const key = btn.dataset.key;

  if (key === "Shift") {
    state.shift = !state.shift;
    renderKeyboard();
    return;
  }

  if (key === "Macron") { toggleDiacritic("\u0304"); renderKeyboard(); return; }
  if (key === "Breve") { toggleDiacritic("\u0306"); renderKeyboard(); return; }
  if (key === "Acute") { toggleDiacritic("\u0301"); renderKeyboard(); return; }
  if (key === "Grave") { toggleDiacritic("\u0300"); renderKeyboard(); return; }
  if (key === "Circumflex") { toggleDiacritic("\u0342"); renderKeyboard(); return; }
  if (key === "Smooth") { toggleDiacritic("\u0313"); renderKeyboard(); return; }
  if (key === "Rough") { toggleDiacritic("\u0314"); renderKeyboard(); return; }
  if (key === "IotaSub") { toggleDiacritic("\u0345"); renderKeyboard(); return; }

  if (key === "Backspace") {
    backspace(editor);
    return;
  }

  if (key === "Space") {
    insertText(editor, " ");
    return;
  }

  if (key === "Enter") {
    insertText(editor, "\n");
    return;
  }

  if (key === "digamma") {
    const symbol = applyPendingDiacritics(state.shift ? "Ϝ" : "ϝ");
    insertText(editor, symbol);
    renderKeyboard();
    return;
  }
  if (key === "koppa") {
    const symbol = applyPendingDiacritics(state.shift ? "Ϙ" : "ϙ");
    insertText(editor, symbol);
    renderKeyboard();
    return;
  }
  if (key === "sampi") {
    const symbol = applyPendingDiacritics(state.shift ? "Ϡ" : "ϡ");
    insertText(editor, symbol);
    renderKeyboard();
    return;
  }

  const map = getMap();
  let symbol = map[key] || key;
  if (state.shift) symbol = toUpperSymbol(symbol);
  symbol = applyPendingDiacritics(symbol);

  insertText(editor, symbol);
  renderKeyboard();
  });
}

if (toggleLayoutBtn && keyboard && editor) {
  toggleLayoutBtn.addEventListener("click", () => {
    state.layout = state.layout === "greek" ? "latin" : "greek";
    toggleLayoutBtn.textContent = state.layout === "greek" ? "Latin" : "Grego";
    renderKeyboard();
  });
}

renderKeyboard();
