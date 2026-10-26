# clinic

和歌山スペイクリニックさくらねこ の公式サイトです。

- 公開先：https://wakayamasakuraneko.com/ （GitHub Pages・`CNAME` で独自ドメイン設定）
- `.nojekyll` を置いているので、Jekyll による変換はされません（ファイルはそのまま公開されます）。

## フォルダ構成

| 場所 | 内容 |
|---|---|
| `index.html` | トップページ（お知らせ・料金表・営業時間・アクセスなど） |
| `index.htm` | 旧URL用のリダイレクトページ |
| `articles/` | 記事ページ（捕獲器の使い方、助成金制度の記事 `josekin-mondai/` など） |
| `price/` | トップページの料金表のデータ。仕組みと編集方法は [price/README.md](price/README.md) |
| `css/` / `js/` | トップページなどで使う共通のCSS・JS |
| `images/` / `favicon/` | 画像・ファビコン |
| `templates/` | 開発用のテンプレート集（公開ページからはリンクしていない） |
| `不要/` | 使わなくなった旧ファイルの置き場 |

## よくある更新

| やりたいこと | 直す場所 |
|---|---|
| 臨時休診のお知らせ | `index.html` のヘッダー部分のスクリプト（`closureEnd` と表示文言） |
| 料金の変更・項目の追加 | `price/data/price-data.json` と `price/data/price-table.json`（詳しくは [price/README.md](price/README.md)） |
