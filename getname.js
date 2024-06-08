import { main, _f3 } from "./functions.js"

export var isAdvanced = {
    'advance' : false
}

document.addEventListener("DOMContentLoaded", (event) => {
    const btn = document.getElementById('submit')
    btn.onclick = main
    const btn_advanced = document.getElementById('advanced-search-toggle')
    btn_advanced.onclick = _f3
})
