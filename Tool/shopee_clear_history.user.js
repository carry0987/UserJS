// ==UserScript==
// @name         Shopee Clear History
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.0
// @description  Clear search history by click
// @icon         https://carry0987.github.io/favicon.png
// @match        https://shopee.tw/*
// @connect      *
// @license      MIT
// @run-at       document-end
// @noframes
// ==/UserScript==

const DEBUG = false;

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}

//Get history
function getHistory() {
    var shopee_history = getValue('reduxPersist:searchHistoryGlobal', true);
    return shopee_history;
}

//Clear history
function clearHistory(history) {
    if (history != null) {
        setValue('reduxPersist:searchHistoryGlobal', '');
    } else {
        setValue('reduxPersist:searchHistoryGlobal', '');
    }
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

//Main function
(function() {
    checkNew();
    function checkNew() {
        var main = document;
        if (main) {
            main.appendChild(createElem('span', 'trainer'));
        }
        reportInfo(main);
    }
})()
