(() => {
  const source = document.getElementById("content");
  const output = document.getElementById("converted");
  const diffs = document.getElementById("diffs");
  if (!source || !output || !diffs) return;

  const upperMap = {
    "Α": "A",
    "Β": "B",
    "Γ": "Λ",
    "Δ": "Δ",
    "Ε": "Ǝ",
    "Ϝ": "Ϝ",
    "Θ": "𐤈",
    "Ι": "S",
    "Κ": "𐤊",
    "Λ": "Γ",
    "Μ": "𐤌",
    "Ν": "𐤍",
    "Ο": "O",
    "Π": "C",
    "Ρ": "q",
    "Σ": "M",
    "Τ": "T",
    "Υ": "V"
  };

  const rtlGlyphs = new Set(["𐤈", "𐤊", "𐤌", "𐤍"]);

  function normalizeGreekChar(ch) {
    const base = ch.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
    return base.toUpperCase();
  }

  function convertText(text) {
    const counts = {};
    const examples = {};
    let result = "";

    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (/[\u0300-\u036F]/.test(ch)) {
        continue;
      }
      const normalized = normalizeGreekChar(ch);
      if (normalized === "") {
        continue;
      }
      let mapped = upperMap[normalized] || normalized || ch;
      if (rtlGlyphs.has(mapped)) {
        mapped = `\u200E${mapped}\u200E`;
      }

      if (mapped !== ch) {
        const key = `${ch}→${mapped}`;
        counts[key] = (counts[key] || 0) + 1;
        if (!examples[key]) {
          const before = text.slice(Math.max(0, i - 6), i) + ch + text.slice(i + 1, i + 7);
          const after = text.slice(Math.max(0, i - 6), i) + mapped + text.slice(i + 1, i + 7);
          examples[key] = `${before} → ${after}`;
        }
      }

      result += mapped;
    }

    return { result, counts, examples };
  }

  function renderDiffs(counts, examples) {
    const entries = Object.keys(counts);
    if (!entries.length) {
      diffs.innerHTML = "<p class=\"muted\">Nenhuma diferença encontrada.</p>";
      return;
    }

    const items = entries
      .sort()
      .map((key) => {
        const count = counts[key];
        const sample = examples[key] ? ` <span class="diff-sample">${examples[key]}</span>` : "";
        return `<li><strong>${key}</strong>: ${count} ocorrência(s).${sample}</li>`;
      })
      .join("");

    diffs.innerHTML = `<h3>Diferenças</h3><ul class="diff-list">${items}</ul>`;
  }

  function update() {
    const { result, counts, examples } = convertText(source.value);
    output.value = result;
    renderDiffs(counts, examples);
  }

  source.addEventListener("input", update);
  update();
})();
