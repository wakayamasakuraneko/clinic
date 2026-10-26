# price/

トップページ（`index.html`）の料金表のデータを置くフォルダです。

2026-10-17 に料金表を作り直しました（v2）。

## フォルダ構成

```
price/
├── data/
│   ├── price-table.json       # 表の構成（見出し・行・説明文）← v2
│   ├── price-data.json        # 料金の数字
│   └── antiworm-data.json     # 駆虫薬の比較表
└── html/                      # 旧料金表のHTMLパーツ（v2では未使用・削除候補）
```

## 仕組み

`index.html` の `<div id="price-table"></div>` に、`js/price-table.js` が料金表一式（料金表開閉ボタン・表・合計欄）を組み立てます。見た目は `css/price-table.css` です。

```
price-table.json（どの見出しに、どんな行を、どの順で）
        ＋
price-data.json（料金の数字）   →  js/price-table.js  →  #price-table
        ＋
antiworm-data.json（駆虫薬の比較表）
```

## よくある変更

| やりたいこと | 直す場所 |
|---|---|
| 料金を変える | `price-data.json` の数字 |
| 項目を足す | `price-data.json` に料金を足し、`price-table.json` の行に追加 |
| 項目の表示名を変える | `price-table.json` の `label`（小計の内訳名は `name`） |
| 項目を一時的に隠す | `price-table.json` の行に `"hidden": true` |
| 説明文を変える | `price-table.json` の `note` |
| 色を変える | `css/price-table.css` の先頭の `--pt-…` |

## `price-table.json` の行の書き方

```jsonc
{
  "label": ["メス", "(耳カット)"],           // 表示名。区切りの所でだけ改行される
  "price": "避妊手術（メス・耳カット）",       // price-data.json の名前
  "name": "メス 避妊手術(耳カット)",          // 小計の内訳に出す名前（省略可）
  "prefix": "※",                            // 料金の前に付ける文字（省略可）
  "suffix": "変動あり",                      // 料金の後に付ける文字（省略可）
  "note": ["説明の1段落目", "2段落目"],       // 行を押すと開く説明（HTML可・省略可）
  "hidden": true,                           // 表示しない（省略可）
  "noCalc": true                            // 個数欄を付けない（省略可）
}
```

- 料金に幅がある行は `"priceRange": ["下限の名前", "上限の名前"]` と書きます。
- 1行に複数の料金を並べる行（コンベニア）は `"options": [{ "sub": "2㎏まで", "price": "…" }, …]` と書きます。

`price-data.json` に無い名前を書くと、表には「—」と出て、ブラウザのコンソールに警告が出ます。
