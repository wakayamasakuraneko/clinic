// render-antiworm.js
// 駆虫薬テーブルを price-data/antiworm-data.json" (オブジェクト型) から読み込んで描画するスクリプト
// 1. JSONをfetchして読み込む
// 2. <tbody id="aw-body"> を空にしてから各行を追加
// 3. coversオブジェクトのキー順に「◯/ー/？」を埋める
// 4. 記号に応じて aw-yes/aw-no/aw-maybe のクラスを付与（色分け用…現在未使用）

(function () {
  const COLS = [
    "マダニ",
    "ノミ",
    "シラミ",
    "耳ダニ",
    "疥癬",
    "フィラリア",
    "回虫・鈎虫",
    "条虫(※)",
  ];
  const cls = { "◯": "aw-yes", ー: "aw-no", "？": "aw-maybe" };

  async function loadJSON(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`antiworm json ${r.status}`);
    return await r.json();
  }

  function td(txt, className) {
    const el = document.createElement("td");
    if (className) el.className = className;
    el.textContent = txt;
    return el;
  }

  async function main() {
    const tbody = document.getElementById("aw-body");
    if (!tbody) return;
    const data = await loadJSON("price-data/antiworm-data.json");
    tbody.innerHTML = "";
    for (const prod of data) {
      const tr = document.createElement("tr");
      const head = document.createElement("td");
      head.className = "nowrap";
      head.textContent = prod.name;
      tr.appendChild(head);

      for (const key of COLS) {
        const symbol = (prod.covers && prod.covers[key]) || "";
        tr.appendChild(td(symbol, cls[symbol]));
      }
      tbody.appendChild(tr);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
