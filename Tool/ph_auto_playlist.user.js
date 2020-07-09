// ==UserScript==
// @name         [PH] Auto Add List
// @namespace    https://carry0987.github.io/
// @version      1.1.0
// @description  Automatically add video to Playlist
// @author       carry0987
// @match        https://www.pornhub.com/view_video.php*
// @grant        none
// ==/UserScript==

var get_vid;
var get_token;
var get_view_key;
var set_url;
var playlist_id = '123456';
var add_url = 'https://www.pornhub.com/playlist/add?type=playlist&';

(function() {
    'use strict';
    init();
})();

//Set HotKeyListener
function injectHotkeyListener() {
    document.addEventListener('keypress', hotkeyHandler);
}

//Handles keypresses
function hotkeyHandler(e) {
    let key = e.which;
    let char = String.fromCharCode(key);
    if (char == 'F' || e.keyCode == 75) {
        if ((typeof TOP_BODY) != undefined) {
            get_token = TOP_BODY.token;
            get_view_key = getURLParam(window.location.href, 'viewkey');
            get_vid = 'playlist_id='+playlist_id+'&vkey='+get_view_key+'&token='+get_token;
            set_url = add_url+get_vid;
            reportInfo(set_url);
            post(set_url, function(data) {
                reportInfo(data)
            });
        } else {
            get_vid = false;
        }
    }
}

//Initialize
function init() {
    injectHotkeyListener();
}

//Get URL parameter
function getURLParam(url, param) {
    var url_string = url;
    var get_url = new URL(url_string);
    var c = get_url.searchParams.get(param);
    return c;
}

//Post
function post(href, func, parm) {
    var xhr = new window.XMLHttpRequest()
    xhr.open(parm ? 'POST' : 'GET', href)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    xhr.responseType = 'document'
    xhr.onerror = function() {
        xhr = null
        post(href, func, parm)
    }
    xhr.onload = function(e) {
        if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
            var data = e.target.response
            if (xhr.responseType === 'document' && getElem('#messagebox', data)) {
                if (getElem('#messagebox')) {
                    getElem('#csp').replaceChild(getElem('#messagebox', data), getElem('#messagebox'))
                } else {
                    getElem('#csp').appendChild(getElem('#messagebox', data))
                }
            }
            func(data, e)
        }
        xhr = null
    }
    xhr.send(parm)
}

//Set value
function setValue(item, value) {
    if (typeof GM_setValue === 'undefined') {
        window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
    } else {
        GM_setValue(item, value);
    }
}

//Get value
function getValue(item, toJSON) {
    if (typeof GM_getValue === 'undefined' || !GM_getValue(item, null)) {
        return (item in window.localStorage) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
    } else {
        return GM_getValue(item, null);
    }
}

//Get element
function getElem(ele, mode, parent) {
    if (typeof ele === 'object') {
        return ele
    } else if (mode === undefined && parent === undefined) {
        return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele)
    } else if (mode === 'all') {
        return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele)
    } else if (typeof mode === 'object' && parent === undefined) {
        return mode.querySelector(ele)
    }
}

//Create element
function createElem(name, elemID = false, elemClass = false) {
    var elem = document.createElement(name);
    if (elemID != false) {
        elem.setAttribute('id', elemID);
    }
    if (elemClass != false) {
        elem.className = elemClass;
    }
    return elem
}

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}
