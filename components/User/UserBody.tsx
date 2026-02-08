import { PageTopButton } from "../Global/PageTopButton"
import { useLocationContext } from "../Router/RouterContext"
import { MyPageContent } from "./MyPageContent"
import { UserContent } from "./UserContent"
import "./styles/index.css"

export function UserBody() {
    const location = useLocationContext()

    return (
        <div className="container page-user-container">
            {location.pathname.startsWith("/user/") && <UserContent />}
            {location.pathname.startsWith("/my") && <MyPageContent />}
            <PageTopButton isLabelShown={false} isFixed={true} />
        </div>
    )
}
