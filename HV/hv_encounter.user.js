// ==UserScript==
// @name         HV Encounter
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.5.9
// @description  Auto report when encounter monster
// @icon         https://carry0987.github.io/favicon.png
// @match        https://hentaiverse.org/?s=Character&ss=ch
// @match        https://hentaiverse.org/
// @match        https://hentaiverse.org/?s=Battle&ss=ba*
// @match        https://hentaiverse.org/?s=Battle&ss=ar
// @include      http*://alt.hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/?s=Character&ss=ch
// @include      http*://alt.hentaiverse.org/?s=Battle&ss=ba*
// @include      http*://alt.hentaiverse.org/?s=Battle&ss=ar
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @noframes
// ==/UserScript==

const DAY_MS = 86400 * 1e3;
const DEBUG = false;
const six_hr = 2.16e+7;
const twelve_hr = 4.32e+7;
const recheck_times = 60000;
//Detect URL
var alt_hv = false;
var getLocation = document.location.href;
if (getLocation.match('://alt.')) {
    alt_hv = true;
}

class Cookie {
    constructor(cookie = document.cookie) {
        this.map = document.cookie.split('; ')
            .reduce((c, s) => {
                const i = s.indexOf('=');
                c.set(s.slice(0, i), s.slice(i + 1));
                return c;
            }, new Map());
    }

    get id() {
        return this.map.get('ipb_member_id');
    }

    toString() {
        return [...this.map.entries()]
            .map(([k, v]) => `${k}=${v}`)
            .join('; ');
    }
}

const cookie = new Cookie;
const lastDate = new Date(getValue(cookie.id, false));

const onerror = (resp) => {
    if (DEBUG === true) {
        console.error('ExEveryDay Error', resp);
    }
}

const onload = (resp) => {
    if (DEBUG === true) {
        console.info('ExEveryDay Info', resp);
    }
    if (resp.responseText.match(/It is the dawn of a new day/g)) {
        setValue(cookie.id, new Date().toJSON());
    } else if (resp.responseText.match(/Click here to fight in the HentaiVerse/g)) {
        var link = resp.responseText.match(/encounter=(.*?)=/g);
        setValue('Final Encounter', new Date().toJSON());
        countEncounter();
        if (alt_hv === true) {
            window.open('http://alt.hentaiverse.org/?s=Battle&ss=ba&'+link[0], '_self');
        } else {
            window.open('https://hentaiverse.org/?s=Battle&ss=ba&'+link[0], '_self');
        }
    }
}

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}

//Count total encounter
function countEncounter() {
    var get_encounter = getValue('Total Encounter', true);
    if (get_encounter != null && (typeof get_encounter) === 'number') {
        setValue('Total Encounter', get_encounter + 1);
    } else {
        setValue('Total Encounter', 0);
    }
    return get_encounter;
}

//Get encounter
function checkEncounter() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://e-hentai.org/news.php',
        headers: {
            Cookie: cookie.toString(),
        },
        onload,
        onerror
    });
}

//Set value via localStorage
function setValue(item, value) {
    window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}

//Get value via localStorage
function getValue(item, toJSON) {
    return (window.localStorage[item]) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
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

//Check date
(function() {
    if (getElem('#battle_main')) return;
    checkNew();
    function checkNew() {
        setInterval(function() {
            checkEncounter();
        }, recheck_times)
    }
})()
