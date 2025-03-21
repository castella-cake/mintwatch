import { Tag } from "@/types/VideoData";
import { IconCheck, IconLock, IconLockOpen, IconTags, IconTrash } from "@tabler/icons-react";
import { useSmIdContext } from "../WatchDataContext";

type compatibleTag = {
    name: string;
    isLocked: boolean;
    isNicodicArticleExists: boolean;
}

function tagLengthCounter(tagText: string) {
    let length = 0;
    // 半角文字は1文字、全角文字は2文字としてカウント
    for (let i = 0; i < tagText.length; i++) {
        if ( tagText[i].match(/[ -~]/) ) {
            length++
        } else {
            length += 2
        }
    }
    return length
}

export default function Tags({ initialTagData, isShinjukuLayout }: { initialTagData: Tag, isShinjukuLayout: boolean }) {
    const { smId } = useSmIdContext()

    const [tags, setTags] = useState<compatibleTag[]>(initialTagData.items);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isLockable, setIsLockable] = useState(false);
    const [isEditable, setIsEditable] = useState(initialTagData.edit.isEditable);

    const tagInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTags(initialTagData.items);
        setIsEditable(initialTagData.edit.isEditable);
        setIsLockable(false);
        setIsEditMode(false);
    }, [initialTagData]);

    const nicodicExistIcon = isShinjukuLayout ? (
        <img
            src="http://nicovideo.cdn.nimg.jp/web/img/common/icon/dic_on.png"
            alt="記事利用可能アイコン"
        />
    ) : (
        "百"
    );
    const nicodicNotExistIcon = isShinjukuLayout ? (
        <img
            src="http://nicovideo.cdn.nimg.jp/web/img/common/icon/dic_off.png"
            alt="記事未作成アイコン"
        />
    ) : (
        "？"
    );

    async function onEditModeToggle() {
        const response: TagsApiRootObject = await getTagsApi(smId)
        if (response.meta.status !== 200) return
        setTags(response.data.tags)
        if (response.data.isEditable) {
            setIsEditable(response.data.isEditable)
            setIsEditMode(state => !state)
            setIsLockable(response.data.isLockable)
        } else {
            setIsEditable(false)
            setIsEditMode(false)
            setIsLockable(false)
            alert("動画のタグを編集できません。これは、視聴時点では動画タグを編集可能であったが、その後に編集不可に変更された場合に発生します。")
        }
    }

    async function onTagAdd() {
        if (
            !isEditable ||
            !tagInputRef.current ||
            tagInputRef.current.value === "" ||
            tagInputRef.current.value === " " ||
            tagInputRef.current.value === "　" ||
            tags.length > 11
        ) return
        if (tagLengthCounter(tagInputRef.current.value) > 40) {
            alert("タグは40文字以内で入力してください。(全角文字は2文字としてカウントされます)")
        } else if (tags.some(elem => tagInputRef.current && elem.name === tagInputRef.current.value)) {
            alert("このタグは既に登録されています。")
        } else {
            const tagName = tagInputRef.current.value
            const response: TagsApiRootObject = await tagsEditApi(smId, tagName, "POST")
            if (response.meta.status === 400 && response.meta.errorCode === "TAG_RESERVED") alert("400: 予約済みのタグは追加できません。")
            if (response.meta.status !== 200) return
            setTags(response.data.tags)
        }
    }

    async function onTagRemove(tagName: string, isLocked: boolean) {
        if (!isEditable || isLocked) return
        const response: TagsApiRootObject = await tagsEditApi(smId, tagName, "DELETE")
        if (response.meta.status !== 200) return
        setTags(response.data.tags)
    }

    async function onTagLockEdit(tagName: string, isLocked: boolean) {
        if (!isLockable || !isEditable) return
        const response: TagsApiRootObject = await tagsLockApi(smId, tagName, isLocked)
        if (response.meta.status !== 200) return
        setTags(response.data.tags)
    }

    const canAddTag = tags.length <= 11

    return <div className="tags-container">
        <div className="tags-title">
            <span>{isEditMode ? "タグを編集中" : "登録タグ"}</span>
            <button
                className="tags-editbutton"
                title={isEditMode ? "タグ編集を終了" : "タグ編集を開始"}
                onClick={onEditModeToggle}
                data-is-active={isEditMode}
                aria-disabled={!isEditable}
            >
                { isEditMode ? <IconCheck/> : <IconTags /> }
                { isEditMode ? "完了" : "編集" }
            </button>
        </div>
        <div className="tags-item-container" data-is-editmode={isEditMode}>
            {tags.map((elem, index) => {
                return (
                    <div
                        key={`tag-${elem.name}`}
                        className={
                            elem.isLocked
                                ? "tags-item tags-item-locked"
                                : "tags-item"
                        }
                    >
                        { isEditMode && <button
                            className="tags-item-lockbutton"
                            title={isLockable ? "タグロックを切り替え" : "この動画のタグロックは変更できません"}
                            aria-disabled={!isLockable}
                            onClick={() => onTagLockEdit(elem.name, !elem.isLocked)}
                        >
                            { elem.isLocked ? <IconLock/> : <IconLockOpen/> }
                        </button> }
                        <a
                            href={`/tag/${elem.name}`}
                            title={`タグ ${elem.name} の動画を検索`}
                        >
                            {elem.name}
                        </a>
                        <a
                            href={`https://dic.nicovideo.jp/a/${elem.name}`}
                            className={
                                elem.isNicodicArticleExists
                                    ? "tags-item-nicodic"
                                    : "tags-item-nicodic tags-item-nicodic-notexist"
                            }
                            title={`タグ ${elem.name} の大百科記事を開く`}
                        >
                            {elem.isNicodicArticleExists
                                ? nicodicExistIcon
                                : nicodicNotExistIcon}
                        </a>
                        { isEditMode && <button
                            className="tags-item-removebutton"
                            title={ elem.isLocked ? "ロック中のタグは削除できません" : "タグを削除" }
                            aria-disabled={elem.isLocked}
                            onClick={() => onTagRemove(elem.name, elem.isLocked)}
                        >
                            <IconTrash/>
                        </button>}
                    </div>
                );
            })}
        </div>
        {isEditMode && <div className="tags-add-container">
            <input type="text" placeholder="タグ名を入力…" ref={tagInputRef} className="tags-add-input"/>
            <button onClick={onTagAdd} className="tags-add-button" aria-disabled={!canAddTag}>{ canAddTag ? "追加" : "追加できません" }</button>
        </div>}
    </div>
}