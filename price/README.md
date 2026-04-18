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
    └── price-discount.htm     # 割引説明
```

## 読み込みの仕組み

`index.htm` から以下の JS が呼ばれ、fetch でパーツを差し込む。

- `js/price-loader.js` → `price/html/` の .htm を fetch して `#price-main` / `#price-discount` に挿入
- `js/price-data.js` → `price/data/price-data.json` を fetch して料金の数字を埋め込む
- `js/render-antiworm.js` → `price/data/antiworm-data.json` を fetch して駆虫薬テーブルを描画
