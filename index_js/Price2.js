// 没

//  「広げるbutton」上の文字をウィンドウ幅によって変化 
const showAllButton = document.getElementById('show-all-button');
const toggleTbody = (tbody) => {
    tbody.classList.toggle('show');
};

// 初期化
const init = () => {
    // 画面幅に応じてボタンラベルを変更
    if (window.innerWidth >= 600) {
        showAllButton.textContent = '折り畳む';
    } else {
        showAllButton.textContent = '広げる';
    }
};

// 画面幅が変わった時の処理
window.addEventListener('resize', () => {
    if (window.innerWidth >= 600) {
        showAllButton.textContent = '折り畳む';
    } else {
        showAllButton.textContent = '広げる';
    }
});

// 初期化処理の実行
init();

// ウィンドウ幅が変更された場合にも実行する
window.addEventListener('resize', () => {
    init();
});



// 5つ目のtbodyが初期状態で非表示だが、それ以外は表示
function hideTbodyOnSmallScreen() {
    const width = window.innerWidth;
    const tbodies = document.getElementsByTagName('tbody');
    for (let i = 0; i < tbodies.length; i++) {
        const tbody = tbodies[i];
        if (i === 4) { // 5つ目のtbodyの場合
            tbody.classList.remove('show'); // 初期状態は非表示
        } else if (width <= 600) {
            tbody.classList.remove('show');
        } else {
            tbody.classList.add('show');
        }
    }
}

// 初回実行
hideTbodyOnSmallScreen();

// リサイズ時にも実行
window.addEventListener('resize', hideTbodyOnSmallScreen);



// 2番目のテーブルのtbodyは初期状態で非表示
// 上記のhideTbodyOnSmallScreen();関数より後に記述しなければならない
function hideTable2() {
    const secondTableTbody = document.querySelector('table:nth-of-type(2) tbody');
    secondTableTbody.classList.remove('show');
}
// ページ読み込み時に初回実行する
hideTable2();

// リサイズ時にも実行
window.addEventListener('resize', hideTable2);

