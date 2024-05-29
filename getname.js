import { _d1, _f1, _f2 } from "./functions.js"

document.addEventListener("DOMContentLoaded", (event) => {
    const btn = document.getElementById('submit')
    btn.onclick = main
})

async function main(){
    const btn = document.getElementById('submit')
    btn.disabled = true
    const NAME = document.getElementById('name').value.trim()
    const AUTH = document.getElementById('token').value.trim()
    try {
        const response = await _f1(NAME, AUTH)
        const DISCORD_EPOCH_TIME = _d1(response['timestamp'])
        const f_name = await _f2(AUTH, DISCORD_EPOCH_TIME, response['playerid'])
        alert(`${NAME} might be ${f_name}`)
        btn.disabled = false
    }
    catch (error) { 
        alert(error)
        btn.disabled = false
    }
}