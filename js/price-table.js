// js/price-table.js
// 料金表（v2）：JSONから表を組み立て、開閉・税切替・個数計算・ノミの演出までをこの1本で行う。
//
//   使い方：<div id="price-table"></div> を置いて、このJSと css/price-table.css を読み込むだけ。
//   データ：price/data/price-table.json（表の構成） + price/data/price-data.json（料金の数字）
//           + price/data/antiworm-data.json（駆虫薬の比較表）
//
// 旧料金表（price-loader.js ほか5本のJS + price-main.htm / price-discount.htm）の置き換え用。
(function () {
  const ROOT_ID = "price-table";
  const URLS = {
    table: "price/data/price-table.json",
    price: "price/data/price-data.json",
    antiworm: "price/data/antiworm-data.json",
  };
  const IMG = "images/Price-List-pic/";
  const TAX_MODES = ["excl", "incl", "both"];
  const TAX_LABEL = { excl: "税抜", incl: "税込", both: "抜/込" };

  let prices = {};
  let taxRate = 0.1;
  let taxMode = "excl";
  const items = []; // 個数欄1つ分：{ name, lo, hi, input, count, line, row }
  const sections = []; // { el, head, body }

  // ---------- 小さな道具 ----------
  const yen = (n) => n + "円"; // 料金表はカンマ無し（サイト内の表記に合わせる）
  const incl = (n) => Math.round(n * (1 + taxRate));
  const range = (a, b) => (a === b ? yen(a) : `${yen(a)}～${yen(b)}`);
  const spans = (parts) => parts.map((p) => `<span>${p}</span>`).join("");
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const getPrice = (key) => {
    if (!(key in prices)) {
      console.warn("[price-table] price-data.json に無い名前:", key);
      return null;
    }
    return Number(prices[key]);
  };
  // 税抜・税込の両方を書いておき、どちらを見せるかはCSS（data-tax）で切り替える
  // 税込額は1つ分ごとに丸める（個数を掛ける場合は inLo/inHi に「丸めた1つ分×個数」を渡す）
  const priceHTML = (lo, hi, inLo = incl(lo), inHi = incl(hi)) =>
    `<span class="pt-ex">${range(lo, hi)}</span><span class="pt-sep">/</span><span class="pt-in">${range(inLo, inHi)}</span>`;

  async function loadJSON(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
    return r.json();
  }

  // ---------- 起動 ----------
  async function main() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    let table, priceData, antiworm;
    try {
      [table, priceData, antiworm] = await Promise.all([loadJSON(URLS.table), loadJSON(URLS.price), loadJSON(URLS.antiworm)]);
    } catch (e) {
      console.error("[price-table] 読み込み失敗:", e);
      root.textContent = "料金表を読み込めませんでした。お手数ですがお電話でお問い合わせ下さい。";
      return;
    }
    prices = priceData["料金"] || {};
    taxRate = Number(priceData["税率"]) || 0.1;

    root.classList.add("pt");
    root.dataset.tax = taxMode;
    root.innerHTML = "";

    // 上：料金表開閉（画面上部に張り付く）
    const tools = el("div", "pt-tools");
    const showAll = el("button", "pt-btn pt-btn-showall", "料金表開閉");
    showAll.type = "button";
    tools.appendChild(showAll);
    root.appendChild(tools);

    // 表本体
    const list = el("div", "pt-table");
    table.sections.forEach((sec) => list.appendChild(renderSection(sec, antiworm)));
    root.appendChild(list);

    // 下：合計欄（画面下部に張り付く）
    root.appendChild(renderTotal());

    showAll.addEventListener("click", () => {
      const open = sections.some((s) => !s.el.classList.contains("is-open"));
      sections.forEach((s) => setSection(s, open));
    });

    setStickyTop();
    window.addEventListener("resize", setStickyTop);
    applyTax();
    update();
  }

  // 本番ページでは上部ナビ(.site-nav)の下に「料金表開閉」を張り付かせる
  function setStickyTop() {
    const nav = document.querySelector(".site-nav");
    document.documentElement.style.setProperty("--pt-sticky-top", (nav ? nav.offsetHeight : 0) + "px");
  }

  // ---------- 見出し（アコーディオン） ----------
  function renderSection(sec, antiworm) {
    const wrap = el("div", "pt-sec"); // section にするとページ側の section 用スタイルが効いてしまう
    const head = el(
      "button",
      "pt-head",
      `<span class="pt-mark" aria-hidden="true"></span><span class="pt-title">${sec.title}</span><span class="pt-badge"></span>`
    );
    head.type = "button";
    const body = el("div", "pt-body");
    const inner = el("div", "pt-body-inner");
    body.appendChild(inner);
    wrap.append(head, body);

    if (sec.type === "discount") {
      inner.appendChild(renderDiscount(sec));
    } else {
      sec.rows.forEach((row) => {
        if (row.hidden) return;
        inner.appendChild(row.type === "antiworm" ? renderAntiworm(row, antiworm) : renderRow(row));
      });
    }

    const s = { el: wrap, head, body };
    sections.push(s);
    head.addEventListener("click", () => setSection(s, !wrap.classList.contains("is-open")));
    setSection(s, !!sec.open, true);
    return wrap;
  }

  // 開閉。開ききった後だけ中身のはみ出しを許す（跳んでくるノミが見出しの枠で切れないように）
  function setSection(s, open, instant) {
    s.el.classList.toggle("is-open", open);
    s.head.setAttribute("aria-expanded", open);
    clearTimeout(s.timer);
    s.el.classList.remove("is-settled");
    if (open) s.timer = setTimeout(() => s.el.classList.add("is-settled"), instant ? 0 : 250);
  }

  // ---------- 行 ----------
  function renderRow(row) {
    const rowEl = el("div", "pt-row");
    const main = el("div", "pt-main");
    const label = el("div", "pt-label", spans(row.label));
    const lines = el("div", "pt-lines");
    main.append(label, lines);
    rowEl.appendChild(main);

    // 1行に並べる料金の一覧（通常1つ、コンベニアは3つ）
    const defs = row.options
      ? row.options.map((o) => ({ sub: o.sub, keys: [o.price] }))
      : [{ keys: row.priceRange || [row.price] }];

    defs.forEach((d) => {
      const lo = getPrice(d.keys[0]);
      const hi = getPrice(d.keys[d.keys.length - 1]);
      const line = el("div", "pt-line");
      const price = el("div", "pt-price");
      if (lo == null || hi == null) {
        price.textContent = "—";
      } else {
        price.innerHTML =
          (d.sub ? `<span class="pt-subname">${d.sub}</span>` : "") +
          (row.prefix ? `<span class="pt-prefix">${row.prefix}</span>` : "") +
          `<span class="pt-amount">${priceHTML(lo, hi)}</span>` +
          (row.suffix ? `<span class="pt-suffix">${row.suffix}</span>` : "");
      }
      line.appendChild(price);
      if (!row.noCalc && lo != null) {
        const name = (row.name || row.label.join("")) + (d.sub ? ` ${d.sub}` : "");
        line.appendChild(renderQty({ name, lo, hi, line, row: rowEl }));
      }
      lines.appendChild(line);
    });

    if (row.note) attachNote(rowEl, main, label, row.note);
    return rowEl;
  }

  // 行を押すと開く説明。個数欄を押した時は開閉しない
  function attachNote(rowEl, main, label, note, onToggle) {
    rowEl.classList.add("has-note");
    const noteEl = el("div", "pt-note");
    const inner = el("div", "pt-note-inner");
    const pad = el("div", "pt-note-pad");
    if (Array.isArray(note)) note.forEach((html) => pad.appendChild(el("p", null, html)));
    else pad.appendChild(note);
    inner.appendChild(pad);
    noteEl.appendChild(inner);
    rowEl.appendChild(noteEl);

    label.setAttribute("role", "button");
    label.tabIndex = 0;
    label.setAttribute("aria-expanded", "false");
    const toggle = () => {
      const open = rowEl.classList.toggle("is-open");
      label.setAttribute("aria-expanded", open);
      if (onToggle) onToggle(open);
    };
    main.addEventListener("click", (e) => {
      if (e.target.closest(".pt-qty")) return;
      toggle();
    });
    label.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }

  // ---------- 駆虫薬と表（ノミの演出つき） ----------
  function renderAntiworm(row, antiworm) {
    const rowEl = el("div", "pt-row pt-feature");
    const main = el("div", "pt-main");
    const label = el(
      "div",
      "pt-label",
      `<span class="pt-nomi-box" aria-hidden="true">` +
        `<img class="pt-nomi-ring" src="${IMG}ring.png" alt="">` +
        `<img class="pt-nomi" src="${IMG}nomi.png" alt="">` +
        `</span>${spans(row.label)}`
    );
    main.appendChild(label);
    rowEl.appendChild(main);

    // 比較表＋説明文
    const frag = el("div", "pt-aw-wrap");
    frag.appendChild(renderAntiwormTable(antiworm));
    row.note.forEach((html) => frag.appendChild(el("p", "pt-aw-note", html)));

    const box = label.querySelector(".pt-nomi-box");
    attachNote(rowEl, main, label, frag, (open) => nomiEffect(box, open));
    return rowEl;
  }

  function renderAntiwormTable(data) {
    const cols = ["マダニ", "ノミ", "シラミ", "耳ダニ", "疥癬", "フィラリア", "回虫・鈎虫", "条虫(※)"];
    const cls = { "◯": "aw-yes", "ー": "aw-no", "？": "aw-maybe" };
    const t = el("table", "pt-aw");
    t.innerHTML =
      `<thead><tr><th class="pt-aw-corner">＼</th>${cols.map((c) => `<th class="pt-aw-col">${c}</th>`).join("")}</tr></thead>` +
      `<tbody>${data
        .map(
          (p) =>
            `<tr><th class="pt-aw-name">${p.name}</th>${cols
              .map((c) => {
                const v = (p.covers && p.covers[c]) || "";
                return `<td class="${cls[v] || ""}">${v}</td>`;
              })
              .join("")}</tr>`
        )
        .join("")}</tbody>`;
    return t;
  }

  // 開く時：ノミが回転して倒れ、頭上に輪っか（CSSの .is-open で動く）
  // 閉じる時：死んだノミは下へポトッと落ちて消え、新しいノミが右上から跳んできて収まる
  function nomiEffect(box, open) {
    clearTimeout(box._timer);
    box.classList.remove("is-respawn");
    box.querySelectorAll(".pt-ghost").forEach((g) => g.remove());
    if (open) return;
    box.querySelectorAll("img").forEach((img) => {
      const ghost = img.cloneNode();
      ghost.classList.add("pt-ghost");
      box.appendChild(ghost);
    });
    box.classList.add("is-respawn");
    box._timer = setTimeout(() => {
      box.classList.remove("is-respawn");
      box.querySelectorAll(".pt-ghost").forEach((g) => g.remove());
    }, 1000);
  }

  // ---------- 割引料金 ----------
  function renderDiscount(sec) {
    const wrap = el("div", "pt-discount");
    wrap.appendChild(el("p", "pt-discount-intro", sec.intro));
    const grid = el("div", "pt-dc-grid");
    grid.innerHTML = `<div class="pt-dc-h">猫の数</div><div class="pt-dc-h">1匹当たり<span>の割引額</span></div><div class="pt-dc-h">割引額計</div>`;
    for (let n = 1; n <= sec.to; n++) {
      const per = n >= sec.from ? getPrice(`割引（${n}匹／1匹あたり）`) : null;
      grid.insertAdjacentHTML(
        "beforeend",
        `<div class="pt-dc-n">${n}匹</div>` +
          (per == null
            ? `<div>ー</div><div>ー</div>`
            : `<div class="pt-amount">${priceHTML(per, per)}</div><div class="pt-amount">${priceHTML(per * n, per * n, incl(per) * n, incl(per) * n)}</div>`)
      );
    }
    const last = getPrice(sec.lastKey);
    if (last != null) {
      grid.insertAdjacentHTML(
        "beforeend",
        `<div class="pt-dc-n">${sec.lastLabel}</div><div class="pt-dc-wide"><span class="pt-amount">${priceHTML(last, last)}</span>／1匹</div>`
      );
    }
    wrap.appendChild(grid);
    return wrap;
  }

  // ---------- 個数欄 ----------
  function renderQty(item) {
    const qty = el(
      "div",
      "pt-qty",
      `<input type="number" min="0" max="99" inputmode="numeric" value="0">` +
        `<span class="pt-spin"><button type="button" aria-label="1つ増やす">▲</button><button type="button" aria-label="1つ減らす">▼</button></span>`
    );
    const input = qty.querySelector("input");
    const [up, down] = qty.querySelectorAll("button");
    input.setAttribute("aria-label", item.name + "の個数");
    Object.assign(item, { input, count: 0 });
    items.push(item);

    const set = (n, fromInput) => {
      item.count = Math.max(0, Math.min(99, n));
      if (!fromInput) input.value = item.count;
      update();
    };
    item.set = set; // 小計の内訳の −／＋／× からも使う
    input.addEventListener("input", () => set(parseInt(input.value, 10) || 0, true));
    input.addEventListener("focus", () => input.select());
    up.addEventListener("click", () => set(item.count + 1));
    down.addEventListener("click", () => set(item.count - 1));
    return qty;
  }

  // ---------- 合計欄 ----------
  let totalEls;
  function renderTotal() {
    const box = el(
      "div",
      "pt-total",
      `<div class="pt-total-btns">
         <button type="button" class="pt-btn pt-btn-reset">リセット</button>
         <button type="button" class="pt-btn pt-btn-sub" aria-expanded="false">小計表示</button>
         <button type="button" class="pt-btn pt-btn-tax">税切替</button>
       </div>
       <div class="pt-total-head">
         <span class="pt-total-title">合計</span>
         <span class="pt-total-sums">
           <span class="pt-only-ex">税抜 <b class="pt-ex-c" data-sum="ex">0円</b></span>
           <span class="pt-only-in">税込 <b class="pt-in-c" data-sum="in">0円</b></span>
         </span>
       </div>
       <div class="pt-total-body">
         <div class="pt-total-inner">
           <div class="pt-total-pad">
             <ul class="pt-total-list"></ul>
             <p class="pt-total-note">※ あくまで目安です。猫の状態による追加処置で、表示額より多くなることがあります。</p>
             <p class="pt-total-note" data-range-note hidden>※「～」のある項目は下限～上限で計算しています。</p>
           </div>
         </div>
       </div>`
    );
    totalEls = {
      box,
      list: box.querySelector(".pt-total-list"),
      ex: box.querySelector('[data-sum="ex"]'),
      in: box.querySelector('[data-sum="in"]'),
      rangeNote: box.querySelector("[data-range-note]"),
    };

    const sub = box.querySelector(".pt-btn-sub");
    sub.addEventListener("click", () => {
      const open = box.classList.toggle("is-open");
      sub.setAttribute("aria-expanded", open);
      sub.textContent = open ? "小計非表示" : "小計表示";
    });
    box.querySelector(".pt-btn-tax").addEventListener("click", () => {
      taxMode = TAX_MODES[(TAX_MODES.indexOf(taxMode) + 1) % TAX_MODES.length];
      applyTax();
    });
    box.querySelector(".pt-btn-reset").addEventListener("click", () => {
      items.forEach((it) => {
        it.count = 0;
        it.input.value = 0;
      });
      update();
    });
    return box;
  }

  // 税表示の切替：表・合計欄とも data-tax を見てCSSで出し分ける
  function applyTax() {
    const root = document.getElementById(ROOT_ID);
    root.dataset.tax = taxMode;
    root.querySelectorAll(".pt-badge").forEach((b) => {
      b.innerHTML =
        taxMode === "both" ? '<span class="pt-ex-c">抜</span>/<span class="pt-in-c">込</span>' : TAX_LABEL[taxMode];
    });
  }

  function update() {
    let minEx = 0, maxEx = 0, minIn = 0, maxIn = 0, hasRange = false;
    const list = totalEls.list;
    list.innerHTML = "";
    document.querySelectorAll(".pt .is-selected").forEach((e) => e.classList.remove("is-selected"));

    items.forEach((it) => {
      if (it.count <= 0) return;
      if (it.lo !== it.hi) hasRange = true;
      minEx += it.lo * it.count;
      maxEx += it.hi * it.count;
      minIn += incl(it.lo) * it.count;
      maxIn += incl(it.hi) * it.count;
      it.line.classList.add("is-selected");
      it.row.classList.add("is-selected");

      // 内訳の1行：名前 ／ −・個数・＋ ／ 金額 ／ ×（削除）
      const li = el(
        "li",
        null,
        `<span class="pt-tl-name"></span>` +
          `<span class="pt-tl-ctrl">` +
          `<button type="button" class="pt-tl-btn" data-act="minus" aria-label="1つ減らす">−</button>` +
          `<span class="pt-tl-count">${it.count}</span>` +
          `<button type="button" class="pt-tl-btn" data-act="plus" aria-label="1つ増やす">＋</button>` +
          `</span>` +
          `<span class="pt-tl-amount pt-amount"></span>` +
          `<button type="button" class="pt-tl-btn pt-tl-del" data-act="del" aria-label="削除">×</button>`
      );
      li.querySelector(".pt-tl-name").textContent = it.name;
      li.querySelectorAll(".pt-tl-btn").forEach((b) => b.setAttribute("aria-label", `${it.name}を${b.getAttribute("aria-label")}`));
      li.querySelector('[data-act="minus"]').addEventListener("click", () => it.set(it.count - 1));
      li.querySelector('[data-act="plus"]').addEventListener("click", () => it.set(it.count + 1));
      li.querySelector('[data-act="del"]').addEventListener("click", () => it.set(0));
      li.querySelector(".pt-tl-amount").innerHTML = priceHTML(
        it.lo * it.count,
        it.hi * it.count,
        incl(it.lo) * it.count,
        incl(it.hi) * it.count
      );
      list.appendChild(li);
    });
    if (!list.children.length) list.innerHTML = '<li class="pt-total-empty">項目が選ばれていません</li>';

    totalEls.ex.textContent = range(minEx, maxEx);
    totalEls.in.textContent = range(minIn, maxIn);
    totalEls.rangeNote.hidden = !hasRange;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
  else main();
})();
