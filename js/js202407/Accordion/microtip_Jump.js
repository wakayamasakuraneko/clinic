document.getElementById('toggle-microchip-button').addEventListener('click', () => {
    const allTbodies = document.querySelectorAll('tbody');
    const microchipTbody = Array.from(allTbodies).find(tbody => {
        return Array.from(tbody.querySelectorAll('tr td')).some(td => td.textContent.includes('マイクロチップ'));
    });

    allTbodies.forEach(tbody => {
        tbody.classList.remove('show');
        tbody.querySelectorAll('.js-menu').forEach(menu => menu.classList.remove('is-active'));
        tbody.querySelectorAll('.contents').forEach(content => content.classList.remove('is-open'));
    });

    if (microchipTbody) {
        microchipTbody.classList.add('show');
        const relevantMenu = Array.from(microchipTbody.querySelectorAll('.js-menu')).find(menu => {
            return Array.from(menu.querySelectorAll('td')).some(td => td.textContent.includes('マイクロチップ'));
        });
        if (relevantMenu) {
            relevantMenu.classList.add('is-active');

            // 対応する contents を開く
            let sibling = relevantMenu.nextElementSibling;
            while (sibling) {
                if (sibling.classList.contains('contents')) {
                    sibling.classList.add('is-open');
                    break;
                }
                sibling = sibling.nextElementSibling;
            }

            relevantMenu.scrollIntoView({ behavior: 'instant' }); // 瞬時にジャンプ
        }
    }
});
