export function searchParamsToObject(searchParams: URLSearchParams): Record<string, string> {
    const result: Record<string, string> = {}
    // entries は Firefox でバグを引き起こすので使わない https://bugzilla.mozilla.org/show_bug.cgi?id=1023984
    searchParams.forEach((value, key) => {
        result[key] = value
    })
    return result
}
