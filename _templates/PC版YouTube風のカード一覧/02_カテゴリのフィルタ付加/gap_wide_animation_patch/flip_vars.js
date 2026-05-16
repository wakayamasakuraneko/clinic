// FLIP + CSS変数版（--dx/--dy/--scale/--tyHover）
// 既存の index.htm のスクリプト置き換え用（gap の一時拡大を追加）

(function(){
  const buttons = document.querySelectorAll('.fbtn');
  const grid    = document.querySelector('.grid');
  const cards   = Array.from(document.querySelectorAll('.card'));

  // アニメ時間（ms）と gap 一時値
  const DUR_MS = 700;         // 0.7 秒
  const GAP_ORG = '16px';     // 既定 gap
  const GAP_WIDE = '40px';    // 一時的に広げる gap
  let gapTimer = null;

  function getCats(el){
    return (el.dataset.cats || '').split(',').map(s => s.trim()).filter(Boolean);
  }

  function applyFilter(key){
    // 時間を統一（grid と card の transition が同期）
    grid.style.setProperty('--dur', `${DUR_MS}ms`);

    // gap を一時的に拡大
    grid.style.setProperty('--gap', GAP_WIDE);

    // 1) 残す/出す/消すの仕分け
    const willShow = new Set();
    const willHide = new Set();
    cards.forEach(c => {
      const show = (key === 'all') || getCats(c).includes(key);
      (show ? willShow : willHide).add(c);
    });

    // 2) first（今いるものの旧位置）
    const stayingNow = cards.filter(c => !c.classList.contains('is-gone'));
    const first = new Map(stayingNow.map(c => [c, c.getBoundingClientRect()]));

    // 3) まず表示側はレイアウトに戻して透明状態へ
    willShow.forEach(c => {
      if (c.classList.contains('is-gone')) {
        c.classList.remove('is-gone'); // レイアウト復帰
        c.classList.add('is-hidden');  // いったん透明＆縮小
        // 初期オフセットは 0 にしておく
        c.style.setProperty('--dx', '0px');
        c.style.setProperty('--dy', '0px');
      }
    });

    // 4) 非表示側は即レイアウトから外す（穴を一瞬で詰める）
    willHide.forEach(c => {
      c.classList.add('is-gone');
      c.classList.add('is-hidden');
    });

    // 5) last（新しい配置）
    void grid.offsetWidth; // reflow
    const nowVisible = cards.filter(c => !c.classList.contains('is-gone'));
    const last = new Map(nowVisible.map(c => [c, c.getBoundingClientRect()]));

    // 6) 残る/現れるカードに FLIP を適用（CSS変数で差分をアニメ）
    nowVisible.forEach(c => {
      const l = last.get(c);
      const f = first.get(c);
      if (f) {
        const dx = f.left - l.left;
        const dy = f.top  - l.top;
        if (dx || dy) {
          c.style.setProperty('--dx', dx + 'px');
          c.style.setProperty('--dy', dy + 'px');
          // 次フレームで 0 にしてアニメ開始
          requestAnimationFrame(() => {
            c.style.setProperty('--dx', '0px');
            c.style.setProperty('--dy', '0px');
          });
        }
      }
      // フェードイン
      c.classList.remove('is-hidden');
    });

    // 7) DUR_MS 後に gap を戻し、--dur は任意で掃除
    if (gapTimer) clearTimeout(gapTimer);
    gapTimer = setTimeout(() => {
      grid.style.setProperty('--gap', GAP_ORG);
      grid.style.removeProperty('--dur');
    }, DUR_MS);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true');
      applyFilter(btn.dataset.filter);
    });
  });
})();
