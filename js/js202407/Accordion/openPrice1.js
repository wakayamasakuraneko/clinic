// 挙動をチェックする時はこのプログラムはOFFにしていた方がよい



// // 1つ目のtbodyの場合のみ開けておく場合
function partialDisplay() {
    // const width = window.innerWidth;
    const tbodies = document.getElementsByTagName('tbody');
    for (let i = 0; i < tbodies.length; i++) {
        const tbody = tbodies[i];
        // if (i === 4) { // 5つ目のtbodyのみ閉めておく場合
        if (i >= 1) {
            tbody.classList.remove('show'); // 初期状態は非表示
            // } else if (width <= 600) {
            //     tbody.classList.remove('show');
            // ↑画面幅600px以下は全部閉じておく
        } else {
            tbody.classList.add('show');
        }
    }
}


// 4つ目と5つ目のtbodyのみ表示する
// function partialDisplay() {
//     const tbodies = document.getElementsByTagName('tbody');
//     for (let i = 0; i < tbodies.length; i++) {
//         const tbody = tbodies[i];
//         // if (i === 1) { // 2つ目のtbodyのみ表示する
//         if (i === 3 || i === 4) {
//             tbody.classList.add('show');
//         } else {
//             tbody.classList.remove('show');
//         }
//     }
// }

// 初回実行
partialDisplay();

// リサイズ時にも実行
// window.addEventListener('resize', partialDisplay);




