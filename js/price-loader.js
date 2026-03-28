// js/price-loader.js
(async function () {
  // 1) パーツHTMLを取得して差し込み
  const mainHtml = await fetch("price-html/price-main.htm", {
    // ← 料金表本体パーツ
    cache: "no-store", // ← キャッシュ無効化
  }).then((r) => r.text()); // ← テキストとして取得
  const discHtml = await fetch("price-html/price-discount.htm", {
    // ← 割引説明パーツ
    cache: "no-store", // ← キャッシュ無効化
  }).then((r) => r.text()); // ← テキストとして取得

  document.getElementById("price-main").innerHTML = mainHtml;
  document.getElementById("price-discount").innerHTML = discHtml;

  // 2) 依存JSを順番に読み込む（差し込み後に実行）
  //    ※ Accordion_main.js は「テーブルが存在している前提」でthead/tbodyにイベント付与します
  //       なので差し込みが完了してからロードします。:contentReference[oaicite:1]{index=1}
  const loadScript = (src) =>
    new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = res;
      s.onerror = () => rej(new Error("Failed: " + src));
      document.head.appendChild(s);
    });

  // 料金表で使うJavascript群を順番に読み込む
  await loadScript("js/js202407/Accordion/Accordion_main2025.js"); // ← アコーディオン本体
  await loadScript("js/js202407/Accordion/acco_in_acco.js"); // ← 入れ子アコーディオン対応
  await loadScript("js/js202407/Accordion/microtip_Jump.js");
  await loadScript("js/js202407/Accordion/openPrice1.js"); // ← 初期画面は手術料金のみ展開
  await loadScript("js/js202407/Accordion/line-height-adjustable.js"); // ← 行間検知調整スクリプト（Accordion用）
  await loadScript("js/render-antiworm.js"); // ← 駆虫表をJSONから読み込む用
  // 3) 価格のJSON反映（最後に）
  await loadScript("js/price-data.js");

  // 念のため再描画（無くてもOK）
  if (window.PriceData && typeof window.PriceData.render === "function") {
    window.PriceData.render(); // 差し込み後に再計算・再反映 :contentReference[oaicite:3]{index=3}
  }
})();
