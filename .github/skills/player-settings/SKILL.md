---
name: player-settings
description: MintWatch にどのようにして新しいプレイヤー設定項目を追加し、反映させるかの手順。プレイヤー設定を追加する際に使用する。
---

# MintWatch のプレイヤー設定の追加
注意: 通常設定(sync)の追加については、`customizable-settings` スキルを参照してください。

このドキュメントでは、MintWatch に新しいプレイヤー設定項目を追加するためのガイドラインとコード例を提供します。

## 1. 設定を定義する

`utils/playerSettingsList.ts` は、プレイヤー設定の全ての設定項目を定義するファイルです。  
ここに新しい設定項目を追加します。

`PlayerSettingList` オブジェクトは、プレイヤー設定のカテゴリを内包するオブジェクトです。
キーをカテゴリの識別子として、`PlayerSettingsCategory` オブジェクトを値に持ちます。

`PlayerSettingCategory` オブジェクトは、プレイヤー設定のカテゴリを表します。  
このカテゴリーは、プレイヤー設定のタブを定義するのに使用されますが、設定のグループ化のために使用される場合もあります。
children には `PlayerSetting` オブジェクトを値にするkey-valueペアのオブジェクトを持ちます。  
このキーは、ストレージに保存されるキーを表します。
(詳しくは型情報を参照)

`PlayerSetting` オブジェクトの `name` には設定項目の名前を簡潔に記述します。  
その名前だけでユーザーが正しく理解できない可能性がある場合は、`hint` で説明を追加できます。  
`defaultValue` には、設定のデフォルト値を定義します。

`PlayerSetting` オブジェクトの `type` は、設定の種類を表します。  
- `checkbox`: チェックボックス
- `select`: ドロップダウンでの選択 (`values` で選択される値を定義, `texts` で選択肢のテキストを定義)
- `percentageSliders`: パーセンテージで選択する複数のスライダー(`sliders` で各スライダーを定義)
- `details`: `<details>`タグによる別カテゴリの表示(`detailsTarget` で対象のカテゴリを指定, 指示がない限り使用しません)

## 3. 機能を実装する
コンテンツスクリプトが描画する React コンポーネントは `StorageProvider` コンテキストを通じてストレージの内容を取得できます。  
設定項目の値を取得するには、`useStorageVar()` フックを使用します。
```typescript
const { pauseOnCommentInput } = useStorageVar(["pauseOnCommentInput"], "local")
```

`PlayerSetting` 内の設定は、`local` 領域に保存されます。第二引数に必ず `local` を指定してください。
