import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import "../../../Global/styleModules/Alert.css"
import "../../styles/MylistCreateAlert.css"

const TITLE_MAX_LENGTH = 128
const DESCRIPTION_MAX_LENGTH = 256

export interface MylistFormValues {
    name: string
    description: string
    defaultSortKey: string
    defaultSortOrder: "asc" | "desc"
    isPublic: boolean
}

type MylistFormProps = {
    initialValues: MylistFormValues
    submitLabel: string
    errorPrefix: string
    /**
     * フォームの送信処理
     * 成功時は null を返す（アラートを閉じる）、失敗時は表示するエラーメッセージを返す
     */
    onSubmit: (values: MylistFormValues) => Promise<string | null>
    extraContent?: React.ReactNode
}

export function MylistForm({ initialValues, submitLabel, errorPrefix, onSubmit, extraContent }: MylistFormProps) {
    const { closeAlert } = useSetMessageContext()

    const [title, setTitle] = useState(initialValues.name)
    const [description, setDescription] = useState(initialValues.description)
    const [isPublic, setIsPublic] = useState(initialValues.isPublic)
    const validSortKeys = mylistSortKeys.map(sortKey => sortKey.value)
    const [defaultSortKey, setDefaultSortKey] = useState<string>(validSortKeys.includes(initialValues.defaultSortKey) ? initialValues.defaultSortKey : "addedAt")
    const [defaultSortOrder, setDefaultSortOrder] = useState<"asc" | "desc">(initialValues.defaultSortOrder === "asc" ? "asc" : "desc")
    const [isRequiredError, setIsRequiredError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isTitleEmpty = title.trim().length === 0

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault()
        if (isTitleEmpty) {
            setIsRequiredError(true)
            return
        }

        setErrorMessage(null)
        setIsSubmitting(true)
        try {
            const result = await onSubmit({
                name: title,
                description: description,
                defaultSortKey: defaultSortKey,
                defaultSortOrder: defaultSortOrder,
                isPublic: isPublic,
            })
            if (result) {
                setErrorMessage(result)
                return
            }
            closeAlert()
        } catch (error) {
            setErrorMessage(`${errorPrefix}${String(error)}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="mylist-create-form" onSubmit={handleSubmit}>
            <div className="mylist-create-content">
                <label className="mylist-create-field">
                    <span>
                        タイトル
                        <span className="mylist-create-required" data-is-error={isRequiredError}>{isRequiredError ? "このフィールドは必須です" : "必須"}</span>
                    </span>
                    <div className="mylist-create-input-wrapper">
                        <input
                            type="text"
                            value={title}
                            maxLength={TITLE_MAX_LENGTH}
                            data-is-required-error={isRequiredError}
                            onChange={(event) => {
                                setTitle(event.target.value)
                                if (event.target.value.trim().length > 0) setIsRequiredError(false)
                            }}
                        />
                        <span className="mylist-create-counter" data-is-visible={title.length > 0}>
                            {TITLE_MAX_LENGTH - title.length}
                            {" "}
                            /
                            {" "}
                            {TITLE_MAX_LENGTH}
                        </span>
                    </div>
                </label>
                <label className="mylist-create-field">
                    <span>説明文</span>
                    <div className="mylist-create-input-wrapper">
                        <textarea
                            value={description}
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            rows={3}
                            onChange={event => setDescription(event.target.value)}
                        />
                        <span className="mylist-create-counter" data-is-visible={description.length > 0}>
                            {DESCRIPTION_MAX_LENGTH - description.length}
                            {" "}
                            /
                            {" "}
                            {DESCRIPTION_MAX_LENGTH}
                        </span>
                    </div>
                </label>
                <label className="mylist-create-field mylist-create-row-field">
                    <span>並び順</span>
                    <select
                        value={defaultSortKey}
                        onChange={event => setDefaultSortKey(event.target.value)}
                    >
                        {mylistSortKeys.map(sortKey => (
                            <option key={sortKey.value} value={sortKey.value}>{sortKey.label}</option>
                        ))}
                    </select>
                </label>
                <div className="mylist-create-field mylist-create-row-field">
                    <span>順序</span>
                    <div className="mylist-create-selectbuttons" role="radiogroup" aria-label="順序">
                        <label className="mylist-create-selectbutton" data-is-current={defaultSortOrder === "asc"}>
                            <input
                                type="radio"
                                name="mylist-form-order"
                                className="mylist-create-radioinput"
                                checked={defaultSortOrder === "asc"}
                                onChange={() => setDefaultSortOrder("asc")}
                            />
                            昇順
                        </label>
                        <label className="mylist-create-selectbutton" data-is-current={defaultSortOrder === "desc"}>
                            <input
                                type="radio"
                                name="mylist-form-order"
                                className="mylist-create-radioinput"
                                checked={defaultSortOrder === "desc"}
                                onChange={() => setDefaultSortOrder("desc")}
                            />
                            降順
                        </label>
                    </div>
                </div>
                <div className="mylist-create-field mylist-create-row-field">
                    <span>公開設定</span>
                    <div className="mylist-create-selectbuttons" role="radiogroup" aria-label="公開設定">
                        <label className="mylist-create-selectbutton" data-is-current={!isPublic}>
                            <input
                                type="radio"
                                name="mylist-form-visibility"
                                className="mylist-create-radioinput"
                                checked={!isPublic}
                                onChange={() => setIsPublic(false)}
                            />
                            非公開
                        </label>
                        <label className="mylist-create-selectbutton" data-is-current={isPublic}>
                            <input
                                type="radio"
                                name="mylist-form-visibility"
                                className="mylist-create-radioinput"
                                checked={isPublic}
                                onChange={() => setIsPublic(true)}
                            />
                            公開
                        </label>
                    </div>
                </div>
                { extraContent }
                { errorMessage && <p className="mylist-create-error">{errorMessage}</p> }
            </div>
            <div className="alert-buttons">
                <button
                    type="button"
                    className="alert-button"
                    onClick={closeAlert}
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    className="alert-button"
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                    data-isprimary="true"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    )
}
