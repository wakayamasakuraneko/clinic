const menu = document.querySelectorAll(".js-menu");

function toggle() {
    const content = this.nextElementSibling;
    this.classList.toggle("is-active");
    content.classList.toggle("is-open");
}

for (let i = 0; i < menu.length; i++) { menu[i].addEventListener("click", toggle); }

// 「.js-menu」をクラスに持つ要素がクリックされたとき、「.js-menu」に「is-active」をトグル(追加・削除)し、「.js-menu」の次の兄弟要素のクラスに「"is-open"」をトグルする。

// for文によって、これは「.js-menu」をクラスに持つ全ての要素に適応される。