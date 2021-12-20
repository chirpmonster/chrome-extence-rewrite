//通用方法

//参数转对象
export function queryToObj(url) {
    const res = {}
    const pList = new URLSearchParams(url)
    pList.forEach((val, key) => {
        res[key] = val
    })
    return res
}

//对象转参数
export function objToQuery(obj) {
    const Query = new URLSearchParams(obj)
    return Query.toString()
}