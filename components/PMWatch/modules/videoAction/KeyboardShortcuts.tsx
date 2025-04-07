export default function KeyboardShortcuts() {
    return <div className="pmw-help-content">
        <h2>MintWatch のキーボードショートカット</h2>
        <p>
            ショートカットキーは開発中で、限定的です。<br/>
            現在は以下のショートカットキーが使用できます:
        </p>
        <ul>
            <li><kbd>Space</kbd> 再生/一時停止</li>
            <li><kbd>←</kbd> / <kbd>→</kbd> 10秒戻し/送り</li>
            <li><kbd>,</kbd> / <kbd>.</kbd> 16ms戻し/送り</li>
            <li><kbd>C</kbd> コメントへフォーカス</li>
            <li><kbd>F</kbd> フルスクリーン</li>
            <li><kbd>M</kbd> ミュート</li>
        </ul>
        <kbd>Shift+/</kbd> を押すと、このヘルプをすぐに表示できます。<br/>
        <kbd>Esc</kbd> を押すとこのウィンドウを閉じます。
    </div>
}