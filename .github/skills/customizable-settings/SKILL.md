---
name: customizable-settings
description: MintWatch にどのようにして新しい通常の設定項目を追加し、反映させるかの手順。新しいオプトイン/オプトアウト機能を追加する際などに使用する。
---

# MintWatch の設定項目の追加
注意: プレイヤー(ローカル)設定の追加については、`player-settings` スキルを参照してください。

MintWatch はカスタマイズ性を重視しています。  
そのため、必ずしも全てのユーザーに適するものではない機能や挙動を、ある程度カスタマイズできることも重要です。

このドキュメントでは、MintWatch に新しい設定項目を追加するためのガイドラインとコード例を提供します。

## 1. 設定を定義する

`utils/settingsList.ts` は、設定ページに表示される全ての設定項目を定義するファイルです。  
ここに新しい設定項目を追加します。

設定の `name` は、ストレージに保存されるキーを表します。  
以前はすべて小文字でしたが、これから追加する設定ではローワーキャメルケースを推奨します。

`settingsList` には、カテゴリごとの配列を持ち、  
その中に設定項目を表す `setting` オブジェクトが含まれています。

`setting` オブジェクトの type は、設定の種類を表します。  
- `checkbox`: チェックボックス
- `select`: ドロップダウンでの選択 (`values` で選択される値を定義)
- `selectButtons`: ラジオボタンのように表示される選択 (`values` で選択される値を定義)
- `inputNumber`: 数値入力 (`min` と `max` で範囲を定義)
- `inputString`: 文字列入力 (`placeholder` でプレースホルダーを定義可能)
- `desc`: 説明文 (操作要素なし, 指示がない限り使用しません)
- `group`: `<details>`タグによる設定グループ (`children` で子設定を定義, 指示がない限り使用しません)

## 2. 言語ファイルを定義する
`langs/` ディレクトリには、各言語ごとの翻訳ファイルがあります。  
新しい設定項目を追加したら、対応する翻訳ファイルにもその設定の名前や説明を追加してください。

`SETTINGS_ITEMS` 内のキーは、setting オブジェクトの `name` と一致させる必要があります。  
その中のオブジェクトには、`name` と `hint` を定義します。

`name` には設定項目の名前を簡潔に記述し、その名前だけでユーザーが正しく理解できない可能性がある場合は、`hint` で説明を追加できます。
また、`select` や `selectButtons` の選択肢は、 `select` 配列内に記述します。この時、順番は元の setting オブジェクトの `values` と同じである必要があります。

## 3. 機能を実装する
コンテンツスクリプトが描画する React コンポーネントは `StorageProvider` コンテキストを通じてストレージの内容を取得できます。  
設定項目の値を取得するには、`useStorageVar()` フックを使用します。
```typescript
const { pmwlayouttype, shinjukuDotFontType } = useStorageVar(["pmwlayouttype", "shinjukuDotFontType"], "sync")
```

`settingsList` 内の設定は、`sync` 領域に保存されます。`sync` であれば、第二引数を省略できます。
