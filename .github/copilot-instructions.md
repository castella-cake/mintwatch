# MintWatch 開発ガイド

## プロジェクト概要
MintWatch は、WXT と React を使用して、ニコニコの動画ページを独自 UI に置き換えるブラウザ拡張機能です。
視聴ページ(watch)/ランキングページ(ranking)/検索ページ(search) に対応しており、元ページのスクリプト・スタイルを抑止して React 側で描画します。

## プロジェクトの構造
```
entrypoints/           # 拡張機能スクリプトのエントリポイント
├── background.ts      # バックグラウンドスクリプト
├── index.content.ts   # メイン機能のコンテンツスクリプト
├── load_turnstile.ts  # Cloudflare Turnstile のインポートを含むハンドラーのページスクリプト
└── watch_injector.ts  # Firefox 用 HLS ロジックのページスクリプト

components/
├── Router/           # 独自のSPAルーター実装
├── PMWatch/          # 視聴ページのコンポーネント
├── ReShogi/          # ランキングページのコンポーネント
├── Search/           # 検索ページのコンポーネント
└── Global/           # ヘッダーなどの全ページ共通のコンポーネント

utils/                # ユーティリティ関数 (自動インポート)
├── apis/             # 外部APIラッパー
├── classes/          # クラス定義
└── initiator/        # ページの初期化ロジック

hooks/                # React hooks (自動インポート)
└── hooks/apiHooks/   # APIコール用の React Query フック

types/                # API型定義などの TypeScript 型定義 (自動インポート)
e2e/                  # Playwright E2E テスト
```

## 基本的なアーキテクチャ
1. `entrypoints/index.content.ts` で対象ページを判定し、ルーティングを開始する。
2. `utils/initiator/router.ts` の `MutationObserver` で元サイトの script を即時ブロックする。
3. 置き換え対象 DOM を React で全面的に再構築する。

## コードスタイル
- 単一箇所でしか使わないような関数や型を必要以上に`utils`や`types`などへ切り出さない。
- 型は `any` を安易に使わず、既存の `types/` や型推論を優先する。

## 実装ルール
- ストレージアクセスを統一する。
    - 設定保存は `browser.storage` 直叩きではなく WXT Storage（`storage.setItem()`）を使う。
    - React 側からの参照は `useStorageVar()` を使う。
    - 通常設定は `sync`、プレイヤー設定は `local` に保存する。
- UI 実装の配置ルールを守る。
    - これから実装されるコンポーネントでは `export default` を使わず、名前付き export にする。
    - スタイルは data 属性を優先し、`components/<component>/styleModules/*.css` に配置する。

## API 実装パターン
- 役割分離を維持する。
    - API 呼び出し本体は `utils/apis/*.ts` に実装する（fetch + エラーハンドリング）。
    - UI 側のデータ取得は `hooks/apiHooks/*.ts`（React Query）経由で行う。
- 例: `useSearchExpandData(query)` → `searchExpand(query)`。
- React Query は `staleTime: Infinity` として構成済み。

## 命名・フォーマット規約
- TypeScript / React のコンポーネント・型は PascalCase、関数・変数は camelCase を基本。
- スクリプトの整形は ESLint（`@stylistic`）に従い、`--fix` で修正される。（インデント 4 スペース、ダブルクォート、セミコロンなし）
- CSS クラス名は kebab-case を基本とし、状態表現は data 属性（`data-*`）を優先する。(`.active`のようなクラスを使用しない)
- CSS は Stylelint を使用して検証している。
- CSS は PostCSS を使用しており、`& `不要で子要素へのネストを表現したり、ダブルスラッシュによるコメントを使用できる。(4階層を超えるネストはセレクターを分けるなどして避けること)

## スキル
- `customizable-settings`:
    - 通常設定（`sync`）の追加手順。
    - 主に `utils/settingsList.ts` と `langs/*.json` を更新し、実装側は `useStorageVar()` で参照する。
    - オプトイン/オプトアウト系の設定追加で使用する。
- `player-settings`:
    - プレイヤー設定（`local`）の追加手順。
    - 主に `utils/playerSettingList.ts` を更新し、実装側は `useStorageVar(..., "local")` で参照する。
    - プレイヤー挙動の個別設定追加で使用する。

## 開発・検証フロー
```bash
pnpm install
pnpm run dev
pnpm run dev:firefox
pnpm run build
pnpm run compile
pnpm run e2e
```

## WXT について
WXT に関する API などについては、`https://wxt.dev/llms.txt` から概要や型データを参照可能。  
必要に応じて使用すること。