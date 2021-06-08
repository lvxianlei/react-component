export default function downloadFile (url) {
    const downEle = document.createElement("form")
    const replaceEle = document.createElement("iframe")
    replaceEle.style.display = "none"
    replaceEle.name = "replaceEle"
    document.body.appendChild(replaceEle)
    downEle.method = "get"
    downEle.action = url
    downEle.target = "replaceEle"
    document.body.appendChild(downEle)
    downEle.submit()
    document.body.removeChild(downEle)
    document.body.removeChild(replaceEle)
}