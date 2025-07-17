export const customRankingTestData = {
    "meta": {
        "status": 200,
        "code": "HTTP_200"
    },
    "data": {
        "metadata": {
            "title": "動画ランキング - ニコニコ動画",
            "linkTags": [
            ],
            "metaTags": [
            ],
            "jsonLds": []
        },
        "googleTagManager": {
            "user": {
                "login_status": "not_login"
            },
        },
        "response": {
            "$getCustomRankingSettings": {
                "data": {
                    "settings": [
                        {
                            "laneId": 1,
                            "title": "ForTestingPurposesOnly",
                            "type": "tag",
                            "isAllGenre": false,
                            "genreKeys": [
                                "music_sound"
                            ],
                            "tags": [
                                "ForTestingPurposesOnly"
                            ],
                            "channelVideoListingStatus": "included",
                            "isDefault": false
                        },
                        {
                            "laneId": 2,
                            "title": "音楽・サウンド",
                            "type": "genre",
                            "isAllGenre": false,
                            "genreKeys": [
                                "music_sound",
                                "dance"
                            ],
                            "tags": [],
                            "channelVideoListingStatus": "included",
                            "isDefault": false
                        },
                    ],
                    "genres": [
                        {
                            "key": "entertainment",
                            "label": "エンターテイメント"
                        },
                        {
                            "key": "radio",
                            "label": "ラジオ"
                        },
                        {
                            "key": "music_sound",
                            "label": "音楽・サウンド"
                        },
                        {
                            "key": "dance",
                            "label": "ダンス"
                        },
                        {
                            "key": "animal",
                            "label": "動物"
                        },
                        {
                            "key": "nature",
                            "label": "自然"
                        },
                        {
                            "key": "cooking",
                            "label": "料理"
                        },
                        {
                            "key": "traveling_outdoor",
                            "label": "旅行・アウトドア"
                        },
                        {
                            "key": "vehicle",
                            "label": "乗り物"
                        },
                        {
                            "key": "sports",
                            "label": "スポーツ"
                        },
                        {
                            "key": "society_politics_news",
                            "label": "社会・政治・時事"
                        },
                        {
                            "key": "technology_craft",
                            "label": "技術・工作"
                        },
                        {
                            "key": "commentary_lecture",
                            "label": "解説・講座"
                        },
                        {
                            "key": "anime",
                            "label": "アニメ"
                        },
                        {
                            "key": "game",
                            "label": "ゲーム"
                        },
                        {
                            "key": "other",
                            "label": "その他"
                        }
                    ]
                }
            },
            "$getCustomRankingRanking": [
                {
                    "data": {
                        "laneId": 1,
                        "laneType": "custom",
                        "title": "VOCALOID",
                        "customType": "tag",
                        "isAllGenre": false,
                        "genres": [
                            {
                                "key": "music_sound",
                                "label": "音楽・サウンド"
                            }
                        ],
                        "tags": [
                            "VOCALOID"
                        ],
                        "channelVideoListingStatus": "included",
                        "isDefault": false,
                        "defaultTitle": "エンタメ",
                        "hasNext": false,
                        "videoList": [
                            {
                                "type": "essential",
                                "id": "sm0",
                                "title": "For testing purposes only",
                                "registeredAt": "1970-01-01T00:00:00.000Z",
                                "count": {
                                    "view": 0,
                                    "comment": 0,
                                    "mylist": 0,
                                    "like": 0
                                },
                                "thumbnail": {
                                    "url": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "middleUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "largeUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "listingUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "nHdUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9"
                                },
                                "duration": 186,
                                "shortDescription": "TestDescriptionThatJustForTesting",
                                "latestCommentSummary": "MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です",
                                "isChannelVideo": false,
                                "isPaymentRequired": false,
                                "playbackPosition": 0,
                                "owner": {
                                    "ownerType": "user",
                                    "type": "user",
                                    "visibility": "visible",
                                    "id": "92343354",
                                    "name": "CYakigasi",
                                    "iconUrl": "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg?1732190148"
                                },
                                "requireSensitiveMasking": false,
                                "videoLive": null,
                                "isMuted": false,
                                "9d091f87": false,
                                "acf68865": false
                            },
                        ]
                    }
                },
                {
                    "data": {
                        "laneId": 2,
                        "laneType": "custom",
                        "title": "音楽・サウンド",
                        "customType": "genre",
                        "isAllGenre": false,
                        "genres": [
                            {
                                "key": "music_sound",
                                "label": "音楽・サウンド"
                            },
                            {
                                "key": "dance",
                                "label": "ダンス"
                            }
                        ],
                        "tags": [],
                        "channelVideoListingStatus": "included",
                        "isDefault": false,
                        "defaultTitle": "音楽",
                        "hasNext": false,
                        "videoList": [
                            {
                                "type": "essential",
                                "id": "sm0",
                                "title": "For testing purposes only",
                                "registeredAt": "1970-01-01T00:00:00.000Z",
                                "count": {
                                    "view": 0,
                                    "comment": 0,
                                    "mylist": 0,
                                    "like": 0
                                },
                                "thumbnail": {
                                    "url": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "middleUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "largeUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "listingUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                                    "nHdUrl": "https://nicovideo.cdn.nimg.jp/thumbnails/9/9"
                                },
                                "duration": 186,
                                "shortDescription": "TestDescriptionThatJustForTesting",
                                "latestCommentSummary": "MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です",
                                "isChannelVideo": false,
                                "isPaymentRequired": false,
                                "playbackPosition": 0,
                                "owner": {
                                    "ownerType": "user",
                                    "type": "user",
                                    "visibility": "visible",
                                    "id": "92343354",
                                    "name": "CYakigasi",
                                    "iconUrl": "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg?1732190148"
                                },
                                "requireSensitiveMasking": false,
                                "videoLive": null,
                                "isMuted": false,
                                "9d091f87": false,
                                "acf68865": false
                            },
                        ]
                    }
                }
            ]
        }
    }
}