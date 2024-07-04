const gdb = document.querySelector('.glow-dot-button');

function changeColor() {
    gdb.classList.add('change-color');
    setTimeout(() => {
        gdb.classList.remove('change-color');
        gdb.style.backgroundColor = '#886c34'; // 元の背景色に戻す
        // gdb.style.backgroundColor = '#54a951'; // 元の背景色に戻す
        // gdb.style.backgroundColor = '#6200ea'; // 元の背景色に戻す
    }, 1000);
}

function glowButtons() {
    setTimeout(() => {
        changeColor();
    }, 4000); // 星が消えた後の1秒間のみ背景色を変える
    setTimeout(glowButtons, 5000); // 5秒のサイクルを繰り返す
}

glowButtons();