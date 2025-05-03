import onboardingMarkdown from "@/assets/onboarding.md?raw"
import whatsNewMarkdown from "@/assets/whatsnew.md?raw"
import whatsNewArchiveMarkdown from "@/assets/whatsnew_archive.md?raw"
import { ReactNode } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

const docs = { "help": onboardingMarkdown, "whatsnew": whatsNewMarkdown, "whatsnew_archive": whatsNewArchiveMarkdown }

export default function MarkdownHelp({ contentKey, children }: {contentKey: keyof typeof docs, children?: ReactNode }) {
    return <div className="pmw-help-content">
        <Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>
            {docs[contentKey]}
        </Markdown>
        {children}
    </div>
}