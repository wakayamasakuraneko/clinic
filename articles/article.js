function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start;
  function step(timestamp) {
    if (!start) start = timestamp;
    const p = Math.min((timestamp - start) / duration, 1);
    const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    window.scrollTo(0, startY + diff * ease);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelector('.update-date');
  if (!el) return;
  const d = new Date(document.lastModified);
  if (d.getFullYear() > 2000) {
    el.textContent = '更新: ' + d.getFullYear() + '年' + (d.getMonth() + 1) + '月';
  }
});
