export function generateActionTrackId() {
    const atc_first = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const atc_last = "0123456789"
    let ati_firststr = ""
    let ati_laststr = ""
    for (let i = 0; i < 10; i++) {
        // console.log(i)
        ati_firststr += atc_first[Math.floor(Math.random() * atc_first.length)]
    }
    for (let i = 0; i < 13; i++) {
        // console.log(i)
        ati_laststr += atc_last[Math.floor(Math.random() * atc_last.length)]
    }
    return ati_firststr + "_" + ati_laststr
}
