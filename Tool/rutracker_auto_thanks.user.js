// ==UserScript==
// @name         Rutracker Auto Thanks
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.1.5
// @description  Auto thanks to the OP when download the torrent
// @icon         https://carry0987.github.io/favicon.png
// @match        http*://rutracker.org/forum/viewtopic.php*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    //Get value
    var current_thread = document.querySelector('.dl-stub.dl-link.dl-topic');
    current_thread.onclick = function() {
        var thx = getElem('#thx-btn');
        thx.click();
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
