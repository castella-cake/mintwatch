import { MylistsResponseRootObject } from "@/types/mylistsData"

export const mylistsTestData: MylistsResponseRootObject = {
    meta: {
        status: 200,
    },
    data: {
        mylists: [
            {
                id: 0,
                isPublic: false,
                name: "TestMylist 0",
                description: "",
                decoratedDescriptionHtml: "",
                defaultSortKey: "addedAt",
                defaultSortOrder: "desc",
                itemsCount: 1,
                owner: {
                    ownerType: "user",
                    type: "user",
                    visibility: "visible",
                    id: "92343354",
                    name: "CYakigasi",
                    iconUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg?1732190148",
                },
                sampleItems: [],
                followerCount: 0,
                createdAt: "1970-01-01T00:00:00.000Z",
                isFollowing: false,
            },
            {
                id: 1,
                isPublic: true,
                name: "TestMylist 1",
                description: "",
                decoratedDescriptionHtml: "",
                defaultSortKey: "addedAt",
                defaultSortOrder: "desc",
                itemsCount: 2,
                owner: {
                    ownerType: "user",
                    type: "user",
                    visibility: "visible",
                    id: "92343354",
                    name: "CYakigasi",
                    iconUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg?1732190148",
                },
                sampleItems: [],
                followerCount: 0,
                createdAt: "1970-01-01T00:00:00.000Z",
                isFollowing: false,
            },
        ],
    },
}
