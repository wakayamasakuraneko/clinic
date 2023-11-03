
// 5つ目のtbodyが初期状態で非表示だが、それ以外は表示
// 挙動をチェックする時はこのプログラムはOFFにしていた方がよい
function partialDisplay() {
    // const width = window.innerWidth;
    const tbodies = document.getElementsByTagName('tbody');
    for (let i = 0; i < tbodies.length; i++) {
        const tbody = tbodies[i];
        // if (i === 4) { // 5つ目のtbodyのみ閉めておく場合
        if (i >= 1) { // 1つ目のtbodyの場合のみ開けておく場合
            tbody.classList.remove('show'); // 初期状態は非表示
            // } else if (width <= 600) {
            //     tbody.classList.remove('show');
            // ↑画面幅600px以下は全部閉じておく
        } else {
            tbody.classList.add('show');
        }
    }
}

// 初回実行
partialDisplay();

// リサイズ時にも実行
// window.addEventListener('resize', partialDisplay);




