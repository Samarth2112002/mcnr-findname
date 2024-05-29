class TokenError extends Error {
    constructor(message){
        super(message)
        this.name = "TokenError"
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export function _d1(parsedDate){ 
    const DISCORD_EPOCH = 1420070400000
    const UNIXTIME = parseInt(new Date(parsedDate).valueOf()/1000)*1000
    const DIFF = (UNIXTIME - DISCORD_EPOCH)
    const EPOCH_TIME = DIFF * (2 ** 22)
    return EPOCH_TIME
}

export async function _f1(name, auth){
    const str_left = `${name} left`
    const label = document.getElementById('errormsg')
    let offset = 0, api_error = false, retry_after
    let url, joined_msg, timestamp, msg_id
    while (true) {
        url = `https://discord.com/api/v9/guilds/524318544243195917/messages/search?content=${str_left}&offset=${offset}`
        console.log(`Fetching from URL: ${url.replace(" ", "%20")}`)
        try{ 
            let response = await fetch(
                url, {
                    headers: {
                        "authorization" : auth
                    }})
            .then((response) => {
                if (response.status == 401) {
                    throw new TokenError("Invalid discord token.")
                }
                if (response.status == 429) {
                    api_error = true
                }
                return response.json()
                // throw new Error()
            })
            .then((response) => {
                if ( api_error ) { 
                    retry_after = Math.ceil(response['retry_after'])
                    console.log(`429 error encountered, waiting ${retry_after} seconds before sending another request`)
                }
                else{
                    label.innerHTML = "Request status: 200 (Success) [please wait nigger, processing, will be informed when done]"
                    for (let i = 0; i < 25; ++i) {
                        const author_name = response["messages"][i][0]["author"]["username"]
                        if (author_name != "MCNR") {
                            continue
                        }
                        const msg = response["messages"][i][0]["content"].split("\n")
                        for (let j = 0; j < msg.length; ++j) {
                            if (msg[j] == "```CSS") {
                                let temp = msg[j+1].split("(")
                                if ( (name.trim().length === temp[0].trim().length) && 
                                name.toLowerCase() === temp[0].trim().toLowerCase() ) {
                                    joined_msg = msg[j+1]
                                    temp = joined_msg.split("(")
                                    timestamp = response["messages"][i][0]["timestamp"]
                                    msg_id = response["messages"][i][0]["id"]
                                    
                                    // To implement advanced search later here
                                
                                }
                            }
                        }
                    }
                }
            })
            if ( api_error ) { 
                label.innerHTML = "Request status: 429 (being rate limited), will auto-sleep before sending further requests, I advise to close the tab and retry after 1-2 minutes so discord doesn't rate limit you"
                console.log("HELLO")
                await sleep((retry_after+10)*1000)
                api_error = false
                continue
            }
            offset = offset + 25
        }
        catch (error) {
            if (error instanceof TokenError) { 
                console.log(error)
                throw error
            }
            else if (error instanceof TypeError){
                return {
                    'timestamp' : timestamp,
                    'playerid' : joined_msg.split(' ')[1].slice(1,joined_msg.split(' ')[1].length-1)
                }
            }
            else {
                throw new Error("Some otherwordly error occured that I do not care enough about to debug")
            }
        }
    }
}

export async function _f2(auth, max_id, playerid){
    let url, msg, joined_msg, author_name, temp, temp_id, left_msg_id
    const str_search = `(${playerid}) joined`
    let found = false, final_name, api_error = false, retry_after
    while (true) { 
        url = `https://discord.com/api/v9/guilds/524318544243195917/messages/search?content=${str_search}&max_id=${max_id}`
        let response = await fetch(
            url, {
                headers: {
                    "authorization" : auth
                }})
        .then((response) => {
                if (response.status == 429) {
                    api_error = true
                }
                return response.json()
            })
        .then((response) => {
            if ( api_error ) { 
                retry_after = Math.ceil(response['retry_after'])
                console.log(`429 error encountered, waiting ${retry_after} seconds before sending another request`)
            }
            else {
                for (let i = 0; i < 25; ++i) {
                    author_name = response['messages'][i][0]['author']['username']
                    if ( author_name != "MCNR" ) { 
                        continue
                    }
                    msg = response['messages'][i][0]['content']
                    msg = msg.split("\n")
                    for (let j = 0; j < msg.length; ++j) {
                        left_msg_id = response['messages'][i][0]["id"] // unused???
                        if ( msg[j] == '```CSS' ) {
                            if ( msg[j+1].split(" ").includes('joined') === false ) {
                                continue
                            }
                            joined_msg = msg[j+1]
                            temp = joined_msg.split('(')
                            temp_id = temp[1].split(')')[0]
                            if ( temp_id == playerid ) {
                                final_name = joined_msg.split(' ')[0]
                                found = true
                                break
                            }
                        }
                    }
                    if (found) {
                        break
                    }
                }
            }
        })
        if ( api_error ) {
            api_error = false
            await sleep((retry_after+1)*1000)
            continue
        }
        if ( found ) { 
            return final_name
        }
    }
}