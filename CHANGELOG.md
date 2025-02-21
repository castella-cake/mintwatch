# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.4.0 - 2025/02

### Added
- 再生キューからアイテムを削除することができるようになりました
- 動画統計からラウドネスノーマライズ情報が確認できるようになりました

### Fixed
- プレイリストの自動再生に関する問題を修正しました
- エフェクト設定の設定に正しい単位が使われるようになりました
- 言語設定が日本語以外に設定されている場合に発生するエラーを修正しました


## 0.3.0 - 2025/02/13

### Added
- 動画のロード中表示を追加
- Re:Re:仮 レイアウトを追加
- レコメンドに「投稿動画」と「タイムライン」が追加
- 音量調整ジェスチャーを追加(仮段階)

### Changed
- 設定画面のスタイルを変更

### Fixed
- CLSの大幅な改善
- スクリプトの実行阻止が、回線速度によっては失敗してリロードループする問題を修正
- PepperMint+ から引き継いだ時に残っていた文字列を修正
- 一部の条件において、一時停止していた動画が再び再生されてしまう問題を修正
- Shinjuku レイアウトのコンテンツツリーにパディングが適用されていない問題を修正
- Shinjuku プレイヤーのシークバーを修正
- Shinjuku レイアウトのカウンターが Firefox 環境で崩れる場合がある問題を修正

## 0.2.0 - 2025/01/25

### Added
- 初版   
PepperMint+ の v3.0.0 ブランチから引き継ぎました