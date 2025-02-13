# MintWatch

MintWatch は、ニコニコ動画向けの視聴にフォーカスした、カスタマイズ性の高い新たな動画プレイヤーです。   
プロジェクトはMITライセンスで提供され、背後の面倒な規約などはありません。   
Chrome Webstore: https://chromewebstore.google.com/detail/mintwatch-beta/ggamdocgmhpdnldkkepkiobpioakopom   
Firefox Add-ONS: https://addons.mozilla.org/ja/firefox/addon/mintwatch/

**この拡張機能は非公式のプロジェクトであり、ニコニコやドワンゴとは一切提携していません。**   
もしページレイアウトの崩れなどのバグが発生した場合、まずそれが MintWatch やその他の拡張機能によって引き起こされたものでないか確認してください。   
この拡張機能で発生した問題は、ニコニコ公式のサポートではなくこのリポジトリの[Issue](https://github.com/castella-cake/mintwatch/issues)に報告してください。

# Why?
ニコニコ動画の新視聴ページは、"現代的な"CSSクラスの命名によりUserStyle/UserScriptを使用したカスタマイズを難しくしています。   
MintWatch は、新視聴ページを用いずにページを構築しており、よりカスタマイズ可能なオープンソースの視聴ページを目指して開発されています。   
旧視聴ページに慣れていた人でも、新視聴ページを使用している人でも、すぐに視聴を始められます。

# Install
## ストア版(安定版)を入手
### Firefox
1. https://addons.mozilla.org/ja/firefox/addon/mintwatch/ に行きます
2. ``Firefox に追加`` を押します
3. 画面の手順に従います
4. おわり
### Chrome
1. https://chromewebstore.google.com/detail/mintwatch-beta/ggamdocgmhpdnldkkepkiobpioakopom に行きます
2. ``Chrome に追加`` を押します
3. 画面の手順に従います
4. おわり
## リリースからインストールする
**通常使用には自動更新のある安定版を強く推奨します。このインストール方法は、ストアが使用できない場合にのみ使用してください。**
### Chrome
1. リリースページに行きます
2. ``chrome-<バージョン名>``のzipファイルをダウンロードします
3. zipを解凍します
4. ``chrome://extensions``を開きます
5. 右上のデベロッパーモードを有効化します
6. 「パッケージ化されていない拡張機能を読み込む」をクリックします
7. 解凍したフォルダーを選択します
8. おわり
### Firefox
Firefoxでは、新しいバージョンがある場合自動的にアップデートされます
1. リリースページに行きます
2. xpiファイルをダウンロードします(この時点でインストールダイアログが表示された場合は、そのまま画面の手順に従えば終わりです)
3. xpiファイルをfirefoxにD&Dします
4. 画面の手順に従います
5. おわり

# Build
MintWatch は、ブラウザ上で動作させるためにビルドが必要です。   
Node.jsとnpmをインストールしたら、以下のコマンドで依存関係をインストールします:
```
npm install
```
Manifest V3向け(Chromium)にビルドするには、以下のコマンドを実行します。
```
npm run build
```
ビルドが正常に終了すると、`.output` フォルダーに成果物が作成されます。   

HMRを利用できる開発サーバーを開始するには、`npm run dev`を実行してください。   
提出用のZIP作成には`npm run zip`を使用します。

Manifest V2向け(Firefox)の場合は、runコマンドの最後に`:firefox`を付けて実行します。   

# Support
## ブラウザー
Niconico-PepperMintは最近のFirefoxとその派生ブラウザ、そしてChromium系ブラウザをサポートします。  
ただし、完全な動作には`:has()`のサポートが必要です。(最近のブラウザでは概ねサポートされているはずです)   
PCでの動作を想定した拡張機能のため、スマートフォンでの動作は現状サポートしていません。

# Donate
開発者への寄付に関しては、Github sponsorsで受け付けています。   
https://github.com/sponsors/castella-cake

# License
MintWatch のライセンスは``MIT License``です。  
詳細は``LICENSE.txt``を確認してください。  