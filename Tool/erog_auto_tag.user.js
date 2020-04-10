// ==UserScript==
// @name         Erog Auto Tag
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.1
// @description  Auto thanks to the OP when download the torrent
// @icon         https://carry0987.github.io/favicon.png
// @match        http*://movie-erog.com/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    //Get value
    var get_tag = getElem('#searchmain .tag-word a', 'all');
    if (get_tag.length < 1) {
        get_tag = getElem('#container>main .keyword_link a', 'all');
    }
    var check_tag
    for (var i = 0; i < get_tag.length; i++) {
        check_tag = get_tag[i].href;
        if (typeof check_tag === 'string') {
            var res = check_tag.match(/https:\/\/movie\.eroterest\.net\/\?word=/g);
            if (res) {
                get_tag[i].href = get_tag[i].href.replace('https://movie.eroterest.net/?word=', 'http://movie-erog.com/archives/tag/');
            }
        }
    }
})();

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

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}
