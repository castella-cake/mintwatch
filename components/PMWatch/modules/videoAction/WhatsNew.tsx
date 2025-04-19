import Markdown from 'react-markdown'
import whatsnewMarkdown from '@/assets/whatsnew.md?raw'
export default function WhatsNew() {
    return <div className="pmw-help-content">
        <Markdown>
            {whatsnewMarkdown}
        </Markdown>
    </div>
}