import onboardingMarkdown from "@/assets/onboarding.md?raw"
import whatsNewMarkdown from "@/assets/whatsnew.md?raw"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

const docs = { "help": onboardingMarkdown, "whatsnew": whatsNewMarkdown }

export default function MarkdownHelp({ contentKey }: {contentKey: keyof typeof docs}) {
    return <div className="pmw-help-content">
        <Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>
            {docs[contentKey]}
        </Markdown>
    </div>
}