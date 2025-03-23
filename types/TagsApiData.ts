interface TagsApiRootObject extends baseResponse {
    meta: Meta;
    data: Data;
}

interface Data {
    isLockable: boolean;
    isEditable: boolean;
    uneditableReason: null;
    tags: Tag[];
}

interface Tag {
    name: string;
    isLocked: boolean;
    isLockedBySystem: boolean;
    isNicodicArticleExists: boolean;
}