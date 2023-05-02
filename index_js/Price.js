// chatGPT アコーディオン表 から

// theadをクリックしたら、tbodyを表示するメインプログラム
// かつthead右のマークの表示変化管理
// tableが２つある事が前提
const tables = document.querySelectorAll('table');
tables.forEach(table => {
    const heads = table.querySelectorAll('thead');
    const bodies = table.querySelectorAll('tbody');

    heads.forEach((head, index) => {
        const button = head.querySelector('button');
        head.addEventListener('click', () => {
            if (bodies[index].classList.contains('show')) {
                bodies[index].classList.remove('show');
                button.innerHTML = '<i class="fas fa-search-plus"></i>';
            } else {
                bodies[index].classList.add('show');
                button.innerHTML = '<i class="far fa-check-circle"></i>';
            }
        });

        const observer = new MutationObserver(() => {
            if (bodies[index].classList.contains('show')) {
                button.innerHTML = '<i class="far fa-check-circle"></i>';
            } else {
                button.innerHTML = '<i class="fas fa-search-plus"></i>';
            }
        });

        observer.observe(bodies[index], { attributes: true, attributeFilter: ['class'] });

        // 初期表示の設定
        if (bodies[index].classList.contains('show')) {
            button.innerHTML = '<i class="far fa-check-circle"></i>';
        } else {
            button.innerHTML = '<i class="fas fa-search-plus"></i>';
        }
    });
});



// 税抜/税込の切り替えボタンと表示のされ方
// tax-status(税抜/税込)の自動表示
const exclButton = document.getElementById("excl-button");
const inclButton = document.getElementById("incl-button");
const bothButton = document.getElementById("both-button");
const toggleButton = document.getElementById("toggle-button");

let isDisplayingExcl = true;

const priceExclTax = document.getElementsByClassName("price-excl-tax");
const priceInclTax = document.getElementsByClassName("price-incl-tax");
const slash = document.getElementsByClassName("slash");
// const taxStatus = document.getElementById("tax-status");
// const taxStatus = document.getElementByClassName("tax-status");
const taxStatus = document.getElementsByClassName("tax-status");

// HTMLで税込価格を入力していなくても1.1倍の値を入れてくれる
for (let i = 0; i < priceExclTax.length; i++) {
    const exclPriceText = priceExclTax[i].textContent.trim().split(" ")[0];
    const exclPrice = parseInt(exclPriceText);
    const inclPrice = Math.round(exclPrice * 1.1);
    priceInclTax[i].textContent = `${inclPrice}円`;
}

// トグルボタンクリックする度に(税抜)(税込)(税抜/税込)の表示変わる
// モードのリスト
// 波線「～」が(税抜/税込)の時に表示の仕方が変わる
const modes = ["excl", "incl", "both"];
const WaveLines = document.querySelectorAll(".WaveLine");

// 現在の表示モードのインデックス
let currentModeIndex = 0;

// トグルボタンクリック時
toggleButton.addEventListener("click", function () {
    currentModeIndex = (currentModeIndex + 1) % modes.length;

    // モードに応じて表示を切り替える
    switch (modes[currentModeIndex]) {
        case "excl":
            for (let i = 0; i < priceExclTax.length; i++) {
                priceExclTax[i].style.display = "block";
                priceInclTax[i].style.display = "none";
                slash[i].style.display = "none";
                taxStatus[i].textContent = "(税抜)";
                if (WaveLines[i]) {
                    WaveLines[i].style.display = "none";
                }
            }
            break;

        case "incl":
            for (let i = 0; i < priceExclTax.length; i++) {
                priceExclTax[i].style.display = "none";
                priceInclTax[i].style.display = "block";
                slash[i].style.display = "none";
                taxStatus[i].textContent = "(税込)";
                if (WaveLines[i]) {
                    WaveLines[i].style.display = "none";
                }
            }
            break;

        case "both":
            for (let i = 0; i < priceExclTax.length; i++) {
                priceExclTax[i].style.display = "block";
                priceInclTax[i].style.display = "block";
                taxStatus[i].textContent = "(税抜/税込)";
                if (window.innerWidth < 600) {
                    slash[i].style.display = "none";
                } else {
                    slash[i].style.display = "block";
                }
                if (WaveLines[i]) {
                    WaveLines[i].style.display = "block";
                }
            }
            break;

        default:
            console.error("Invalid mode: " + modes[currentModeIndex]);
    }
});



//  「広げるbutton」クリックで全tbodyの表示/非表示切替  更に、クリック事にbuttonの表示内容も切替 
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



// slash「/」の管理
// ウィンドウのリサイズイベントを監視する
window.addEventListener('resize', function () {
    // 画面幅が一定以下の場合は、スラッシュを非表示にする
    if (window.innerWidth < 600 && modes[currentModeIndex] === "both") {
        for (let i = 0; i < slash.length; i++) {
            slash[i].style.display = "none";
        }
    } else {
        // 画面幅が一定以上の場合は、スラッシュを表示する
        for (let i = 0; i < slash.length; i++) {
            if (modes[currentModeIndex] === "both") {
                slash[i].style.display = "block";
            }
        }
    }
});

// jQueryを使ってトグルボタンがクリックがクリックされるまで、「/」と「税込価格」を隠しておく
$(document).ready(function () {
    $('#toggle-button').click(function () {
        $('.WaveLine').removeClass('hidden');
    });
});

// slash「/」はページ幅が800以下だと非表示に
function updateDisplay() {
    if ($(window).width() <= 800) {
        $('.slash').addClass('hidden');
    } else {
        $('.slash').removeClass('hidden');
    }
}

// 画面幅が変更された場合に「/」が見え隠れ
$(document).ready(function () {
    $(window).on('resize', function () {
        updateDisplay();
    });

    // 初期状態を更新する
    updateDisplay();

    $('#toggle-button').click(function () {
        $('.price-incl-tax').toggleClass('hidden');
        $('.slash').toggleClass('hidden');
    });
});



// 画面幅が800px以下の場合にslashを隠す
const mediaQuery = window.matchMedia('(max-width: 800px)');

// ウィンドウサイズが変更されたときに「/」が見え隠れ
const handleWindowResize = function (event) {
    if (event.matches) {
        for (let i = 0; i < slash.length; i++) {
            slash[i].classList.add('hidden');
        }
    } else {
        for (let i = 0; i < slash.length; i++) {
            slash[i].classList.remove('hidden');
        }
    }
};

// ウィンドウサイズが変更されたらhandleWindowResizeを呼び出す
mediaQuery.addEventListener(handleWindowResize);

// 初回実行
handleWindowResize(mediaQuery);