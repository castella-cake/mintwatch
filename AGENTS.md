# MintWatch 開発ガイド

## 構成と実行フロー

- WXT + React のブラウザ拡張機能。`entrypoints/index.content.ts` がニコニコの対象ページを判定し、`utils/initiator/router.ts` が元ページの script/style を抑止して React UI をマウントする。
- `components/PMWatch` は視聴ページ、`components/ReShogi` はランキング、`components/Search` は検索、`components/Global` は共通 UI、`components/Router` はSPAルーターを担当する。
- `utils/apis` にAPI呼び出し本体、`hooks/apiHooks` にReact Query経由のデータ取得を置く。APIをUIコンポーネントから直接呼ばない。
- `entrypoints/watch_injector.ts` はページスクリプトとして注入されるため、拡張機能APIを使用できない。

## 開発コマンド

- Node.jsとpnpm 11以上を使う。初回または依存関係変更後は`pnpm install`を実行する。
- 開発サーバーは`pnpm run dev`（Chromium）または`pnpm run dev:firefox`（Firefox）。
- ビルドは`pnpm run build`（Chromium MV3）または`pnpm run build:firefox`（Firefox MV2）。成果物は`.output`に出る。
- パッケージ作成は`pnpm run zip`または`pnpm run zip:firefox`。
- 型チェックは`pnpm run compile`。スクリプトとCSSの検証は`pnpm run lint:script && pnpm run lint:style`。
- E2EはPlaywrightを使い、`pnpm run build`で`.output/chrome-mv3`を作成してから`pnpm run e2e`を実行する。単一テストは`pnpm run e2e e2e/watch/basicRenderTest.spec.ts`のようにパスを渡す。
- 単体テストはVitest。単一テストは`pnpm run test -- utils/titleArtistResolver.test.ts`のようにパスを渡す。

## 実装規約

- 設定保存はWXT Storageを使う。通常設定は`sync`と`useStorageVar()`、プレイヤー設定は`local`と`useStorageVar(..., "local")`を使い、`browser.storage`を直接操作しない。
- 新しいコンポーネントはnamed exportを使い、単一箇所でしか使わない関数や型を安易に`utils`や`types`へ切り出さない。(テストを書く場合は関数へ切り出す)
- TypeScript/Reactのコンポーネント・型はPascalCase、関数・変数はcamelCase。ESLintの設定は4スペース、ダブルクォート、セミコロンなし。
- CSSは`components/<component>/styleModules/*.css`を基本とし、状態表現はクラスより`data-*`属性を優先する。CSS変更後はStylelintを実行する。
- 新しいCSSクラス名はケバブケース。よく使われるワードはコンテナに`-container`、それをpositionなどの理由で囲む場合に`-wrapper`、複数アイテムを入れるのに`-items`、アイテムそのものに`-item`を使う。
- 通常設定を追加するときは`.github/skills/customizable-settings/SKILL.md`、プレイヤー設定を追加するときは`.github/skills/player-settings/SKILL.md`を先に確認する。
- 自動インポートが構成されており、Reactのよく使うフックや、utils,hooks,typesにあるものは大抵自動でインポートされる(詳しくは構成ファイルかWXTのllmsを参照)。インポート漏れがあるように見えても、TSエラーが起きていない場合は足さない。逆に自動インポートされるはずがエラーが起きる場合は、`pnpm exec wxt prepare` を一度実行して型を再生成させてみると良い。
- モーダル/ポップオーバー/メニュー領域の「外側クリックで閉じる」挙動は、各コンポーネントが `hooks/useOutsideClose` を使って自分で所有する。
  `RouterUI.tsx` のグローバルハンドラに依存しない (削除済み)。
  新規領域を追加する場合は `useOutsideClose(nodeRef, isOpen, onClose)` を組み込む。
  このため、上記を開くボタンの `e.stopPropagation()` は原則として不要。領域内ボタンの onClick で自由に state を変えて良い。
  ただしトグルボタンが**領域 DOM の外**に固定配置されている場合 (例: 固定ヘッダー内のハンバーガー)、
  ボタンに `data-outside-ignore="<識別子>"` を付け、`useOutsideClose` の第4引数 `ignoreId` に同じ識別子文字列を渡す。
  識別子は対象領域が連想できる名前にする (例: `side-menu-trigger`)。
- stylistic から発生する ESLint エラーは全て安全に自動修正可能。

## WXT について
- WXT に関する API などについては、`https://wxt.dev/llms.txt` から概要や型データを参照可能。必要に応じて使用すること。
