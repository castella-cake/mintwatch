import onboardingMarkdown from "@/assets/onboarding.md?raw"
import Markdown from "react-markdown"
export default function OnboardingHelp() {
    return <div className="pmw-help-content">
        <Markdown>
            {onboardingMarkdown}
        </Markdown>
    </div>
}