// ==UserScript==
// @name         HV Auto Refresh
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.5
// @description  Auto refresh when battle finished
// @icon         https://carry0987.github.io/favicon.png
// @match        http*://hentaiverse.org/*
// @connect      *
// @license      MIT
// @noframes
// ==/UserScript==

const DEBUG = false;
const check_battle = 60000;

//Check battle status
function checkBattle(elem) {
    if (getElem('#btcp')) {
        getElem('#btcp').click();
    } else if (elem.match(/\/y\/battle\/finishbattle\.png/g)) {
        window.open('https://hentaiverse.org/?s=Character&ss=ch', '_self');
    }
}

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}

//Set value via localSorage
function setValue(item, value) {
    window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}

//Get value via localSorage
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

//Check battle
(function() {
    if (!getElem('#battle_main')) return;
    checkNew();
    function checkNew() {
        setInterval(function() {
            var get_page = document
            checkBattle(get_page);
        }, check_battle)
    }
})()
