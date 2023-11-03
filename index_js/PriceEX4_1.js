// theadをクリックしたら、tbodyを表示するメインプログラム
// かつthead右のマークの表示変化管理
// tableが２つある事が前提?
const tables = document.querySelectorAll('table');
tables.forEach(table => {
    const heads = table.querySelectorAll('thead');
    const bodies = table.querySelectorAll('tbody');

    heads.forEach((head, index) => {
        head.addEventListener('click', () => {
            if (bodies[index].classList.contains('show')) {
                bodies[index].classList.remove('show');
            } else {
                bodies[index].classList.add('show');
            }
        });

        const observer = new MutationObserver(() => {
            if (bodies[index].classList.contains('show')) {
                head.classList.add('thead-active'); // <thead>にクラスを追加
            } else {
                head.classList.remove('thead-active'); // <thead>からクラスを削除
            }
        });

        observer.observe(bodies[index], { attributes: true, attributeFilter: ['class'] });

        // 初期表示の設定
        if (bodies[index].classList.contains('show')) {
            head.classList.add('thead-active'); // <thead>にクラスを追加
        } else {
            head.classList.remove('thead-active'); // <thead>からクラスを削除
        }
    });
});





const toggleButton = document.getElementById("toggle-button");
const priceExclTax = document.getElementsByClassName("price-excl-tax");
const priceInclTax = document.getElementsByClassName("price-incl-tax");
const slash = document.getElementsByClassName("slash");
const taxStatus = document.getElementsByClassName("tax-status"); // 追加: tax-status要素を取得

// 初期の価格表示モードを「excl」に設定
let currentModeIndex = 2;

// 初期のtax-statusを設定
let taxStatusText = "税抜"; // 初期表示は「税抜」

// 価格表示モードのリスト
const modes = ["excl", "incl", "both"];

// 価格の表示モードを切り替える関数
function togglePriceDisplay() {
    currentModeIndex = (currentModeIndex + 1) % modes.length;
    const mode = modes[currentModeIndex];

    for (let i = 0; i < priceExclTax.length; i++) {
        if (mode === "excl") {
            priceExclTax[i].style.display = "block";
            priceInclTax[i].style.display = "none";
            slash[i].style.display = "none";
        } else if (mode === "incl") {
            priceExclTax[i].style.display = "none";
            priceInclTax[i].style.display = "block";
            slash[i].style.display = "none";
        } else if (mode === "both") {
            priceExclTax[i].style.display = "block";
            priceInclTax[i].style.display = "block";
            if (window.innerWidth >= 600) {
                slash[i].style.display = "inline";
            }
        }
    }

    // tax-statusの表示を切り替える
    if (mode === "excl") {
        taxStatusText = "税抜";
    } else if (mode === "incl") {
        taxStatusText = "税込";
    } else if (mode === "both") {
        taxStatusText = "抜/込";
    }

    // tax-statusのテキストを更新
    for (let i = 0; i < taxStatus.length; i++) {
        taxStatus[i].textContent = taxStatusText;

        // tax-statusに応じた背景色と文字色を設定する
        switch (taxStatusText) {
            case "税抜":
                // taxStatus[i].style.backgroundColor = "white";
                taxStatus[i].style.color = "blue";
                break;
            case "税込":
                // taxStatus[i].style.backgroundColor = "white";
                taxStatus[i].style.color = "red";
                break;
            case "抜/込":
                // taxStatus[i].style.backgroundColor = "white";
                const parts = taxStatusText.split('/');
                taxStatus[i].style.color = "black"; taxStatus[i].innerHTML = `<span style="color: blue;">${parts[0]}</span>/<span style="color: red;">${parts[1]}</span>`;
                break;
            default:
                // デフォルトの設定（必要に応じて変更）
                taxStatus[i].style.backgroundColor = "transparent";
                taxStatus[i].style.color = "black";
        }
    }

}

// トグルボタンクリック時に価格表示モードを切り替える
toggleButton.addEventListener("click", togglePriceDisplay);

// 初期表示の設定
togglePriceDisplay();





// 「広げるbutton」クリックで全tbodyの表示/非表示切替  更に、クリック事にbuttonの表示内容も切替
const tbodyElements = document.getElementsByTagName('tbody');
const button = document.getElementById('show-all-button');
button.addEventListener('click', () => {
    const isShowingAll = button.textContent === '折り畳む';
    for (let i = 0; i < tbodyElements.length; i++) {
        const tbody = tbodyElements[i];
        if (isShowingAll) {
            tbody.classList.remove('show');
            button.textContent = '広げる';
        } else {
            tbody.classList.add('show');
            button.textContent = '折り畳む';
        }
    }
});

// HTMLで税込価格を計算し表示する
for (let i = 0; i < priceExclTax.length; i++) {
    const exclPriceText = priceExclTax[i].textContent.trim().split("円")[0];
    const exclPrice = parseInt(exclPriceText);
    const inclPrice = Math.round(exclPrice * 1.1);
    priceInclTax[i].textContent = `${inclPrice}円`;
}






