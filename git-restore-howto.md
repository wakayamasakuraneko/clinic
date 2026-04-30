# git 復元メモ

## コミット一覧を見る

```bash
git log --oneline
```

実行すると以下のような一覧が出る。左の7文字がコミットID。

```
2da3bfc add: favicon・pics各種・articles追加、.gitignore整備
0980bb9 gemini: body max-width 1000px でボックスレイアウト化
b67a203 refactor: CSS整理・price/フォルダ再編・不要ファイルをアーカイブ
...
```

日付も見たい場合：

```bash
git log --oneline --format="%h %ad %s" --date=short
```

---

## 特定のコミットの状態に戻す

### ファイル1つだけ戻す（おすすめ）

```bash
git restore --source=コミットID ファイル名
```

例：`index.htm` を `b67a203` の時点に戻す

```bash
git restore --source=b67a203 index.htm
```

### フォルダごと戻す

```bash
git restore --source=コミットID フォルダ名/
```

---

## 注意

- `.gitignore` に入れたファイル（`pics/未使用/` など）は git で管理していないので復元不可
- `git restore` は元に戻せない操作なので、戻す前に現在の状態をコミットしておくと安全

---

## ⚠️ 実際にやらかした事例（2026-04-26）

### 何が起きたか

`gemini 2.htm` に大量の作業（nav-page-footer追加・サンプルA〜E追加など）をしたが、**コミットしないまま** 作業を続けていた。

途中で実験的な変更（nav-page-sample-nav を下固定）を試みたら壊れたので、「変更前に戻して」と依頼。Claude が `git checkout -- "gemini 2.htm"` を実行したところ、**直近コミット（0980bb9）まで巻き戻され**、コミットしていなかった大量の作業が全部消えた。

### なぜそうなったか

`git checkout -- <ファイル>` は「直前のコミット時点」に戻すコマンド。  
コミットしていない変更はすべて消える。

### 対策

**① こまめにコミットする**（最重要）

```bash
git add "gemini 2.htm"
git commit -m "作業内容のメモ"
```

**② 実験的な変更の前は `git stash` で一時退避**

```bash
git stash        # 未コミット作業を退避
# → 試して壊れたら
git stash pop    # 退避した状態に戻す
```

### 今回の復旧方法

Claude Code のファイル履歴バックアップ（`~/.claude/file-history/`）に v53 が残っていたため復元できた。  
ただし **このバックアップが常にあるとは限らない**。こまめにコミットするのが唯一の確実な対策。

---

## 今日時点（2026-04-22）のコミットID

```
2da3bfc  add: favicon・pics各種・articles追加、.gitignore整備
```

## 今日時点（2026-04-26）のコミットID

```
3a2164a  gemini: nav-page-footer・サンプル配色A〜E追加、_templatesフォルダ整備
```

## 今日時点（2026-04-30）のコミットID

```
6d3e92a  chore: 未ステージファイルを整理・コミット
c3de18e  convert: articles の .htm を index.html に変換・article.css 共通スタイル適用（11記事）
```

- `c3de18e` — article.css 新規追加、11記事（what-is-spay / cancel-ok / carry-case / laundry-net / trap-setup / trap-transport / trap-temperature / trap-fail / collapsible-trap / vacuum-effect / trap-pedal）を .htm → index.html に変換
- `6d3e92a` — favicon 各種・index.html・articles/images/ 等を追加、BlogHome・Entire_Blog を .gitignore に追加
