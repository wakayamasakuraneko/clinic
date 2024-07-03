// line-height-adjustable(行間調整)
// <ol>の行間の自動調整普段は2.5-3でカラム落ちすると1.7、ただし不完全。

document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("tbody.show td ol");

    function checkOverflow(element) {
        const parentWidth = element.parentElement.clientWidth; // 親要素の幅を取得

        // クローンを作成
        const clonedElement = element.cloneNode(true);
        clonedElement.style.display = 'inline-block';
        clonedElement.style.visibility = 'hidden';
        clonedElement.style.height = 'auto';
        clonedElement.style.whiteSpace = 'nowrap'; // 折り返しを無効にする
        clonedElement.className = element.className; // 元の要素と同じクラスを適用
        document.body.appendChild(clonedElement); // クローンを一時的に追加

        // クローンの幅が親要素の幅よりも大きい場合、カラム落ちと判断
        if (clonedElement.scrollWidth > parentWidth) {
            element.classList.add('wrapped');
        } else {
            element.classList.remove('wrapped');
        }

        // クローンを削除
        document.body.removeChild(clonedElement);
    }

    function checkAllElements() {
        elements.forEach((element) => {
            requestAnimationFrame(() => checkOverflow(element));
        });
    }

    checkAllElements();
    window.addEventListener('resize', checkAllElements);
});
