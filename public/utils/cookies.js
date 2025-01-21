
//functions to save, find and delete cookies with the authetication, used to make the login and keep logged
function defineCookie(key, value){
    document.cookie = `${key}=${value}; path=/`;
}

function findCookie(key){
    return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${key}=`))
    ?.split("=")[1];
}
function removeCookie(key){
    document.cookie = `${key}=; expires=thu 01 Jan 1970 00:00:00 ` 
}

export { defineCookie, findCookie, removeCookie };