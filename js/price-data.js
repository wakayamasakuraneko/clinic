/*! price-data.debug.js (fixed) */
(function () {
  const DATA_URL =
    (document.currentScript && document.currentScript.dataset.url) ||
    "price-data/price-data.json";

  const yenFmt = new Intl.NumberFormat("ja-JP");
  let DATA = null;

  async function load() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      DATA = await res.json();
      // console.log("[price-data.debug] loaded JSON:", DATA);
      render();
      attach();
      window.addEventListener("load", () => {
        // console.log("[price-data.debug] window load -> re-render");
        setTimeout(render, 0);
      });
    } catch (e) {
      console.error("[price-data.debug] 価格データの読み込みに失敗:", e);
    }
  }

  function getTaxRate() {
    const r = Number(DATA && DATA["税率"]);
    return isNaN(r) ? 0.1 : r;
  }

  function fYen(n) {
    if (typeof n !== "number" || !isFinite(n)) return "";
    return n + "円"; // ← カンマを入れずにそのまま
  }

  function render() {
    if (!DATA) return;
    const taxRate = getTaxRate();
    const priceMap = DATA["料金"] || {};

    // ★ ここから　割引「合計」を自動計算
    for (let n = 1; n <= 20; n++) {
      // 上限は必要に応じて変えてOK
      const perKey = `割引（${n}匹／1匹あたり）`;
      const sumKey = `割引（${n}匹合計）`;
      if (perKey in priceMap) {
        const per = Number(priceMap[perKey]);
        if (Number.isFinite(per)) {
          priceMap[sumKey] = per * n;
        }
      }
    }
    // ★ ここまで（1〜20匹を対象にする例）

    let matched = 0,
      missing = 0;

    document.querySelectorAll(".price-excl-tax[data-code]").forEach((excl) => {
      const code = excl.dataset.code;
      if (!code) return;
      if (!(code in priceMap)) {
        missing++;
        excl.setAttribute("data-updated", "missing");
        console.warn("[price-data.debug] JSONに該当キーなし:", code);
        return;
      }

      const base = Number(priceMap[code]);
      const incl = Math.round(base * (1 + taxRate));

      excl.textContent = fYen(base);
      excl.setAttribute("data-updated", "ok");

      const ol = excl.closest("ol");
      const inclEl = ol && ol.querySelector(".price-incl-tax");
      if (inclEl) {
        inclEl.textContent = fYen(incl);
        inclEl.setAttribute("data-updated", "ok");
      }

      matched++;
      // console.log(`[price-data.debug] set ${code}: excl=${base}, incl=${incl}`);
    });

    const upd = document.getElementById("price-updated");
    if (upd && DATA["更新日"]) upd.textContent = `最終更新: ${DATA["更新日"]}`;

    // console.log(`[price-data.debug] updated: ${matched}, missing: ${missing}`);
  }

  function attach() {
    const toggle = document.getElementById("toggle-button");
    if (toggle)
      toggle.addEventListener("click", () => {
        // console.log("[price-data.debug] toggle clicked -> re-render");
        setTimeout(render, 0);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }

  window.PriceData = { reload: load, render };
})();
