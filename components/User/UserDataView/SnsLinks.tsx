export function SnsLinks({ sns }: { sns: GenericUserData["sns"] }) {
    if (!sns || sns.length <= 0) return null
    return (
        <div className="userdata-links">
            {sns.map((sns, index) => (
                <div className="userdata-link" key={index}>
                    <a href={sns.url} target="_blank" rel="noopener noreferrer" title={`${sns.type} で ${sns.screenName} を開く (別タブで開きます)`}>
                        <img src={sns.iconUrl} alt={sns.type} />
                    </a>
                </div>
            ))}
        </div>
    )
}
