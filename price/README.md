# price/

料金表まわりのデータ・HTMLパーツを格納するフォルダ。

## フォルダ構成

```
price/
├── data/          # JSON データ
│   ├── price-data.json        # 各手術・処置の料金データ
│   └── antiworm-data.json     # 駆虫薬テーブルのデータ
└── html/          # fetch で読み込む HTML パーツ
    ├── price-main.htm         # 料金表本体
    ├── price-discount.htm     # 割引説明
    └── price-preview.css      # 単品プレビュー専用CSS（後述）
```

## 読み込みの仕組み

`index.htm` から以下の JS が呼ばれ、fetch でパーツを差し込む。

- `js/price-loader.js` → `price/html/` の .htm を fetch して `#price-main` / `#price-discount` に挿入
- `js/price-data.js` → `price/data/price-data.json` を fetch して料金の数字を埋め込む
- `js/render-antiworm.js` → `price/data/antiworm-data.json` を fetch して駆虫薬テーブルを描画

## price-preview.css について

**本番には不要。** `index.htm` から fetch して使う分には、`css/priceCSS/price-bundle.css` が適用されるので関係ない。

**存在理由：** `price-main.htm` を単品でブラウザ表示してレイアウトを確認したいとき用に実験的に作ったもの。
**注意点：**
- 単品プレビューでは JS（価格反映・アコーディオン）は動かないため、料金欄は空のまま表示される
- `price-bundle.css` を変更した場合はこちらも手動で同期が必要（ズレが生じても本番には影響しない）
- 不要と判断した場合は削除しても問題ない（`price-main.htm` の `<link rel="stylesheet" href="price-preview.css" />` も合わせて削除する）
