(() => {
  const STORAGE_KEY = "cardFilters.v1";
  const btns = Array.from(document.querySelectorAll(".fbtn"));
  const cards = Array.from(document.querySelectorAll(".card"));
  const modeBtn = document.getElementById("modeBtn");
  const clearBtn = document.getElementById("clearBtn");

  // 状態
  let selected = new Set();
  let mode = "or"; // 'or' | 'and'

  // ---- 初期化（URL > LocalStorage の優先順）----
  const params = new URLSearchParams(location.search);
  const urlCats = params.get("cats");
  const urlMode = params.get("mode");

  if (urlCats || urlMode) {
    if (urlCats)
      urlCats
        .split(",")
        .filter(Boolean)
        .forEach((c) => selected.add(c));
    if (urlMode === "and" || urlMode === "or") mode = urlMode;
  } else {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (Array.isArray(saved.cats)) saved.cats.forEach((c) => selected.add(c));
      if (saved.mode === "and" || saved.mode === "or") mode = saved.mode;
    } catch {}
  }

  // ボタンUI反映
  btns.forEach((b) =>
    b.classList.toggle("is-active", selected.has(b.dataset.filter))
  );
  modeBtn.textContent = `モード: ${mode.toUpperCase()}`;

  // ---- フィルタ関数 ----
  function applyFilter() {
    const keys = Array.from(selected);
    cards.forEach((card) => {
      const cats = (card.dataset.cats || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      let show = true;
      if (keys.length > 0) {
        if (mode === "or") {
          show = keys.some((k) => cats.includes(k));
        } else {
          // and
          show = keys.every((k) => cats.includes(k));
        }
      }
      card.classList.toggle("is-hidden", !show);
    });
  }

  // ---- 状態保存（URL & LocalStorage）----
  function persist() {
    // URL更新（?cats=a,b&mode=and）。選択ゼロならクエリ除去
    const u = new URL(location.href);
    if (selected.size === 0 && mode === "or") {
      u.search = ""; // 初期状態はクエリなし
    } else {
      const catsStr = Array.from(selected).join(",");
      u.searchParams.set("cats", catsStr);
      u.searchParams.set("mode", mode);
    }
    history.replaceState(null, "", u);

    // LocalStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cats: Array.from(selected), mode })
      );
    } catch {}
  }

  // ---- クリック挙動 ----
  btns.forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.dataset.filter;
      if (selected.has(key)) {
        selected.delete(key);
        b.classList.remove("is-active");
      } else {
        selected.add(key);
        b.classList.add("is-active");
      }
      applyFilter();
      persist();
    });
  });

  modeBtn.addEventListener("click", () => {
    mode = mode === "or" ? "and" : "or";
    modeBtn.textContent = `モード: ${mode.toUpperCase()}`;
    applyFilter();
    persist();
  });

  clearBtn.addEventListener("click", () => {
    selected.clear();
    btns.forEach((b) => b.classList.remove("is-active"));
    mode = "or";
    modeBtn.textContent = `モード: OR`;
    applyFilter();
    persist();
  });

  // 初回適用
  applyFilter();
})();
